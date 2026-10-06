export type RoleCategory = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  skills: string[];
};

export const roleCategories: RoleCategory[] = [
  {
    slug: "executive-support",
    name: "Executive & Administrative Support",
    tagline: "Senior operators who protect your time.",
    description:
      "Executive assistants, project coordinators and operations administrators trained to run calendars, inboxes, travel and reporting across time zones.",
    skills: [
      "Executive Assistant",
      "Calendar & Inbox Management",
      "Travel Coordination",
      "Project Coordination",
      "Operations Administration",
      "Data & Reporting",
      "Minute Taking",
      "Vendor Management",
    ],
  },
  {
    slug: "customer-experience",
    name: "Customer Experience & Support",
    tagline: "Front-line teams that protect your brand.",
    description:
      "Multichannel support specialists, CX leads and success managers experienced with Zendesk, Intercom, HubSpot and SLA-driven environments.",
    skills: [
      "Customer Support (Email/Chat)",
      "Voice Support",
      "Technical Support",
      "Customer Success",
      "Escalation Management",
      "Zendesk / Intercom",
      "Quality Assurance",
      "Community Management",
    ],
  },
  {
    slug: "finance-accounting",
    name: "Finance & Accounting",
    tagline: "Numbers people who close the month cleanly.",
    description:
      "Bookkeepers, financial analysts and qualified accountants with international standards exposure and rigorous reconciliation discipline.",
    skills: [
      "Bookkeeping",
      "Accounts Payable / Receivable",
      "Payroll",
      "Financial Reporting",
      "Financial Analysis & Modelling",
      "QuickBooks / Xero",
      "Tax & Compliance Support",
      "Audit Support",
    ],
  },
  {
    slug: "sales-growth",
    name: "Sales, Marketing & Growth",
    tagline: "Pipeline builders, not lead scrapers.",
    description:
      "SDRs, account executives, performance marketers and content strategists who own targets and report on outcomes.",
    skills: [
      "Sales Development (SDR)",
      "Account Management",
      "Performance Marketing",
      "SEO & Content Strategy",
      "Email & Lifecycle Marketing",
      "Social Media Management",
      "CRM Operations (HubSpot/Salesforce)",
      "Market Research",
    ],
  },
  {
    slug: "technology",
    name: "Technology & Engineering",
    tagline: "Engineers vetted on real work, not puzzles.",
    description:
      "Full-stack, frontend, backend, data and QA engineers assessed through practical work samples and live technical interviews.",
    skills: [
      "Frontend Engineering",
      "Backend Engineering",
      "Full-Stack Engineering",
      "Mobile Development",
      "Data Engineering",
      "DevOps & Cloud",
      "QA & Automation",
      "Technical Product Support",
    ],
  },
  {
    slug: "creative-design",
    name: "Creative & Design",
    tagline: "Craft that matches your brand standard.",
    description:
      "Product designers, brand designers, video editors and motion specialists with portfolios reviewed by senior practitioners.",
    skills: [
      "Product / UX Design",
      "UI & Design Systems",
      "Brand & Graphic Design",
      "Video Editing",
      "Motion Graphics",
      "Presentation Design",
      "Copywriting",
      "Webflow / No-code Build",
    ],
  },
  {
    slug: "healthcare-support",
    name: "Healthcare & Regulated Support",
    tagline: "Compliance-aware talent for sensitive workflows.",
    description:
      "Medical administrators, billing specialists and scribes familiar with confidentiality obligations and regulated documentation.",
    skills: [
      "Medical Virtual Administration",
      "Medical Billing & Coding",
      "Clinical Scribing",
      "Patient Scheduling",
      "Insurance Verification",
      "Records Management",
      "Compliance Documentation",
      "Care Coordination",
    ],
  },
  {
    slug: "people-operations",
    name: "People Operations & Recruitment",
    tagline: "Teams that help you hire and keep talent.",
    description:
      "Recruiters, HR generalists and people-ops specialists who can build hiring pipelines and onboarding systems for distributed teams.",
    skills: [
      "Talent Sourcing",
      "Technical Recruiting",
      "HR Administration",
      "Onboarding & Enablement",
      "Payroll & Benefits Admin",
      "Performance Management",
      "HRIS Administration",
      "Policy & Documentation",
    ],
  },
];

