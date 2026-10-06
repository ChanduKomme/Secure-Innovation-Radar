// Synthetic demo data only. Shapes mirror a future database schema.
export type Level = "Low" | "Medium" | "High";
export type Priority = "Low" | "Medium" | "High";
export type PrivacyStatus = "Passed" | "Sanitized" | "Flagged";

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  department: string;
  category: string;
  impact: Level;
  urgency: Level;
  anonymous: boolean;
  created_at: string;
  theme: string; // theme id
  similarity_score: number;
  privacy_status: PrivacyStatus;
  priority_score: number;
}

export interface Theme {
  id: string;
  name: string;
  short: string;
  description: string;
  suggestion_count: number;
  trend_percentage: number;
  impact_score: number; // 0-100
  frequency_score: number; // 0-100
  impact_label: string;
  priority: Priority;
  status: "Emerging" | "Growing" | "Stable" | "Declining";
  keywords: string[];
  summary: string;
  recommended_action: string;
  investigation: string;
  representative: string[];
  research: string[];
  icon: string;
}

export const DEPARTMENTS = [
  "Production",
  "Quality",
  "Maintenance",
  "Research & Development",
  "IT / Digitalization",
  "Administration",
  "Other",
];
export const CATEGORIES = [
  "Problem",
  "Improvement Idea",
  "Solution Proposal",
  "Process Issue",
  "Research Opportunity",
];

