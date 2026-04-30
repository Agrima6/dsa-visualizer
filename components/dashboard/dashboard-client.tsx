"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const USER = {
  name: "Agrima Agarwal",
  initials: "A",
  email: "agrima@algomaitri.com",
  isPro: true,
};

const STATS = [
  { label: "Problems Solved", value: "147", meta: "+12 this week", icon: "⚡" },
  { label: "Current Streak", value: "14", meta: "days in a row", icon: "🔥" },
  { label: "XP Points", value: "3,480", meta: "+240 this week", icon: "⭐" },
  { label: "Global Rank", value: "#248", meta: "↑ 31 positions", icon: "🏆" },
];

const TOPICS = [
  { name: "Arrays", pct: 85 },
  { name: "Trees", pct: 70 },
  { name: "Graphs", pct: 45 },
  { name: "Heaps", pct: 60 },
  { name: "Sorting", pct: 92 },
  { name: "DP", pct: 30 },
];

const COURSES = [
  {
    id: "dsa",
    title: "DSA Masterclass",
    done: 42,
    total: 60,
    tags: "Arrays · Trees · Graphs",
    href: "/company-questions",
  },
  {
    id: "visual",
    title: "Visualizer Practice",
    done: 18,
    total: 30,
    tags: "Stack · Queue · Linked List",
    href: "/visualizer",
  },
];

const LEADERBOARD = [
  { rank: 1, initials: "RK", name: "Rahul K.", xp: "4,920" },
  { rank: 2, initials: "PS", name: "Priya S.", xp: "4,310" },
  { rank: 3, initials: "MV", name: "Manav V.", xp: "4,100" },
  { rank: 12, initials: "A", name: "You", xp: "3,480", isMe: true },
];

const NAV = [
  { label: "Home", icon: "⌂", href: "/" },
  { label: "Data Structures", icon: "◉", href: "/company-questions" },
  { label: "Stack", icon: "↳", href: "/visualizer/stack" },
  { label: "Queue", icon: "▱", href: "/visualizer/queue" },
  { label: "Sorting", icon: "⇅", href: "/visualizer/sorting" },
  { label: "Linked List", icon: "☷", href: "/visualizer/linked-list" },
  { label: "Binary Search Tree", icon: "⌘", href: "/visualizer/tree" },
  { label: "Heap", icon: "▰", href: "/visualizer/heap" },
];

const ACTIVITY = [
  0, 1, 2, 1, 3, 4, 1, 0, 2, 3, 4, 2,
  1, 3, 4, 4, 2, 1, 0, 1, 2, 3, 4, 3,
  2, 1, 3, 4, 2, 0, 1, 2, 4, 3, 2, 1,
  0, 2, 3, 4, 4, 3, 2, 1, 1, 2, 3, 0,
  2, 4, 3, 2, 1, 0, 1, 3, 4, 2, 1, 0,
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="am-sidebar">
      <div className="am-logo">
        <div className="am-logo-mark">☊</div>
        <span>AlgoMaitri</span>
      </div>

      <div className="am-nav-label">Navigation</div>

      <nav className="am-nav">
        {NAV.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`am-nav-item ${active ? "active" : ""}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="am-user">
        <div className="am-user-avatar">{USER.initials}</div>
      </div>
    </aside>
  );
}

function StatCard({ s }: { s: typeof STATS[number] }) {
  return (
    <div className="am-stat-card">
      <div className="am-stat-icon">{s.icon}</div>
      <div>
        <p>{s.label}</p>
        <h3>{s.value}</h3>
        <span>{s.meta}</span>
      </div>
    </div>
  );
}

function TopicProgress() {
  return (
    <section className="am-card">
      <div className="am-card-head">
        <h2>Topic Progress</h2>
        <Link href="/company-questions">View all</Link>
      </div>

      <div className="am-topic-list">
        {TOPICS.map((t) => (
          <div className="am-topic" key={t.name}>
            <div className="am-topic-top">
              <span>{t.name}</span>
              <strong>{t.pct}%</strong>
            </div>
            <div className="am-progress">
              <div style={{ width: `${t.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StreakCard() {
  return (
    <section className="am-card am-streak-card">
      <div className="am-card-head">
        <h2>Daily Streak</h2>
      </div>

      <div className="am-streak-number">14</div>
      <p>day streak 🔥</p>

      <div className="am-week">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className={i <= new Date().getDay() ? "done" : ""}>
            <span>{i <= new Date().getDay() ? "✓" : ""}</span>
            <small>{d}</small>
          </div>
        ))}
      </div>

      <div className="am-mini-note">Best streak: 21 days</div>
    </section>
  );
}

