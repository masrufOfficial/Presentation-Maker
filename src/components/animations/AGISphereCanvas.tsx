"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface AGISphereCanvasProps {
  className?: string;
}

/**
 * Lightweight Three.js particle intelligence sphere for Slide 17 (The Road Toward AGI).
 * Gradually assembles glowing blue, cyan, and violet particles into a rotating 3D sphere
 * floating cleanly in a white environment. Automatically disposes GPU resources on unmount.
 */
export function AGISphereCanvas({ className = "" }: AGISphereCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5.4;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Fibonacci sphere points
    const count = 420;
    const targetPositions = new Float32Array(count * 3);
    const startPositions = new Float32Array(count * 3);
    const currentPositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color("#2563EB"),
      new THREE.Color("#3B82F6"),
      new THREE.Color("#06B6D4"),
      new THREE.Color("#8B5CF6"),
    ];

    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const radius = 1.65;

    for (let i = 0; i < count; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const tx = radius * Math.sin(phi) * Math.cos(theta);
      const ty = radius * Math.cos(phi);
      const tz = radius * Math.sin(phi) * Math.sin(theta);

      targetPositions[i * 3] = tx;
      targetPositions[i * 3 + 1] = ty;
      targetPositions[i * 3 + 2] = tz;

      const spread = 2.4 + Math.random() * 1.4;
      startPositions[i * 3] = tx * spread;
      startPositions[i * 3 + 1] = ty * spread;
      startPositions[i * 3 + 2] = tz * spread;

      currentPositions[i * 3] = prefersReduced ? tx : startPositions[i * 3];
      currentPositions[i * 3 + 1] = prefersReduced ? ty : startPositions[i * 3 + 1];
      currentPositions[i * 3 + 2] = prefersReduced ? tz : startPositions[i * 3 + 2];

      const c = palette[i % palette.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(currentPositions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.085,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Subtle wireframe icosahedron inside
    const wireGeo = new THREE.IcosahedronGeometry(1.18, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireMesh);

    const ringGeo = new THREE.TorusGeometry(1.98, 0.008, 8, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.32,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI * 0.38;
    scene.add(ringMesh);

    let rafId = 0;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const t = prefersReduced ? 1 : Math.min(elapsed / 2.2, 1);
      const ease = 1 - Math.pow(1 - t, 3);

      const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < count * 3; i++) {
        posAttr.array[i] =
          startPositions[i] + (targetPositions[i] - startPositions[i]) * ease;
      }
      posAttr.needsUpdate = true;

      if (!prefersReduced) {
        points.rotation.y = elapsed * 0.24;
        points.rotation.x = Math.sin(elapsed * 0.3) * 0.14;
        wireMesh.rotation.y = -elapsed * 0.18;
        wireMesh.rotation.z = elapsed * 0.1;
        ringMesh.rotation.z = elapsed * 0.3;
      }

      renderer.render(scene, camera);
      if (!prefersReduced) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 360;
      const h = container.clientHeight || 360;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={`w-full h-full ${className}`} aria-hidden="true" />;
}
