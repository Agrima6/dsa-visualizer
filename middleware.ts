import { NextRequest, NextResponse } from "next/server"
import { verifyGateToken, GATE_COOKIE } from "@/lib/gate-cookie"

const PUBLIC_PATHS = ["/", "/about", "/privacy", "/term", "/disclaimer", "/sign-in", "/api/access/check"]

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

export async function middleware(req: NextRequest) {
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
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
}
