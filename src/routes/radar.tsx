import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpDown, Lightbulb } from "lucide-react";
import { CartesianGrid, ReferenceArea, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis, LabelList, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { THEMES, type Theme } from "@/data/mock";
import { PageHeader, Pill, Section, Trend } from "@/components/ui-bits";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/radar")({
  head: () => meta("Innovation Radar", "Bubble radar of recurring employee-reported problems by frequency and business impact."),
  component: RadarPage,
});

const COLOR = { High: "var(--chart-1)", Medium: "var(--chart-2)", Low: "var(--chart-5)" };
const axis = { fontSize: 11, fill: "var(--muted-foreground)" };

function Tip({ active, payload }: { active?: boolean; payload?: { payload: Theme }[] }) {
  if (!active || !payload?.length) return null;
  const t = payload[0]!.payload;
  return (
    <div className="card-surface w-56 p-3 text-xs">
      <div className="mb-2 text-sm font-semibold">{t.name}</div>
      <div className="grid grid-cols-2 gap-y-1">
        <span className="text-muted-foreground">Suggestions</span><span className="text-right font-mono">{t.suggestion_count}</span>
        <span className="text-muted-foreground">Impact</span><span className="text-right">{t.impact_label}</span>
        <span className="text-muted-foreground">Trend</span><span className="text-right"><Trend v={t.trend_percentage} /></span>
        <span className="text-muted-foreground">Priority</span><span className="text-right"><Pill value={t.priority} /></span>
      </div>
    </div>
  );
}

function RadarPage() {
  const [sort, setSort] = useState<"rank" | "suggestion_count" | "impact_score" | "trend_percentage">("rank");
  const ranked = [...THEMES].sort((a, b) => b.impact_score * b.frequency_score - a.impact_score * a.frequency_score);
  const rows = sort === "rank" ? ranked : [...ranked].sort((a, b) => b[sort] - a[sort]);
  const H = ({ k, children }: { k: typeof sort; children: string }) => (
    <button className="inline-flex items-center gap-1" onClick={() => setSort(k)}>{children}<ArrowUpDown className="size-3" /></button>
  );
  return (
    <>
      <PageHeader title="Innovation Radar" subtitle="See which employee-reported problems combine high recurrence with high potential impact." />
      <div className="grid gap-3 xl:grid-cols-4">
        <Section title="Opportunity map" description="Bubble size = number of related suggestions" className="xl:col-span-3"
          actions={<div className="flex gap-3 text-[11px] text-muted-foreground">{Object.entries(COLOR).map(([k, c]) => <span key={k} className="flex items-center gap-1"><span className="size-2 rounded-full" style={{ background: c }} />{k} priority</span>)}</div>}>
          <div className="h-[460px]">
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 36, right: 24, bottom: 24, left: 4 }}>
                <ReferenceArea x1={50} x2={100} y1={50} y2={100} fill="var(--primary)" fillOpacity={0.05} stroke="var(--primary)" strokeOpacity={0.25} strokeDasharray="4 4"
                  label={{ value: "Priority review zone", position: "insideBottomRight", fontSize: 11, fill: "var(--primary)" }} />
                <CartesianGrid stroke="var(--border)" />
                <XAxis type="number" dataKey="frequency_score" domain={[0, 100]} tick={axis} label={{ value: "Frequency of Employee Reports →", position: "insideBottom", offset: -14, fontSize: 12, fill: "var(--muted-foreground)" }} />
                <YAxis type="number" dataKey="impact_score" domain={[0, 100]} tick={axis} label={{ value: "Estimated Business Impact →", angle: -90, position: "insideLeft", offset: 14, fontSize: 12, fill: "var(--muted-foreground)" }} />
                <ZAxis type="number" dataKey="suggestion_count" range={[300, 2600]} />
                <Tooltip content={<Tip />} cursor={false} />
                <Scatter data={THEMES}>
                  {THEMES.map((t) => <Cell key={t.id} fill={COLOR[t.priority]} fillOpacity={0.55} stroke={COLOR[t.priority]} strokeWidth={1.5} />)}
                  <LabelList dataKey="short" position="top" offset={14} fill="var(--foreground)" stroke="none" fontSize={11} fontWeight={500} />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Section>
        <div className="card-surface h-fit border-l-2 border-l-primary p-5">
          <div className="flex items-center gap-2"><Lightbulb className="size-4 text-primary" /><span className="eyebrow">Management Insight</span></div>
          <p className="mt-2 text-sm leading-relaxed">The radar helps distinguish isolated ideas from recurring organizational signals. Themes in the upper-right area should receive earlier expert review.</p>
          <div className="mt-4 space-y-2 border-t pt-4">
            {ranked.slice(0, 3).map((t, i) => (
              <Link key={t.id} to="/themes/$themeId" params={{ themeId: t.id }} className="flex items-center gap-2 text-sm hover:text-primary">
                <span className="font-mono text-xs text-muted-foreground">{i + 1}</span>{t.short}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Section title="Top Opportunities" className="mt-3">
        <div className="-m-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead className="pl-4"><H k="rank">Rank</H></TableHead><TableHead>Theme</TableHead>
                <TableHead><H k="suggestion_count">Frequency</H></TableHead><TableHead><H k="impact_score">Impact</H></TableHead>
                <TableHead><H k="trend_percentage">Trend</H></TableHead><TableHead>Priority</TableHead><TableHead className="pr-4">Recommended Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((t) => (
                <TableRow key={t.id} className="text-sm">
                  <TableCell className="pl-4 font-mono text-muted-foreground">{ranked.indexOf(t) + 1}</TableCell>
                  <TableCell><Link to="/themes/$themeId" params={{ themeId: t.id }} className="font-medium hover:text-primary">{t.short}</Link></TableCell>
                  <TableCell className="font-mono">{t.suggestion_count}</TableCell>
                  <TableCell>{t.impact_label}</TableCell>
                  <TableCell><Trend v={t.trend_percentage} /></TableCell>
                  <TableCell><Pill value={t.priority} /></TableCell>
                  <TableCell className="pr-4 font-medium">{t.recommended_action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>
    </>
  );
}
