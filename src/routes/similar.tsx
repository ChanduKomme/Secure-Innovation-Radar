import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Info, ArrowRight, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEPARTMENTS, themeById, type Theme } from "@/data/mock";
import { classifyTheme, findSimilar } from "@/lib/semantic";
import { analyzeSemantic, semanticEngineMode, type LiveRelatedResult } from "@/lib/semantic-api";
import { useStore } from "@/lib/store";
import { PageHeader, Pill } from "@/components/ui-bits";
import { meta } from "@/lib/meta";

const ARCH = [
  { t: "Employee Suggestion", d: "" },
  { t: "Sentence Embedding", d: "Live multilingual SentenceTransformer-compatible ONNX embeddings; the public demo runs them directly in the browser by default." },
  { t: "Vector Similarity", d: "Cosine similarity over normalized embeddings." },
  { t: "Top Related Suggestions", d: "" },
  { t: "Theme Assignment", d: "Similarity-weighted evidence from related suggestions." },
];
const DEFAULT = "Use acoustic signals to detect cutting-tool wear before quality decreases.";

type SimilarState = {
  theme: Theme;
  confidence: number;
  results: LiveRelatedResult[];
  engine: "live" | "fallback";
  model?: string;
};

export const Route = createFileRoute("/similar")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s["q"] === "string" ? (s["q"] as string) : undefined }),
  head: () => meta("Similar Ideas", "Semantic similarity explorer for duplicate and related employee suggestions."),
  component: Similar,
});

