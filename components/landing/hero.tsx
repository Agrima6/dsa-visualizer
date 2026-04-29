"use client";

import React, { useEffect, useRef } from "react";
import { MoveRight, Sparkles } from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import Link from "next/link";
import gsap from "gsap";

const topics = [
  "Arrays",
  "Linked Lists",
  "Stacks",
  "Queues",
  "Trees",
  "Heaps",
  "Sorting",
  "Graphs",
  "Dijkstra",
  "Huffman Coding",
  "Polynomial",
];

const marqueeTopics = [...topics, ...topics];

export const Hero = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const topicsHeadingRef = useRef<HTMLDivElement | null>(null);
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        badgeRef.current,
        { opacity: 0, y: 18, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" }
      );

      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, delay: 0.08, ease: "power3.out" }
      );

      gsap.fromTo(
        descRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.85, delay: 0.18, ease: "power3.out" }
      );

      gsap.fromTo(
        buttonRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.75, delay: 0.28, ease: "power3.out" }
      );

      gsap.fromTo(
        visualRef.current,
        { opacity: 0, x: 40, scale: 0.92 },
        { opacity: 1, x: 0, scale: 1, duration: 1, delay: 0.18, ease: "power3.out" }
      );

      gsap.to(visualRef.current, {
        y: -10,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.fromTo(
        topicsHeadingRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.45, ease: "power3.out" }
      );

      gsap.fromTo(
        marqueeTrackRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.55, ease: "power3.out" }
      );

      if (marqueeTrackRef.current) {
        gsap.to(marqueeTrackRef.current, {
          xPercent: -50,
          duration: 20,
          ease: "none",
          repeat: -1,
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden pt-14 pb-4 lg:pt-20 lg:pb-6"
    >
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 gap-8 items-center lg:grid-cols-2">
          <div className="flex gap-5 flex-col">
            <div ref={badgeRef} className="hero-badge w-fit">
              <Sparkles className="h-4 w-4" />
              <span>Interactive DSA Learning Platform</span>
            </div>

            <div className="flex gap-4 flex-col">
              <h1
                ref={titleRef}
                className="text-5xl md:text-7xl lg:text-8xl max-w-xl tracking-[-0.05em] text-left font-semibold leading-[0.95]"
              >
                <span className="hero-title-glow hero-gradient-text">
                  AlgoMaitri
                </span>
              </h1>

              <p
                ref={descRef}
                className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-xl text-left"
              >
                Interactive tool for learning and understanding data structures
                through visual animations, guided operations, and intuitive
                step-by-step exploration.
              </p>
            </div>

            <div ref={buttonRef} className="flex flex-row gap-4 pt-1">
              <Link href="/visualizer">
                <RainbowButton className="min-w-[170px] rounded-2xl px-6 py-6 text-base shadow-[0_10px_30px_rgba(139,92,246,0.18)]">
                  Visualizer <MoveRight className="ml-1 hidden sm:block w-4 h-4" />
                </RainbowButton>
              </Link>
            </div>
          </div>

          <div
            ref={visualRef}
            className="relative flex items-center justify-center min-h-[260px] md:min-h-[340px] lg:min-h-[400px]"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="hero-orb hero-orb-one" />
              <div className="hero-orb hero-orb-two" />
            </div>

            <img
              src="https://media1.giphy.com/avatars/HeyAutoHQ/DgfrJNR8oUyv.gif"
              alt="Visualizer Preview"
              className="relative z-10 w-[280px] md:w-[360px] lg:w-[440px] h-auto object-contain transition duration-500 hover:scale-105"
            />
          </div>
        </div>

        <div className="mt-8 lg:mt-10">
          <div
            ref={topicsHeadingRef}
            className="mb-3 flex items-center gap-4"
          >
            <div className="topics-label">
              Topics we cover
            </div>
            <div className="topics-simple-line" />
          </div>

          <div className="topics-marquee-wrap">
            <div ref={marqueeTrackRef} className="topics-marquee-track">
              {marqueeTopics.map((topic, index) => (
                <div key={`${topic}-${index}`} className="topics-marquee-pill">
                  <span className="topics-marquee-dot" />
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};