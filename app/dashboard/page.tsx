"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { Navbar } from "@/components/navigation/navbar";
import { loadData, type Solve, type TrackerData } from "@/lib/tracker";

/* ─── Helpers ───────────────────────────────────────────────── */
function computeStreak(solves: Solve[]): number {
  if (!solves.length) return 0;
  const days = new Set(
    solves.map((s) => {
      const d = new Date(s.ts);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (days.has(key)) streak++;
    else if (i > 0) break;
  }
  return streak;
}

const TOPIC_COLORS = [
  "#6c47ff", "#00c9a7", "#f59e0b",
  "#ff6b6b", "#8b5cf6", "#06b6d4",
];

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ─── Dashboard ─────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [data, setData] = useState<TrackerData>({ solves: [], visualized: [] });

  // Re-read localStorage every time this function is called
  const refresh = useCallback(() => {
    setData(loadData());
  }, []);

  useEffect(() => {
    // Initial load
    refresh();

    // Re-read when tab becomes visible again (user navigates back)
    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };

    // Re-read when window regains focus
    const onFocus = () => refresh();

    // Re-read on storage events (cross-tab updates)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "dsa_tracker_v1") refresh();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  /* ── Derived stats ── */
  const { solves, visualized } = data;
  const totalSolved = solves.length;
  const streak = computeStreak(solves);
  const correct = solves.filter((s) => s.correct).length;
  const acc = totalSolved ? Math.round((correct / totalSolved) * 100) : 0;
  const vizCount = visualized.length;

  // Weekly bars
  const now = Date.now();
  const weekCounts = [0, 0, 0, 0, 0, 0, 0];
  solves.forEach((s) => {
    const diff = (now - s.ts) / 86400000;
    if (diff < 7) weekCounts[new Date(s.ts).getDay()]++;
  });
  const maxW = Math.max(...weekCounts, 1);
  const weekTotal = weekCounts.reduce((a, b) => a + b, 0);

  // Topics
  const topicMap: Record<string, number> = {};
  solves.forEach((s) => {
    topicMap[s.topic] = (topicMap[s.topic] || 0) + 1;
  });
  const sortedTopics = Object.entries(topicMap).sort((a, b) => b[1] - a[1]);
  const maxT = sortedTopics[0]?.[1] ?? 1;

  // Streak calendar — last 14 days
  const daysSolved = new Set(
    solves.map((s) => {
      const d = new Date(s.ts);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );
  const todayDate = new Date();

  // Recent solves
  const recent = [...solves].sort((a, b) => b.ts - a.ts).slice(0, 4);

  // User display
  const initials = isLoaded && user
    ? (user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")
    : "U";
  const displayName = isLoaded && user
    ? user.firstName ?? user.username ?? "There"
    : "...";

  /* ── Render ── */
  return (
    <main className="min-h-screen bg-background font-sans">
      <Navbar />

      <div className="px-6 md:px-10 pb-12 max-w-5xl mx-auto">

        {/* Hero bar */}
        <div className="flex items-center justify-between py-6 border-b border-border mb-6">
          <div className="flex items-center gap-4">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={displayName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-violet-500/30"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white font-bold text-lg">
                {initials}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Welcome back, {displayName} 👋
              </h1>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                DSA TRACKER · {user?.primaryEmailAddress?.emailAddress ?? ""}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono bg-violet-500/10 text-violet-500 border border-violet-500/25 px-3 py-1.5 rounded-full">
            ● LIVE
          </span>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <StatCard color="#6c47ff" icon="🧩" label="problems solved" value={totalSolved} />
          <StatCard color="#ff6b6b" icon="🔥" label="day streak"      value={streak} />
          <StatCard color="#00c9a7" icon="🎯" label="accuracy"         value={`${acc}%`} />
          <StatCard color="#f59e0b" icon="👁"  label="visualized"      value={vizCount} />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-3 mb-4">

          {/* Weekly bar chart */}
          <div className="rounded-2xl border bg-background p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold">Weekly activity</span>
              <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-1 rounded-full">
                {weekTotal} this week
              </span>
            </div>
            <div className="flex items-end gap-1.5 h-32">
              {weekCounts.map((c, i) => {
                const h = Math.max(4, Math.round((c / maxW) * 112));
                return (
                  <div key={i} className="flex flex-col items-center flex-1 gap-1">
                    <span className="text-[9px] font-mono text-muted-foreground">
                      {c > 0 ? c : ""}
                    </span>
                    <div
                      className="w-full rounded-t-md"
                      style={{
                        height: h,
                        background: "#6c47ff",
                        opacity: c ? 1 : 0.15,
                      }}
                    />
                    <span className="text-[9px] font-mono text-muted-foreground">
                      {WEEK_DAYS[i][0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Topic breakdown */}
          <div className="rounded-2xl border bg-background p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold">Topics breakdown</span>
              <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-1 rounded-full">
                {sortedTopics.length} topics
              </span>
            </div>
            <div className="space-y-2.5">
              {sortedTopics.slice(0, 6).map(([name, cnt], i) => (
                <div key={name} className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-muted-foreground w-14 flex-shrink-0 truncate">
                    {name}
                  </span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.round((cnt / maxT) * 100)}%`,
                        background: TOPIC_COLORS[i % TOPIC_COLORS.length],
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground w-5 text-right">
                    {cnt}
                  </span>
                </div>
              ))}
              {sortedTopics.length === 0 && (
                <p className="text-xs text-muted-foreground font-mono text-center py-4">
                  no topics yet — start solving!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          {/* Streak calendar */}
          <div className="rounded-2xl border bg-background p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Streak calendar</span>
              <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-1 rounded-full">
                14 days
              </span>
            </div>
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {["S","M","T","W","T","F","S"].map((d, i) => (
                <span key={i} className="text-center text-[9px] font-mono text-muted-foreground">
                  {d}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 14 }, (_, i) => {
                const d = new Date(todayDate);
                d.setDate(d.getDate() - (13 - i));
                const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
                const active = daysSolved.has(key);
                const isToday = i === 13;
                return (
                  <div
                    key={i}
                    title={d.toDateString()}
                    className="aspect-square rounded-[4px] transition-all"
                    style={{
                      background: active ? "#6c47ff" : undefined,
                      boxShadow: isToday && active ? "0 0 0 2px #6c47ff55" : "none",
                    }}
                    // fallback to muted via className when not active
                    {...(!active && { className: "aspect-square rounded-[4px] bg-muted" })}
                  />
                );
              })}
            </div>
          </div>

          {/* Accuracy ring */}
          <div className="rounded-2xl border bg-background p-5 flex flex-col">
            <span className="text-sm font-semibold mb-2">Accuracy</span>
            <div className="flex-1 flex items-center justify-center">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="38"
                  fill="none" stroke="currentColor"
                  strokeOpacity="0.1" strokeWidth="10"
                />
                <circle
                  cx="50" cy="50" r="38"
                  fill="none" stroke="#6c47ff" strokeWidth="10"
                  strokeDasharray="238.76"
                  strokeDashoffset={238.76 - (238.76 * acc) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1)" }}
                />
                <text
                  x="50" y="45"
                  textAnchor="middle"
                  fontSize="16" fontWeight="800"
                  fill="currentColor"
                >
                  {acc}%
                </text>
                <text
                  x="50" y="60"
                  textAnchor="middle"
                  fontSize="9"
                  fill="currentColor"
                  opacity="0.5"
                >
                  correct
                </text>
              </svg>
            </div>
            <p className="text-center text-[11px] font-mono text-muted-foreground mt-1">
              {correct} / {totalSolved} solved
            </p>
          </div>

          {/* Recent solves */}
          <div className="rounded-2xl border bg-background p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Recent solves</span>
              <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-1 rounded-full">
                {totalSolved} total
              </span>
            </div>
            {recent.length > 0 ? (
              <div>
                {recent.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <span className="text-xs truncate max-w-[110px]">{s.name}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <DiffBadge diff={s.difficulty} />
                      <span
                        className="text-xs font-mono"
                        style={{ color: s.correct ? "#00c9a7" : "#ff6b6b" }}
                      >
                        {s.correct ? "✓" : "✗"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground font-mono text-center py-4">
                no solves yet — start practicing!
              </p>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}

/* ─── Sub-components ────────────────────────────────────────── */

function StatCard({
  color, icon, label, value,
}: {
  color: string;
  icon: string;
  label: string;
  value: string | number;
}) {
  return (
    <div
      className="rounded-2xl p-4 relative overflow-hidden bg-muted/40"
      style={{ borderTop: `3px solid ${color}` }}
    >
      <div className="text-lg mb-2">{icon}</div>
      <div className="text-2xl font-extrabold tracking-tight leading-none">{value}</div>
      <div className="text-[11px] font-mono text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function DiffBadge({ diff }: { diff: "easy" | "medium" | "hard" }) {
  const styles: Record<string, string> = {
    easy:   "bg-emerald-500/15 text-emerald-600",
    medium: "bg-amber-500/15 text-amber-600",
    hard:   "bg-red-500/15 text-red-500",
  };
  return (
    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${styles[diff]}`}>
      {diff}
    </span>
  );
}