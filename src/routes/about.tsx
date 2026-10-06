import { createFileRoute } from "@tanstack/react-router";
import { Code2, Database, Brain, Ruler, Network, Cpu, Shield, BarChart3, ArrowRight } from "lucide-react";
import { Flow, PageHeader, Section } from "@/components/ui-bits";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/about")({
  head: () => meta("About & Architecture", "Architecture, technology choices and roadmap of the Secure Innovation Radar prototype."),
  component: About,
});

const TECH = [
  { k: "Frontend", v: "React + TypeScript + Tailwind", i: Code2 },
  { k: "Data", v: "Supabase-ready / PostgreSQL-ready", i: Database },
  { k: "Semantic AI", v: "Sentence Embeddings", i: Brain },
  { k: "Similarity", v: "Cosine Similarity", i: Ruler },
  { k: "Clustering", v: "HDBSCAN / Agglomerative Clustering", i: Network },
  { k: "LLM", v: "Local Ollama / Controlled LLM architecture", i: Cpu },
  { k: "Security", v: "PII masking + prompt-injection screening", i: Shield },
  { k: "Visualization", v: "Interactive dashboards", i: BarChart3 },
];
const FUTURE = [
  "Real sentence-transformer embedding service", "Persistent vector search", "Automatic cluster evolution",
  "Multilingual German/English suggestions", "Access-control roles", "Local enterprise LLM",
  "Feedback-based ranking", "Clustering evaluation metrics", "Human expert validation", "Integration with existing intranet systems",
];

function About() {
  return (
    <>
      <PageHeader title="Prototype Architecture" subtitle="How an employee suggestion becomes a management insight." />
      <div className="grid gap-3 lg:grid-cols-3">
        <Section title="System flow">
          <Flow highlight={[2, 6]} steps={["Employee Suggestion", "Web Interface", "Privacy & Security Guard", "Semantic Embedding Engine", "Similarity Search", "Semantic Clustering", "Local / Controlled LLM", "Trend & Priority Analysis", "Management Dashboard"]} />
        </Section>
        <div className="space-y-3 lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            {TECH.map((t) => (
              <div key={t.k} className="card-surface flex items-center gap-3 p-3.5">
                <span className="grid size-8 place-items-center rounded-md bg-secondary"><t.i className="size-4 text-primary" /></span>
                <div><div className="eyebrow">{t.k}</div><div className="text-sm font-medium">{t.v}</div></div>
              </div>
            ))}
          </div>
          <Section title="Why I Built This">
            <div className="space-y-3 text-sm leading-relaxed">
              <p>I built Secure Innovation Radar as an independent prototype after studying an Applied AI opportunity focused on employee suggestion intelligence. Rather than only describing my interest in LLM integration, semantic clustering, and trend discovery, I wanted to explore the problem technically.</p>
              <p>The concept combines experience from my TAADS document-intelligence project, HMI/NLP analytics work, and cybersecurity research into one privacy-aware enterprise AI workflow.</p>
              <p>The objective is not simply to collect suggestions, but to convert fragmented employee knowledge into recurring themes, decision-ready summaries, and measurable innovation signals.</p>
            </div>
          </Section>
        </div>
      </div>

      <h2 className="eyebrow mb-2 mt-5">Future Development</h2>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {FUTURE.map((f, i) => (
          <div key={f} className="card-surface flex items-center gap-2 p-3 text-sm">
            <span className="font-mono text-[11px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>{f}
            <ArrowRight className="ml-auto size-3.5 text-muted-foreground" />
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-1 rounded-md border bg-card p-4 text-xs text-muted-foreground">
        <p><strong className="text-foreground">Independent Prototype · Synthetic Demo Data.</strong> Not an official GFE application; no real employee or internal data is used.</p>
        <p>Public research alignment examples are illustrative and based only on publicly available themes.</p>
      </div>
    </>
  );
}
