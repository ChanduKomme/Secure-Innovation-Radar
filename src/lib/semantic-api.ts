import type { Suggestion, Theme } from "@/data/mock";
import { THEMES } from "@/data/mock";

export interface LiveRelatedResult {
  suggestion: Suggestion;
  score: number;
}

export interface LiveSemanticResult {
  engine: "sentence-transformer";
  model: string;
  theme: Theme;
  confidence: number;
  related: LiveRelatedResult[];
}

interface ApiAnalyzeResponse {
  engine: "sentence-transformer";
  model: string;
  theme_id: string;
  theme_name: string;
  confidence: number;
  related: { suggestion_id: string; score: number }[];
}

const baseUrl = (import.meta.env.VITE_SEMANTIC_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";

export function semanticApiConfigured() {
  return Boolean(baseUrl);
}

export function semanticEngineMode(): "remote" | "browser" {
  return baseUrl ? "remote" : "browser";
}

async function analyzeViaRemoteApi(
  query: string,
  suggestions: Suggestion[],
  limit: number,
): Promise<LiveSemanticResult> {
  const response = await fetch(`${baseUrl}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      limit,
      suggestions: suggestions.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        theme: s.theme,
        department: s.department,
        impact: s.impact,
      })),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Semantic API error ${response.status}${detail ? `: ${detail}` : ""}`);
  }

  const data = (await response.json()) as ApiAnalyzeResponse;
  const byId = new Map(suggestions.map((s) => [s.id, s]));
  const theme = THEMES.find((t) => t.id === data.theme_id);
  if (!theme) throw new Error(`Unknown theme returned by semantic API: ${data.theme_id}`);

  return {
    engine: data.engine,
    model: data.model,
    theme,
    confidence: data.confidence,
    related: data.related
      .map((r) => ({ suggestion: byId.get(r.suggestion_id), score: r.score }))
      .filter((r): r is LiveRelatedResult => Boolean(r.suggestion)),
  };
}

export async function analyzeSemantic(
  query: string,
  suggestions: Suggestion[],
  limit = 6,
): Promise<LiveSemanticResult> {
  if (baseUrl) return analyzeViaRemoteApi(query, suggestions, limit);

  // The published demo does not require a separate backend. It loads a quantized
  // multilingual SentenceTransformer-compatible ONNX model directly in the browser.
  // This keeps the public prototype self-contained while still producing real embeddings.
  const { analyzeSemanticInBrowser } = await import("@/lib/browser-semantic");
  return analyzeSemanticInBrowser(query, suggestions, limit);
}