function Similar() {
  const { q: initial } = Route.useSearch();
  const { suggestions } = useStore();
  const [input, setInput] = useState(initial ?? DEFAULT);
  const [query, setQuery] = useState(initial ?? DEFAULT);
  const [dept, setDept] = useState("all");
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const mode = semanticEngineMode();

  const filteredSuggestions = useMemo(
    () => suggestions.filter((s) => dept === "all" || s.department === dept),
    [suggestions, dept],
  );

  const localState = useMemo<SimilarState>(() => {
    const local = classifyTheme(query);
    return {
      theme: local.theme,
      confidence: local.confidence,
      results: findSimilar(query, filteredSuggestions, 6).filter((r) => r.suggestion.title.toLowerCase() !== query.toLowerCase().replace(/\.$/, "")),
      engine: "fallback",
    };
  }, [query, filteredSuggestions]);

  const [state, setState] = useState<SimilarState>(localState);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      try {
        const live = await analyzeSemantic(query, filteredSuggestions, 6);
        if (cancelled) return;
        setState({
          theme: live.theme,
          confidence: live.confidence,
          results: live.related.filter((r) => r.suggestion.title.toLowerCase() !== query.toLowerCase().replace(/\.$/, "")),
          engine: "live",
          model: live.model,
        });
        setWarning(null);
      } catch (error) {
        console.warn("Real semantic engine unavailable; using fallback", error);
        if (cancelled) return;
        setState(localState);
        setWarning("The real semantic model could not load, so these results use the deterministic demo fallback.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void run();
    return () => { cancelled = true; };
  }, [query, filteredSuggestions, localState]);

  const { theme, confidence, results } = state;

  return (
    <>
      <PageHeader title="Semantic Similarity Explorer" subtitle="Find duplicate, related, and conceptually similar employee suggestions." />
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <form className="card-surface p-4" onSubmit={(e) => { e.preventDefault(); setQuery(input); }}>
            <Textarea rows={2} value={input} onChange={(e) => setInput(e.target.value)} className="resize-none" />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <Select value={dept} onValueChange={setDept}>
                <SelectTrigger className="h-8 w-44"><SelectValue>{dept === "all" ? "All departments" : dept}</SelectValue></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All departments</SelectItem>
                  {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button type="submit" size="sm" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : <Search />} Find Similar Ideas</Button>
            </div>
          </form>

          <div className="card-surface grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="p-4"><div className="eyebrow">Detected Theme</div><Link to="/themes/$themeId" params={{ themeId: theme.id }} className="mt-1 block text-sm font-semibold text-primary hover:underline">{theme.name}</Link></div>
            <div className="p-4"><div className="eyebrow">Confidence</div><div className="mt-1 font-mono text-lg font-semibold">{confidence}%</div></div>
            <div className="p-4"><div className="eyebrow">Related Suggestions</div><div className="mt-1 font-mono text-lg font-semibold">{results.length}</div></div>
          </div>

          {warning && <div className="rounded-md border border-warning/30 bg-warning/10 px-4 py-2 text-xs text-muted-foreground">{warning}</div>}

          <div className="space-y-3">
            {results.map((r, i) => {
              const pct = Math.round(r.score * 100);
              return (
                <article key={r.suggestion.id} className="card-surface p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-mono text-[11px] text-muted-foreground">#{i + 1} · {r.suggestion.id}</div>
                      <h3 className="mt-0.5 font-medium">{r.suggestion.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{r.suggestion.description}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{r.suggestion.department}</span>·<span>{themeById(r.suggestion.theme)?.short}</span>·<span>Impact</span><Pill value={r.suggestion.impact} />
                      </div>
                    </div>
                    <div className="w-32 shrink-0 text-right">
                      <div className="font-mono text-lg font-semibold tabular-nums">{pct}%</div>
                      <div className="text-[11px] text-muted-foreground">similarity</div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
            {results.length === 0 && !loading && <div className="card-surface p-8 text-center text-sm text-muted-foreground">No conceptually similar suggestions found. Try describing the underlying problem.</div>}
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Info className="size-3.5" />
            {state.engine === "live"
              ? `Similarity scores are calculated live from multilingual sentence embeddings using cosine similarity (${mode === "browser" ? "in-browser ONNX" : "FastAPI backend"}).`
              : "Semantic similarity compares meaning, not only exact keywords. Scores shown currently use the deterministic demo fallback."}
          </p>
          <div className="card-surface p-4">
            <div className="mb-3 flex items-center justify-between"><span className="text-[13px] font-semibold">Architecture Preview</span><span className="eyebrow">semantic pipeline</span></div>
            <div className="grid gap-2 sm:grid-cols-5">
              {ARCH.map((a, i) => (
                <div key={a.t} className="relative flex flex-col">
                  <div className={`flex-1 rounded-sm border px-2.5 py-2 ${i === 1 ? "border-primary bg-primary-soft" : "bg-muted/40"}`}>
                    <div className="font-mono text-[10px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</div>
                    <div className={`text-xs font-medium ${i === 1 ? "text-primary" : ""}`}>{a.t}</div>
                  </div>
                  {i < ARCH.length - 1 && <ArrowRight className="absolute -right-2 top-3 z-10 hidden size-3.5 rounded-full bg-card text-muted-foreground sm:block" />}
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground"><span className="font-medium text-primary">02 Sentence Embedding:</span> {ARCH[1]!.d}</p>
          </div>
        </div>

        <aside className="card-surface h-fit p-5 lg:sticky lg:top-20">
          <div className="eyebrow">Why this matters</div>
          <p className="mt-2 text-sm leading-relaxed">
            Ten differently worded employee suggestions may represent one underlying business problem. Semantic grouping reduces duplicate review work and highlights recurring issues.
          </p>
          <div className="mt-4 space-y-2 border-t pt-4 text-xs text-muted-foreground">
            <div className="flex justify-between"><span>Method</span>
              <TooltipProvider><Tooltip><TooltipTrigger className="inline-flex items-center gap-1 font-mono underline decoration-dotted underline-offset-2">cosine similarity <Info className="size-3" /></TooltipTrigger>
                <TooltipContent className="max-w-64 text-xs">{state.engine === "live" ? "Live cosine similarity between normalized multilingual sentence embeddings." : "The real model could not load, so the deterministic demo fallback is active."}</TooltipContent></Tooltip></TooltipProvider></div>
            <div className="flex justify-between"><span>Corpus</span><span className="font-mono">{filteredSuggestions.length} ideas</span></div>
            <div className="flex justify-between"><span>Engine</span><span className="font-mono">{state.engine === "live" ? (mode === "browser" ? "browser ONNX" : "FastAPI") : "demo fallback"}</span></div>
            {state.model && <div className="flex items-start justify-between gap-4"><span>Model</span><span className="max-w-52 break-all text-right font-mono">{state.model}</span></div>}
          </div>
        </aside>
      </div>
    </>
  );
}
