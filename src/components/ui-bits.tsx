import type { ReactNode } from "react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

const tone = {
  High: "bg-destructive-soft text-destructive",
  "Very High": "bg-destructive-soft text-destructive",
  Medium: "bg-warning-soft text-warning",
  Low: "bg-secondary text-muted-foreground",
  Passed: "bg-success-soft text-success",
  Enabled: "bg-success-soft text-success",
  Sanitized: "bg-primary-soft text-primary",
  Required: "bg-primary-soft text-primary",
  Flagged: "bg-destructive-soft text-destructive",
  Emerging: "bg-primary-soft text-primary",
  Growing: "bg-success-soft text-success",
  Stable: "bg-secondary text-muted-foreground",
  Declining: "bg-secondary text-muted-foreground",
} as const;

export function Pill({ value, className }: { value: string; className?: string }) {
  const { t } = useLanguage();
  const toneClass = (tone as Record<string, string>)[value] ?? "bg-secondary text-secondary-foreground";
  return (
    <span className={cn("inline-flex h-5 items-center whitespace-nowrap rounded-sm border border-current/15 px-1.5 text-[11px] font-medium leading-none", toneClass, className)}>
      {t(value)}
    </span>
  );
}

export function Trend({ v }: { v: number }) {
  return (
    <span className={cn("font-mono text-xs font-medium tabular-nums", v > 0 ? "text-success" : "text-muted-foreground")}>
      {v > 0 ? "+" : ""}
      {v}%
    </span>
  );
}

export function ThemeIcon({ name, className }: { name: string; className?: string }) {
  const I = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Circle;
  return (
    <span className={cn("grid size-8 shrink-0 place-items-center rounded-md bg-primary-soft text-primary", className)}>
      <I className="size-4" />
    </span>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b pb-4">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[13px] text-muted-foreground">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Section({ title, description, actions, children, className }: { title: string; description?: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("card-surface flex flex-col", className)}>
      <header className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5">
        <div>
          <h2 className="text-[13px] font-semibold">{title}</h2>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        {actions}
      </header>
      <div className="flex-1 p-4">{children}</div>
    </section>
  );
}

export function Flow({ steps, highlight }: { steps: string[]; highlight?: number[] }) {
  return (
    <ol className="flex flex-col items-stretch">
      {steps.map((s, i) => (
        <li key={s} className="flex flex-col items-center">
          <div
            className={cn(
              "flex w-full items-center gap-3 rounded-sm border px-3 py-1.5 text-[13px]",
              highlight?.includes(i) ? "border-primary bg-primary-soft text-primary font-medium" : "bg-card",
            )}
          >
            <span className="font-mono text-[11px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            {s}
          </div>
          {i < steps.length - 1 && <span className="h-2.5 w-px bg-border" />}
        </li>
      ))}
    </ol>
  );
}
