"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ── Static data ───────────────────────────────────────────────
const STATS = [
  { label: "Problems Solved", value: "147",   meta: "+12 this week",  icon: "⚡", color: "violet" },
  { label: "Current Streak",  value: "14",    meta: "days in a row",  icon: "🔥", color: "rose"   },
  { label: "XP Points",       value: "3,480", meta: "+240 this week", icon: "⭐", color: "amber"  },
  { label: "Global Rank",     value: "#248",  meta: "↑ 31 positions", icon: "🏆", color: "blue"   },
];

const TOPICS = [
  { name: "Arrays",  pct: 85 },
  { name: "Trees",   pct: 70 },
  { name: "Graphs",  pct: 45 },
  { name: "Heaps",   pct: 60 },
  { name: "Sorting", pct: 92 },
  { name: "DP",      pct: 30 },
];

const COURSES = [
  { id: "dsa",    title: "DSA Masterclass",     done: 42, total: 60, tags: "Arrays · Trees · Graphs",      href: "/company-questions" },
  { id: "visual", title: "Visualizer Practice", done: 18, total: 30, tags: "Stack · Queue · Linked List",  href: "/visualizer"        },
];

const LEADERBOARD = [
  { rank: 1,  initials: "RK", name: "Rahul K.",  xp: "4,920", isMe: false },
  { rank: 2,  initials: "PS", name: "Priya S.",  xp: "4,310", isMe: false },
  { rank: 3,  initials: "MV", name: "Manav V.",  xp: "4,100", isMe: false },
  { rank: 12, initials: "A",  name: "You",       xp: "3,480", isMe: true  },
];

const NAV_GROUPS = [
  {
    label: "Navigation",
    items: [
      { label: "Home",          icon: "⌂", href: "/"                    },
      { label: "Dashboard",     icon: "◈", href: "/dashboard"            },
      { label: "Data Structures", icon: "◉", href: "/company-questions" },
    ],
  },
  {
    label: "Data Structures",
    items: [
      { label: "Stack",              icon: "↳", href: "/visualizer/stack"       },
      { label: "Queue",              icon: "▱", href: "/visualizer/queue"       },
      { label: "Sorting",            icon: "⇅", href: "/visualizer/sorting"     },
      { label: "Linked List",        icon: "☷", href: "/visualizer/linked-list" },
      { label: "Binary Search Tree", icon: "⌘", href: "/visualizer/tree"        },
      { label: "Heap",               icon: "▰", href: "/visualizer/heap"        },
    ],
  },
];

const ACTIVITY = [
  0,1,2,1,3,4,1,0,2,3,4,2,
  1,3,4,4,2,1,0,1,2,3,4,3,
  2,1,3,4,2,0,1,2,4,3,2,1,
  0,2,3,4,4,3,2,1,1,2,3,0,
  2,4,3,2,1,0,1,3,4,2,1,0,
];

const WEEK_DAYS = ["S","M","T","W","T","F","S"];

// ── Helpers ───────────────────────────────────────────────────
function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

