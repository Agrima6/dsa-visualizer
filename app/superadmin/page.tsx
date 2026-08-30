import { currentUser } from "@clerk/nextjs/server"
import Link from "next/link"
import { ShieldAlert, LogIn } from "lucide-react"
import { isCurrentUserAdmin } from "@/lib/admin"
import { SuperadminDashboard } from "@/components/superadmin/superadmin-dashboard"

function DeniedScreen({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/10">
        <Icon className="h-7 w-7 text-violet-500" />
      </div>
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {action}
    </main>
  )
}

export default async function SuperadminPage() {
  const user = await currentUser()

  if (!user) {
    return (
      <DeniedScreen
        icon={LogIn}
        title="Sign in required"
        description="The superadmin dashboard is only visible to signed-in admin accounts."
        action={
          <Link
            href={`/sign-in?redirect_url=${encodeURIComponent("/superadmin")}`}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Sign in
          </Link>
        }
      />
    )
  }

  const admin = await isCurrentUserAdmin()
  if (!admin) {
    return (
      <DeniedScreen
        icon={ShieldAlert}
        title="Access denied"
        description="Your account isn't marked as an admin. Ask an existing admin to add your email to ADMIN_EMAILS, or set publicMetadata.role to 'admin' on your Clerk account."
      />
    )
  }

  return <SuperadminDashboard />
}
