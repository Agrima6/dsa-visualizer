import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";
const withMDX = require("@next/mdx")();

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
};

export default withSentryConfig(withMDX(nextConfig), {
  // Silences source-map-upload noise in CI/local builds where no Sentry
  // auth token is configured — uploading source maps needs SENTRY_AUTH_TOKEN
  // (+ SENTRY_ORG/SENTRY_PROJECT) as a deliberate opt-in, not a build
  // requirement.
  silent: true,
  webpack: {
    treeshake: { removeDebugLogging: true },
  },
});