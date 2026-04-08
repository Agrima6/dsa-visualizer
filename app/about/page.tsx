"use client";

import Link from "next/link";
import { ArrowLeft, BrainCircuit, MoveRight, Sparkles } from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";

const founders = [
  {
    name: "Dr. Kiran Khatter",
    role: "Co-Founder",
    image:
      "https://img.freepik.com/premium-photo/businesswoman-office-young-indian-girl-head-shot-woman-portrait-ai-generative_955712-4844.jpg",
    description:
      "Focused on building meaningful learning experiences that make DSA concepts easier to understand through clarity, structure, and intuition.",
  },
  {
    name: "Maheshwar Dwivedy",
    role: "Co-Founder",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    description:
      "Passionate about combining technology and education to help learners explore problem solving in a more visual and approachable way.",
  },
  {
    name: "Aaradhya Gupta",
    role: "Co-Founder",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr-X-BE1xj89wZdH5Qc-iCScCPDvXLAJziZg&s",
    description:
      "Works on shaping a learner-first platform where design, simplicity, and interactivity come together for better conceptual understanding.",
  },
  {
    name: "Agrima Agarwal",
    role: "Co-Founder",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80",
    description:
      "Driven by the vision of making data structures and algorithms feel less intimidating and more intuitive for every student.",
  },
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <div className="relative z-10 flex min-h-screen flex-col p-4 sm:p-8 lg:p-10">
        <Navbar />

        <section className="w-full pt-10 pb-8 lg:pt-16 lg:pb-12">
          <div className="container mx-auto">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>

            <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-background/70 p-6 shadow-[0_10px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl md:p-8 lg:p-10">
              <div className="absolute -left-20 top-0 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

              <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
                <div className="flex flex-col gap-5">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-sm text-foreground/90 shadow-sm backdrop-blur">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>About AlgoMaitri</span>
                  </div>

                  <h1 className="max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-6xl lg:text-7xl">
                    <span className="bg-gradient-to-r from-foreground via-primary to-purple-500 bg-clip-text text-transparent">
                      Building a smarter way to learn DSA
                    </span>
                  </h1>

                  <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                    AlgoMaitri is designed to make data structures and algorithms
                    easier to understand through interactive visualizations,
                    guided exploration, and beautiful learning experiences.
                  </p>

                  <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                    Our goal is to bridge the gap between theory and intuition so
                    learners do not just memorize concepts, but truly see how
                    they work step by step.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link
                      href="/visualizer"
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.02] hover:shadow-lg"
                    >
                      Explore Visualizer <MoveRight className="h-4 w-4" />
                    </Link>

                    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-3 text-sm text-muted-foreground backdrop-blur">
                      <BrainCircuit className="h-4 w-4 text-primary" />
                      Visual Learning • Clear Concepts • Better Intuition
                    </div>
                  </div>
                </div>

                <div className="relative flex min-h-[260px] items-center justify-center lg:min-h-[340px]">
                  <div className="relative h-[260px] w-full overflow-hidden rounded-3xl border border-border/50 bg-muted shadow-xl md:h-[320px]">
                    <img
                      src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
                      alt="AlgoMaitri team vision"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-primary/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full pt-4 pb-16 lg:pt-6 lg:pb-20">
          <div className="container mx-auto">
            <div className="mb-8 flex flex-col gap-3">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-sm text-foreground/90 shadow-sm backdrop-blur">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Co-Founders</span>
              </div>

              <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
                The people behind AlgoMaitri
              </h2>

              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Meet the team shaping a more intuitive, interactive, and learner-friendly
                way to explore data structures and algorithms.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {founders.map((founder) => (
                <div
                  key={founder.name}
                  className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background/70 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(0,0,0,0.12)]"
                >
                  <div className="relative h-[190px] w-full overflow-hidden sm:h-[210px]">
                    <img
                      src={founder.image}
                      alt={founder.name}
                      className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                  </div>

                  <div className="flex flex-col gap-2 p-5 md:p-6">
                    <div className="w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                      {founder.role}
                    </div>

                    <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                      {founder.name}
                    </h3>

                    <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                      {founder.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}