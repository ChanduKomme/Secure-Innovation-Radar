import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Ban, CheckCircle2, FlaskConical, Search, Sparkles, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { themeById } from "@/data/mock";
import { proposalFor } from "@/data/proposals";
import { useStore, type ProposalStatus } from "@/lib/store";
import { Pill, Section, ThemeIcon } from "@/components/ui-bits";

export const Route = createFileRoute("/themes/$themeId")({
  loader: ({ params }) => {
    const theme = themeById(params.themeId);
    if (!theme) throw notFound();
    return { theme };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Theme not found" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.theme.name} — Secure Innovation Radar`;
    return {
      meta: [
        { title: t },
        { name: "description", content: loaderData.theme.description },
        { property: "og:title", content: t },
        { property: "og:description", content: loaderData.theme.description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ThemeNotFound,
  component: ThemeDetail,
});

function ThemeNotFound() {
  return (
    <div className="card-surface p-10 text-center">
      <p className="text-sm text-muted-foreground">This theme does not exist.</p>
      <Button asChild size="sm" className="mt-4"><Link to="/themes">Back to themes</Link></Button>
    </div>
  );
}

const STATUS_LABEL: Record<ProposalStatus, { text: string; tone: string }> = {
  open: { text: "Awaiting decision", tone: "Low" },
  review: { text: "Expert review requested", tone: "Required" },
  investigation: { text: "Marked for investigation", tone: "Passed" },
  dismissed: { text: "Dismissed", tone: "Flagged" },
};

function Tag({ children, tone = "bg-secondary text-secondary-foreground" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`inline-flex h-6 items-center rounded-sm border border-current/15 px-2 text-xs font-medium ${tone}`}>{children}</span>;
}

function HypothesisLabel() {
  return (
    <span className="inline-flex items-center gap-1 rounded-sm border border-warning/30 bg-warning-soft px-1.5 py-0.5 text-[11px] font-medium text-warning">
      <Sparkles className="size-3" /> AI-generated hypothesis — expert validation required
    </span>
  );
}

function ThemeDetail() {
  const { theme: t } = Route.useLoaderData();
  const { suggestions, proposal, setProposal } = useStore();
  const p = proposalFor(t);
  const members = suggestions.filter((s) => s.theme === t.id);
  const depts = t.departments ?? new Set(members.map((m) => m.department)).size;
  const status = proposal[t.id] ?? "open";
  const act = (s: ProposalStatus, msg: string) => { setProposal(t.id, s); toast.success(msg, { description: t.name }); };

  const signals: [string, string][] = [
    [String(t.suggestion_count), "related suggestions"],
    [String(depts), "departments represented"],
    [`${t.trend_percentage > 0 ? "+" : ""}${t.trend_percentage}%`, "vs. previous period"],
    [`${t.frequency_score}/100`, "recurrence score"],
    [`${t.impact_score}/100`, "estimated impact"],
  ];

  return (
    <>
      <Link to="/themes" className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5" /> All themes</Link>

      <div className="card-surface mb-3 flex flex-wrap items-center gap-4 p-4">
        <ThemeIcon name={t.icon} className="size-10" />
        <div className="min-w-0 flex-1">
          <div className="eyebrow">Theme intelligence view</div>
          <h1 className="text-lg font-semibold tracking-tight">{t.name}</h1>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Tag tone={t.priority === "High" ? "bg-destructive-soft text-destructive" : "bg-warning-soft text-warning"}>{t.priority} Priority</Tag>
            <Tag tone="bg-success-soft text-success">{t.trend_percentage > 0 ? "+" : ""}{t.trend_percentage}% Trend</Tag>
            <Tag>{t.suggestion_count} Related Suggestions</Tag>
            <Tag tone="bg-primary-soft text-primary">Human Review Required</Tag>
          </div>
        </div>
        <div className="text-right">
          <div className="eyebrow mb-1">Decision status</div>
          <Pill value={STATUS_LABEL[status].tone} className="hidden" />
          <span className="text-xs font-medium">{STATUS_LABEL[status].text}</span>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <Section title="Recurring Problem" actions={<span className="flex items-center gap-1 text-[11px] text-muted-foreground"><Sparkles className="size-3" /> AI-generated summary · demo</span>}>
            <p className="text-[13px] leading-relaxed">{t.summary}</p>
          </Section>

          <Section title="Why This Theme Is Emerging">
            <div className="-m-4 grid grid-cols-2 divide-x divide-y sm:grid-cols-5 sm:divide-y-0">
              {signals.map(([v, l]) => (
                <div key={l} className="px-4 py-3">
                  <div className="font-mono text-lg font-semibold tabular-nums">{v}</div>
                  <div className="text-[11px] text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="AI Improvement Proposal" actions={<HypothesisLabel />} className="border-primary/30">
            <div className="space-y-3 text-[13px]">
              <div>
                <div className="eyebrow mb-1">Problem</div>
                <p>{p.problem}</p>
              </div>
              <div className="rounded-sm border-l-2 border-primary bg-primary-soft px-3 py-2">
                <div className="eyebrow mb-1 text-primary">Proposed Investigation</div>
                <p>{p.investigation}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="eyebrow mb-1">Potential Approach</div>
                  <ol className="space-y-1">
                    {p.approach.map((a, i) => <li key={a} className="flex gap-2"><span className="font-mono text-[11px] text-muted-foreground">{i + 1}.</span>{a}</li>)}
                  </ol>
                </div>
                <div>
                  <div className="eyebrow mb-1">Potential Benefit</div>
                  <ul className="space-y-1">
                    {p.benefits.map((b) => <li key={b} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" />{b}</li>)}
                  </ul>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                <div className="text-xs"><span className="text-muted-foreground">AI Confidence:</span> <Pill value={p.confidence} /></div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" disabled={status === "review"} onClick={() => act("review", "Expert review requested")}><UserCheck /> Request Expert Review</Button>
                  <Button size="sm" variant="outline" disabled={status === "investigation"} onClick={() => act("investigation", "Marked for investigation")}><Search /> Mark for Investigation</Button>
                  <Button size="sm" variant="ghost" disabled={status === "dismissed"} onClick={() => act("dismissed", "Suggestion dismissed")}><Ban /> Dismiss Suggestion</Button>
                </div>
              </div>
            </div>
          </Section>

          <Section title="Representative Employee Suggestions">
            <ol className="space-y-1.5">
              {t.representative.map((r, i) => (
                <li key={r} className="flex items-center gap-3 rounded-sm border bg-muted/40 px-3 py-2 text-[13px]">
                  <span className="font-mono text-[11px] text-muted-foreground">{i + 1}</span>{r}
                </li>
              ))}
            </ol>
          </Section>

          <Section title={`All suggestions in cluster (${members.length} in demo set)`}>
            <ul className="-my-2 divide-y text-[13px]">
              {members.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 py-2">
                  <span className="truncate">{s.title}</span>
                  <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">{s.department}<Pill value={s.impact} /></span>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <div className="space-y-3">
          <Section title="Common Concepts">
            <div className="flex flex-wrap gap-1.5">
              {t.keywords.map((k) => <span key={k} className="rounded-sm border bg-secondary px-2 py-0.5 font-mono text-xs">{k}</span>)}
            </div>
          </Section>

          <Section title="Generative AI Solution Pilot" actions={<FlaskConical className="size-4 text-primary" />}>
            <p className="text-xs leading-relaxed text-muted-foreground">
              This experimental function investigates whether an LLM can convert recurring employee-reported problems into structured improvement hypotheses. Outputs are advisory and require expert validation.
            </p>
            <div className="mt-3 rounded-sm border bg-muted/40 px-3 py-2 font-mono text-[11px]">
              <span className="text-muted-foreground">input:</span> {t.suggestion_count} related employee suggestions (sanitized)
            </div>
            <div className="mt-3 space-y-2.5 text-[13px]">
              <div><div className="eyebrow mb-0.5">Common Problem</div><p>{p.problem}</p></div>
              <div><div className="eyebrow mb-0.5">Potential Root Causes</div><ul className="list-disc space-y-0.5 pl-4">{p.rootCauses.map((r) => <li key={r}>{r}</li>)}</ul></div>
              <div><div className="eyebrow mb-0.5">Suggested Investigation</div><p>{t.investigation}</p></div>
              <div><div className="eyebrow mb-0.5">Expected Benefits</div><p>{p.benefits.slice(0, 3).join(" · ")}</p></div>
              <div><div className="eyebrow mb-0.5">Open Questions</div><ul className="list-disc space-y-0.5 pl-4">{p.openQuestions.map((q) => <li key={q}>{q}</li>)}</ul></div>
            </div>
            <div className="mt-3 border-t pt-3"><HypothesisLabel /></div>
          </Section>

          <Section title="Public Research Alignment — Illustrative">
            <ul className="space-y-1.5 text-[13px]">
              {t.research.map((r) => <li key={r} className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" />{r}</li>)}
            </ul>
            <p className="mt-3 border-t pt-3 text-[11px] text-muted-foreground">Illustrative mapping based only on publicly available research themes.</p>
          </Section>
        </div>
      </div>
    </>
  );
}
