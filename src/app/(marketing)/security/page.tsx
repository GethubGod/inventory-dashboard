import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, Users, Eye, AlertTriangle } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PageHero } from "@/components/marketing/page-hero";
import { APPSTORE_COMPLIANCE_LINKS } from "@/config/external-links";

export const metadata: Metadata = {
  title: "Security | Babytuna Systems",
  description:
    "How Babytuna Systems protects your data. Encryption, authentication, access control, and vulnerability reporting.",
};

const securitySections = [
  {
    icon: Lock,
    title: "Data Encryption",
    content: [
      "All data transmitted between your device and our servers is encrypted using HTTPS/TLS.",
      "Data at rest is encrypted using the default encryption provided by our infrastructure provider (Supabase on AWS).",
      "Voice ordering data is processed securely and not stored after transcription is complete.",
    ],
  },
  {
    icon: Shield,
    title: "Authentication",
    content: [
      "User authentication is handled by Supabase Auth, which supports email/password and magic link sign-in.",
      "Team members access the system via organization-specific access codes, reducing the need for individual credentials in operational settings.",
      "Session tokens are securely managed and expire after a configurable period of inactivity.",
    ],
  },
  {
    icon: Users,
    title: "Access Control",
    content: [
      "Access is scoped to organizations. Users can only view and modify data within their own organization.",
      "Role-based permissions (admin, manager, member) control what actions each team member can perform.",
      "Organization administrators can create, revoke, and manage access codes for their team.",
    ],
  },
  {
    icon: Eye,
    title: "Operational Security",
    content: [
      "We follow the principle of least privilege for internal access to production systems.",
      "Application dependencies are regularly updated to address known vulnerabilities.",
      "We monitor for unauthorized access attempts and anomalous activity patterns.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Reporting Vulnerabilities",
    content: [
      "If you discover a security vulnerability, please report it to us immediately.",
      "Email security concerns to babytunalovessushi@gmail.com with the subject line \"Security Vulnerability Report.\"",
      "We will acknowledge receipt within 48 hours and work to address valid reports promptly.",
      "We ask that you not publicly disclose vulnerabilities until we've had a reasonable opportunity to address them.",
    ],
  },
];

export default function SecurityPage() {
  return (
    <MarketingPageShell>
      <PageHero
        title="Security."
        subtitle="How we protect your data, your team's access, and your operations."
      />

      <section className="bg-[#fafaf9] text-zinc-900 py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-zinc-600 text-base md:text-lg leading-relaxed mb-12 md:mb-16">
            Security is foundational to Babytuna Systems. We handle sensitive
            operational data — inventory levels, supplier relationships, team
            access — and we take that responsibility seriously. Below is a
            transparent overview of how we protect your information.
          </p>

          <div className="space-y-12 md:space-y-16">
            {securitySections.map((section) => (
              <div key={section.title}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-zinc-100 border border-black/5 flex items-center justify-center">
                    <section.icon className="h-5 w-5 text-teal-600" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-3 pl-[52px]">
                  {section.content.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-zinc-600 text-sm md:text-base leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-white rounded-2xl border border-black/5 p-6 md:p-8 shadow-sm">
            <h2 className="text-lg md:text-xl font-bold mb-3">
              A note on certifications
            </h2>
            <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
              Babytuna Systems is an early-stage product. We do not currently
              hold SOC 2, ISO 27001, or similar certifications. As we grow, we
              will pursue formal audits and certifications appropriate to our
              scale and customer requirements. In the meantime, we are committed
              to following security best practices and being transparent about
              our approach.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-black/10">
            <p className="text-sm text-zinc-500">
              See also:{" "}
              <Link
                href={APPSTORE_COMPLIANCE_LINKS.privacy}
                className="text-teal-600 hover:text-teal-500 transition-colors"
              >
                Privacy Policy
              </Link>{" "}
              &middot;{" "}
              <Link
                href="/terms"
                className="text-teal-600 hover:text-teal-500 transition-colors"
              >
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
