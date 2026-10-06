import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SUGGESTIONS, THEMES } from "@/data/mock";
const SEED_IDS = new Set(SUGGESTIONS.map((s) => s.id));
import { useStore } from "@/lib/store";
import { PageHeader, Pill, ThemeIcon, Trend } from "@/components/ui-bits";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/themes/")({
  head: () => meta("AI Themes", "Eight AI-detected semantic clusters of recurring employee suggestions."),
  component: Themes,
});

function Themes() {
  const { suggestions } = useStore();
  const [prio, setPrio] = useState("all");
  const extra = (id: string) => suggestions.filter((s) => s.theme === id && !SEED_IDS.has(s.id)).length;
  const list = THEMES.filter((t) => prio === "all" || t.priority === prio);
  return (
    <>
      <PageHeader
        title="AI-Detected Innovation Themes"
        subtitle="Semantic clusters formed from employee suggestions, ranked by volume."
        actions={
          <ToggleGroup type="single" variant="outline" size="sm" value={prio} onValueChange={(v) => v && setPrio(v)}>
            {["all", "High", "Medium", "Low"].map((p) => <ToggleGroupItem key={p} value={p} className="px-3 text-xs capitalize data-[state=on]:bg-primary-soft data-[state=on]:text-primary">{p === "all" ? "All" : p}</ToggleGroupItem>)}
          </ToggleGroup>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {list.map((t) => (
          <article key={t.id} className="card-surface flex flex-col p-4">
            <div className="flex items-start justify-between">
              <ThemeIcon name={t.icon} />
              <Pill value={t.priority} />
            </div>
            <h3 className="mt-3 text-sm font-semibold leading-snug">{t.name}</h3>
            <p className="mt-1 line-clamp-2 flex-1 text-xs text-muted-foreground">{t.description}</p>
            <div className="mt-4 flex items-end justify-between border-t pt-3">
              <div>
                <div className="font-mono text-xl font-semibold">{t.suggestion_count + extra(t.id)}</div>
                <div className="text-[11px] text-muted-foreground">ideas</div>
              </div>
              <div className="text-right"><Trend v={t.trend_percentage} /><div className="text-[11px] text-muted-foreground">vs. last period</div></div>
            </div>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <Link to="/themes/$themeId" params={{ themeId: t.id }}>Open Intelligence View <ArrowRight /></Link>
            </Button>
          </article>
        ))}
      </div>
    </>
  );
}
