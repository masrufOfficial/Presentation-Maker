export interface SlideMeta {
  id: number;
  number: string; // "01" .. "10"
  sectionId: "01" | "02" | "03" | "04";
  sectionTitle: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  centralIdea: string;
  isSectionStart?: boolean;
}

export const PRESENTER_INFO = {
  fullName: "Masruf Rahman",
  program: "MSc in CSE",
  institution: "Bangladesh University of Business and Technology (BUBT)",
  institutionShort: "BUBT",
  studentId: "20260323003",
  email: "mmrhridoy99@gmail.com",
  presentationTitle: "Ethical Challenges and Future Directions in Advanced AI",
  presentationSubtitle: "Building Smart AI Systems That Truly Benefit Humanity",
} as const;

export const SECTIONS = [
  { id: "01", title: "Introduction", slideRange: "01 – 03" },
  { id: "02", title: "Ethical Challenges", slideRange: "04 – 07" },
  { id: "03", title: "Future Directions", slideRange: "08 – 09" },
  { id: "04", title: "Conclusion", slideRange: "10" },
] as const;

export const SLIDES: SlideMeta[] = [
  {
    id: 1,
    number: "01",
    sectionId: "01",
    sectionTitle: "Introduction",
    title: "Ethical Challenges and Future Directions in Advanced AI",
    shortTitle: "Title & Welcome",
    subtitle: "Building Smart AI Systems That Truly Benefit Humanity",
    centralIdea: "Introducing why ethical design matters as AI grows smarter.",
    isSectionStart: true,
  },
  {
    id: 2,
    number: "02",
    sectionId: "01",
    sectionTitle: "Introduction",
    title: "How AI Evolved",
    shortTitle: "How AI Evolved",
    subtitle: "Five simple stages from basic rules to smart AI agents",
    centralIdea: "AI has grown quickly from fixed rules to systems that learn, create, and act.",
  },
  {
    id: 3,
    number: "03",
    sectionId: "01",
    sectionTitle: "Introduction",
    title: "Why AI Ethics Matters",
    shortTitle: "Why Ethics Matters",
    subtitle: "AI now affects everyday decisions for people, businesses, and governments",
    centralIdea: "Because AI works at huge scale, even small mistakes can affect millions of people.",
  },
  {
    id: 4,
    number: "04",
    sectionId: "02",
    sectionTitle: "Ethical Challenges",
    title: "Bias and Fairness",
    shortTitle: "Bias & Fairness",
    subtitle: "Unfair data leads to unfair AI decisions — fairness must be built in",
    centralIdea: "Checking data and testing across all groups keeps AI fair for everyone.",
    isSectionStart: true,
  },
  {
    id: 5,
    number: "05",
    sectionId: "02",
    sectionTitle: "Ethical Challenges",
    title: "Privacy and Data Protection",
    shortTitle: "Privacy & Data",
    subtitle: "Protecting personal data, identity, and consent in the age of AI",
    centralIdea: "Smart AI should learn useful patterns without exposing private personal data.",
  },
  {
    id: 6,
    number: "06",
    sectionId: "02",
    sectionTitle: "Ethical Challenges",
    title: "Transparency and AI Mistakes",
    shortTitle: "Transparency & Accuracy",
    subtitle: "Opening the 'Black Box' and catching AI hallucinations (wrong facts)",
    centralIdea: "People need clear reasons behind AI answers and reliable fact-checking.",
  },
  {
    id: 7,
    number: "07",
    sectionId: "02",
    sectionTitle: "Ethical Challenges",
    title: "Deepfakes, Jobs & Human Control",
    shortTitle: "Society & Control",
    subtitle: "Three big real-world impacts we must manage carefully",
    centralIdea: "We need media trust, worker reskilling, and clear human oversight over AI.",
  },
  {
    id: 8,
    number: "08",
    sectionId: "03",
    sectionTitle: "Future Directions",
    title: "Six Pillars of Responsible AI",
    shortTitle: "Responsible AI",
    subtitle: "Simple, practical rules for building safe and trustworthy AI systems",
    centralIdea: "Fairness, safety, privacy, transparency, accountability, and human-first design.",
    isSectionStart: true,
  },
  {
    id: 9,
    number: "09",
    sectionId: "03",
    sectionTitle: "Future Directions",
    title: "Future of AI & Global Rules",
    shortTitle: "Future & Governance",
    subtitle: "Helpful AI agents, human alignment, and international standards",
    centralIdea: "Future AI combines helpful multi-agent teamwork with global rules like the EU AI Act and UNESCO.",
  },
  {
    id: 10,
    number: "10",
    sectionId: "04",
    sectionTitle: "Conclusion",
    title: "Key Takeaways & Thank You",
    shortTitle: "Takeaways & Q&A",
    subtitle: "Let's Build an Intelligent Future, Responsibly.",
    centralIdea: "The real success of AI is not just how smart it is, but how responsibly we use it.",
    isSectionStart: true,
  },
];
