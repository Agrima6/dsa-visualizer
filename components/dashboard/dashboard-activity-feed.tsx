"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Activity, Clock4 } from "lucide-react"

type ActivityEntry = {
  topic: string
  action: string
  timestamp: string
}

const ACTION_LABELS: Record<string, string> = {
  opened: "Opened",
  solved: "Solved",
  unmarked: "Unmarked",
  started: "Started",
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp)
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function getActivityLabel(entry: ActivityEntry) {
  const prefix = ACTION_LABELS[entry.action] ?? entry.action
  return `${prefix} ${entry.topic}`
}

export default function DashboardActivityFeed() {
  const { user } = useUser()
  const [activities, setActivities] = useState<ActivityEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) {
      setActivities([])
      setLoading(false)
      return
    }

    let controller = new AbortController()
    let interval: ReturnType<typeof setInterval>

    const fetchActivity = async () => {
      try {
        const url = `/api/activity?userId=${encodeURIComponent(user.id)}`
        const res = await fetch(url, { cache: "no-store", signal: controller.signal })
        if (!res.ok) throw new Error("Failed to load activity")
        const data = (await res.json()) as ActivityEntry[]
        const sorted = data.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        setActivities(sorted.slice(0, 12))
      } catch (err) {
        console.error("Unable to fetch dashboard activity", err)
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
    interval = setInterval(fetchActivity, 5000)

    return () => {
      controller.abort()
      clearInterval(interval)
    }
  }, [user?.id])

  return (
    <section className="rounded-3xl border bg-card p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Activity className="h-4 w-4" />
          Live activity feed
        </div>
        <span className="text-xs text-muted-foreground">Updates every 5 seconds</span>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="rounded-2xl border border-dashed border-violet-500/30 bg-muted/50 p-5 text-sm text-muted-foreground">
            Loading recent activity...
          </div>
        ) : activities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-violet-500/30 bg-muted/50 p-5 text-sm text-muted-foreground">
            No recent activity yet. Open a topic or mark a problem solved to populate your feed.
          </div>
        ) : (
          activities.map((entry) => (
            <div key={`${entry.timestamp}-${entry.topic}`} className="rounded-3xl border border-violet-500/10 bg-violet-500/5 p-4">
              <p className="text-sm font-semibold text-foreground">{getActivityLabel(entry)}</p>
              <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock4 className="h-3.5 w-3.5" />
                {formatTimestamp(entry.timestamp)}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
