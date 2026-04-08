"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Message, Consumer } from "./types"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { Sparkles, Activity, CheckCircle2 } from "lucide-react"

interface MessageQueueDisplayProps {
  queue: Message[]
  processed: Message[]
  consumers: Consumer[]
}

function MessageCard({ message }: { message: Message }) {
  const getStatusClasses = () => {
    switch (message.status) {
      case "pending":
        return "border-violet-500/15 bg-white/70 text-foreground dark:bg-white/[0.04]"
      case "processing":
        return "border-amber-400/25 bg-amber-400/15 text-amber-700 dark:text-amber-300"
      case "completed":
        return "border-emerald-500/25 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
      case "failed":
        return "border-rose-500/25 bg-rose-500/15 text-rose-700 dark:text-rose-300"
      default:
        return "border-violet-500/15 bg-white/70 text-foreground dark:bg-white/[0.04]"
    }
  }

  const getStatusBadgeClasses = () => {
    switch (message.status) {
      case "pending":
        return "bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/15"
      case "processing":
        return "bg-amber-400/15 text-amber-700 dark:text-amber-300 border border-amber-400/20"
      case "completed":
        return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
      case "failed":
        return "bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/20"
      default:
        return "bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/15"
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className={`relative overflow-hidden rounded-2xl border p-4 shadow-sm transition-all ${getStatusClasses()}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_28%)] pointer-events-none" />

      <div className="relative flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-mono text-sm break-words">{message.content}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize tracking-wide ${getStatusBadgeClasses()}`}
        >
          {message.status}
        </span>
      </div>
    </motion.div>
  )
}

export function MessageQueueDisplay({
  queue,
  processed,
  consumers,
}: MessageQueueDisplayProps) {
  const activeConsumers = consumers.filter((c) => c.isProcessing).length

  return (
    <div className="space-y-6">
      {/* Queue Section */}
      <Card className="overflow-hidden rounded-[28px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] shadow-[0_10px_40px_rgba(139,92,246,0.08)] dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)]">
        <CardHeader className="relative border-b border-violet-500/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.08),transparent_24%)]" />
          <div className="relative flex justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="rounded-full border border-violet-500/15 bg-violet-500/10 p-2 text-violet-600 dark:text-violet-300">
                <Sparkles className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg">Message Queue</CardTitle>
            </div>

            <span className="rounded-full border border-violet-500/15 bg-white/75 px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm dark:bg-white/[0.04]">
              {queue.length} messages waiting
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {queue.length > 0 ? (
                queue.map((message) => (
                  <MessageCard key={message.id} message={message} />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-violet-500/15 bg-white/60 px-4 py-8 text-center text-sm text-muted-foreground dark:bg-white/[0.03]">
                  No messages in queue right now.
                </div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Processing Section */}
      {activeConsumers > 0 && (
        <Card className="overflow-hidden rounded-[28px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] shadow-[0_10px_40px_rgba(139,92,246,0.08)] dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)]">
          <CardHeader className="relative border-b border-violet-500/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />
            <div className="relative flex items-center gap-2">
              <div className="rounded-full border border-amber-400/20 bg-amber-400/15 p-2 text-amber-700 dark:text-amber-300">
                <Activity className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg">Currently Processing</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-5">
            <div className="space-y-3">
              {consumers
                .filter((c) => c.isProcessing)
                .map((consumer) => (
                  <div
                    key={consumer.id}
                    className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300"
                  >
                    <span className="font-semibold">{consumer.name}</span> is processing...
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processed Messages */}
      {processed.length > 0 && (
        <Card className="overflow-hidden rounded-[28px] border border-violet-500/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(245,243,255,0.94)_34%,rgba(255,248,235,0.92)_100%)] shadow-[0_10px_40px_rgba(139,92,246,0.08)] dark:bg-[linear-gradient(145deg,rgba(20,18,30,0.96),rgba(17,14,27,0.98)_34%,rgba(34,24,10,0.72)_100%)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.28)]">
          <CardHeader className="relative border-b border-violet-500/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.08),transparent_24%)]" />
            <div className="relative flex justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full border border-emerald-500/20 bg-emerald-500/15 p-2 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg">Processed Messages</CardTitle>
              </div>

              <span className="rounded-full border border-emerald-500/15 bg-white/75 px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm dark:bg-white/[0.04]">
                {processed.length} completed
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-5">
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {[...processed].reverse().slice(0, 5).map((message) => (
                  <MessageCard key={message.id} message={message} />
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}