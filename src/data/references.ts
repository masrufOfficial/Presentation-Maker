export interface AcademicReference {
  id: string;
  citation: string;
  organization: string;
  year: string;
  category: "Governance" | "Ethics & Fairness" | "Safety & Alignment" | "Explainability & Reliability" | "Economy & Society";
  url: string;
  relevantSlides: number[];
}

export const REFERENCES: AcademicReference[] = [
  {
    id: "eu-ai-act",
    citation: "European Parliament & Council (2024). Regulation (EU) 2024/1689 — Artificial Intelligence Act (EU AI Act).",
    organization: "European Union",
    year: "2024",
    category: "Governance",
    url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
    relevantSlides: [3, 8, 9],
  },
  {
    id: "unesco-ai-ethics",
    citation: "UNESCO (2021). Recommendation on the Ethics of Artificial Intelligence.",
    organization: "UNESCO",
    year: "2021",
    category: "Governance",
    url: "https://unesdoc.unesco.org/ark:/48223/pf0000381137",
    relevantSlides: [3, 4, 5, 8, 9, 10],
  },
  {
    id: "nist-ai-rmf",
    citation: "National Institute of Standards and Technology (2023). Artificial Intelligence Risk Management Framework (AI RMF 1.0).",
    organization: "NIST",
    year: "2023",
    category: "Governance",
    url: "https://www.nist.gov/itl/ai-risk-management-framework",
    relevantSlides: [6, 8, 9],
  },
  {
    id: "oecd-ai-principles",
    citation: "OECD (2019; updated 2024). Recommendation of the Council on Artificial Intelligence (OECD AI Principles).",
    organization: "OECD",
    year: "2024",
    category: "Governance",
    url: "https://oecd.ai/en/ai-principles",
    relevantSlides: [3, 8, 9, 10],
  },
  {
    id: "stanford-hai-index",
    citation: "Stanford Institute for Human-Centered Artificial Intelligence (HAI) (2024). Artificial Intelligence Index Report.",
    organization: "Stanford HAI",
    year: "2024",
    category: "Economy & Society",
    url: "https://aiindex.stanford.edu/",
    relevantSlides: [2, 7, 9],
  },
  {
    id: "buolamwini-gebru",
    citation: "Buolamwini, J., & Gebru, T. (2018). Gender Shades: Intersectional Accuracy Disparities in Commercial Gender Classification. PMLR (FAT*).",
    organization: "MIT / Microsoft Research",
    year: "2018",
    category: "Ethics & Fairness",
    url: "https://proceedings.mlr.press/v81/buolamwini18a.html",
    relevantSlides: [4, 5],
  },
  {
    id: "dwork-dp",
    citation: "Dwork, C., & Roth, A. (2014). The Algorithmic Foundations of Differential Privacy. Foundations and Trends in Theoretical Computer Science.",
    organization: "FnT TCS",
    year: "2014",
    category: "Ethics & Fairness",
    url: "https://www.cis.upenn.edu/~aaroth/Papers/privacybook.pdf",
    relevantSlides: [5, 8],
  },
  {
    id: "ribeiro-lime",
    citation: "Ribeiro, M. T., Singh, S., & Guestrin, C. (2016). 'Why Should I Trust You?': Explaining the Predictions of Any Classifier. KDD.",
    organization: "ACM KDD",
    year: "2016",
    category: "Explainability & Reliability",
    url: "https://arxiv.org/abs/1602.04938",
    relevantSlides: [6],
  },
  {
    id: "ji-hallucination",
    citation: "Ji, Z., Lee, N., Frieske, R., et al. (2023). Survey of Hallucination in Natural Language Generation. ACM Computing Surveys.",
    organization: "ACM Computing Surveys",
    year: "2023",
    category: "Explainability & Reliability",
    url: "https://dl.acm.org/doi/10.1145/3571730",
    relevantSlides: [6],
  },
  {
    id: "ouyang-rlhf",
    citation: "Ouyang, L., Wu, J., Jiang, X., et al. (2022). Training language models to follow instructions with human feedback. NeurIPS.",
    organization: "NeurIPS",
    year: "2022",
    category: "Safety & Alignment",
    url: "https://arxiv.org/abs/2203.02155",
    relevantSlides: [8, 9],
  },
  {
    id: "amodei-safety",
    citation: "Amodei, D., Olah, C., Steinhardt, J., et al. (2016). Concrete Problems in AI Safety. arXiv.",
    organization: "AI Safety Research",
    year: "2016",
    category: "Safety & Alignment",
    url: "https://arxiv.org/abs/1606.06565",
    relevantSlides: [7, 8, 9],
  },
  {
    id: "ilo-imf-workforce",
    citation: "Cazzaniga, M., et al. (2024). Gen-AI: Artificial Intelligence and the Future of Work. IMF Staff Discussion Note.",
    organization: "IMF",
    year: "2024",
    category: "Economy & Society",
    url: "https://www.imf.org/en/Publications/Staff-Discussion-Notes/Issues/2024/01/14/Gen-AI-Artificial-Intelligence-and-the-Future-of-Work-542379",
    relevantSlides: [7],
  },
];
