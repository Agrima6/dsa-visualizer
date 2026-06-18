const STORAGE_KEY = "dsa_tracker_data";

interface Solve {
  id: number;
  ts: number;
  [key: string]: any; // Adjust properties as needed
}

function notifyUpdate() {
    window.dispatchEvent(new Event("dsa_tracker_updated"));
  }
  
  export function logSolve(solve: Omit<Solve, "id" | "ts">) {
    const data = loadData();
    data.solves.push({ ...solve, id: Date.now(), ts: Date.now() });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      notifyUpdate(); // ← add this
    } catch {}
  }
  
  export function logVisualized(id: number) {
    const data = loadData();
    if (!data.visualized.includes(id)) {
      data.visualized.push(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      notifyUpdate(); // ← add this
    }
  }
function loadData() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        return JSON.parse(data);
    }
    return { solves: [], visualized: [] };
}