// ── Sidebar ───────────────────────────────────────────────────
function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside className={cn(
        "fixed left-0 top-0 z-40 flex h-full w-[260px] flex-col border-r border-white/[0.07] bg-[rgba(10,10,16,0.97)] backdrop-blur-2xl transition-transform duration-300 lg:static lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}>

        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-base font-bold text-white shadow-[0_0_24px_rgba(139,92,246,0.4)]">
            ☊
          </div>
          <span className="text-[15px] font-extrabold tracking-tight text-white">AlgoMaitri</span>
        </div>

        {/* Nav groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.20em] text-white/25">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-150",
                        active
                          ? "bg-gradient-to-r from-violet-600/25 to-blue-600/15 text-white shadow-[inset_0_0_0_1px_rgba(139,92,246,0.30)]"
                          : "text-white/45 hover:bg-white/[0.05] hover:text-white/80"
                      )}
                    >
                      <span className="w-4 shrink-0 text-center text-sm opacity-60">{item.icon}</span>
                      {item.label}
                      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User footer */}
        <div className="border-t border-white/[0.07] px-4 py-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-3 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-bold text-white">A</div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-white">You</p>
              <p className="text-[11px] text-white/35">Rank #248 · 3,480 XP</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// ── Stat card ──────────────────────────────────────────────────
function StatCard({ s }: { s: typeof STATS[number] }) {
  const styles: Record<string, { glow: string; iconBg: string; val: string; border: string }> = {
    violet: { glow: "shadow-[0_0_35px_rgba(139,92,246,0.10)]", iconBg: "bg-violet-500/15 text-violet-300", val: "text-violet-300", border: "border-violet-500/15" },
    rose:   { glow: "shadow-[0_0_35px_rgba(244,63,94,0.08)]",  iconBg: "bg-rose-500/15 text-rose-300",     val: "text-rose-300",   border: "border-rose-500/15"   },
    amber:  { glow: "shadow-[0_0_35px_rgba(251,191,36,0.08)]", iconBg: "bg-amber-400/15 text-amber-300",   val: "text-amber-300",  border: "border-amber-400/15"  },
    blue:   { glow: "shadow-[0_0_35px_rgba(59,130,246,0.08)]", iconBg: "bg-blue-500/15 text-blue-300",     val: "text-blue-300",   border: "border-blue-500/15"   },
  };
  const st = styles[s.color];
  return (
    <div className={cn(
      "relative overflow-hidden rounded-[24px] border bg-[rgba(14,14,20,0.85)] p-5 backdrop-blur-xl",
      st.border, st.glow
    )}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">{s.label}</p>
          <div className={cn("mt-3 font-mono text-3xl font-black tracking-tight", st.val)}>{s.value}</div>
          <p className="mt-1 text-[11px] text-white/30">{s.meta}</p>
        </div>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xl", st.iconBg)}>
          {s.icon}
        </div>
      </div>
    </div>
  );
}

// ── Topic progress ─────────────────────────────────────────────
function TopicProgress() {
  return (
    <section className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[rgba(14,14,20,0.85)] p-6 backdrop-blur-xl h-full">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[15px] font-bold bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">Topic Progress</h2>
        <Link href="/company-questions" className="text-[12px] font-semibold text-violet-400 hover:text-violet-300 transition-colors">View all →</Link>
      </div>
      <div className="space-y-4">
        {TOPICS.map(t => (
          <div key={t.name}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[13px] font-medium text-white/65">{t.name}</span>
              <span className="font-mono text-[12px] font-bold text-violet-400">{t.pct}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-500 transition-all duration-700"
                style={{ width: `${t.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Streak card ────────────────────────────────────────────────
function StreakCard() {
  const today = new Date().getDay();
  return (
    <section className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[rgba(14,14,20,0.85)] p-6 backdrop-blur-xl text-center h-full">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-400/30 to-transparent" />
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-28 w-28 rounded-full bg-rose-500/8 blur-3xl" />
      <div className="relative mb-5 flex items-center justify-between">
        <h2 className="text-[15px] font-bold bg-gradient-to-r from-rose-300 to-orange-300 bg-clip-text text-transparent">Daily Streak</h2>
        <span className="rounded-full border border-rose-500/25 bg-rose-500/10 px-2.5 py-1 text-[10px] font-bold text-rose-400">🔥 Active</span>
      </div>
      <div className="relative my-2 font-mono text-[64px] font-black leading-none tracking-tighter bg-gradient-to-br from-rose-300 to-orange-300 bg-clip-text text-transparent">
        14
      </div>
      <p className="mb-5 text-[12px] font-semibold text-white/35">days in a row</p>
      <div className="grid grid-cols-7 gap-1.5">
        {WEEK_DAYS.map((d, i) => {
          const done = i <= today;
          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold",
                done
                  ? "bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.35)]"
                  : "bg-white/[0.04] text-white/15 border border-white/[0.06]"
              )}>
                {done ? "✓" : ""}
              </div>
              <span className="text-[9px] text-white/25">{d}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-[12px] text-white/30">
        🏆 Best streak: <span className="font-bold text-white/50">21 days</span>
      </div>
    </section>
  );
}

// ── Activity heatmap ───────────────────────────────────────────
function ActivityHeatmap() {
  const heatCls = [
    "bg-white/[0.04]",
    "bg-violet-500/22",
    "bg-violet-500/42",
    "bg-violet-500/65",
    "bg-violet-600 shadow-[0_0_5px_rgba(139,92,246,0.45)]",
  ];
  return (
    <section className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[rgba(14,14,20,0.85)] p-6 backdrop-blur-xl h-full">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[15px] font-bold bg-gradient-to-r from-blue-300 to-violet-300 bg-clip-text text-transparent">Activity</h2>
        <div className="flex items-center gap-1 text-[10px] text-white/20">
          <span>Less</span>
          {[0,1,2,3,4].map(v => <div key={v} className={cn("h-2.5 w-2.5 rounded-sm", heatCls[v])} />)}
          <span>More</span>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-[5px]">
        {ACTIVITY.map((lvl, i) => (
          <div
            key={i}
            className={cn("aspect-square rounded-[4px] cursor-default transition-transform hover:scale-110", heatCls[lvl])}
            title={`Level ${lvl}`}
          />
        ))}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {[{ label: "Active days", value: "18" }, { label: "Problems solved", value: "47" }].map(s => (
          <div key={s.label} className="rounded-xl border border-white/[0.05] bg-white/[0.03] px-3 py-3 text-center">
            <div className="font-mono text-xl font-black text-violet-300">{s.value}</div>
            <div className="mt-0.5 text-[11px] text-white/30">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── XP level bar ───────────────────────────────────────────────
function XPCard() {
  const xp = 3480, next = 4000;
  const pct = Math.round((xp / next) * 100);
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-amber-400/18 bg-[linear-gradient(130deg,rgba(251,191,36,0.07),rgba(139,92,246,0.05))] p-5 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/35 to-transparent" />
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.20em] text-amber-400/55">Level Progress</span>
            <span className="rounded-full bg-amber-400/12 border border-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">Lv. 7</span>
          </div>
          <div className="mb-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-black text-amber-300">{xp.toLocaleString()}</span>
            <span className="text-[12px] text-white/25">/ {next.toLocaleString()} XP to Lv. 8</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.05]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1 text-right text-[11px] font-mono text-amber-400/45">{pct}%</p>
        </div>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-400/12 border border-amber-400/18 text-3xl">⭐</div>
      </div>
    </div>
  );
}

// ── Courses card ───────────────────────────────────────────────
function CoursesCard() {
  return (
    <section className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[rgba(14,14,20,0.85)] p-6 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[15px] font-bold bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">Continue Learning</h2>
        <Link href="/company-questions" className="text-[12px] font-semibold text-violet-400 hover:text-violet-300 transition-colors">Browse →</Link>
      </div>
      <div className="space-y-3">
        {COURSES.map(c => {
          const pct = Math.round((c.done / c.total) * 100);
          return (
            <Link
              href={c.href}
              key={c.id}
              className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all hover:border-violet-500/25 hover:bg-violet-500/[0.06]"
            >
              <div className="flex-1 min-w-0">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <h3 className="truncate text-[14px] font-semibold text-white/80 group-hover:text-white transition-colors">{c.title}</h3>
                  <span className="shrink-0 font-mono text-[20px] font-black text-violet-400">{pct}%</span>
                </div>
                <p className="mb-2.5 text-[12px] text-white/30">{c.done}/{c.total} lessons · {c.tags}</p>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-500 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ── Leaderboard ────────────────────────────────────────────────
function LeaderboardCard() {
  const rankStyle = (r: number) =>
    r === 1 ? "bg-amber-400/18 text-amber-300 border-amber-400/28" :
    r === 2 ? "bg-white/[0.06] text-white/45 border-white/10" :
    r === 3 ? "bg-orange-500/14 text-orange-300 border-orange-500/22" :
              "bg-violet-500/10 text-violet-300 border-violet-500/22";

  return (
    <section className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[rgba(14,14,20,0.85)] p-6 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[15px] font-bold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">Leaderboard</h2>
        <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold text-amber-400">Weekly</span>
      </div>
      <div className="space-y-2">
        {LEADERBOARD.map(u => (
          <div
            key={u.rank}
            className={cn(
              "flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all",
              u.isMe
                ? "border-violet-500/28 bg-violet-500/[0.09] shadow-[0_0_18px_rgba(139,92,246,0.07)]"
                : "border-white/[0.05] bg-white/[0.025]"
            )}
          >
            <span className={cn("flex h-7 w-8 shrink-0 items-center justify-center rounded-lg border text-[10px] font-black", rankStyle(u.rank))}>
              #{u.rank}
            </span>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-[11px] font-black text-white">
              {u.initials}
            </div>
            <p className={cn("flex-1 text-[13px] font-semibold", u.isMe ? "text-violet-200" : "text-white/60")}>
              {u.name}
              {u.isMe && <span className="ml-1.5 text-[10px] text-violet-400/60 font-normal">(you)</span>}
            </p>
            <span className={cn("font-mono text-[12px] font-bold", u.isMe ? "text-violet-300" : "text-white/30")}>
              {u.xp} xp
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Root dashboard ─────────────────────────────────────────────
export default function DashboardClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div
      className="flex min-h-screen"
      style={{
        background: `
          radial-gradient(circle at 18% 0%,  rgba(124,58,237,0.18) 0%,  transparent 36%),
          radial-gradient(circle at 82% 12%, rgba(59,130,246,0.14)  0%,  transparent 34%),
          radial-gradient(circle at 50% 90%, rgba(139,92,246,0.06)  0%,  transparent 40%),
          #08080c
        `,
        fontFamily: `Inter, ui-sans-serif, system-ui, -apple-system, sans-serif`,
      }}
    >
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 min-w-0 overflow-x-hidden px-5 py-6 md:px-8 md:py-8 lg:px-10">

        {/* Topbar */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.04] text-white/40 hover:text-white transition-colors lg:hidden"
          >
            ☰
          </button>
          <nav className="flex items-center gap-2 text-[12px] text-white/25">
            <span>▣</span>
            <span>/</span>
            <span className="text-white/50 font-medium">Dashboard</span>
          </nav>
        </div>

        {/* ── Hero ── */}
        <section className="relative mb-7 overflow-hidden rounded-[32px] border border-white/[0.08] bg-[rgba(12,12,18,0.88)] p-6 backdrop-blur-2xl md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.09),transparent_28%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />
          <div className="absolute -top-14 left-8 h-44 w-44 rounded-full bg-violet-600/7 blur-3xl" />
          <div className="absolute -bottom-8 right-8 h-32 w-32 rounded-full bg-blue-500/8 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/22 bg-violet-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.20em] text-violet-300">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
                ⚡ Learning Dashboard
              </div>
              <h1
                className="text-[clamp(36px,5vw,58px)] font-black text-white"
                style={{ letterSpacing: "-0.05em", lineHeight: "1.04" }}
              >
                {greeting},
                <br />
                <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-blue-300 bg-clip-text text-transparent">
                  Keep building.
                </span>
              </h1>
              <p className="mt-4 max-w-lg text-[15px] leading-[1.7] text-white/35">
                Track your DSA progress, continue visual lessons, monitor your streak,
                and stay consistent with AlgoMaitri practice.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row lg:flex-col">
              <Link
                href="/visualizer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 text-[14px] font-bold text-white shadow-[0_8px_24px_rgba(139,92,246,0.28)] transition-all hover:shadow-[0_12px_32px_rgba(139,92,246,0.38)] hover:-translate-y-0.5"
              >
                Continue Practice →
              </Link>
              <Link
                href="/company-questions"
                className="inline-flex items-center justify-center rounded-2xl border border-white/[0.09] bg-white/[0.04] px-6 py-3 text-[14px] font-bold text-white/60 transition-all hover:bg-white/[0.07] hover:text-white"
              >
                Browse Problems
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stat cards ── */}
        <div className="mb-5 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {STATS.map(s => <StatCard key={s.label} s={s} />)}
        </div>

        {/* ── XP bar ── */}
        <div className="mb-5"><XPCard /></div>

        {/* ── Main 3-col grid ── */}
        <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <TopicProgress />
          <StreakCard />
          <ActivityHeatmap />
        </div>

        {/* ── Bottom 2-col ── */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
          <CoursesCard />
          <LeaderboardCard />
        </div>
      </main>
    </div>
  );
}