export interface SpeakerNote {
  slideId: number;
  estimatedDuration: string;
  keyMessage: string;
  talkingPoints: string[];
  transitionCue: string;
}

export const SPEAKER_NOTES: Record<number, SpeakerNote> = {
  1: {
    slideId: 1,
    estimatedDuration: "1 min",
    keyMessage: "Warm welcome and simple introduction to the topic.",
    talkingPoints: [
      "Good morning/afternoon everyone. I am Masruf Rahman, MSc in CSE at BUBT.",
      "Today I will talk in simple terms about the ethical challenges of modern AI and where AI is heading next.",
      "We will cover 10 quick slides: how AI grew, the main risks, and how we can build safe, helpful AI.",
    ],
    transitionCue: "First, let's look at how AI got to where it is today.",
  },
  2: {
    slideId: 2,
    estimatedDuration: "1 min",
    keyMessage: "Show the 5 easy stages of AI growth.",
    talkingPoints: [
      "Early AI only followed fixed rules written by humans.",
      "Machine Learning and Deep Learning allowed computers to learn patterns from data.",
      "Today, Generative AI creates text and images, and AI Agents can plan and complete multi-step tasks.",
    ],
    transitionCue: "Because AI is now so capable, ethics has become more important than ever.",
  },
  3: {
    slideId: 3,
    estimatedDuration: "1 min",
    keyMessage: "AI is no longer just a lab project—it makes real decisions.",
    talkingPoints: [
      "AI now helps decide job applications, bank loans, medical scans, and what news we see.",
      "One small mistake in an AI system can quickly affect millions of people.",
      "That is why ethics must be part of how we design and test AI from day one.",
    ],
    transitionCue: "Let's look at the first major challenge: bias and fairness.",
  },
  4: {
    slideId: 4,
    estimatedDuration: "1.5 min",
    keyMessage: "If training data is unfair, AI repeats that unfairness.",
    talkingPoints: [
      "AI learns from past human data. If past data has bias, the AI learns that bias too.",
      "For example, research like Gender Shades showed facial recognition worked less accurately for some groups.",
      "To fix this, we audit datasets, balance representation, and test accuracy fairly across every group.",
    ],
    transitionCue: "Next, let's talk about protecting personal privacy.",
  },
  5: {
    slideId: 5,
    estimatedDuration: "1 min",
    keyMessage: "AI needs data, but people still deserve privacy and consent.",
    talkingPoints: [
      "Modern AI uses huge amounts of personal data, photos, and online activity.",
      "Without strong rules, facial recognition and tracking can harm personal freedom.",
      "Privacy-safe methods like Differential Privacy and Federated Learning let AI learn without exposing raw private data.",
    ],
    transitionCue: "Beyond privacy, we also need to understand how AI reaches its answers.",
  },
  6: {
    slideId: 6,
    estimatedDuration: "1.5 min",
    keyMessage: "We must open the 'Black Box' and verify AI answers.",
    talkingPoints: [
      "Many AI models work like a 'Black Box'—we see the answer, not the reason behind it.",
      "Explainable AI (XAI) helps show which factors led to a decision, which is vital in healthcare and finance.",
      "Also, generative AI can 'hallucinate'—meaning it gives confident but wrong facts—so fact-checking is essential.",
    ],
    transitionCue: "Now let's look at three big impacts on society: deepfakes, jobs, and control.",
  },
  7: {
    slideId: 7,
    estimatedDuration: "1.5 min",
    keyMessage: "Managing fake media, workforce changes, and human oversight.",
    talkingPoints: [
      "Deepfakes make fake voices and videos look real, so we need digital watermarks and verification.",
      "AI will change many jobs—helping people work faster, while requiring new skills and fair access.",
      "Most importantly, humans must stay in control of high-risk decisions with clear safety limits.",
    ],
    transitionCue: "Now that we know the challenges, how do we build better AI?",
  },
  8: {
    slideId: 8,
    estimatedDuration: "1.5 min",
    keyMessage: "Six clear principles guide Responsible AI.",
    talkingPoints: [
      "Responsible AI stands on six simple pillars: Fairness, Safety, Privacy, Transparency, Accountability, and Human-First Design.",
      "Instead of adding ethics at the end, engineers should check these six pillars throughout development.",
      "Safety must also grow as fast as AI capability—separating real risks today from future scenarios.",
    ],
    transitionCue: "Let's see how technology and global rules are shaping AI's future.",
  },
  9: {
    slideId: 9,
    estimatedDuration: "1.5 min",
    keyMessage: "Future AI pairs helpful agents with global safety rules.",
    talkingPoints: [
      "Technologically, AI is moving toward helpful multi-agent teams, better alignment with human values, and careful long-term AGI research.",
      "Globally, frameworks like the EU AI Act, UNESCO Ethics Recommendation, NIST AI RMF, and OECD Principles set shared safety standards.",
      "Working together across countries is key because AI crosses borders instantly.",
    ],
    transitionCue: "Let's wrap up with our key takeaways.",
  },
  10: {
    slideId: 10,
    estimatedDuration: "1 min + Q&A",
    keyMessage: "Leave the audience with one memorable thought and open Q&A.",
    talkingPoints: [
      "Remember our core message: the true measure of AI is not just how smart it becomes, but how responsibly we build and use it.",
      "Keep fairness, transparency, human oversight, and global cooperation at the center.",
      "Thank you very much! I am happy to take your questions.",
    ],
    transitionCue: "Open floor for Q&A.",
  },
};
