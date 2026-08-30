import { NextResponse } from "next/server"
import { clerkMiddleware } from "@clerk/nextjs/server"
import { verifyGateToken, GATE_COOKIE } from "@/lib/gate-cookie"

const PUBLIC_PATHS = [
  "/",
  "/about",
  "/privacy",
  "/term",
  "/disclaimer",
  "/sign-in",
  "/api/access/check",
  // Not behind the pre-launch password gate: the superadmin dashboard has
  // its own Clerk-based auth check (see lib/admin.ts), and the
  // pre-registration endpoint has to be reachable by visitors who haven't
  // entered the gate password yet.
  "/superadmin",
  "/api/prereg",
]

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

// Wrapped in clerkMiddleware so that auth() / currentUser() work anywhere
// downstream (API routes, server components) — without this wrapper Clerk
// throws "auth() was called but Clerk can't detect usage of
// clerkMiddleware()" the moment anything calls auth()/currentUser().
export default clerkMiddleware(async (_auth, req) => {
  const { pathname, search } = req.nextUrl
  if (isPublicPath(pathname)) return NextResponse.next()

  const token = req.cookies.get(GATE_COOKIE)?.value
  if (await verifyGateToken(token)) return NextResponse.next()

  if (pathname.startsWith("/api")) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const gateUrl = new URL("/", req.url)
  gateUrl.searchParams.set("redirect_url", pathname + search)
  return NextResponse.redirect(gateUrl)
})

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
}