export const engagementModels = [
  {
    title: "Full-time dedicated",
    detail: "One professional, fully embedded in your team, working your hours.",
  },
  { title: "Part-time", detail: "Structured coverage for 20 hours a week or less." },
  { title: "Project-based", detail: "Defined scope, defined deliverables, defined end date." },
  { title: "Team build-out", detail: "Multiple roles hired together, coordinated by one partner." },
];

export const businessProcess = [
  {
    step: "01",
    title: "Discovery consultation",
    body: "We map the role, the outcomes, the working hours and the cultural fit you need — before any CV is sent.",
  },
  {
    step: "02",
    title: "Targeted sourcing",
    body: "We recruit against your brief across our global network instead of forwarding whoever is available.",
  },
  {
    step: "03",
    title: "Assessment & vetting",
    body: "Skills testing, work samples, structured interviews, background and reference checks.",
  },
  {
    step: "04",
    title: "Shortlist & selection",
    body: "You receive a short, explained shortlist. You interview. You decide. We do the vetting, you make the choice.",
  },
  {
    step: "05",
    title: "Onboarding & aftercare",
    body: "We support onboarding, check in through the first 90 days, and replace at no cost if fit fails.",
  },
];

export const talentProcess = [
  {
    step: "01",
    title: "Apply",
    body: "Submit your profile once. One application opens you to every matching role in our network.",
  },
  {
    step: "02",
    title: "Assessment",
    body: "Complete role-relevant skills assessments and a communication evaluation.",
  },
  {
    step: "03",
    title: "Interview",
    body: "A structured interview with a RemoSource recruiter who understands your discipline.",
  },
  {
    step: "04",
    title: "Vetting",
    body: "Reference checks, credential verification and background screening.",
  },
  {
    step: "05",
    title: "Matching & placement",
    body: "We present you to companies whose needs genuinely match your profile — and support you after you start.",
  },
];

export const talentPool = [
  {
    id: "RS-4821",
    role: "Senior Executive Assistant",
    category: "Executive & Administrative Support",
    region: "East Africa",
    timezone: "GMT+3 · overlaps EU & US East",
    experience: "8 years",
    languages: ["English", "Swahili"],
    skills: ["Calendar Management", "Board Reporting", "Travel", "Notion"],
    availability: "Available in 2 weeks",
    vetting: "Fully vetted",
  },
  {
    id: "RS-3390",
    role: "Full-Stack Engineer",
    category: "Technology & Engineering",
    region: "West Africa",
    timezone: "GMT+1 · overlaps EU & UK",
    experience: "6 years",
    languages: ["English", "French"],
    skills: ["TypeScript", "React", "Node.js", "AWS"],
    availability: "Available now",
    vetting: "Fully vetted",
  },
  {
    id: "RS-2214",
    role: "Financial Analyst",
    category: "Finance & Accounting",
    region: "South Asia",
    timezone: "GMT+5:30 · overlaps EU & APAC",
    experience: "7 years",
    languages: ["English", "Hindi"],
    skills: ["Modelling", "FP&A", "Power BI", "Xero"],
    availability: "Available in 4 weeks",
    vetting: "Fully vetted",
  },
  {
    id: "RS-5107",
    role: "Customer Success Manager",
    category: "Customer Experience & Support",
    region: "Southeast Asia",
    timezone: "GMT+8 · overlaps APAC & US West",
    experience: "5 years",
    languages: ["English", "Tagalog"],
    skills: ["SaaS Onboarding", "Retention", "HubSpot", "QBRs"],
    availability: "Available now",
    vetting: "Fully vetted",
  },
  {
    id: "RS-1878",
    role: "Product Designer",
    category: "Creative & Design",
    region: "Latin America",
    timezone: "GMT-5 · overlaps US & Canada",
    experience: "9 years",
    languages: ["English", "Spanish"],
    skills: ["Figma", "Design Systems", "Research", "Prototyping"],
    availability: "Available in 3 weeks",
    vetting: "Fully vetted",
  },
  {
    id: "RS-6642",
    role: "Medical Billing Specialist",
    category: "Healthcare & Regulated Support",
    region: "East Africa",
    timezone: "GMT+3 · overlaps EU & US East",
    experience: "4 years",
    languages: ["English"],
    skills: ["ICD-10", "Claims", "Insurance Verification", "EHR"],
    availability: "Available now",
    vetting: "Fully vetted",
  },
  {
    id: "RS-7305",
    role: "Sales Development Representative",
    category: "Sales, Marketing & Growth",
    region: "Eastern Europe",
    timezone: "GMT+2 · overlaps EU & UK",
    experience: "5 years",
    languages: ["English", "Polish"],
    skills: ["Outbound", "Salesforce", "Sequencing", "Discovery Calls"],
    availability: "Available in 2 weeks",
    vetting: "Fully vetted",
  },
  {
    id: "RS-9024",
    role: "Talent Acquisition Partner",
    category: "People Operations & Recruitment",
    region: "Southern Africa",
    timezone: "GMT+2 · overlaps EU & UK",
    experience: "10 years",
    languages: ["English", "Zulu"],
    skills: ["Technical Recruiting", "Sourcing", "Employer Branding", "ATS"],
    availability: "Available in 4 weeks",
    vetting: "Fully vetted",
  },
];

