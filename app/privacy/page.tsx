// app/privacy/page.tsx
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | AlgoMaitri",
  description: "Privacy policy for AlgoMaitri — how we collect, use, and protect your data.",
}

const LAST_UPDATED = "April 2026"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#faf7ff_50%,#ffffff_100%)] dark:bg-[linear-gradient(180deg,#09090b_0%,#0d0916_50%,#09090b_100%)]">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
        {/* Back */}
        <Link href="/"
          className="mb-10 inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-white/70 px-4 py-2 text-sm text-muted-foreground transition-all hover:bg-violet-500/5 hover:text-violet-600 dark:bg-white/[0.04] dark:hover:text-violet-300">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to AlgoMaitri
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-violet-500/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
            Legal
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: <span className="font-medium text-foreground">{LAST_UPDATED}</span>
          </p>
          <p className="mt-3 text-muted-foreground leading-7">
            At <span className="font-semibold text-foreground">AlgoMaitri</span>, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10">

          <Section number="1" title="Information We Collect">
            <p>We collect the following types of information to provide and improve our services:</p>
            <ul className="mt-3 space-y-2 list-none">
              <Li><strong>Account Information:</strong> When you sign in via a third-party provider (e.g., Google through Clerk), we receive basic profile information such as your name and email address.</Li>
              <Li><strong>Usage Data:</strong> We collect data about how you interact with our platform — pages visited, features used, and time spent — through analytics tools.</Li>
              <Li><strong>Payment Information:</strong> When you make a purchase, payment is processed securely by <strong>Razorpay</strong>. We do not store your card details or sensitive payment information.</Li>
              <Li><strong>Technical Data:</strong> This includes your IP address, browser type, device information, and cookies, used to ensure platform stability and security.</Li>
            </ul>
          </Section>

          <Section number="2" title="How We Use Your Information">
            <ul className="space-y-2 list-none">
              <Li>To provide, maintain, and improve the AlgoMaitri platform and its features.</Li>
              <Li>To process payments and manage access to premium content.</Li>
              <Li>To communicate with you regarding account activity, updates, or support requests.</Li>
              <Li>To analyze usage patterns and improve the learning experience.</Li>
              <Li>To comply with legal obligations and enforce our Terms & Conditions.</Li>
            </ul>
          </Section>

          <Section number="3" title="Cookies & Tracking">
            <p>AlgoMaitri uses cookies and similar tracking technologies to enhance your experience. These include:</p>
            <ul className="mt-3 space-y-2 list-none">
              <Li><strong>Essential cookies</strong> required for authentication and core functionality.</Li>
              <Li><strong>Analytics cookies</strong> to understand how users interact with our platform (e.g., via Google Analytics or similar tools).</Li>
            </ul>
            <p className="mt-3">You can control or disable cookies through your browser settings; however, this may affect certain features of the platform.</p>
          </Section>

          <Section number="4" title="Data Sharing & Third-Party Services">
            <p>We do not sell or rent your personal data to third parties. However, we may share information with trusted service providers who assist us in operating our platform, including:</p>
            <ul className="mt-3 space-y-2 list-none">
              <Li><strong>Clerk</strong> — authentication and user management.</Li>
              <Li><strong>Razorpay</strong> — secure payment processing.</Li>
              <Li><strong>Analytics providers</strong> — usage tracking to improve our services.</Li>
              <Li><strong>Hosting providers</strong> — infrastructure and uptime.</Li>
            </ul>
            <p className="mt-3">Each of these providers has their own privacy policy governing their use of your data.</p>
          </Section>

          <Section number="5" title="Data Retention">
            <p>We retain your personal information only for as long as necessary to provide our services and fulfil the purposes outlined in this policy, or as required by law. If you request account deletion, we will remove your data in accordance with applicable regulations.</p>
          </Section>

          <Section number="6" title="Data Security">
            <p>We implement industry-standard security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. This includes encrypted connections (HTTPS), access controls, and secure data storage. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.</p>
          </Section>

          <Section number="7" title="Your Rights">
            <p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
            <ul className="mt-3 space-y-2 list-none">
              <Li>The right to access the personal data we hold about you.</Li>
              <Li>The right to request correction of inaccurate data.</Li>
              <Li>The right to request deletion of your personal data.</Li>
              <Li>The right to withdraw consent for data processing at any time.</Li>
            </ul>
            <p className="mt-3">To exercise any of these rights, please contact us at <a href="mailto:support@algomaitri.com" className="text-violet-600 underline underline-offset-4 hover:text-violet-700 dark:text-violet-400">support@algomaitri.com</a>.</p>
          </Section>

          <Section number="8" title="Children's Privacy">
            <p>AlgoMaitri is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us and we will take steps to delete that information promptly.</p>
          </Section>

          <Section number="9" title="Changes to This Policy">
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify users of significant changes by updating the "Last updated" date above. Continued use of the platform following changes constitutes your acceptance of the updated policy.</p>
          </Section>

          <Section number="10" title="Contact Us">
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at:</p>
            <div className="mt-4 rounded-2xl border border-violet-500/15 bg-violet-500/5 px-5 py-4">
              <p className="font-semibold text-foreground">AlgoMaitri</p>
              <p className="mt-1">
                <a href="mailto:support@algomaitri.com" className="text-violet-600 hover:underline dark:text-violet-400">
                  support@algomaitri.com
                </a>
              </p>
            </div>
          </Section>

        </div>

        <LegalFooterLinks active="privacy" />
      </div>
    </div>
  )
}

// ─── Shared sub-components ────────────────────────────────────

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-xs font-bold text-white shadow-[0_4px_12px_rgba(139,92,246,0.3)]">
          {number}
        </div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>
      <div className="ml-11 text-sm leading-7 text-muted-foreground space-y-3">
        {children}
      </div>
      <div className="mt-10 h-px bg-gradient-to-r from-transparent via-violet-500/15 to-transparent" />
    </section>
  )
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500/60" />
      <span>{children}</span>
    </li>
  )
}

function LegalFooterLinks({ active }: { active: "terms" | "privacy" | "disclaimer" }) {
  const links = [
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/disclaimer", label: "Disclaimer" },
  ]
  return (
    <div className="mt-16 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-violet-500/10 pt-8">
      {links.map(l => (
        <Link key={l.href} href={l.href}
          className={`text-sm transition-colors ${
            active === l.href.replace("/", "")
              ? "font-semibold text-violet-600 dark:text-violet-400"
              : "text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400"
          }`}>
          {l.label}
        </Link>
      ))}
    </div>
  )
}