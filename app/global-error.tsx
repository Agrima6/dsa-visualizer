"use client"

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="max-w-md text-sm text-muted-foreground">
            AlgoMaitri hit an unexpected error. You can try again, or head back home.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => reset()}
              className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
            >
              Try again
            </button>
            {/* Plain <a>, not next/link: this replaces the root layout, so app
                providers/router may not be mounted when this renders. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
