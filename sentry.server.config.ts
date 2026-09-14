import * as Sentry from "@sentry/nextjs"

// Inert until SENTRY_DSN is set — Sentry.init with an empty dsn disables
// itself silently rather than throwing, so this is safe to ship before a
// Sentry project exists yet.
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  // Low volume, invite-only pre-launch app — keep noise (and cost) down
  // rather than sampling every request. Revisit once there's real traffic.
})
