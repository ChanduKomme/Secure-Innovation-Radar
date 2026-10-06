import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, ChevronDown, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CATEGORIES, DEPARTMENTS, type Level, type Suggestion } from "@/data/mock";
import { classifyTheme, findSimilar, isToolWearQuery, privacyScan } from "@/lib/semantic";
import { useStore } from "@/lib/store";
import { PageHeader, Pill } from "@/components/ui-bits";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/submit")({
  head: () => meta("Submit Idea", "Submit an improvement idea and see a simulated semantic AI analysis."),
  component: Submit,
});

const STEPS = ["Privacy screening", "Prompt safety screening", "Semantic analysis", "Similarity search", "Theme assignment", "Priority calculation"];

function Submit() {
  const { suggestions, add } = useStore();
  const [f, setF] = useState({ title: "", description: "", department: "Production", category: "Improvement Idea", impact: "Medium" as Level, urgency: "Medium" as Level, anonymous: true, ack: false });
  const [step, setStep] = useState(-1);
  const [result, setResult] = useState<null | ReturnType<typeof analyze>>(null);

  function analyze() {
    const text = `${f.title} ${f.description}`;
    const { theme, confidence } = classifyTheme(text);
    const related = findSimilar(text, suggestions, 3);
    const priv = privacyScan(text);
    const pts = (f.impact === "High" ? 40 : f.impact === "Medium" ? 25 : 10) + (f.urgency === "High" ? 25 : f.urgency === "Medium" ? 15 : 5) + Math.round(theme.frequency_score * 0.3);
    return { theme, confidence, related, priv, priority: isToolWearQuery(text) ? 86 : Math.min(98, pts) };
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    let i = 0;
    setStep(0);
    const iv = setInterval(() => {
      i++;
      if (i >= STEPS.length) {
        clearInterval(iv);
        const r = analyze();
        const s: Suggestion = {
          id: `SUG-${Date.now().toString().slice(-4)}`, title: f.title, description: r.priv.sanitized,
          department: f.department, category: f.category, impact: f.impact, urgency: f.urgency, anonymous: f.anonymous,
          created_at: new Date().toISOString().slice(0, 10), theme: r.theme.id, similarity_score: r.related[0]?.score ?? 0,
          privacy_status: r.priv.injection ? "Flagged" : r.priv.fields.length ? "Sanitized" : "Passed", priority_score: r.priority,
        };
        add(s);
        setResult(r);
        setStep(-1);
      } else setStep(i);
    }, 450);
  };

  const reset = () => { setResult(null); setF({ ...f, title: "", description: "", ack: false }); };
  const busy = step >= 0;

  return (
    <>
      <PageHeader title="Submit an Improvement Idea" subtitle="Share a problem, improvement opportunity, or proposed solution." />
      <div className="grid gap-3 lg:grid-cols-5">
        <form onSubmit={submit} className="card-surface space-y-5 p-5 lg:col-span-3">
          <div className="space-y-1.5">
            <Label htmlFor="t">Title</Label>
            <Input id="t" required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Example: Detect cutting-tool wear before quality decreases" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="d">Description</Label>
            <Textarea id="d" required rows={6} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} placeholder="Describe the problem, why it matters, and any improvement idea you have…" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Department</Label>
              <Select value={f.department} onValueChange={(v) => setF({ ...f, department: v })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={f.category} onValueChange={(v) => setF({ ...f, category: v })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {(["impact", "urgency"] as const).map((k) => (
              <div key={k} className="space-y-1.5">
                <Label className="capitalize">{k}</Label>
                <ToggleGroup type="single" variant="outline" value={f[k]} onValueChange={(v) => v && setF({ ...f, [k]: v as Level })} className="w-full">
                  {["Low", "Medium", "High"].map((l) => <ToggleGroupItem key={l} value={l} className="flex-1 text-xs data-[state=on]:bg-primary-soft data-[state=on]:text-primary">{l}</ToggleGroupItem>)}
                </ToggleGroup>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2.5">
            <div>
              <div className="text-sm font-medium">Anonymous submission</div>
              <div className="text-xs text-muted-foreground">Your identity is not stored with this idea.</div>
            </div>
            <Switch checked={f.anonymous} onCheckedChange={(v) => setF({ ...f, anonymous: v })} />
          </div>
          <label className="flex items-start gap-2 text-sm">
            <Checkbox checked={f.ack} onCheckedChange={(v) => setF({ ...f, ack: !!v })} className="mt-0.5" />
            I understand this prototype uses synthetic/demo data only.
          </label>
          <Button type="submit" disabled={!f.ack || busy || !f.title}>
            {busy ? <Loader2 className="animate-spin" /> : <Sparkles />} Analyze & Submit
          </Button>
        </form>

        <div className="space-y-3 lg:col-span-2">
          {busy && (
            <div className="card-surface p-5">
              <div className="eyebrow mb-3">AI processing</div>
              <ul className="space-y-2 text-sm">
                {STEPS.map((s, i) => (
                  <li key={s} className={i <= step ? "flex items-center gap-2" : "flex items-center gap-2 text-muted-foreground"}>
                    {i < step ? <CheckCircle2 className="size-4 text-success" /> : i === step ? <Loader2 className="size-4 animate-spin text-primary" /> : <span className="size-4 rounded-full border" />}
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result && (
            <div className="card-surface overflow-hidden">
              <div className="flex items-center gap-2 border-b bg-success-soft px-5 py-3 text-sm font-semibold text-success">
                <CheckCircle2 className="size-4" /> AI Analysis Complete
              </div>
              <dl className="divide-y text-sm">
                {[
                  ["Theme", <span className="font-medium">{result.theme.name}</span>],
                  ["Confidence", <span className="font-mono">{result.confidence}%</span>],
                  ["Related Suggestions", <span className="font-mono">{result.related.length}</span>],
                  ["Privacy", <Pill value={result.priv.fields.length ? "Sanitized" : "Passed"} />],
                  ["Prompt Safety", <Pill value={result.priv.injection ? "Flagged" : "Passed"} />],
                  ["Priority", <span className="font-mono font-semibold">{result.priority}/100</span>],
                ].map(([k, v]) => (
                  <div key={k as string} className="flex items-center justify-between px-5 py-2.5">
                    <dt className="text-muted-foreground">{k}</dt><dd>{v}</dd>
                  </div>
                ))}
              </dl>
              {result.related.length > 0 && (
                <ul className="border-t bg-muted/40 px-5 py-3 text-xs">
                  {result.related.map((r) => (
                    <li key={r.suggestion.id} className="flex justify-between gap-2 py-1">
                      <span className="truncate">{r.suggestion.title}</span>
                      <span className="font-mono text-muted-foreground">{Math.round(r.score * 100)}%</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap gap-2 border-t p-4">
                <Button size="sm" asChild><Link to="/similar" search={{ q: `${f.title}. ${f.description}` }}>View Similar Ideas</Link></Button>
                <Button size="sm" variant="outline" asChild><Link to="/themes/$themeId" params={{ themeId: result.theme.id }}>Open Theme Intelligence</Link></Button>
                <Button size="sm" variant="ghost" onClick={reset}>Submit Another Idea</Button>
              </div>
            </div>
          )}
          {!busy && !result && (
            <div className="card-surface p-5 text-sm text-muted-foreground">
              <Sparkles className="mb-2 size-5 text-primary" />
              After submission, the AI engine assigns your idea to a recurring theme, finds related suggestions, and checks it for privacy and security issues.
            </div>
          )}
          <Collapsible className="card-surface">
            <CollapsibleTrigger className="group flex w-full items-center justify-between px-5 py-3 text-sm font-medium">
              How this analysis works <ChevronDown className="size-4 transition group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ol className="list-decimal space-y-1.5 border-t px-5 py-4 pl-9 text-sm text-muted-foreground">
                <li>The suggestion is converted into a semantic representation (embedding).</li>
                <li>It is compared with existing ideas by meaning, not keywords.</li>
                <li>It is assigned to the closest recurring theme.</li>
                <li>It is checked for personal data and prompt-injection attempts.</li>
                <li>It is added to trend and priority analysis.</li>
              </ol>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </>
  );
}
