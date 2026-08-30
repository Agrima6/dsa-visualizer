"use client"

import { Suspense } from "react"
import { SignIn } from "@clerk/nextjs"
import { useSearchParams } from "next/navigation"

function getSafeRedirect(raw: string | null) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/home"
  return raw
}

function SignInContent() {
  const searchParams = useSearchParams()
  const redirectUrl = getSafeRedirect(searchParams.get("redirect_url"))

  return <SignIn routing="path" path="/sign-in" fallbackRedirectUrl={redirectUrl} />
}

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <Suspense fallback={null}>
        <SignInContent />
      </Suspense>
    </main>
  )
}
