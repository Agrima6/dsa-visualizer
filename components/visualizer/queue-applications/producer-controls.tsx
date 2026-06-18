"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Producer } from "./types"

const MAX_LENGTH = 20

interface ProducerControlsProps {
  producers: Producer[]
  onProduce: (producerId: string, content: string) => void
}

export function ProducerControls({ producers, onProduce }: ProducerControlsProps) {
  const [message, setMessage] = useState("")
  const [selectedProducer, setSelectedProducer] = useState(producers[0].id)

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    // Only update if within limit — no glow, no re-render beyond limit
    if (val.length <= MAX_LENGTH) {
      setMessage(val)
    }
  }

  const handleProduce = () => {
    if (message.trim()) {
      onProduce(selectedProducer, message.trim())
      setMessage("")
    }
  }

  const isAtLimit = message.length >= MAX_LENGTH

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Producers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Producer selector */}
        <div className="grid grid-cols-2 gap-2">
          {producers.map((producer) => (
            <Button
              key={producer.id}
              variant={selectedProducer === producer.id ? "default" : "outline"}
              onClick={() => setSelectedProducer(producer.id)}
              className="relative"
            >
              {producer.name}
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {producer.messageCount}
              </span>
            </Button>
          ))}
        </div>

        {/* Input row */}
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={handleMessageChange}
              placeholder="Enter message"
              onKeyDown={(e) => e.key === "Enter" && handleProduce()}
              maxLength={MAX_LENGTH}
              className="flex-1"
            />
            <Button
              onClick={handleProduce}
              disabled={!message.trim()}
            >
              Send
            </Button>
          </div>

          {/* Counter + limit warning — only shown once user starts typing */}
          {message.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {isAtLimit ? (
                  <span className="text-rose-500">
                    Maximum {MAX_LENGTH} characters reached
                  </span>
                ) : (
                  // Empty span keeps layout stable
                  <span />
                )}
              </span>
              <span
                className={`text-xs tabular-nums ${
                  isAtLimit
                    ? "text-rose-500 font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                {message.length}/{MAX_LENGTH}
              </span>
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  )
}