export const THEMES: Theme[] = [
  {
    id: "predictive-maintenance",
    name: "Predictive Maintenance & Tool Wear",
    short: "Predictive Maintenance",
    description: "Earlier detection of tool degradation and machine-state problems from process and sensor data.",
    suggestion_count: 17,
    trend_percentage: 32,
    impact_score: 84,
    frequency_score: 88,
    impact_label: "High",
    priority: "High",
    status: "Emerging",
    keywords: ["tool wear", "acoustic signals", "vibration", "machine condition", "sensor monitoring", "predictive maintenance", "quality degradation"],
    summary:
      "Multiple employee suggestions indicate that tool degradation and machine-state problems are often detected only after production quality begins to decline. Several suggestions propose earlier detection using acoustic, vibration, force, or process data.",
    recommended_action: "Investigate",
    investigation:
      "Evaluate whether existing process or sensor streams can support anomaly detection for early tool degradation.",
    representative: [
      "Detect cutting-tool wear using acoustic measurements",
      "Predict tool replacement earlier",
      "Monitor vibration trends during production",
      "Recognize quality degradation before failure",
    ],
    research: ["AI-based process monitoring", "Sensor analysis", "Anomaly detection", "Digital production"],
    icon: "Wrench",
  },
  {
    id: "quality-inspection",
    name: "AI Quality Inspection",
    short: "AI Quality Inspection",
    description: "Computer-vision and data-driven detection and classification of recurring quality defects.",
    suggestion_count: 14,
    trend_percentage: 21,
    impact_score: 94,
    frequency_score: 70,
    impact_label: "Very High",
    priority: "High",
    status: "Growing",
    keywords: ["visual inspection", "surface defects", "computer vision", "defect classification", "quality alerts"],
    summary:
      "Employees report that visual inspection is manual, inconsistent across shifts, and that recurring defect types are not systematically linked to process parameters. Suggestions converge on camera-based defect detection and automatic defect classification.",
    recommended_action: "Pilot",
    investigation: "Assess a camera-based inspection pilot on one line with a labelled defect sample set.",
    representative: [
      "Use AI vision to detect surface defects",
      "Automatically classify recurring quality issues",
      "Connect quality alerts with production parameters",
    ],
    research: ["Machine vision", "Quality analytics", "Explainable classification"],
    icon: "ScanSearch",
  },
  {
    id: "energy-efficiency",
    name: "Energy Efficiency",
    short: "Energy Efficiency",
    description: "Reducing idle consumption, compressed-air losses, and unnecessary machine runtime.",
    suggestion_count: 11,
    trend_percentage: 18,
    impact_score: 76,
    frequency_score: 56,
    impact_label: "High",
    priority: "Medium",
    status: "Growing",
    keywords: ["compressed air", "leakage", "idle consumption", "shutdown windows", "energy monitoring"],
    summary:
      "Suggestions point to avoidable energy consumption from compressed-air leakage and machines left idle between shifts. Employees propose automatic leak detection and scheduled shutdown windows.",
    recommended_action: "Explore",
    investigation: "Quantify idle and leakage losses using existing meter data before selecting measures.",
    representative: [
      "Detect compressed-air leakage automatically",
      "Monitor idle machine energy consumption",
      "Suggest energy-saving shutdown windows",
    ],
    research: ["Energy-aware production", "Sensor analysis"],
    icon: "Zap",
  },
  {
    id: "process-automation",
    name: "Process Automation",
    short: "Process Automation",
    description: "Removing repetitive manual steps, duplicate data entry, and paper-based approvals.",
    suggestion_count: 9,
    trend_percentage: 4,
    impact_score: 58,
    frequency_score: 48,
    impact_label: "Medium",
    priority: "Medium",
    status: "Stable",
    keywords: ["duplicate entry", "approvals", "workflow", "automation", "forms"],
    summary:
      "Employees describe repetitive manual data entry across systems and slow approval chains. Suggestions focus on digitized workflows and automatic data transfer.",
    recommended_action: "Monitor",
    investigation: "Map the three most frequently mentioned manual workflows and estimate time spent.",
    representative: ["Reduce duplicate manual data entry", "Digitize recurring approval workflows"],
    research: ["Digital production", "Workflow automation"],
    icon: "Workflow",
  },
  {
    id: "data-dashboards",
    name: "Data & Dashboarding",
    short: "Data Dashboards",
    description: "Better visibility of production and quality KPIs for teams and shift leads.",
    suggestion_count: 8,
    trend_percentage: 9,
    impact_score: 55,
    frequency_score: 42,
    impact_label: "Medium",
    priority: "Medium",
    status: "Stable",
    keywords: ["dashboard", "KPI", "visibility", "reporting", "shift handover"],
    summary:
      "Teams request consolidated, near-real-time views of key production metrics instead of manually compiled spreadsheets.",
    recommended_action: "Monitor",
    investigation: "Identify which KPIs are compiled manually today and by whom.",
    representative: ["Live KPI dashboard for shift leads", "Replace weekly spreadsheet reports"],
    research: ["Industrial data platforms"],
    icon: "LayoutDashboard",
  },
  {
    id: "knowledge-sharing",
    name: "Internal Knowledge Sharing",
    short: "Knowledge Sharing",
    description: "Making solved problems and lessons learned findable across teams.",
    suggestion_count: 7,
    trend_percentage: 12,
    impact_score: 50,
    frequency_score: 50,
    impact_label: "Medium",
    priority: "Medium",
    status: "Growing",
    keywords: ["lessons learned", "search", "knowledge base", "support cases", "documentation"],
    summary:
      "Employees frequently re-solve problems already solved elsewhere. Suggestions call for a single searchable place for recurring technical issues and summarized lessons learned.",
    recommended_action: "Explore",
    investigation: "Pilot semantic search over existing resolved support tickets.",
    representative: [
      "Create one searchable location for recurring technical problems",
      "Automatically summarize lessons learned",
      "Find similar solved issues before opening a new support case",
    ],
    research: ["Knowledge management", "Semantic search"],
    icon: "BookOpen",
  },
  {
    id: "safety-ergonomics",
    name: "Safety & Ergonomics",
    short: "Safety",
    description: "Workplace safety improvements and ergonomic load reduction.",
    suggestion_count: 6,
    trend_percentage: -3,
    impact_score: 70,
    frequency_score: 30,
    impact_label: "High",
    priority: "Medium",
    status: "Stable",
    keywords: ["safety", "ergonomics", "lifting", "near miss", "PPE"],
    summary:
      "Suggestions address manual lifting at specific stations and inconsistent near-miss reporting.",
    recommended_action: "Review",
    investigation: "Review station-level near-miss data with the safety officer.",
    representative: ["Lifting aid at packaging station", "Simplify near-miss reporting"],
    research: ["Human factors"],
    icon: "ShieldCheck",
  },
  {
    id: "documentation-workflow",
    name: "Documentation & Workflow",
    short: "Documentation",
    description: "Reducing effort for maintenance and process documentation.",
    suggestion_count: 5,
    trend_percentage: 6,
    impact_score: 36,
    frequency_score: 78,
    impact_label: "Low",
    priority: "Low",
    status: "Stable",
    keywords: ["maintenance documentation", "reports", "templates", "paperwork"],
    summary:
      "Employees perceive documentation as time-consuming and repetitive. Suggestions propose templates and automatic report drafting.",
    recommended_action: "Monitor",
    investigation: "Evaluate auto-drafting of maintenance reports from structured work-order data.",
    representative: ["Automate maintenance documentation", "Standardize shift report templates"],
    research: ["Document intelligence"],
    icon: "FileText",
  },
];

