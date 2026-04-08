import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { CTA } from "@/components/landing/cta";
import { Navbar } from "@/components/navigation/navbar";
import InteractiveDots from "@/components/interactive-dots";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <InteractiveDots />

      <div className="relative z-10 flex min-h-screen flex-col px-4 pb-6 pt-4 sm:px-10 sm:pb-10 sm:pt-6">
        <Navbar />
        <Hero />
        <Features />
        <CTA />
      </div>
    </main>
  );
}