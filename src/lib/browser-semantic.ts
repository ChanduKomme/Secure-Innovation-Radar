import { pipeline, type FeatureExtractionPipeline } from "@huggingface/transformers";
import type { Suggestion, Theme } from "@/data/mock";
import { THEMES } from "@/data/mock";
import type { LiveRelatedResult, LiveSemanticResult } from "@/lib/semantic-api";

const MODEL = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";
let extractorPromise: Promise<FeatureExtractionPipeline> | null = null;

function getExtractor() {
  if (!extractorPromise) {
    const createPipeline = pipeline as unknown as (
      task: "feature-extraction",
      model: string,
      options: { dtype: "q8" },
    ) => Promise<FeatureExtractionPipeline>;
    extractorPromise = createPipeline("feature-extraction", MODEL, { dtype: "q8" });
  }
  return extractorPromise;
}

function dot(a: number[], b: number[]) {
  let s = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) s += (a[i] ?? 0) * (b[i] ?? 0);
  return s;
}

function themeFromVotes(suggestions: Suggestion[], scores: number[]): { theme: Theme; confidence: number } {
  const votes = new Map<string, number>();
  suggestions.forEach((s, i) => {
    const score = Math.max(0, scores[i] ?? 0);
    votes.set(s.theme, (votes.get(s.theme) ?? 0) + score * score);
  });

  let bestId = suggestions[0]?.theme ?? THEMES[0]!.id;
  let best = -1;
  let total = 0;
  for (const [id, value] of votes) {
    total += value;
    if (value > best) {
      best = value;
      bestId = id;
    }
  }

  const theme = THEMES.find((t) => t.id === bestId) ?? THEMES[0]!;
  const share = total > 0 ? best / total : 0.5;
  const top = scores.length ? Math.max(...scores) : 0;
  const confidence = Math.max(40, Math.min(99, Math.round((0.6 * share + 0.4 * Math.max(0, top)) * 100)));
  return { theme, confidence };
}

export async function analyzeSemanticInBrowser(
  query: string,
  suggestions: Suggestion[],
  limit = 6,
): Promise<LiveSemanticResult> {
  if (!suggestions.length) throw new Error("No suggestions available for semantic analysis");

  const extractor = await getExtractor();
  const texts = [query, ...suggestions.map((s) => `${s.title}. ${s.description}`.trim())];
  const output = await extractor(texts, { pooling: "mean", normalize: true });
  const vectors = output.tolist() as number[][];
  const q = vectors[0];
  if (!q) throw new Error("Embedding model returned no query vector");

  const scores = vectors.slice(1).map((v) => dot(q, v));
  const ranked = scores
    .map((score, i) => ({ suggestion: suggestions[i]!, score }))
    .sort((a, b) => b.score - a.score)
    .filter((r) => r.score >= 0.2)
    .slice(0, limit)
    .map<LiveRelatedResult>((r) => ({ suggestion: r.suggestion, score: Math.max(-1, Math.min(1, r.score)) }));

  const { theme, confidence } = themeFromVotes(suggestions, scores);
  return {
    engine: "sentence-transformer",
    model: `${MODEL} (browser ONNX/q8)`,
    theme,
    confidence,
    related: ranked,
  };
}

export const browserSemanticModel = MODEL;
