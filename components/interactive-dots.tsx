"use client";

import { useEffect, useRef } from "react";

export default function InteractiveDots() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const mouse = {
      x: -9999,
      y: -9999,
      tx: -9999,
      ty: -9999,
      radius: 220,
    };

    const DOT_GAP = 28;
    const MAX_SHIFT = 18;

    type Dot = {
      x: number;
      y: number;
      ox: number;
      oy: number;
    };

    let dots: Dot[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = [];
      for (let y = 0; y <= height + DOT_GAP; y += DOT_GAP) {
        for (let x = 0; x <= width + DOT_GAP; x += DOT_GAP) {
          dots.push({
            x,
            y,
            ox: x,
            oy: y,
          });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.tx = -9999;
      mouse.ty = -9999;
    };

    const drawDot = (x: number, y: number, intensity: number) => {
      const length = 1.8 + intensity * 4.8;
      const angle = intensity * Math.PI * 0.55;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      if (intensity > 0.02) {
        const hue1 = 225 + intensity * 35;
        const hue2 = 285 + intensity * 25;

        const gradient = ctx.createLinearGradient(-length, 0, length, 0);
        gradient.addColorStop(0, `hsla(${hue1}, 90%, 62%, ${0.22 + intensity * 0.7})`);
        gradient.addColorStop(1, `hsla(${hue2}, 90%, 62%, ${0.16 + intensity * 0.55})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1 + intensity * 0.7;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(-length / 2, 0);
        ctx.lineTo(length / 2, 0);
        ctx.stroke();
      } else {
        ctx.fillStyle = "rgba(99, 102, 241, 0.16)";
        ctx.beginPath();
        ctx.arc(x - x, y - y, 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      for (const dot of dots) {
        const dx = dot.ox - mouse.x;
        const dy = dot.oy - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let shiftX = 0;
        let shiftY = 0;
        let intensity = 0;

        if (dist < mouse.radius) {
          const force = 1 - dist / mouse.radius;
          const angle = Math.atan2(dy, dx);

          shiftX = Math.cos(angle) * force * MAX_SHIFT;
          shiftY = Math.sin(angle) * force * MAX_SHIFT;
          intensity = force;
        }

        dot.x += (dot.ox + shiftX - dot.x) * 0.12;
        dot.y += (dot.oy + shiftY - dot.y) * 0.12;

        drawDot(dot.x, dot.y, intensity);
      }

      animationFrame = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="interactive-dots-canvas" />;
}