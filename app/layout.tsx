import type { Metadata } from "next"
import "./globals.css"

import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/global/theme-provider"
import { ClerkProvider } from "@clerk/nextjs"
import { ProgressProvider } from "@/hooks/use-progress"
import { AccessibilityProvider } from "@/hooks/use-accessibility"
import { TranscriptPanel } from "@/components/global/transcript-panel"
import { MotionConfigBridge } from "@/components/global/motion-config-bridge"
import { PostHogProvider } from "@/components/global/posthog-provider"
import { FeedbackWidget } from "@/components/global/feedback-widget"
import { RootPageTransition } from "@/components/global/root-page-transition"
import { ScrollProgressBar } from "@/components/global/scroll-progress-bar"

export const metadata: Metadata = {
  metadataBase: new URL("https://algomaitri.com"),
  title: "AlgoMaitri — Visual DSA Studio",
  description:
    "Interactive visualizations for data structures and algorithms — learn arrays, trees, graphs, sorting, recursion, and more by watching real code execute.",
  icons: {
    icon: "/algomaitri-logo.svg",
    shortcut: "/algomaitri-logo.svg",
  },
  openGraph: {
    title: "AlgoMaitri — Visual DSA Studio",
    description:
      "Interactive visualizations for data structures and algorithms — learn by watching real code execute.",
    url: "https://algomaitri.com",
    siteName: "AlgoMaitri",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AlgoMaitri — Visual DSA Studio",
    description:
      "Interactive visualizations for data structures and algorithms — learn by watching real code execute.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <PostHogProvider>
          <AccessibilityProvider>
          <MotionConfigBridge>
          <ProgressProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ScrollProgressBar />
            <div className="min-h-screen flex flex-col">
              <div className="flex-1">
                <RootPageTransition>{children}</RootPageTransition>
              </div>

              <footer className="text-center text-sm text-muted-foreground py-4">
                © 2026 AlgoMaitri. All rights reserved.
              </footer>
            </div>

            <Toaster />
            <TranscriptPanel />
            <FeedbackWidget />
          </ThemeProvider>
          </ProgressProvider>
          </MotionConfigBridge>
          </AccessibilityProvider>
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
