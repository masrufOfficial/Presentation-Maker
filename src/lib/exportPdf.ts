"use client";

import { PRESENTER_INFO } from "@/data/slides";

interface LoadedImage {
  dataUrl: string;
  width: number;
  height: number;
  format: "PNG" | "JPEG";
}

function loadImageAsDataUrl(url: string): Promise<LoadedImage | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0);
        const isPng = url.toLowerCase().endsWith(".png");
        const format = isPng ? "PNG" : "JPEG";
        const dataUrl = canvas.toDataURL(isPng ? "image/png" : "image/jpeg", 0.92);
        resolve({
          dataUrl,
          width: img.naturalWidth,
          height: img.naturalHeight,
          format,
        });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

interface PdfSlideContent {
  number: string;
  section: string;
  title: string;
  subtitle: string;
  bullets: string[];
  highlight?: string;
  imageUrl?: string;
}

const PDF_SLIDES: PdfSlideContent[] = [
  {
    number: "01",
    section: "SECTION 01 — INTRODUCTION",
    title: "Ethical Challenges & Future Directions in Advanced AI",
    subtitle: PRESENTER_INFO.presentationSubtitle,
    bullets: [
      `Presenter: ${PRESENTER_INFO.fullName}`,
      `Program: ${PRESENTER_INFO.program}`,
      `Institution: ${PRESENTER_INFO.institution}`,
      `Student ID: ${PRESENTER_INFO.studentId}`,
      `Email: ${PRESENTER_INFO.email}`,
    ],
    highlight: "MSc in CSE Academic Keynote Presentation",
    imageUrl: "/images/real-ai-hero.jpg",
  },
  {
    number: "02",
    section: "SECTION 01 — INTRODUCTION",
    title: "How AI Evolved",
    subtitle: "Five simple stages from fixed rules to smart AI agents.",
    bullets: [
      "1. Rule-Based AI (1950s–1980s): Followed fixed if-then rules written by humans.",
      "2. Machine Learning (1990s–2000s): Learned statistical patterns directly from data.",
      "3. Deep Learning (2012–2017): Neural networks mastered images, speech, and language.",
      "4. Generative AI (2020–2024): Created fluent text, code, and realistic media.",
      "5. AI Agents (Today & Next): Plan steps, use tools, and complete tasks autonomously.",
    ],
    highlight: "As AI grows faster and more independent, ethical design becomes essential.",
    imageUrl: "/images/real-ai-hero.jpg",
  },
  {
    number: "03",
    section: "SECTION 01 — INTRODUCTION",
    title: "Why AI Ethics Matters",
    subtitle: "AI now affects real decisions for people, businesses, and governments.",
    bullets: [
      "People & Daily Life: Influences job applications, bank loans, medical scans, and news.",
      "Businesses: Automates customer support, hiring, and risk assessment.",
      "Governments & Law: Public services and civic security rely on data systems.",
      "Global Scale: One small flaw in an AI model can impact millions instantly.",
    ],
    highlight: "High Autonomy + Massive Scale = Ethics must guide engineering from day one.",
  },
  {
    number: "04",
    section: "SECTION 02 — ETHICAL CHALLENGES",
    title: "Bias and Fairness",
    subtitle: "Unfair training data leads to unfair AI decisions — fairness must be built in.",
    bullets: [
      "The Problem: Missing or unbalanced groups in training data cause AI to copy old biases.",
      "Real-World Evidence: The Gender Shades study (MIT, 2018) revealed large accuracy gaps across groups.",
      "Fix 1 — Balanced Data: Include diverse, representative examples from all demographics.",
      "Fix 2 — Fairness Audits: Test accuracy across gender, age, and region before deployment.",
    ],
    highlight: "Goal: Fair, inclusive automated decisions that everyone can trust.",
    imageUrl: "/images/real-fairness-people.jpg",
  },
  {
    number: "05",
    section: "SECTION 02 — ETHICAL CHALLENGES",
    title: "Privacy and Data Protection",
    subtitle: "Protecting personal identity, data, and consent in the age of AI.",
    bullets: [
      "Massive Data Collection: AI trains on huge volumes of personal text, photos, and activity.",
      "Consent & Ownership: People deserve clear knowledge and control over their personal data.",
      "Differential Privacy: Adds mathematical protection so individuals cannot be identified.",
      "Federated Learning: Trains AI on devices without centralizing raw private data.",
    ],
    highlight: "Smart AI should learn useful patterns without exposing personal identity.",
    imageUrl: "/images/real-privacy-security.jpg",
  },
  {
    number: "06",
    section: "SECTION 02 — ETHICAL CHALLENGES",
    title: "Transparency & AI Mistakes",
    subtitle: "Opening the 'Black Box' and catching AI hallucinations.",
    bullets: [
      "Black-Box Problem: Deep networks often give answers without explaining their reasoning.",
      "Explainable AI (XAI): Shows which features drove a decision (vital in medicine & finance).",
      "AI Hallucinations: Generative AI can invent wrong facts or citations with high confidence.",
      "Verification: Ground answers in trusted sources (RAG) and show uncertainty clearly.",
    ],
    highlight: "Trust requires both clear explanations and reliable fact-checking.",
  },
  {
    number: "07",
    section: "SECTION 02 — ETHICAL CHALLENGES",
    title: "Deepfakes, Jobs & Human Control",
    subtitle: "Three major real-world impacts we must manage carefully.",
    bullets: [
      "Deepfakes & Fake Media: Synthetic voices and videos risk scams — need watermarks & verification.",
      "Changing Jobs: AI boosts productivity and creates new roles, requiring fair reskilling.",
      "Economic Inequality: Ensure developing nations and universities have fair access to AI.",
      "Human Control (HITL): High-risk AI actions must keep human approval and safety overrides.",
    ],
    highlight: "Humans must remain accountable for high-impact automated decisions.",
  },
  {
    number: "08",
    section: "SECTION 03 — FUTURE DIRECTIONS",
    title: "Six Pillars of Responsible AI",
    subtitle: "Simple, practical rules for building safe and trustworthy AI systems.",
    bullets: [
      "1. Fairness — Treat all users equally and test for hidden bias.",
      "2. Safety — Prevent harmful actions and enforce strict safety limits.",
      "3. Privacy — Protect personal data and respect informed consent.",
      "4. Transparency — Explain how AI works and when AI is being used.",
      "5. Accountability — Maintain clear human ownership and audit trails.",
      "6. Human-First Design — Build AI to empower people and human dignity.",
    ],
    imageUrl: "/images/real-fairness-people.jpg",
  },
  {
    number: "09",
    section: "SECTION 03 — FUTURE DIRECTIONS",
    title: "Future of AI & Global Rules",
    subtitle: "Helpful AI agents, human alignment, and international standards.",
    bullets: [
      "Helpful AI Agents: Specialized assistants collaborating under human guidance.",
      "Human Value Alignment: Using human feedback (RLHF) & ethical principles.",
      "EU AI Act (2024): Pioneering risk-based legal rules for high-impact AI.",
      "UNESCO (2021), NIST AI RMF (2023) & OECD (2024): Global safety & ethics standards.",
    ],
    highlight: "Because AI crosses borders instantly, global cooperation is essential.",
    imageUrl: "/images/real-global-future.jpg",
  },
  {
    number: "10",
    section: "SECTION 04 — CONCLUSION",
    title: "Key Takeaways & Thank You",
    subtitle: "“The real measure of advanced AI is not how smart it becomes, but how responsibly we build and use it.”",
    bullets: [
      "Smart AI must always be paired with strong ethics and responsibility.",
      "Fairness, privacy, and transparency build lasting public trust.",
      "Humans must stay in control of important AI decisions.",
      "Global cooperation keeps AI safe and beneficial for all humanity.",
      `Questions & Discussion — ${PRESENTER_INFO.fullName} (${PRESENTER_INFO.email})`,
    ],
    highlight: "Thank You! Let's Build an Intelligent Future, Responsibly.",
    imageUrl: "/images/real-global-future.jpg",
  },
];

