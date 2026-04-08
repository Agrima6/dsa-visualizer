import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/global/theme-provider"
import { ClerkProvider } from "@clerk/nextjs"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AlgoMaitri",
  description: "AlgoMaitri is a tool for visualizing data structures",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col">
              <div className="flex-1">
                {children}
              </div>
            </div>

            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}