function ActivityHeatmap() {
  return (
    <section className="am-card">
      <div className="am-card-head">
        <h2>Activity</h2>
      </div>

      <div className="am-heatmap">
        {ACTIVITY.map((lvl, i) => (
          <span key={i} className={`lvl-${lvl}`} />
        ))}
      </div>

      <div className="am-activity-stats">
        <div>
          <strong>18</strong>
          <span>Active days</span>
        </div>
        <div>
          <strong>47</strong>
          <span>Problems</span>
        </div>
      </div>
    </section>
  );
}

function CoursesCard() {
  return (
    <section className="am-card">
      <div className="am-card-head">
        <h2>Continue Learning</h2>
        <Link href="/company-questions">Browse</Link>
      </div>

      <div className="am-course-list">
        {COURSES.map((c) => {
          const pct = Math.round((c.done / c.total) * 100);

          return (
            <Link href={c.href} key={c.id} className="am-course">
              <div>
                <h3>{c.title}</h3>
                <p>{c.done} / {c.total} lessons · {c.tags}</p>
                <div className="am-progress">
                  <div style={{ width: `${pct}%` }} />
                </div>
              </div>
              <strong>{pct}%</strong>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function LeaderboardCard() {
  return (
    <section className="am-card">
      <div className="am-card-head">
        <h2>Leaderboard</h2>
        <span>Weekly</span>
      </div>

      <div className="am-leader-list">
        {LEADERBOARD.map((u) => (
          <div key={u.rank} className={`am-leader ${u.isMe ? "me" : ""}`}>
            <span className="rank">#{u.rank}</span>
            <div className="avatar">{u.initials}</div>
            <p>{u.name}</p>
            <strong>{u.xp} xp</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function DashboardClient() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <style>{`
        .am-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 265px 1fr;
          background:
            radial-gradient(circle at 20% 0%, rgba(124, 92, 255, 0.18), transparent 35%),
            radial-gradient(circle at 85% 15%, rgba(79, 140, 255, 0.16), transparent 38%),
            #08080c;
          color: #f7f7fb;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .am-sidebar {
          height: 100vh;
          position: sticky;
          top: 0;
          background: rgba(20, 20, 27, 0.92);
          border-right: 1px solid rgba(255,255,255,0.08);
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
        }

        .am-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 16px;
          font-weight: 800;
          padding: 10px 12px 28px;
        }

        .am-logo-mark {
          width: 30px;
          height: 30px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #c084fc, #60a5fa);
          color: white;
          box-shadow: 0 0 30px rgba(168,85,247,0.35);
        }

        .am-nav-label {
          color: #a1a1aa;
          font-size: 13px;
          margin: 8px 0 10px;
        }

        .am-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .am-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #e5e7eb;
          text-decoration: none;
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          transition: 0.2s ease;
        }

        .am-nav-item span {
          width: 18px;
          opacity: 0.9;
        }

        .am-nav-item:hover,
        .am-nav-item.active {
          background: rgba(124, 92, 255, 0.18);
          color: #ffffff;
        }

        .am-user {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 18px;
        }

        .am-user-avatar {
          width: 38px;
          height: 38px;
          border-radius: 999px;
          background: #050507;
          border: 1px solid rgba(255,255,255,0.14);
          display: grid;
          place-items: center;
          font-weight: 800;
        }

        .am-main {
          padding: 34px 42px 48px;
        }

        .am-topbar {
          display: flex;
          align-items: center;
          gap: 14px;
          color: #a1a1aa;
          font-size: 15px;
          margin-bottom: 22px;
        }

        .am-hero {
          max-width: 850px;
          margin-bottom: 28px;
        }

        .am-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 17px;
          border-radius: 999px;
          border: 1px solid rgba(168,85,247,0.45);
          background: rgba(124, 58, 237, 0.16);
          color: #c4b5fd;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 22px;
        }

        .am-hero h1 {
          font-size: clamp(42px, 5vw, 72px);
          line-height: 0.95;
          letter-spacing: -0.06em;
          margin: 0;
          font-weight: 900;
        }

        .am-gradient-text {
          background: linear-gradient(90deg, #d8b4fe, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .am-hero p {
          max-width: 650px;
          color: #b6b6c3;
          font-size: 18px;
          line-height: 1.6;
          margin-top: 20px;
        }

        .am-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin: 30px 0;
        }

        .am-stat-card {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 22px;
          padding: 20px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
          box-shadow: 0 18px 60px rgba(0,0,0,0.25);
        }

        .am-stat-icon {
          width: 42px;
          height: 42px;
          border-radius: 15px;
          background: rgba(124, 92, 255, 0.18);
          display: grid;
          place-items: center;
        }

        .am-stat-card p {
          margin: 0 0 8px;
          color: #a1a1aa;
          font-size: 13px;
        }

        .am-stat-card h3 {
          margin: 0;
          font-size: 28px;
          letter-spacing: -0.04em;
        }

        .am-stat-card span {
          color: #8b8b98;
          font-size: 12px;
        }

        .am-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr 0.9fr;
          gap: 18px;
          margin-bottom: 18px;
        }

        .am-bottom-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 18px;
        }

        .am-card {
          background: rgba(15,15,22,0.78);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 24px;
          padding: 22px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.28);
          backdrop-filter: blur(18px);
        }

        .am-card-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .am-card-head h2 {
          margin: 0;
          font-size: 18px;
          letter-spacing: -0.03em;
        }

        .am-card-head a,
        .am-card-head span {
          color: #a78bfa;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
        }

        .am-topic-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .am-topic-top {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          margin-bottom: 7px;
        }

        .am-topic-top strong {
          color: #a78bfa;
        }

        .am-progress {
          height: 8px;
          background: rgba(255,255,255,0.07);
          border-radius: 999px;
          overflow: hidden;
        }

        .am-progress div {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #a78bfa, #60a5fa);
        }

        .am-streak-card {
          text-align: center;
        }

        .am-streak-number {
          font-size: 70px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: -0.08em;
          background: linear-gradient(90deg, #c084fc, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .am-streak-card p {
          margin: 8px 0 20px;
          color: #a1a1aa;
          font-weight: 700;
        }

        .am-week {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
        }

        .am-week div {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: #71717a;
          font-size: 11px;
        }

        .am-week span {
          width: 28px;
          height: 28px;
          border-radius: 999px;
          background: rgba(255,255,255,0.07);
          display: grid;
          place-items: center;
          color: white;
        }

        .am-week .done span {
          background: linear-gradient(135deg, #a78bfa, #60a5fa);
          box-shadow: 0 0 20px rgba(124,92,255,0.35);
        }

        .am-mini-note {
          margin-top: 18px;
          color: #a1a1aa;
          font-size: 13px;
        }

        .am-heatmap {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 5px;
        }

        .am-heatmap span {
          aspect-ratio: 1;
          border-radius: 5px;
          background: rgba(255,255,255,0.06);
        }

        .am-heatmap .lvl-1 { background: rgba(124,92,255,0.22); }
        .am-heatmap .lvl-2 { background: rgba(124,92,255,0.42); }
        .am-heatmap .lvl-3 { background: rgba(124,92,255,0.68); }
        .am-heatmap .lvl-4 { background: #8b5cf6; }

        .am-activity-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 20px;
        }

        .am-activity-stats div {
          background: rgba(255,255,255,0.045);
          border-radius: 16px;
          padding: 14px;
          text-align: center;
        }

        .am-activity-stats strong {
          display: block;
          font-size: 24px;
        }

        .am-activity-stats span {
          color: #a1a1aa;
          font-size: 12px;
        }

        .am-course-list,
        .am-leader-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .am-course {
          text-decoration: none;
          color: white;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 18px;
        }

        .am-course h3 {
          margin: 0 0 6px;
          font-size: 17px;
        }

        .am-course p {
          color: #a1a1aa;
          margin: 0 0 12px;
          font-size: 13px;
        }

        .am-course strong {
          color: #a78bfa;
          font-size: 22px;
        }

        .am-leader {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 16px;
          background: rgba(255,255,255,0.04);
        }

        .am-leader.me {
          background: rgba(124,92,255,0.16);
          border: 1px solid rgba(168,85,247,0.32);
        }

        .rank {
          width: 38px;
          color: #a78bfa;
          font-weight: 800;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #a78bfa, #60a5fa);
          font-weight: 800;
        }

        .am-leader p {
          flex: 1;
          margin: 0;
          font-weight: 700;
        }

        .am-leader strong {
          color: #a1a1aa;
          font-size: 13px;
        }

        @media (max-width: 1100px) {
          .am-root {
            grid-template-columns: 1fr;
          }

          .am-sidebar {
            display: none;
          }

          .am-main {
            padding: 24px;
          }

          .am-stats-grid,
          .am-grid,
          .am-bottom-grid {
            grid-template-columns: 1fr;
          }

          .am-hero h1 {
            font-size: 44px;
          }
        }
      `}</style>

      <div className="am-root">
        <Sidebar />

        <main className="am-main">
          <div className="am-topbar">
            <span>▣</span>
            <span>/</span>
            <span>Dashboard</span>
          </div>

          <section className="am-hero">
            <div className="am-pill">⚡ Learning Dashboard</div>

            <h1>
              {greeting}, <span className="am-gradient-text">{USER.name.split(" ")[0]}</span>
              <br />
              keep building.
            </h1>

            <p>
              Track your DSA progress, continue your visual lessons, monitor your streak,
              and stay consistent with AlgoMaitri practice.
            </p>
          </section>

          <section className="am-stats-grid">
            {STATS.map((s) => (
              <StatCard s={s} key={s.label} />
            ))}
          </section>

          <section className="am-grid">
            <TopicProgress />
            <StreakCard />
            <ActivityHeatmap />
          </section>

          <section className="am-bottom-grid">
            <CoursesCard />
            <LeaderboardCard />
          </section>
        </main>
      </div>
    </>
  );
}