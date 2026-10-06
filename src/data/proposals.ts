// Generated (synthetic) improvement proposals per theme. In production these
// would come from a controlled LLM call over the cluster's sanitized suggestions.
import type { Theme } from "./mock";

export interface Proposal {
  problem: string;
  investigation: string;
  approach: string[];
  benefits: string[];
  confidence: "Low" | "Medium" | "High";
  rootCauses: string[];
  openQuestions: string[];
}

const PM: Proposal = {
  problem: "Tool degradation may only become visible after production quality starts declining.",
  investigation:
    "Evaluate whether existing acoustic, vibration, force, or machine-state data can be continuously analyzed to detect degradation patterns earlier.",
  approach: [
    "Identify available sensor/process data",
    "Establish healthy operating baseline",
    "Detect deviations/anomalies",
    "Correlate anomalies with tool condition and quality results",
    "Validate results with domain experts",
  ],
  benefits: ["Earlier maintenance intervention", "Reduced unexpected downtime", "Improved quality consistency", "Better use of machine/process data"],
  confidence: "Medium",
  rootCauses: [
    "Fixed-interval tool replacement instead of condition-based",
    "Sensor data recorded but not continuously analyzed",
    "Quality feedback reaches production with delay",
  ],
  openQuestions: [
    "Which sensor signals are already available?",
    "Is labelled tool-condition data available?",
    "What false-positive rate would be acceptable?",
    "Which domain expert should validate the hypothesis?",
  ],
};

export function proposalFor(t: Theme): Proposal {
  if (t.id === "predictive-maintenance") return PM;
  return {
    problem: t.summary.split(". ")[0]!.replace(/\.$/, "") + ".",
    investigation: t.investigation,
    approach: ["Quantify the problem with existing data", "Interview affected teams", "Define a small, measurable pilot", "Validate results with domain experts"],
    benefits: [`Addresses ${t.suggestion_count} related employee suggestions`, "Reduced duplicate review effort", "Measurable improvement baseline"],
    confidence: t.priority === "High" ? "Medium" : "Low",
    rootCauses: [`Recurring issue around ${t.keywords[0]}`, `Limited visibility of ${t.keywords[1] ?? "process data"}`],
    openQuestions: ["Which data sources are available?", "Who owns this process?", "What would a successful pilot measure?"],
  };
}
