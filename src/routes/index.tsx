import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpDown, ArrowUpRight, Lightbulb, Layers, TrendingUp, Flag } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ACTIVITY, DEPARTMENTS, THEMES, themeById } from "@/data/mock";
import { useStore } from "@/lib/store";
import { PageHeader, Pill, Section, ThemeIcon, Trend } from "@/components/ui-bits";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/")({
  head: () => meta("Overview", "Management dashboard of employee suggestions, AI-detected themes and emerging opportunities."),
  component: Overview,
});

const KPIS = [
  { label: "Total Suggestions", value: "96", caption: "Synthetic employee ideas", icon: Lightbulb },
  { label: "Active AI Themes", value: "8", caption: "Semantic clusters detected", icon: Layers },
  { label: "Emerging Issues", value: "4", caption: "Increasing over recent periods", icon: TrendingUp },
  { label: "High Priority", value: "5", caption: "High impact + high recurrence", icon: Flag },
];

const axis = { fontSize: 11, fill: "var(--muted-foreground)" };

function Overview() {
  const { suggestions } = useStore();
  const [dept, setDept] = useState("all");
  const [impact, setImpact] = useState("all");
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<"created_at" | "priority_score">("created_at");

  const rows = useMemo(
    () =>
      suggestions
        .filter((s) => (dept === "all" || s.department === dept) && (impact === "all" || s.impact === impact) && s.title.toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => (sortKey === "created_at" ? b.created_at.localeCompare(a.created_at) : b.priority_score - a.priority_score))
        .slice(0, 10),
    [suggestions, dept, impact, q, sortKey],
  );

  return (
    <>
      <PageHeader title="Overview" subtitle="Employee suggestion intelligence · reporting period Jan – Aug 2026" />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="card-surface p-3.5">
            <div className="flex items-center justify-between">
              <span className="eyebrow">{k.label}</span>
              <k.icon className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-1.5 font-mono text-2xl font-semibold tabular-nums tracking-tight">{k.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{k.caption}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-5">
        <Section title="Innovation Activity" description="Monthly volume of new suggestions and detected recurring themes" className="xl:col-span-3">
          <div className="h-full min-h-64 w-full">
            <ResponsiveContainer>
              <LineChart data={ACTIVITY} margin={{ left: -20, right: 8, top: 4 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={axis} axisLine={false} tickLine={false} />
                <YAxis tick={axis} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid var(--border)" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} iconType="plainline" />
                <Line type="monotone" dataKey="suggestions" name="New Suggestions" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="recurring" name="Recurring Themes" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="high" name="High Priority Themes" stroke="var(--chart-3)" strokeWidth={2} dot={false} strokeDasharray="4 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Emerging Opportunities" description="Fastest-growing semantic clusters" className="xl:col-span-2">
          <ul className="-my-1 divide-y">
            {THEMES.slice(0, 4).map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-2.5">
                <ThemeIcon name={t.icon} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium">{t.short}</div>
                  <div className="mt-0.5 flex items-center gap-2 whitespace-nowrap text-xs text-muted-foreground">
                    <span><span className="font-mono">{t.suggestion_count}</span> ideas</span><Trend v={t.trend_percentage} /><Pill value={t.priority} /><Pill value={t.status} />
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/themes/$themeId" params={{ themeId: t.id }}><span className="hidden sm:inline">View Theme</span> <ArrowUpRight /></Link>
                </Button>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section
        title="Recent Suggestions"
        description={`${suggestions.length} suggestions in demo dataset`}
        className="mt-3"
        actions={
          <div className="flex flex-wrap gap-2">
            <Input placeholder="Search titles…" value={q} onChange={(e) => setQ(e.target.value)} className="h-8 w-full sm:w-44" />
            <Select value={dept} onValueChange={setDept}>
              <SelectTrigger className="h-8 w-40"><SelectValue>{dept === "all" ? "All departments" : dept}</SelectValue></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={impact} onValueChange={setImpact}>
              <SelectTrigger className="h-8 w-32"><SelectValue>{impact === "all" ? "All impact" : impact}</SelectValue></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All impact</SelectItem>
                {["High", "Medium", "Low"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        }
      >
        <div className="-m-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead className="pl-4"><button className="inline-flex items-center gap-1" onClick={() => setSortKey("created_at")}>Date <ArrowUpDown className="size-3" /></button></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Theme</TableHead>
                <TableHead>Similarity Group</TableHead>
                <TableHead>Privacy Status</TableHead>
                <TableHead className="pr-4"><button className="inline-flex items-center gap-1" onClick={() => setSortKey("priority_score")}>Impact <ArrowUpDown className="size-3" /></button></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((s) => {
                const t = themeById(s.theme)!;
                return (
                  <TableRow key={s.id} className="text-sm">
                    <TableCell className="whitespace-nowrap pl-4 font-mono text-xs text-muted-foreground">{s.created_at}</TableCell>
                    <TableCell className="max-w-72 truncate font-medium">{s.title}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{s.department}</TableCell>
                    <TableCell><Link to="/themes/$themeId" params={{ themeId: t.id }} className="whitespace-nowrap text-primary hover:underline">{t.short}</Link></TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">SG-{t.id.slice(0, 3).toUpperCase()}-{THEMES.indexOf(t) + 1}</TableCell>
                    <TableCell><Pill value={s.privacy_status} /></TableCell>
                    <TableCell className="pr-4"><Pill value={s.impact} /></TableCell>
                  </TableRow>
                );
              })}
              {rows.length === 0 && (
                <TableRow><TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">No suggestions match these filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Section>
    </>
  );
}