export const testimonials = [
  {
    quote:
      "We had spent four months trying to hire an operations lead. RemoSource sent three candidates in eleven days and two of them were genuinely hireable. That is a different standard.",
    name: "Elena Marković",
    title: "COO, logistics scale-up",
    location: "Rotterdam, Netherlands",
  },
  {
    quote:
      "What sold us was that they interviewed us as carefully as they interviewed the candidates. The shortlist came with reasoning, not just CVs.",
    name: "Daniel Okoye",
    title: "Founder, health-tech company",
    location: "Austin, United States",
  },
  {
    quote:
      "I applied once. Three weeks later I was placed with a company that matched exactly what I asked for, and my recruiter still checks in months later.",
    name: "Priya Raman",
    title: "Financial Analyst placed via RemoSource",
    location: "Bengaluru, India",
  },
];

export const businessFaqs = [
  {
    q: "How fast can you present candidates?",
    a: "Most roles reach a shortlist within 10 to 15 business days from the discovery consultation. Highly specialised or regulated roles can take longer, and we will tell you that upfront rather than send weaker candidates to hit a deadline.",
  },
  {
    q: "What does your vetting actually include?",
    a: "Role-specific skills assessment or work sample, a structured competency interview, communication evaluation, reference checks and background verification. You receive the evidence behind every shortlisted candidate.",
  },
  {
    q: "Are you a freelancer marketplace?",
    a: "No. We do not run a self-serve marketplace and we do not sell hours. We recruit, assess and match specific professionals to specific roles, and we stay involved after placement.",
  },
  {
    q: "What if the hire does not work out?",
    a: "Every placement carries a replacement guarantee period. If fit fails within that window, we restart the search at no additional placement cost.",
  },
  {
    q: "Which time zones can you cover?",
    a: "Our network spans Africa, Latin America, South and Southeast Asia, Eastern Europe and the Middle East, so we can staff overlap with almost any working day. Time-zone overlap is part of the brief from the first conversation.",
  },
  {
    q: "How is pricing structured?",
    a: "Pricing depends on role seniority, engagement model and duration. We quote transparently after the discovery consultation, with no hidden margin on top of the professional's compensation.",
  },
];

export const talentFaqs = [
  {
    q: "Does it cost anything to join?",
    a: "No. RemoSource never charges professionals to apply, to be assessed, or to be placed. Our clients pay us.",
  },
  {
    q: "Do I need to be available immediately?",
    a: "No. Tell us your real availability. We match against it rather than pressuring you into roles that do not fit your timeline.",
  },
  {
    q: "What kind of roles do you place?",
    a: "Long-term remote roles with international companies — full-time, part-time and project-based — across support, operations, finance, technology, creative, healthcare administration and go-to-market functions.",
  },
  {
    q: "Is my information public?",
    a: "Never. Public candidate profiles show only a reference ID, role, region, experience band and skills. Your name and contact details are shared with a company only with your explicit consent.",
  },
  {
    q: "How long does the process take?",
    a: "Assessment and interview typically happen within two weeks of applying. Matching depends on live client demand in your discipline.",
  },
];

export const stats = [
  { value: "40+", label: "Countries in our talent network" },
  { value: "11 days", label: "Median time to first shortlist" },
  { value: "3%", label: "Of applicants pass full vetting" },
  { value: "92%", label: "Placements still active at 12 months" },
];
