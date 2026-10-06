// Mock "semantic AI" layer. Replace these functions with calls to a real
// embedding / clustering backend; the call signatures are the contract.
import { THEMES, type Suggestion, type Theme } from "@/data/mock";

const STOP = new Set("the a an and or of to in on for with by from is are be before after use using our we it this that at as into".split(" "));

// Lightweight concept expansion to emulate meaning-based matching.
const CONCEPTS: Record<string, string[]> = {
  wear: ["degradation", "worn", "tool", "lifetime", "replacement"],
  acoustic: ["sound", "audio", "microphone", "signals", "acoustic"],
  vibration: ["vibration", "bearing", "anomaly"],
  quality: ["defect", "inspection", "scrap", "degradation"],
  energy: ["energy", "power", "idle", "compressed", "air", "leakage"],
  automate: ["automatic", "automatically", "automation", "digitize", "manual"],
  knowledge: ["search", "lessons", "learned", "solved", "share", "sharing"],
  document: ["documentation", "report", "reports", "templates"],
};

function tokens(text: string): string[] {
  const base = text.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
  const out = new Set<string>();
  for (const w of base) {
    const stem = w.replace(/(ing|ed|es|s)$/, "");
    out.add(stem);
    for (const [k, vs] of Object.entries(CONCEPTS)) {
      if (w.includes(k) || vs.some((v) => w.startsWith(v.slice(0, 5)))) {
        out.add(`#${k}`);
      }
    }
  }
  return [...out];
}

function cosine(a: string[], b: string[]): number {
  const A = new Set(a), B = new Set(b);
  let inter = 0;
  A.forEach((x) => B.has(x) && inter++);
  if (!A.size || !B.size) return 0;
  return inter / Math.sqrt(A.size * B.size);
}

export interface SimilarResult { suggestion: Suggestion; score: number }

// Calibrated demo scenario: tool-wear queries return a fixed, reproducible
// result set so the live demo is deterministic.
const PM_DEMO: [string, number][] = [
  ["Predict cutting-tool degradation from acoustic signals", 0.91],
  ["Automatic monitoring for worn production tools", 0.86],
  ["Identify machining quality degradation earlier", 0.79],
];
export function isToolWearQuery(text: string) {
  const t = text.toLowerCase();
  return /(tool|cutting)/.test(t) && /(wear|degrad|worn)/.test(t);
}

export function findSimilar(query: string, pool: Suggestion[], limit = 5): SimilarResult[] {
  if (isToolWearQuery(query)) {
    const demo = PM_DEMO.map(([title, score]) => ({ suggestion: pool.find((s) => s.title === title)!, score })).filter((r) => r.suggestion);
    if (demo.length) return demo;
  }
  const q = tokens(query);
  return pool
    .map((s) => ({ suggestion: s, score: cosine(q, tokens(`${s.title} ${s.title} ${s.description}`)) }))
    .filter((r) => r.score > 0.08)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r, i) => ({ ...r, score: Math.min(0.95, 0.62 + r.score * 0.55 - i * 0.015) }));
}

export function classifyTheme(text: string): { theme: Theme; confidence: number } {
  if (isToolWearQuery(text)) return { theme: THEMES[0]!, confidence: 89 };
  const q = tokens(text);
  let best: Theme = THEMES[0]!, bestScore = -1;
  for (const t of THEMES) {
    const s = cosine(q, tokens(`${t.name} ${t.description} ${t.keywords.join(" ")} ${t.representative.join(" ")}`));
    if (s > bestScore) { best = t; bestScore = s; }
  }
  return { theme: best, confidence: Math.round(Math.min(94, 58 + bestScore * 120)) };
}

const EMAIL = /[\w.+-]+@[\w-]+\.[\w.]+/g;
const NAME_CTX = /\b(contact|ask|call|email|tell|from|by)\s+([A-Z][a-z]+)\b/g;
const INJECTION = /(ignore (all )?(previous|prior) instructions|reveal|system prompt|disregard|act as|jailbreak)/i;

export function privacyScan(text: string) {
  const fields: { type: string; value: string }[] = [];
  let sanitized = text.replace(EMAIL, (m) => { fields.push({ type: "EMAIL", value: m }); return "[EMAIL]"; });
  sanitized = sanitized.replace(NAME_CTX, (_m, verb, name) => { fields.push({ type: "PERSON", value: name }); return `${verb} [PERSON]`; });
  fields.sort((a, b) => text.indexOf(a.value) - text.indexOf(b.value));
  return { fields, sanitized, injection: INJECTION.test(text) };
}