/**
 * Generates and downloads a clean, high-resolution 16:9 widescreen PDF
 * containing all 10 slides, the official BUBT logo on every page, and 3D illustrations.
 */
export async function exportPresentationPdf(): Promise<void> {
  const { jsPDF } = await import("jspdf");
  // 16:9 landscape in mm (297 x 167 mm)
  const PAGE_W = 297;
  const PAGE_H = 167;

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [PAGE_W, PAGE_H],
  });

  // Preload BUBT logo and unique 3D images in parallel
  const uniqueImgUrls = Array.from(
    new Set(PDF_SLIDES.map((s) => s.imageUrl).filter(Boolean) as string[])
  );
  const [bubtLogo, ...loadedImgs] = await Promise.all([
    loadImageAsDataUrl("/images/BUBT-Logo.png"),
    ...uniqueImgUrls.map((u) => loadImageAsDataUrl(u)),
  ]);

  const imgMap = new Map<string, LoadedImage>();
  uniqueImgUrls.forEach((url, idx) => {
    const loaded = loadedImgs[idx];
    if (loaded) imgMap.set(url, loaded);
  });

  PDF_SLIDES.forEach((slide, idx) => {
    if (idx > 0) doc.addPage([PAGE_W, PAGE_H], "landscape");

    // Pure white background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, PAGE_W, PAGE_H, "F");

    // Top accent bar (blue)
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, PAGE_W, 2.5, "F");

    // Official BUBT Logo in top-right corner (preserving exact aspect ratio)
    if (bubtLogo) {
      const targetH = 16;
      const targetW = (bubtLogo.width / bubtLogo.height) * targetH;
      doc.addImage(
        bubtLogo.dataUrl,
        bubtLogo.format,
        PAGE_W - targetW - 12,
        8,
        targetW,
        targetH
      );
    }

    const hasImage = Boolean(slide.imageUrl && imgMap.has(slide.imageUrl));
    const textMaxW = hasImage ? 172 : 258;

    // Section badge text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(37, 99, 235);
    doc.text(slide.section, 16, 18);

    // Slide Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(15, 23, 42);
    const titleLines = doc.splitTextToSize(slide.title, textMaxW);
    doc.text(titleLines, 16, 29);

    let cursorY = 29 + titleLines.length * 9.5;

    // Subtitle
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    const subLines = doc.splitTextToSize(slide.subtitle, textMaxW);
    doc.text(subLines, 16, cursorY);
    cursorY += subLines.length * 5.8 + 6;

    // Subtle divider
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(16, cursorY - 2, 16 + Math.min(textMaxW, 80), cursorY - 2);
    cursorY += 4;

    // Bullet points
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11.5);
    doc.setTextColor(30, 41, 59);
    for (const bullet of slide.bullets) {
      doc.setFillColor(37, 99, 235);
      doc.circle(18.5, cursorY - 1.2, 1.1, "F");
      const lines = doc.splitTextToSize(bullet, textMaxW - 8);
      doc.text(lines, 23, cursorY);
      cursorY += lines.length * 5.6 + 3.5;
    }

    // Highlight callout box
    if (slide.highlight) {
      const boxY = Math.min(Math.max(cursorY + 3, 128), 137);
      doc.setFillColor(239, 246, 255);
      doc.setDrawColor(191, 219, 254);
      doc.roundedRect(16, boxY, textMaxW, 13, 3, 3, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(37, 99, 235);
      const hlLines = doc.splitTextToSize(slide.highlight, textMaxW - 10);
      doc.text(hlLines, 21, boxY + 8);
    }

    // Right-side 3D Illustration
    if (hasImage && slide.imageUrl) {
      const imgObj = imgMap.get(slide.imageUrl)!;
      const boxX = 198;
      const boxY = 34;
      const boxW = 84;
      const boxH = 84;
      const ratio = imgObj.width / imgObj.height;
      let drawW = boxW;
      let drawH = boxW / ratio;
      if (drawH > boxH) {
        drawH = boxH;
        drawW = boxH * ratio;
      }
      const dx = boxX + (boxW - drawW) / 2;
      const dy = boxY + (boxH - drawH) / 2;
      doc.addImage(imgObj.dataUrl, imgObj.format, dx, dy, drawW, drawH);
    }

    // Footer bar
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(16, PAGE_H - 12, PAGE_W - 16, PAGE_H - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `${PRESENTER_INFO.fullName} • ${PRESENTER_INFO.program}, ${PRESENTER_INFO.institutionShort} (ID: ${PRESENTER_INFO.studentId})`,
      16,
      PAGE_H - 6.5
    );
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235);
    doc.text(`${slide.number} / ${String(PDF_SLIDES.length).padStart(2, "0")}`, PAGE_W - 16, PAGE_H - 6.5, {
      align: "right",
    });
  });

  doc.save("Ethical-AI-Presentation-Masruf-Rahman-BUBT.pdf");
}
