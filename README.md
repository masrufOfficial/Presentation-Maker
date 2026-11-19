# Ethical Challenges and Future Directions in Advanced AI

An animated, Apple Keynote–inspired **10-slide** academic web presentation with a **Get Started Landing Page**, **1-click Export PDF**, **3D illustrations**, and **real-time QR-paired smartphone remote control**, built for **Masruf Rahman (MSc in CSE, Bangladesh University of Business and Technology — BUBT)**.

## Presenter & Institutional Branding
- **Presenter:** Masruf Rahman
- **Program:** MSc in CSE
- **Institution:** Bangladesh University of Business and Technology (BUBT)
- **Student ID:** `20260323003`
- **Email:** `mmrhridoy99@gmail.com`
- **Official BUBT Logo:** Preserved unmodified at `public/images/BUBT-Logo.png` and rendered consistently on all slides, PDF pages, and interfaces via `<BUBTLogo />`.

---

## Key Features
- **Get Started Landing Page (`/`):** Instant overview, **Get Started** button, **Export PDF** button, and built-in **Connect Phone Remote (QR)** panel that stays seamlessly connected when you start presenting.
- **10 Clean, Easy-to-Understand Slides** in a minimalist white theme (`Space Grotesk` + `Inter`) with **3D illustrations** (`ai-3d-brain.jpg`, `ai-3d-ethics-balance.jpg`, `ai-3d-shield.jpg`, `ai-3d-future-globe.jpg`).
- **1-Click Export PDF:** Downloads a clean 16:9 widescreen 10-page PDF (`Ethical-AI-Presentation-Masruf-Rahman-BUBT.pdf`) with the official BUBT logo on every slide and embedded 3D illustrations.
- **Real-Time Smartphone Remote Control (Socket.IO):**
  - Scan the QR code on the Landing Page (or click **Phone** in the bottom toolbar).
  - Bidirectional sync (Phone ↔ Laptop) over the internet or local Wi-Fi.
  - Private speaker notes (never shown on projector), next-slide preview, live laser pointer touchpad, swipe gestures, blackout mode, timer sync, and disconnect.

---

## Local Development

```bash
npm install
npm install --prefix server
npm run dev:all
```
- Presentation & Landing Page: `http://localhost:3000`
- Realtime Socket.IO Server: `http://localhost:4001/health`

---

## Production Deployment
- **Frontend (Vercel):** Deploy the repository root to Vercel and set `NEXT_PUBLIC_SOCKET_URL` to your deployed Socket.IO server URL.
- **Realtime Server (Railway / Render):** Deploy the `server/` folder (`server/Dockerfile`, `server/railway.json`, `server/render.yaml`) and set `ALLOWED_ORIGINS` to your Vercel URL.