export const themeById = (id: string) => THEMES.find((t) => t.id === id);

type Seed = [string, string, string, Level, Level, string, PrivacyStatus];
const SEEDS: Seed[] = [
  ["Use acoustic signals to predict tool wear", "Microphones near the spindle could pick up changes in cutting sound before wear affects quality.", "Production", "High", "High", "predictive-maintenance", "Passed"],
  ["Predict cutting-tool degradation from acoustic signals", "Train a model on acoustic recordings to estimate remaining tool life.", "Production", "High", "Medium", "predictive-maintenance", "Passed"],
  ["Automatic monitoring for worn production tools", "Tools are often replaced too late. Automatic monitoring of tool condition would help.", "Maintenance", "High", "High", "predictive-maintenance", "Sanitized"],
  ["Identify machining quality degradation earlier", "Quality drops are noticed only at final inspection; detect machining drift earlier.", "Quality", "Medium", "Medium", "predictive-maintenance", "Passed"],
  ["Detect machine vibration anomalies before downtime", "Vibration sensors could warn us before bearing failures cause downtime.", "Maintenance", "High", "High", "predictive-maintenance", "Passed"],
  ["Track tool lifetime using production data", "Log tool usage hours from the machine controller to plan replacements.", "Production", "Medium", "Medium", "predictive-maintenance", "Passed"],
  ["Detect cutting-tool wear earlier", "Worn tools cause scrap; earlier detection would reduce rework.", "Production", "High", "High", "predictive-maintenance", "Passed"],
  ["Monitor vibration trends during production", "Trend vibration levels per machine over weeks to spot degradation.", "Maintenance", "Medium", "Low", "predictive-maintenance", "Passed"],
  ["Automatically identify recurring machine stops", "Classify stop reasons automatically instead of manual logging.", "Production", "Medium", "Medium", "predictive-maintenance", "Passed"],
  ["Use spindle force data to flag tool breakage", "Force spikes could indicate imminent tool breakage.", "Research & Development", "High", "Medium", "predictive-maintenance", "Passed"],
  ["AI-assisted visual quality inspection", "Cameras plus AI could support inspectors on the final check.", "Quality", "High", "High", "quality-inspection", "Passed"],
  ["Use AI vision to detect surface defects", "Scratches and dents are missed at high line speed.", "Quality", "High", "Medium", "quality-inspection", "Passed"],
  ["Automatically classify recurring quality issues", "Group defect reports so we see which issues repeat.", "Quality", "Medium", "Medium", "quality-inspection", "Sanitized"],
  ["Connect quality alerts with production parameters", "Link each quality alert to the machine settings at that moment.", "IT / Digitalization", "High", "Medium", "quality-inspection", "Passed"],
  ["Consistent inspection criteria across shifts", "Different shifts judge borderline parts differently.", "Quality", "Medium", "Low", "quality-inspection", "Passed"],
  ["Camera check for missing components", "An automatic check for missing screws before packaging.", "Production", "High", "Medium", "quality-inspection", "Passed"],
  ["Reduce compressed-air waste", "Compressed-air lines leak noticeably in hall 2.", "Maintenance", "High", "Medium", "energy-efficiency", "Passed"],
  ["Detect compressed-air leakage automatically", "Ultrasonic sensors could locate leaks automatically.", "Maintenance", "High", "Medium", "energy-efficiency", "Passed"],
  ["Monitor idle machine energy consumption", "Machines stay powered on over weekends.", "Production", "Medium", "Low", "energy-efficiency", "Passed"],
  ["Suggest energy-saving shutdown windows", "Use the production schedule to propose shutdown windows.", "IT / Digitalization", "Medium", "Low", "energy-efficiency", "Passed"],
  ["Sub-metering per production line", "We cannot see energy use per line today.", "Administration", "Medium", "Low", "energy-efficiency", "Passed"],
  ["Automate maintenance documentation", "Maintenance reports take a lot of time to write manually.", "Maintenance", "Medium", "Medium", "documentation-workflow", "Passed"],
  ["Standardize shift report templates", "Every shift writes handover notes differently.", "Production", "Low", "Low", "documentation-workflow", "Passed"],
  ["Draft reports from work-order data", "Pre-fill reports using the structured work-order fields.", "IT / Digitalization", "Medium", "Low", "documentation-workflow", "Passed"],
  ["Reduce duplicate manual data entry", "The same data is typed into three different systems.", "Administration", "Medium", "Medium", "process-automation", "Passed"],
  ["Digitize recurring approval workflows", "Paper approval forms delay purchases by days.", "Administration", "Medium", "Medium", "process-automation", "Sanitized"],
  ["Automatic transfer of measurement results", "Measurement data should flow into the quality system automatically.", "Quality", "Medium", "Low", "process-automation", "Passed"],
  ["Robotic loading for repetitive tasks", "Simple loading tasks could be automated with a cobot.", "Production", "High", "Low", "process-automation", "Passed"],
  ["Improve knowledge sharing between teams", "Teams solve the same problems independently.", "Research & Development", "Medium", "Medium", "knowledge-sharing", "Passed"],
  ["Create one searchable location for recurring technical problems", "A central searchable place for known issues and fixes.", "IT / Digitalization", "Medium", "Medium", "knowledge-sharing", "Passed"],
  ["Automatically summarize lessons learned", "Project lessons learned are long and rarely read.", "Research & Development", "Medium", "Low", "knowledge-sharing", "Passed"],
  ["Find similar solved issues before opening a new support case", "Suggest similar solved tickets when creating a new one.", "IT / Digitalization", "Medium", "Medium", "knowledge-sharing", "Passed"],
  ["Live KPI dashboard for shift leads", "Shift leads need current output and scrap rate at a glance.", "Production", "Medium", "Medium", "data-dashboards", "Passed"],
  ["Replace weekly spreadsheet reports", "Weekly Excel reports are compiled manually.", "Administration", "Medium", "Low", "data-dashboards", "Passed"],
  ["Unified quality dashboard", "Quality metrics from different tools in one view.", "Quality", "Medium", "Low", "data-dashboards", "Passed"],
  ["Lifting aid at packaging station", "Heavy boxes are lifted manually many times per shift.", "Production", "High", "Medium", "safety-ergonomics", "Passed"],
  ["Simplify near-miss reporting", "Reporting a near miss takes too long, so it is skipped.", "Other", "Medium", "Medium", "safety-ergonomics", "Sanitized"],
  ["Better lighting at inspection tables", "Poor lighting causes eye strain and missed defects.", "Quality", "Medium", "Low", "safety-ergonomics", "Passed"],
  ["Recognize quality degradation before failure", "Combine process signals to predict quality loss.", "Research & Development", "High", "Medium", "predictive-maintenance", "Passed"],
  ["Predict tool replacement earlier", "Plan tool changes based on predicted wear, not fixed intervals.", "Maintenance", "High", "Medium", "predictive-maintenance", "Passed"],
  ["Detect cutting-tool wear using acoustic measurements", "Acoustic emission measurements as wear indicator.", "Research & Development", "High", "High", "predictive-maintenance", "Passed"],
  ["Thermal camera checks on electrical cabinets", "Detect overheating components early.", "Maintenance", "Medium", "Medium", "predictive-maintenance", "Passed"],
];

