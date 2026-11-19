import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ethical Challenges and Future Directions in Advanced AI | Masruf Rahman — BUBT",
  description:
    "Animated academic presentation with real-time smartphone remote control. Presented by Masruf Rahman, MSc in CSE, Bangladesh University of Business and Technology (BUBT).",
  authors: [{ name: "Masruf Rahman", url: "mailto:mmrhridoy99@gmail.com" }],
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-white text-brand-navy font-sans antialiased selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
