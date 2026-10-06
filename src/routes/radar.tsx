import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowUpDown, Lightbulb } from "lucide-react";
import { CartesianGrid, ReferenceArea, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis, LabelList, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { THEMES, type Theme } from "@/data/mock";
import { PageHeader, Pill, Section, ThemeIcon, Trend } from "@/components/ui-bits";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/radar")({
  head: () => meta("Innovation Radar", "Bubble radar of recurring employee-reported problems by frequency and business impact."),
  component: RadarPage,
});

const COLOR = { High: "var(--chart-1)", Medium: "var(--chart-2)", Low: "var(--chart-5)" };
const axis = { fontSize: 11, fill: "var(--muted-foreground)" };
const score = (t: Theme) => Math.round((t.impact_score * t.frequency_score) / 100);
const QUADRANTS = [
  { x: 97, y: 97, anchor: "end", text: "STRATEGIC PRIORITIES" },
  { x: 3, y: 97, anchor: "start", text: "TARGETED HIGH IMPACT" },
  { x: 97, y: 4, anchor: "end", text: "RECURRING · LOW IMPACT" },
  { x: 3, y: 4, anchor: "start", text: "ISOLATED SIGNALS" },
] as const;

function Tip({ active, payload }: { active?: boolean; payload?: { payload: Theme }[] }) {
  if (!active || !payload?.length) return null;
  const t = payload[0]!.payload;
  return (
    <div className="card-surface w-56 p-3 text-xs">
      <div className="mb-2 text-[13px] font-semibold">{t.name}</div>
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
  const ranked = [...THEMES].sort((a, b) => score(b) - score(a));
  const [sel, setSel] = useState<Theme>(ranked[0]!);
  const rows = sort === "rank" ? ranked : [...ranked].sort((a, b) => b[sort] - a[sort]);
  const inZone = THEMES.filter((t) => t.frequency_score >= 50 && t.impact_score >= 50);
  const H = ({ k, children }: { k: typeof sort; children: string }) => (
    <button className="inline-flex items-center gap-1 uppercase" onClick={() => setSort(k)}>{children}<ArrowUpDown className="size-3" /></button>
  );
  const stats = [
    ["Themes mapped", THEMES.length],
    ["In priority zone", inZone.length],
    ["Ideas represented", THEMES.reduce((a, t) => a + t.suggestion_count, 0)],
    ["Avg. trend", `+${Math.round(THEMES.reduce((a, t) => a + t.trend_percentage, 0) / THEMES.length)}%`],
  ];

  return (
    <>
      <PageHeader title="Innovation Radar" subtitle="See which employee-reported problems combine high recurrence with high potential impact." />

      <div className="card-surface mb-3 grid grid-cols-2 divide-x divide-y md:grid-cols-4 md:divide-y-0">
        {stats.map(([k, v]) => (
          <div key={k as string} className="px-4 py-2.5">
            <div className="eyebrow">{k}</div>
            <div className="font-mono text-lg font-semibold tabular-nums">{v}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-4">
        <Section title="Opportunity map" description="Frequency × impact · bubble size = related suggestions · click a bubble to inspect" className="xl:col-span-3"
          actions={<div className="flex gap-3 text-[11px] text-muted-foreground">{Object.entries(COLOR).map(([k, c]) => <span key={k} className="flex items-center gap-1"><span className="size-2 rounded-full" style={{ background: c }} />{k}</span>)}</div>}>
          <div className="h-[380px] md:h-[480px]">
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 28, right: 20, bottom: 24, left: 0 }}>
                <ReferenceArea x1={50} x2={100} y1={50} y2={100} fill="var(--primary)" fillOpacity={0.06} />
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 3" />
                <ReferenceLine x={50} stroke="var(--muted-foreground)" strokeOpacity={0.4} />
                <ReferenceLine y={50} stroke="var(--muted-foreground)" strokeOpacity={0.4} />
                {QUADRANTS.map((q) => (
                  <ReferenceLine key={q.text} segment={[{ x: q.x, y: q.y }, { x: q.x, y: q.y }]} stroke="none"
                    label={{ value: q.text, position: "center", fontSize: 10, letterSpacing: 1, fontWeight: 600, textAnchor: q.anchor, fill: q.text.startsWith("STRATEGIC") ? "var(--primary)" : "var(--muted-foreground)" }} />
                ))}
                <XAxis type="number" dataKey="frequency_score" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={axis} label={{ value: "Frequency of Employee Reports →", position: "insideBottom", offset: -14, fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis type="number" dataKey="impact_score" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={axis} label={{ value: "Estimated Business Impact →", angle: -90, position: "insideLeft", offset: 16, fontSize: 11, fill: "var(--muted-foreground)" }} />
                <ZAxis type="number" dataKey="suggestion_count" range={[260, 2400]} />
                <Tooltip content={<Tip />} cursor={false} />
                <Scatter data={THEMES} onClick={(d: { payload?: Theme }) => d.payload && setSel(d.payload)} className="cursor-pointer">
                  {THEMES.map((t) => (
                    <Cell key={t.id} fill={COLOR[t.priority]} fillOpacity={sel.id === t.id ? 0.85 : 0.45} stroke={sel.id === t.id ? "var(--foreground)" : COLOR[t.priority]} strokeWidth={sel.id === t.id ? 2 : 1.25} />
                  ))}
                  <LabelList dataKey="short" position="top" offset={12} fill="var(--foreground)" stroke="none" fontSize={11} fontWeight={500} />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <div className="flex flex-col gap-3">
          <div className="card-surface p-4">
            <div className="eyebrow mb-2">Selected theme</div>
            <div className="flex items-center gap-2.5">
              <ThemeIcon name={sel.icon} />
              <div className="text-[13px] font-semibold leading-tight">{sel.name}</div>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t pt-3 text-xs">
              <dt className="text-muted-foreground">Suggestions</dt><dd className="text-right font-mono">{sel.suggestion_count}</dd>
              <dt className="text-muted-foreground">Frequency</dt><dd className="text-right font-mono">{sel.frequency_score}</dd>
              <dt className="text-muted-foreground">Impact</dt><dd className="text-right font-mono">{sel.impact_score}</dd>
              <dt className="text-muted-foreground">Trend</dt><dd className="text-right"><Trend v={sel.trend_percentage} /></dd>
              <dt className="text-muted-foreground">Priority</dt><dd className="text-right"><Pill value={sel.priority} /></dd>
              <dt className="text-muted-foreground">Action</dt><dd className="text-right font-medium">{sel.recommended_action}</dd>
            </dl>
            <Button size="sm" variant="outline" className="mt-3 w-full" asChild>
              <Link to="/themes/$themeId" params={{ themeId: sel.id }}>Open Intelligence View <ArrowRight /></Link>
            </Button>
          </div>
          <div className="card-surface border-l-2 border-l-primary p-4">
            <div className="flex items-center gap-2"><Lightbulb className="size-4 text-primary" /><span className="eyebrow">Management Insight</span></div>
            <p className="mt-2 text-[13px] leading-relaxed">The radar helps distinguish isolated ideas from recurring organizational signals. Themes in the upper-right area should receive earlier expert review.</p>
            <div className="mt-3 border-t pt-3 text-xs text-muted-foreground">
              <span className="font-mono font-semibold text-foreground">{inZone.length}</span> themes currently in the priority zone: {inZone.map((t) => t.short).join(", ")}.
            </div>
          </div>
        </div>
      </div>

      <Section title="Top Opportunities" description="Ranked by opportunity score (frequency × impact)" className="mt-3">
        <div className="-m-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4"><H k="rank">Rank</H></TableHead><TableHead>Theme</TableHead>
                <TableHead><H k="suggestion_count">Frequency</H></TableHead><TableHead><H k="impact_score">Impact</H></TableHead>
                <TableHead><H k="trend_percentage">Trend</H></TableHead><TableHead>Score</TableHead><TableHead>Priority</TableHead><TableHead className="pr-4">Recommended Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((t) => (
                <TableRow key={t.id} onClick={() => setSel(t)} data-state={sel.id === t.id ? "selected" : undefined} className="cursor-pointer data-[state=selected]:bg-primary-soft/60">
                  <TableCell className="pl-4 font-mono text-muted-foreground">{String(ranked.indexOf(t) + 1).padStart(2, "0")}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium">{t.short}</TableCell>
                  <TableCell className="font-mono">{t.suggestion_count}</TableCell>
                  <TableCell className="whitespace-nowrap">{t.impact_label}</TableCell>
                  <TableCell><Trend v={t.trend_percentage} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary"><div className="h-full bg-primary" style={{ width: `${score(t)}%` }} /></div>
                      <span className="font-mono text-xs">{score(t)}</span>
                    </div>
                  </TableCell>
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
