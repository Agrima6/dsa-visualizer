"use client";

import { Navbar } from "@/components/navigation/navbar";
import {
  Trophy,
  Flame,
  Target,
  BrainCircuit,
  TrendingUp,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

const data = {
  stats: {
    solved: 128,
    streak: 14,
    accuracy: 78,
    visualized: 64,
  },

  weekly: [
    { day: "Mon", solved: 5 },
    { day: "Tue", solved: 9 },
    { day: "Wed", solved: 6 },
    { day: "Thu", solved: 12 },
    { day: "Fri", solved: 8 },
    { day: "Sat", solved: 10 },
    { day: "Sun", solved: 7 },
  ],

  topics: [
    { name: "Arrays", solved: 30 },
    { name: "Stacks", solved: 14 },
    { name: "Queues", solved: 8 },
    { name: "Trees", solved: 20 },
    { name: "Graphs", solved: 6 },
  ],
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="p-6 md:p-10 space-y-8">

        {/* Heading */}
        <div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Your Learning Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your DSA progress, consistency, and focus areas.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

          <StatCard icon={Trophy} label="Solved" value={data.stats.solved} />
          <StatCard icon={Flame} label="Streak" value={`${data.stats.streak} days`} />
          <StatCard icon={Target} label="Accuracy" value={`${data.stats.accuracy}%`} />
          <StatCard icon={BrainCircuit} label="Visualized" value={data.stats.visualized} />

        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Line Chart */}
          <div className="card">
            <h3 className="card-title">Weekly Progress</h3>

            <div className="h-[260px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.weekly}>
                  <XAxis dataKey="day" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="solved"
                    stroke="#7c3aed"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="card">
            <h3 className="card-title">Topic-wise Solved</h3>

            <div className="h-[260px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <Tooltip />
                  <Bar dataKey="solved" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Insights */}
        <div className="grid md:grid-cols-3 gap-5">

          <InsightCard
            title="Strong Area"
            value="Arrays"
            desc="You have solved the most questions here."
          />

          <InsightCard
            title="Needs Focus"
            value="Graphs"
            desc="Low practice detected. Start visualizing more."
          />

          <InsightCard
            title="Consistency"
            value="Good"
            desc="You're solving regularly. Keep it up."
          />

        </div>

      </div>
    </main>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({ icon: Icon, label, value }: any) {
  return (
    <div className="rounded-2xl border bg-background/70 p-5 backdrop-blur-xl shadow-sm">
      <div className="flex items-center justify-between">
        <Icon className="h-5 w-5 text-primary" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>

      <div className="mt-4 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function InsightCard({ title, value, desc }: any) {
  return (
    <div className="rounded-2xl border bg-background/70 p-5 backdrop-blur-xl">
      <h4 className="text-sm text-muted-foreground">{title}</h4>
      <div className="text-xl font-semibold mt-1">{value}</div>
      <p className="text-sm text-muted-foreground mt-2">{desc}</p>
    </div>
  );
}