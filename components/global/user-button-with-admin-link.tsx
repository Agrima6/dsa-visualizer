"use client"

import { UserButton } from "@clerk/nextjs"
import { ShieldCheck } from "lucide-react"

/**
 * Clerk's <UserButton>, with a "Superadmin" item added to its dropdown so
 * signed-in accounts can actually find /superadmin — it isn't linked
 * anywhere else in the marketing nav. The page itself still gates access
 * server-side (lib/admin.ts), so a non-admin clicking this just lands on
 * an "access denied" screen rather than anything sensitive.
 */
export function UserButtonWithAdminLink() {
  return (
    <UserButton>
      <UserButton.MenuItems>
        <UserButton.Link
          label="Superadmin"
          labelIcon={<ShieldCheck className="h-4 w-4" />}
          href="/superadmin"
        />
      </UserButton.MenuItems>
    </UserButton>
  )
}
