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
