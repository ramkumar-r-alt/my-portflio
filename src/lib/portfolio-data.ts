import resumeUrl from "@/assets/Ramkumar-Resume.pdf?url";

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  year: string;
  role: string;
  stack: string[];
  accentLabel: string;
  caseStudy: boolean;
  overview: string;
  problem: string;
  solution: string;
  features: string[];
  architecture: string[];
  challenges: string[];
  optimizations: string[];
  results: { label: string; value: string }[];
  lessons: string[];
};

export const profile = {
  name: "Ramkumar R",
  title: "Full Stack Engineer",
  experience: "3+ Years",
  headline: "Ramkumar R",
  subtitle:
    "Building fast, scalable and beautiful digital experiences with React, Next.js, Node.js, PostgreSQL, Redis and modern web technologies.",
  about:
    "I'm a Full Stack Engineer with experience building AI, Enterprise SaaS and FinTech products. I enjoy designing elegant user experiences while architecting scalable backend systems. My expertise spans frontend engineering, API development, database optimization, caching, asynchronous processing and reusable design systems.",
  email: "ram232488@gmail.com",
  linkedin: "https://www.linkedin.com/in/ramkumar-r-052b92179/",
  github: "https://github.com/ramkumar-r-alt",
  resume: resumeUrl,
};

export const heroBadges = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Redis",
  "RabbitMQ",
  "Tailwind CSS",
  "Framer Motion",
];

export const skillGroups = [
  {
    label: "Frontend",
    items: [
      "React",
      "Next.js",
      "JavaScript",
      "TypeScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Redux Toolkit",
      "Framer Motion",
      "Three.js",
    ],
  },
  { label: "Backend", items: ["Node.js", "Express.js", "REST APIs"] },
  { label: "Database", items: ["PostgreSQL", "MongoDB", "MySQL", "Redis"] },
  { label: "Messaging", items: ["RabbitMQ"] },
  {
    label: "Tools",
    items: ["Git", "GitHub", "Docker", "Vercel", "Jira", "Postman", "Figma"],
  },
];

export const orbitSkills = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Redis",
  "RabbitMQ",
  "Docker",
  "Tailwind",
  "Three.js",
  "Express",
  "MongoDB",
];

export const experience = [
  {
    period: "Feb 2026 — Jul 2026",
    role: "Full Stack Engineer",
    company: "AlMukarramah Consulting Services",
    location: "Bengaluru, India",
    detail:
      "Built and scaled Trade57.ai, a live B2B trading platform, across frontend and backend.",
    highlights: [
      "Developed full-stack features for Trade57.ai using React 18 + Vite with Node.js/Express REST APIs, increasing system throughput by 30%",
      "Re-architected PostgreSQL schemas by redesigning indexes and eliminating redundant joins, cutting average API response time by 40%",
      "Implemented Redis caching across high-traffic endpoints, reducing database query load and improving scalability during concurrent user spikes",
      "Built bulk-upload and RFQ automation scripts with rate limiting and retry logic to reliably process large data payloads",
      "Integrated PostgreSQL Foreign Data Wrapper (FDW) to enable cross-database queries across distributed instances without data duplication",
      "Migrated the frontend build pipeline to Vite, reducing build time by over 50% and improving hot-reload speed",
      "Refactored legacy modules and reviewed pull requests to improve separation of concerns and long-term maintainability",
    ],
  },
  {
    period: "Aug 2023 — Feb 2026",
    role: "Software Development Engineer",
    company: "Diatoz",
    location: "Bengaluru, India",
    detail:
      "Delivered React, Next.js and Node.js features across multiple concurrent enterprise client projects.",
    highlights: [
      "Delivered React and Next.js features across 5+ client projects, building shared component libraries that cut per-project development time by 25%",
      "Owned REST API integration between React frontends and Node.js/Express/MongoDB backends across multiple concurrent client systems",
      "Built a custom AI chatbot for IFQM using Node.js and NLP integration, automating user support and reducing manual query handling",
      "Built AI agent tooling (SDE, PRD and ARD document generators) for an Amazon-facing proof of concept, integrating LLM APIs to automate documentation workflows",
      "Engineered an interactive 3D product configurator for Barry Callebaut using Three.js and React, enabling real-time in-browser visualization",
      "Mentored 3 interns through structured code reviews and workflows, improving overall team delivery consistency",
    ],
  },
  {
    period: "May 2023 — Aug 2023",
    role: "Software Development Intern",
    company: "Diatoz",
    location: "Bengaluru, India",
    detail:
      "Built responsive UI components for a recruitment platform while learning professional delivery practices.",
    highlights: [
      "Built responsive React and Next.js UI components for a recruitment platform, contributing to 2 production feature releases",
      "Participated in Agile sprints, code reviews and daily standups, building a strong foundation in professional software delivery",
    ],
  },
];

