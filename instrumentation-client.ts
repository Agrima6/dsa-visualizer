import * as Sentry from "@sentry/nextjs"

// Client-side errors — the ones a server-only setup would never see (a
// crash in a visualizer's animation loop, a failed fetch from the
// browser, React itself throwing during render).
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  // Session replay is genuinely useful for "what did the user actually
  // click before this broke" on a visual product like this one — kept
  // off by default (extra cost + a privacy surface worth deciding on
  // deliberately) rather than silently recording sessions the moment a
  // DSN is added. Flip replaysSessionSampleRate up once that's a
  // conscious choice, not a side effect of this file existing.
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
})
