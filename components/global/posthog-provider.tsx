"use client"

// Product analytics — inert until NEXT_PUBLIC_POSTHOG_KEY is set (see
// .env.example), so this is safe to ship before a PostHog project exists.
// Without this, there's no way to answer "which visualizer do people
// actually use" or "where do they drop off" other than guessing.

import { useEffect, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import posthog from "posthog-js"
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react"

function PageviewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthogClient = usePostHog()

  useEffect(() => {
    if (!pathname || !posthogClient) return
    const url = searchParams?.size ? `${pathname}?${searchParams.toString()}` : pathname
    posthogClient.capture("$pageview", { $current_url: url })
    // Re-fires on every route change — App Router doesn't emit a native
    // navigation event PostHog's own autocapture can hook into, so this
    // is the standard manual-pageview pattern for it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams])

  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY

  useEffect(() => {
    if (!key || posthog.__loaded) return
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      // Pageviews are captured manually above (App Router navigations
      // aren't full page loads), and capturing every click by default is
      // more data-collection than an invite-only pre-launch app should
      // opt into without a deliberate decision.
      capture_pageview: false,
      capture_pageleave: true,
      person_profiles: "identified_only",
    })
  }, [key])

  if (!key) return <>{children}</>

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </PHProvider>
  )
}
