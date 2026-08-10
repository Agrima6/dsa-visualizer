import { Suspense } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { GATE_COOKIE, verifyGateToken } from "@/lib/gate-cookie"
import { AccessGate } from "@/components/prelaunch/access-gate"

function getSafeRedirect(raw: string | undefined) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/visualizer"
  return raw
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>
}) {
  const store = await cookies()
  const token = store.get(GATE_COOKIE)?.value

  if (await verifyGateToken(token)) {
    const { redirect_url } = await searchParams
    redirect(getSafeRedirect(redirect_url))
  }

  return (
    <Suspense fallback={null}>
      <AccessGate />
    </Suspense>
  )
}