export const achievements = [
  { value: "3+", label: "Years shipping production software" },
  { value: "4", label: "Enterprise products delivered" },
  { value: "60%", label: "Average API latency reduction" },
  { value: "95+", label: "Lighthouse scores on shipped apps" },
];

export const projects: Project[] = [
 
  {
    slug: "trade57",
    name: "Trade57.ai",
    tagline: "Enterprise B2B trading platform",
    year: "2026",
    role: "Full Stack Engineer",
    accentLabel: "B2B SaaS",
    caseStudy: false,
    stack: ["React", "Vite", "Node.js", "PostgreSQL", "Redis", "RabbitMQ"],
    overview:
      "A B2B trading platform handling high-frequency order flow, counterparty management and settlement reporting.",
    problem:
      "The original schema buckled under order-heavy traffic; report queries locked tables and the UI stalled during peak trading hours.",
    solution:
      "Redesigned the relational schema, introduced Redis caching for hot reads and moved reporting and notifications onto RabbitMQ consumers.",
    features: [
      "Real-time order entry and management",
      "Counterparty and settlement reporting",
      "Role-scoped admin dashboards",
      "Async notification pipeline",
    ],
    architecture: [
      "React + Vite SPA with modular feature slices",
      "Node.js REST APIs with partitioned PostgreSQL order history",
      "Redis caching for hot pricing reads",
      "RabbitMQ consumers for reporting and notifications",
    ],
    challenges: [
      "Zero-downtime schema migration on live trading data",
      "Consistent pricing views across cached and live reads",
      "Backpressure during burst order volume",
    ],
    optimizations: [
      "Composite indexes and partitioned order history tables",
      "Event-driven cache invalidation instead of TTL guessing",
      "Durable queues with retry and dead-letter handling",
    ],
    results: [
      { label: "P95 query time", value: "-72%" },
      { label: "Peak throughput", value: "4.5x" },
      { label: "Report generation", value: "-80%" },
    ],
    lessons: [
      "Event-driven invalidation beats TTL heuristics",
      "Measure before indexing — most guesses are wrong",
    ],
  },
   {
    slug: "flowwork-ai",
    name: "flowwork.ai",
    tagline: "AI workflow copilot for engineering teams",
    year: "2024-2026",
    role: "Software Development Engineer",
    accentLabel: "AI SaaS",
    caseStudy: true,
    stack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Redis", "OpenAI"],
    overview:
      "Flowwork AI turns scattered engineering activity into a single planning surface — AI-assisted ticket drafting, sprint summaries and a two-way JIRA sync.",
    problem:
      "Teams lost hours every week manually translating conversations into tickets, and context was split across JIRA, docs and chat.",
    solution:
      "Designed the platform architecture, built a reusable React component system, and shipped AI integrations behind a queue-backed job layer with Redis caching for expensive reads.",
    features: [
      "AI-assisted ticket drafting and sprint summaries",
      "Two-way JIRA synchronisation",
      "Reusable design-system component library",
      "Role-based workspaces and permissions",
      "Streaming AI responses in the dashboard",
    ],
    architecture: [
      "Next.js app router frontend with a shared design-system package",
      "Node.js service layer with domain-driven modules",
      "PostgreSQL as the system of record, Redis as read-through cache",
      "Background workers for AI jobs and external sync",
    ],
    challenges: [
      "Keeping AI responses deterministic enough for real project data",
      "Bi-directional JIRA sync without duplicate writes",
      "Cold-start latency on AI-heavy dashboard views",
    ],
    optimizations: [
      "Redis read-through caching for expensive aggregate queries",
      "Streaming AI output instead of blocking requests",
      "Route-level code splitting and image optimisation",
      "Idempotent sync workers keyed on external issue IDs",
    ],
    results: [
      { label: "Dashboard TTFB", value: "-64%" },
      { label: "Ticket creation time", value: "-70%" },
      { label: "Sync conflicts", value: "~0" },
    ],
    lessons: [
      "Ship the boring sync layer before the shiny AI layer",
      "A design system pays for itself by week three",
    ],
  },
  {
    slug: "e2e-workforce",
    name: "E2E Workforce",
    tagline: "HRMS for distributed teams",
    year: "2022",
    role: "Software Development Engineer",
    accentLabel: "HR SaaS",
    caseStudy: true,
    stack: ["React", "Node.js", "MongoDB", "Sockets", "Charts"],
    overview:
      "A complete HRMS covering employee records, leave management, project allocation, internal chat and analytics dashboards.",
    problem:
      "HR operations lived in spreadsheets, making approvals slow and reporting unreliable.",
    solution:
      "Built modular HR domains with a shared permission layer, real-time chat and dashboards that aggregate leave, attendance and project load.",
    features: [
      "Employee records and org structure",
      "Leave requests with configurable approval chains",
      "Project allocation and utilisation tracking",
      "Real-time internal chat",
      "Analytics dashboards",
    ],
    architecture: [
      "React SPA split by HR domain module",
      "Node.js API with a single shared permission layer",
      "MongoDB document store with pre-aggregated reporting collections",
      "Socket layer isolated from the main request path",
    ],
    challenges: [
      "Complex approval hierarchies per department",
      "Real-time messaging alongside REST workflows",
      "Aggregation dashboards over growing datasets",
    ],
    optimizations: [
      "Pre-aggregated reporting collections refreshed on write",
      "Virtualised long employee tables",
      "Debounced socket presence updates",
    ],
    results: [
      { label: "Approval turnaround", value: "-60%" },
      { label: "Report accuracy", value: "100%" },
      { label: "Dashboard load", value: "-45%" },
    ],
    lessons: [
      "Permissions belong in one layer, not sprinkled per route",
      "Real-time features need their own failure story",
    ],
  },
  {
    slug: "e2e-hiring",
    name: "E2E Hiring",
    tagline: "Recruitment portal with a marketing front door",
    year: "2022",
    role: "Software Development Engineer",
    accentLabel: "Recruitment",
    caseStudy: true,
    stack: ["Next.js", "TypeScript", "Auth", "Tailwind CSS"],
    overview:
      "A recruitment portal pairing conversion-focused landing pages with an authenticated candidate and recruiter experience.",
    problem:
      "The old careers site was static, unbranded and pushed applicants into a third-party form with heavy drop-off.",
    solution:
      "Rebuilt the portal in Next.js with server-rendered landing pages, secure authentication and a responsive application flow.",
    features: [
      "SEO-optimised job listing and detail pages",
      "Secure candidate and recruiter authentication",
      "Multi-step, resumable application form",
      "Recruiter pipeline views",
    ],
    architecture: [
      "Next.js with a per-page rendering strategy (SSG marketing, SSR app)",
      "Session-based auth guarding gated routes",
      "Schema-validated form state persisted per step",
      "Tailwind design tokens for a fluid type scale",
    ],
    challenges: [
      "SEO-critical pages coexisting with gated app routes",
      "Multi-step application form with resumable state",
      "Responsive parity from 320px to ultrawide",
    ],
    optimizations: [
      "Static generation for marketing routes",
      "Image and font optimisation for LCP",
      "Client-side caching of listing queries",
    ],
    results: [
      { label: "Application completion", value: "+38%" },
      { label: "Lighthouse performance", value: "97" },
      { label: "Organic traffic", value: "+2.1x" },
    ],
    lessons: [
      "Conversion is a rendering-strategy decision too",
      "Resumable forms drastically cut abandonment",
    ],
  },
];

export const caseStudies = projects.filter((p) => p.caseStudy);

export const testimonials = [
  {
    quote:
      "Ramkumar ships like a founding engineer — architecture, UI and the unglamorous infrastructure in between.",
    author: "Engineering Lead",
    role: "Placeholder testimonial",
  },
  {
    quote:
      "Rare combination: cares about database indexes and about the easing curve on a hover state.",
    author: "Product Manager",
    role: "Placeholder testimonial",
  },
];

export const sections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Projects" },
  { id: "achievements", label: "Achievements" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
];
