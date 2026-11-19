"use client";

import React, { useEffect, useRef } from "react";

interface NeuralHeroCanvasProps {
  /** "opening" = particles form neural net + glowing sphere; "closing" = human + AI dual nodes merge into unified network */
  variant?: "opening" | "closing";
  className?: string;
}

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  phase: number;
  cluster: number;
}

/**
 * High-FPS, low-GPU HTML5 Canvas neural network & glowing intelligence sphere animation
 * tailored for pure white backgrounds with blue, cyan, and violet accents.
 */
export function NeuralHeroCanvas({
  variant = "opening",
  className = "",
}: NeuralHeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    let startTime = performance.now();

    const colors =
      variant === "closing"
        ? ["#2563EB", "#06B6D4", "#8B5CF6", "#3B82F6"]
        : ["#2563EB", "#3B82F6", "#8B5CF6", "#06B6D4"];

    const nodes: NodePoint[] = [];
    const NODE_COUNT = 54;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (nodes.length === 0 && width > 0 && height > 0) {
        for (let i = 0; i < NODE_COUNT; i++) {
          const cluster = i % 2;
          nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.42,
            vy: (Math.random() - 0.5) * 0.42,
            radius: 2 + Math.random() * 2.4,
            color: colors[i % colors.length],
            phase: Math.random() * Math.PI * 2,
            cluster,
          });
        }
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const introProgress = prefersReduced ? 1 : Math.min(elapsed / 1.8, 1);

      ctx.clearRect(0, 0, width, height);

      // Center of intelligence sphere
      const cx = variant === "opening" ? width * 0.76 : width * 0.5;
      const cy = variant === "opening" ? height * 0.5 : height * 0.52;
      const sphereRadius = Math.min(width, height) * (variant === "opening" ? 0.25 : 0.28);

      // Soft ambient glow behind intelligence sphere
      const ambientGrad = ctx.createRadialGradient(cx, cy, 8, cx, cy, sphereRadius * 1.9);
      ambientGrad.addColorStop(0, `rgba(37, 99, 235, ${0.14 * introProgress})`);
      ambientGrad.addColorStop(0.45, `rgba(139, 92, 246, ${0.07 * introProgress})`);
      ambientGrad.addColorStop(0.75, `rgba(6, 182, 212, ${0.04 * introProgress})`);
      ambientGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = ambientGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius * 1.9, 0, Math.PI * 2);
      ctx.fill();

      // Update & draw floating neural particles
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!prefersReduced) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
        }
      }

      // Connect nearby particles
      const maxDist = Math.min(width, height) * 0.22;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.22 * introProgress;
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const pulse = 0.75 + 0.25 * Math.sin(elapsed * 2.2 + n.phase);
        ctx.globalAlpha = 0.65 * pulse * introProgress;
        ctx.fillStyle = n.color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Abstract 3D Wireframe / Orbital Intelligence Sphere
      const ringCount = 5;
      for (let r = 0; r < ringCount; r++) {
        const angle = elapsed * (0.22 + r * 0.06) * (r % 2 === 0 ? 1 : -1);
        const rx = sphereRadius * (0.58 + r * 0.11) * introProgress;
        const ry = rx * (0.34 + (r % 3) * 0.18);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle + r * 0.6);
        ctx.strokeStyle =
          r % 2 === 0
            ? `rgba(37, 99, 235, ${(0.28 - r * 0.03).toFixed(3)})`
            : `rgba(139, 92, 246, ${(0.24 - r * 0.03).toFixed(3)})`;
        ctx.lineWidth = r === 0 ? 1.6 : 1.1;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Orbiting glowing photon node
        const px = Math.cos(elapsed * (0.9 + r * 0.2)) * rx;
        const py = Math.sin(elapsed * (0.9 + r * 0.2)) * ry;
        ctx.fillStyle = r % 2 === 0 ? "#2563EB" : "#06B6D4";
        ctx.beginPath();
        ctx.arc(px, py, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Inner glowing core
      const coreR = sphereRadius * 0.24 * introProgress;
      const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, coreR * 1.6);
      coreGrad.addColorStop(0, "rgba(37, 99, 235, 0.35)");
      coreGrad.addColorStop(0.55, "rgba(6, 182, 212, 0.16)");
      coreGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 1.6, 0, Math.PI * 2);
      ctx.fill();

      if (!prefersReduced) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  );
}
