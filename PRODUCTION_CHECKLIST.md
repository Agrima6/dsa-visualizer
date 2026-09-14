# Production launch checklist

Tracks the Tier 1 items from the pre-launch audit that need a human decision
or an external account — everything else (tests, Sentry/PostHog scaffolding,
CI) is already done in code. Delete this file once you've launched, or keep
it as a living doc — your call.

## Credentials — swap dev/test keys for live ones

- [ ] **Clerk**: currently on development keys (you'll hit hard usage caps
      the moment real traffic shows up). Clerk dashboard → Production
      instance → copy the live `pk_live_.../sk_live_...` pair into your
      production environment's `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` /
      `CLERK_SECRET_KEY`.
- [ ] **Razorpay**: confirm `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` are live
      keys, not test keys, in production. Re-register the webhook URL
      against your real domain (Dashboard → Settings → Webhooks →
      `https://<your-domain>/api/payment/webhook`, subscribed to
      `payment.captured`) and update `RAZORPAY_WEBHOOK_SECRET` to match.
- [ ] **ElevenLabs**: confirm `ELEVENLABS_API_KEY` is set and has enough
      quota for expected narration volume — `app/api/tts/route.ts` already
      rate-limits per-IP and caps a global daily character budget, but
      those caps are only useful if they're sized for your actual traffic.
- [ ] **GATE_PASSWORD**: rotate it right before launch if it's been shared
      with anyone during development/testing.

## Monitoring — scaffolded, needs your accounts

- [ ] **Sentry**: create a project at sentry.io, then set `SENTRY_DSN` and
      `NEXT_PUBLIC_SENTRY_DSN` (same value) in your production environment.
      Everything else (`instrumentation.ts`, `sentry.server.config.ts`,
      `sentry.edge.config.ts`, `instrumentation-client.ts`) is already
      wired up and inert until those are set. Optionally set
      `SENTRY_AUTH_TOKEN`/`SENTRY_ORG`/`SENTRY_PROJECT` too, so source maps
      upload on deploy and you get real stack traces instead of minified
      ones.
- [ ] **PostHog**: create a project at posthog.com, set
      `NEXT_PUBLIC_POSTHOG_KEY` (and `NEXT_PUBLIC_POSTHOG_HOST` if
      self-hosting). `components/global/posthog-provider.tsx` is already
      wired into the root layout and inert until the key is set.
- [ ] Known cost of both: Sentry's client SDK adds ~50KB to the shared JS
      bundle on every page even while inert (measured: 102KB → 152KB).
      That's the normal cost of an error-monitoring SDK — flagging it so
      it's a known tradeoff, not a surprise in a bundle-size review later.

## Battle judge — needs an infra decision before going fully public

`lib/battle/judge.ts` currently judges submissions in a Node
`worker_thread` with a hard timeout — this stops runaway loops and crashes,
**not a determined attacker**. It's the one part of this app that executes
arbitrary code from a stranger's browser. Fine for an invite-only beta with
people you trust; not fine to open to the public internet unchanged.

Two real paths forward, in order of effort:
- [ ] **Self-host Piston** (github.com/engineer-man/piston) — it's a
      pre-built Docker image designed for exactly this; needs a server to
      run it on (a small VPS or a container service), then point
      `lib/battle/judge.ts` back at it instead of the worker_thread path
      (the original plan — the public Piston API went whitelist-only mid-
      session, which is why this fell back to worker_threads).
- [ ] **Judge0** (judge0.com) — similar shape, has a hosted option if you'd
      rather not run your own container.

This is a "decide and schedule it" item, not something to rush under
launch pressure — pick one, size the infra cost, and treat it as a
blocker specifically for making Battle's matchmaking public (random-
opponent), not for keeping it invite-link-only a while longer.

## Legal / compliance — needs a human (ideally a lawyer) read, not me

- [ ] `/term`, `/privacy`, `/disclaimer` already have real, substantive
      content (not placeholder stubs) — worth a legal review pass now that
      real payments (Razorpay) and real user data (Clerk) are in the loop,
      especially if you're taking international signups (GDPR data
      export/deletion flows).

## Support channel

- [ ] No visible way for a confused or frustrated user to reach you right
      now. Even a `mailto:` link or a simple feedback widget beats silence.

## CI

- [x] `.github/workflows/ci.yml` now runs typecheck → lint → test → build
      on every push/PR to main.