export const SUGGESTIONS: Suggestion[] = SEEDS.map((s, i) => {
  const day = 28 - ((i * 3) % 27);
  const month = 8 - Math.floor(i / 7);
  const impactPts = s[3] === "High" ? 40 : s[3] === "Medium" ? 25 : 10;
  const urgPts = s[4] === "High" ? 25 : s[4] === "Medium" ? 15 : 5;
  const themePts = Math.round((themeById(s[5])!.frequency_score / 100) * 30);
  return {
    id: `SUG-${String(1000 + i)}`,
    title: s[0],
    description: s[1],
    department: s[2],
    category: CATEGORIES[i % CATEGORIES.length]!,
    impact: s[3],
    urgency: s[4],
    anonymous: i % 3 === 0,
    created_at: `2026-${String(Math.max(month, 1)).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    theme: s[5],
    similarity_score: 0.7 + ((i * 37) % 25) / 100,
    privacy_status: s[6],
    priority_score: Math.min(98, impactPts + urgPts + themePts),
  };
});

export const ACTIVITY = [
  { month: "Jan", suggestions: 6, recurring: 2, high: 1 },
  { month: "Feb", suggestions: 8, recurring: 3, high: 1 },
  { month: "Mar", suggestions: 9, recurring: 3, high: 2 },
  { month: "Apr", suggestions: 11, recurring: 4, high: 2 },
  { month: "May", suggestions: 12, recurring: 5, high: 3 },
  { month: "Jun", suggestions: 14, recurring: 6, high: 3 },
  { month: "Jul", suggestions: 17, recurring: 7, high: 4 },
  { month: "Aug", suggestions: 19, recurring: 8, high: 5 },
];
