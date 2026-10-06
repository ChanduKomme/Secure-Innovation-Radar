import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Sparkles, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { themeById } from "@/data/mock";
import { useStore } from "@/lib/store";
import { Pill, Section, ThemeIcon, Trend } from "@/components/ui-bits";

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

function ThemeDetail() {
  const { theme: t } = Route.useLoaderData();
  const { suggestions, reviewed, markReview } = useStore();
  const members = suggestions.filter((s) => s.theme === t.id);
  const isReviewed = reviewed.has(t.id);

  return (
    <>
      <Link to="/themes" className="mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5" /> All themes</Link>

      <div className="card-surface mb-4 flex flex-wrap items-center gap-6 p-5">
        <ThemeIcon name={t.icon} className="size-11" />
        <div className="min-w-0 flex-1">
          <div className="eyebrow">Theme intelligence view</div>
          <h1 className="text-xl font-semibold tracking-tight">{t.name}</h1>
        </div>
        {[["Related", <span className="font-mono text-lg font-semibold">{t.suggestion_count}</span>], ["Trend", <Trend v={t.trend_percentage} />], ["Priority", <Pill value={t.priority} />], ["Human Review", <Pill value={isReviewed ? "Passed" : "Required"} />]].map(([k, v]) => (
          <div key={k as string} className="text-center"><div className="eyebrow mb-1">{k}</div>{v}</div>
        ))}
        <Button
          disabled={isReviewed}
          onClick={() => { markReview(t.id); toast.success("Theme marked for expert review"); }}
        >
          {isReviewed ? <CheckCircle2 /> : <UserCheck />} {isReviewed ? "Marked for Review" : "Mark for Expert Review"}
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Section title="AI-generated problem summary" actions={<span className="flex items-center gap-1 text-[11px] text-muted-foreground"><Sparkles className="size-3" /> Generated · demo</span>}>
            <p className="text-sm leading-relaxed">{t.summary}</p>
            <div className="mt-4 rounded-md border-l-2 border-primary bg-primary-soft px-4 py-3">
              <div className="eyebrow text-primary">Suggested investigation</div>
              <p className="mt-1 text-sm">{t.investigation}</p>
            </div>
          </Section>
          <Section title="Representative suggestions">
            <ul className="space-y-2">
              {t.representative.map((r) => <li key={r} className="rounded-md border bg-muted/40 px-3 py-2 text-sm">“{r}”</li>)}
            </ul>
          </Section>
          <Section title={`All suggestions in cluster (${members.length} in demo set)`}>
            <ul className="-my-2 divide-y text-sm">
              {members.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 py-2">
                  <span className="truncate">{s.title}</span>
                  <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">{s.department}<Pill value={s.impact} /></span>
                </li>
              ))}
            </ul>
          </Section>
        </div>
        <div className="space-y-4">
          <Section title="Common concepts">
            <div className="flex flex-wrap gap-1.5">
              {t.keywords.map((k) => <span key={k} className="rounded border bg-secondary px-2 py-0.5 font-mono text-xs">{k}</span>)}
            </div>
          </Section>
          <Section title="Public Research Alignment — Illustrative">
            <ul className="space-y-1.5 text-sm">
              {t.research.map((r) => <li key={r} className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" />{r}</li>)}
            </ul>
            <p className="mt-3 border-t pt-3 text-[11px] text-muted-foreground">Illustrative mapping based only on publicly available research themes.</p>
          </Section>
          <Section title="Recommended action">
            <div className="text-lg font-semibold">{t.recommended_action}</div>
            <p className="text-xs text-muted-foreground">Impact: {t.impact_label} · Status: {t.status}</p>
          </Section>
        </div>
      </div>
    </>
  );
}
