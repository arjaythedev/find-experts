export interface JobFamily {
  id: string;
  label: string;
  iconId: string;
  topics: string[];
}

export const JOB_FAMILIES: JobFamily[] = [
  {
    id: "product-management",
    label: "Product Management",
    iconId: "layout-grid",
    topics: ["ai-product", "ai-productivity", "vibe-coding", "customer-research", "decision-making"],
  },
  {
    id: "engineering",
    label: "Engineering",
    iconId: "code-2",
    topics: ["vibe-coding", "ai-agents", "rag-llm-apps", "ai-evals", "claude-code"],
  },
  {
    id: "data-science",
    label: "Data Science / Analytics",
    iconId: "bar-chart-3",
    topics: ["ai-analysis", "rag-llm-apps", "ai-evals", "ai-agents", "claude-code"],
  },
  {
    id: "designer",
    label: "Design / UX",
    iconId: "palette",
    topics: ["ai-design", "ux-design", "figma-design-systems", "ai-product", "vibe-coding"],
  },
  {
    id: "marketing",
    label: "Marketing",
    iconId: "megaphone",
    topics: ["ai-marketing", "ai-productivity", "personal-branding", "communication-storytelling", "gtm-engineering"],
  },
  {
    id: "sales",
    label: "Sales / GTM",
    iconId: "handshake",
    topics: ["ai-for-sales", "gtm-engineering", "ai-agents", "ai-productivity", "communication-storytelling"],
  },
  {
    id: "biz-ops",
    label: "Biz Ops",
    iconId: "briefcase",
    topics: ["ai-productivity", "ai-analysis", "decision-making", "management-leadership", "ai-agents"],
  },
  {
    id: "founder",
    label: "Founder / Business Owner",
    iconId: "rocket",
    topics: ["ai-product", "vibe-coding", "ai-agents", "gtm-engineering", "management-leadership"],
  },
];

export interface Interest {
  id: string;
  label: string;
  topics: string[]; // maps to recommendation-index topics
}

