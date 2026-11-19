import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      colors: {
        canvas: {
          DEFAULT: "#FFFFFF",
          subtle: "#F8FAFC",
          tint: "#EFF6FF",
        },
        brand: {
          primary: "#2563EB",
          electric: "#3B82F6",
          cyan: "#06B6D4",
          violet: "#8B5CF6",
          navy: "#0F172A",
          muted: "#64748B",
          border: "#E2E8F0",
        },
      },
      boxShadow: {
        "keynote-sm": "0 2px 12px -2px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(15, 23, 42, 0.04)",
        "keynote-md": "0 12px 32px -8px rgba(15, 23, 42, 0.08), 0 4px 12px -4px rgba(37, 99, 235, 0.06)",
        "keynote-lg": "0 24px 60px -12px rgba(15, 23, 42, 0.12), 0 8px 24px -8px rgba(37, 99, 235, 0.1)",
        "glow-blue": "0 0 32px -4px rgba(37, 99, 235, 0.28)",
        "glow-cyan": "0 0 28px -4px rgba(6, 182, 212, 0.28)",
      },
      backgroundImage: {
        "editorial-grid":
          "linear-gradient(to right, rgba(226, 232, 240, 0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(226, 232, 240, 0.45) 1px, transparent 1px)",
        "editorial-dots":
          "radial-gradient(rgba(148, 163, 184, 0.35) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-48": "48px 48px",
        "dots-24": "24px 24px",
      },
    },
  },
  plugins: [],
};

export default config;
