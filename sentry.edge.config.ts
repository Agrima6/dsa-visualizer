import * as Sentry from "@sentry/nextjs"

// Covers middleware.ts and any edge routes — separate from
// sentry.server.config.ts because the edge runtime can't use every Node API
// the regular server config might eventually rely on.
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
})
