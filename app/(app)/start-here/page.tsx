import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata = {
  title: "Start Here | AlgoMaitri",
  description: "New to data structures and algorithms? A plain-language introduction and the order to learn things in.",
}

const STEPS = [
  { name: "Understand", text: "Each topic opens with a plain-English intro and a real-life analogy. Read it before touching anything." },
  { name: "Visualize", text: "Use the controls to add, remove and search, and watch every step happen. Pause and step through slowly." },
  { name: "Explain", text: "The Explanation tab describes what you just saw, with the code next to it." },
  { name: "Write it yourself", text: "Open the Code Playground and write your own version. It animates your code, not ours." },
  { name: "Practice", text: "Solve real interview questions in Company Questions, and mark them as solved to track progress." },
]

const BIG_O = [
  { name: "O(1)", label: "Constant", text: "Same effort no matter how big the data is. Opening locker #4." },
  { name: "O(log n)", label: "Halving", text: "Each step throws away half. Finding a word in a dictionary." },
  { name: "O(n)", label: "Linear", text: "Effort grows with the data. Reading every page of a book." },
  { name: "O(n²)", label: "Quadratic", text: "Effort explodes. Comparing every person in a room with every other person." },
]

export default function StartHerePage() {
  return (
    <div className="container mx-auto max-w-3xl space-y-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Start here</h1>
        <p className="mt-2 text-muted-foreground">
          You don&apos;t need to know anything about data structures and algorithms to begin. This page
          explains what they are, why they matter, and what to do first.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What is DSA?</h2>
        <p className="leading-relaxed">
          A <strong>data structure</strong> is a way of organizing information so it&apos;s easy to use — a list, a
          stack of plates, a family tree. An <strong>algorithm</strong> is a step-by-step recipe for doing
          something with it: finding an item, putting things in order, or picking the shortest route.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Every app you use relies on both. Your contacts are sorted, maps find the shortest route, and
          the Back button is a stack. Choosing the right structure is often the difference between an
          app that feels instant and one that freezes.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Why do interviews ask about it?</h2>
        <p className="leading-relaxed">
          Companies use DSA questions to see how you break a problem down and whether you can pick an
          approach that stays fast as the data grows. It&apos;s a thinking exercise more than a memory test.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Big-O, in plain words</h2>
        <p className="leading-relaxed">
          Big-O describes how the work grows as the amount of data grows. You&apos;ll see it everywhere, so
          here&apos;s the whole idea:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {BIG_O.map((b) => (
            <div key={b.name} className="rounded-xl border border-border bg-card p-4">
              <p className="font-mono text-sm font-semibold text-violet-600 dark:text-violet-300">
                {b.name} <span className="font-sans font-normal text-muted-foreground">· {b.label}</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          The Time Complexity topic lets you see these curves grow on a live graph.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What you should already know</h2>
        <p className="leading-relaxed">
          Just the basics of one programming language: variables, if-statements, loops, and functions.
          If loops still feel shaky, spend a day on those first — everything here builds on them.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How to learn each topic</h2>
        <ol className="space-y-3">
          {STEPS.map((s, i) => (
            <li key={s.name} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-semibold text-white">
                {i + 1}
              </span>
              <p className="pt-0.5 text-sm leading-relaxed">
                <strong>{s.name}.</strong> <span className="text-muted-foreground">{s.text}</span>
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Ready?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The DSA Foundations path takes you through the essentials in a sensible order, starting with
          how to measure speed, then arrays, sorting, stacks, queues, linked lists and recursion.
        </p>
        <Link
          href="/learning-paths"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
        >
          Open the Foundations path <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  )
}