export const INTERESTS_BY_ROLE: Record<string, Interest[]> = {
  "product-management": [
    { id: "ai-product-sense", label: "AI Product Sense", topics: ["ai-product", "customer-research"] },
    { id: "vibe-coding", label: "Vibe Coding", topics: ["vibe-coding"] },
    { id: "decision-making", label: "Decision Making", topics: ["decision-making"] },
    { id: "ai-prototyping", label: "AI Prototyping", topics: ["vibe-coding", "ai-product"] },
    { id: "customer-research", label: "Customer Research", topics: ["customer-research"] },
    { id: "executive-presence", label: "Executive Presence", topics: ["communication-storytelling", "management-leadership"] },
    { id: "ai-strategy", label: "AI Strategy", topics: ["ai-x-leaders", "ai-product"] },
    { id: "productivity", label: "AI Productivity", topics: ["ai-productivity"] },
  ],
  "engineering": [
    { id: "vibe-coding", label: "Vibe Coding", topics: ["vibe-coding"] },
    { id: "ai-agents", label: "AI Agents", topics: ["ai-agents"] },
    { id: "rag-llm", label: "RAG & LLM Apps", topics: ["rag-llm-apps"] },
    { id: "ai-evals", label: "AI Evals", topics: ["ai-evals"] },
    { id: "claude-code", label: "Claude Code", topics: ["claude-code"] },
    { id: "system-design", label: "System Design", topics: ["rag-llm-apps", "ai-agents"] },
    { id: "technical-leadership", label: "Technical Leadership", topics: ["management-leadership", "ai-x-leaders"] },
    { id: "communication", label: "Communication", topics: ["communication-storytelling"] },
  ],
  "data-science": [
    { id: "ai-analysis", label: "AI Analysis", topics: ["ai-analysis"] },
    { id: "rag-llm", label: "RAG & LLM Apps", topics: ["rag-llm-apps"] },
    { id: "ai-evals", label: "AI Evals", topics: ["ai-evals"] },
    { id: "ai-agents", label: "AI Agents", topics: ["ai-agents"] },
    { id: "claude-code", label: "Claude Code", topics: ["claude-code"] },
    { id: "decision-making", label: "Decision Making", topics: ["decision-making"] },
    { id: "storytelling", label: "Data Storytelling", topics: ["communication-storytelling"] },
    { id: "leadership", label: "Technical Leadership", topics: ["management-leadership", "ai-x-leaders"] },
  ],
  "designer": [
    { id: "ai-design", label: "AI Design", topics: ["ai-design"] },
    { id: "ux-design", label: "UX Design", topics: ["ux-design"] },
    { id: "figma", label: "Figma & Design Systems", topics: ["figma-design-systems"] },
    { id: "ai-prototyping", label: "AI Prototyping", topics: ["vibe-coding", "ai-design"] },
    { id: "product-sense", label: "Product Sense", topics: ["ai-product", "customer-research"] },
    { id: "storytelling", label: "Storytelling", topics: ["communication-storytelling"] },
    { id: "personal-brand", label: "Personal Branding", topics: ["personal-branding"] },
    { id: "leadership", label: "Design Leadership", topics: ["management-leadership"] },
  ],
  "marketing": [
    { id: "ai-marketing", label: "AI Marketing", topics: ["ai-marketing"] },
    { id: "gtm-engineering", label: "GTM Engineering", topics: ["gtm-engineering"] },
    { id: "personal-brand", label: "Personal Branding", topics: ["personal-branding"] },
    { id: "storytelling", label: "Storytelling", topics: ["communication-storytelling"] },
    { id: "productivity", label: "AI Productivity", topics: ["ai-productivity"] },
    { id: "customer-research", label: "Customer Research", topics: ["customer-research"] },
    { id: "executive-presence", label: "Executive Presence", topics: ["communication-storytelling", "management-leadership"] },
    { id: "vibe-coding", label: "Vibe Coding", topics: ["vibe-coding"] },
  ],
  "sales": [
    { id: "ai-sales", label: "AI for Sales", topics: ["ai-for-sales"] },
    { id: "gtm-engineering", label: "GTM Engineering", topics: ["gtm-engineering"] },
    { id: "ai-agents", label: "AI Agents", topics: ["ai-agents"] },
    { id: "storytelling", label: "Storytelling", topics: ["communication-storytelling"] },
    { id: "productivity", label: "AI Productivity", topics: ["ai-productivity"] },
    { id: "personal-brand", label: "Personal Branding", topics: ["personal-branding"] },
    { id: "executive-presence", label: "Executive Presence", topics: ["communication-storytelling", "management-leadership"] },
    { id: "decision-making", label: "Decision Making", topics: ["decision-making"] },
  ],
  "biz-ops": [
    { id: "productivity", label: "AI Productivity", topics: ["ai-productivity"] },
    { id: "ai-analysis", label: "AI Analysis", topics: ["ai-analysis"] },
    { id: "decision-making", label: "Decision Making", topics: ["decision-making"] },
    { id: "ai-agents", label: "AI Agents", topics: ["ai-agents"] },
    { id: "leadership", label: "Management & Leadership", topics: ["management-leadership"] },
    { id: "executive-presence", label: "Executive Presence", topics: ["communication-storytelling", "ai-x-leaders"] },
    { id: "storytelling", label: "Storytelling", topics: ["communication-storytelling"] },
    { id: "vibe-coding", label: "Vibe Coding", topics: ["vibe-coding"] },
  ],
  "founder": [
    { id: "ai-product", label: "AI Product", topics: ["ai-product"] },
    { id: "vibe-coding", label: "Vibe Coding", topics: ["vibe-coding"] },
    { id: "ai-agents", label: "AI Agents", topics: ["ai-agents"] },
    { id: "gtm-engineering", label: "GTM Engineering", topics: ["gtm-engineering"] },
    { id: "leadership", label: "Leadership", topics: ["management-leadership"] },
    { id: "executive-presence", label: "Executive Presence", topics: ["communication-storytelling", "ai-x-leaders"] },
    { id: "personal-brand", label: "Personal Branding", topics: ["personal-branding"] },
    { id: "decision-making", label: "Decision Making", topics: ["decision-making"] },
  ],
};

export const TOPIC_LABELS: Record<string, string> = {
  "vibe-coding": "Vibe Coding",
  "ai-agents": "AI Agents",
  "rag-llm-apps": "RAG & LLM Apps",
  "ai-evals": "AI Evals",
  "ai-product": "AI Product",
  "claude-code": "Claude Code",
  "ai-productivity": "AI Productivity",
  "gtm-engineering": "GTM Engineering",
  "ai-for-sales": "AI for Sales",
  "communication-storytelling": "Communication & Storytelling",
  "ai-marketing": "AI Marketing",
  "ai-analysis": "AI Analysis",
  "ai-x-leaders": "AI for Leaders",
  "personal-branding": "Personal Branding",
  "customer-research": "Customer Research",
  "decision-making": "Decision Making",
  "management-leadership": "Management & Leadership",
  "ux-design": "UX Design",
  "ai-design": "AI Design",
  "figma-design-systems": "Figma & Design Systems",
};
