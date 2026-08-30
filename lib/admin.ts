import { currentUser } from "@clerk/nextjs/server"

/**
 * An account is admin if either is true:
 *  - their Clerk publicMetadata has { role: "admin" } (set via the Clerk
 *    dashboard: Users -> select user -> Metadata -> Public), or
 *  - their primary email is listed in the ADMIN_EMAILS env var
 *    (comma-separated), which is the easiest way to bootstrap your own
 *    account without touching the Clerk dashboard at all.
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const user = await currentUser()
  if (!user) return false

  if (user.publicMetadata?.role === "admin") return true

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  if (adminEmails.length === 0) return false

  const userEmails = user.emailAddresses.map((e) => e.emailAddress.toLowerCase())
  return userEmails.some((e) => adminEmails.includes(e))
}
