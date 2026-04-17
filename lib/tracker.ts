// lib/tracker.ts

export interface Solve {
    id: number;
    name: string;
    topic: string;
    difficulty: "easy" | "medium" | "hard";
    correct: boolean;
    ts: number;
  }
  
  export interface TrackerData {
    solves: Solve[];
    visualized: number[];
  }
  
  const STORAGE_KEY = "dsa_tracker_v1";
  
  export function loadData(): TrackerData {
    if (typeof window === "undefined") return { solves: [], visualized: [] };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return { solves: [], visualized: [] };
  }
  
  export function logSolve(solve: Omit<Solve, "id" | "ts">) {
    const data = loadData();
    data.solves.push({ ...solve, id: Date.now(), ts: Date.now() });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }
  
  export function logVisualized(id: number) {
    const data = loadData();
    if (!data.visualized.includes(id)) {
      data.visualized.push(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }