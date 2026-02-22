import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "Terms of Service | Babytuna Systems",
  description:
    "Terms and conditions for using Babytuna Systems inventory management platform.",
};

const sections = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "description", title: "Description of Service" },
  { id: "accounts", title: "Accounts & Access" },
  { id: "acceptable-use", title: "Acceptable Use" },
  { id: "subscriptions", title: "Subscriptions & Billing" },
  { id: "intellectual-property", title: "Intellectual Property" },
  { id: "limitation", title: "Limitation of Liability" },
  { id: "termination", title: "Termination" },
  { id: "governing-law", title: "Governing Law" },
  { id: "changes", title: "Changes to Terms" },
  { id: "contact", title: "Contact" },
];

export default function TermsPage() {
  return (
    <MarketingPageShell>
      <PageHero
        title="Terms of Service."
        subtitle="Last updated: February 2026"
      />

      <section className="bg-[#fafaf9] text-zinc-900 py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="bg-white rounded-xl border border-black/5 p-5 md:p-6 shadow-sm mb-12">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">
              Table of Contents
            </h2>
            <ol className="space-y-2">
              {sections.map((section, i) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-sm text-zinc-600 hover:text-teal-600 transition-colors flex items-baseline gap-2"
                  >
                    <span className="text-zinc-400 font-mono text-xs">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-10 md:space-y-14">
            <p className="text-zinc-600 text-base leading-relaxed">
              These Terms of Service (&quot;Terms&quot;) govern your use of the
              Babytuna Systems platform, including the web application at
              babytunasystems.com and the Babytuna iOS app, operated by Babytuna
              Systems Inc. (&quot;Babytuna,&quot; &quot;we,&quot; &quot;us,&quot;
              or &quot;our&quot;). By accessing or using the service, you agree
              to be bound by these Terms.
            </p>

            <div id="acceptance">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
                By creating an account or using the service, you confirm that
                you are at least 18 years old and agree to comply with these
                Terms. If you are using the service on behalf of an organization,
                you represent that you have authority to bind that organization.
              </p>
            </div>

            <div id="description">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                2. Description of Service
              </h2>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
                Babytuna Systems provides an inventory management and ordering
                platform for restaurants, including voice-based ordering,
                inventory tracking, supplier routing, demand forecasting, and
                related features. The specific features available to you may
                depend on your subscription plan.
              </p>
            </div>

            <div id="accounts">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                3. Accounts &amp; Access
              </h2>
              <div className="space-y-4 text-zinc-600 text-sm md:text-base leading-relaxed">
                <p>
                  You are responsible for maintaining the confidentiality of
                  your account credentials and access codes. You agree to notify
                  us immediately of any unauthorized use of your account.
                </p>
                <p>
                  Organization administrators may create access codes for team
                  members. The administrator is responsible for managing access
                  and ensuring team members comply with these Terms.
                </p>
              </div>
            </div>

            <div id="acceptable-use">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                4. Acceptable Use
              </h2>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="space-y-2 text-zinc-600 text-sm md:text-base leading-relaxed list-disc pl-5">
                <li>Use the service for any illegal purpose</li>
                <li>Attempt to gain unauthorized access to any part of the service</li>
                <li>Interfere with or disrupt the service or its infrastructure</li>
                <li>Reverse-engineer, decompile, or disassemble any part of the service</li>
                <li>Share account credentials outside your organization</li>
                <li>Use the service to store or transmit malicious code</li>
              </ul>
            </div>

            <div id="subscriptions">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                5. Subscriptions &amp; Billing
              </h2>
              <div className="space-y-4 text-zinc-600 text-sm md:text-base leading-relaxed">
                <p>
                  Babytuna offers a free Starter plan and a paid Pro plan.
                  The Pro plan is billed monthly. You may upgrade or downgrade
                  at any time.
                </p>
                <p>
                  You may cancel your Pro subscription at any time. Upon
                  cancellation, you will retain access to Pro features through
                  the end of your current billing period.
                </p>
                <p>
                  We reserve the right to change pricing with 30 days&apos;
                  notice. Price changes will not apply to your current billing
                  period.
                </p>
              </div>
            </div>

            <div id="intellectual-property">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                6. Intellectual Property
              </h2>
              <div className="space-y-4 text-zinc-600 text-sm md:text-base leading-relaxed">
                <p>
                  The service, including its design, code, features, and
                  branding, is owned by Babytuna Systems Inc. and protected by
                  copyright and other intellectual property laws.
                </p>
                <p>
                  You retain ownership of the data you input into the platform.
                  By using the service, you grant us a limited license to
                  process your data solely to provide the service.
                </p>
              </div>
            </div>

            <div id="limitation">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                7. Limitation of Liability
              </h2>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
                To the maximum extent permitted by law, Babytuna Systems shall
                not be liable for any indirect, incidental, special,
                consequential, or punitive damages resulting from your use of
                the service. Our total liability shall not exceed the amount you
                paid us in the twelve months preceding the claim.
              </p>
            </div>

            <div id="termination">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                8. Termination
              </h2>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
                We may suspend or terminate your access to the service if you
                violate these Terms or for any other reason with reasonable
                notice. You may delete your account at any time by contacting
                support.
              </p>
            </div>

            <div id="governing-law">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                9. Governing Law
              </h2>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
                These Terms are governed by the laws of the United States. Any
                disputes will be resolved in the courts of the state in which
                Babytuna Systems Inc. is incorporated.
              </p>
            </div>

            <div id="changes">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                10. Changes to Terms
              </h2>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
                We may modify these Terms at any time. Material changes will be
                communicated via the platform or email. Continued use of the
                service after changes constitutes acceptance of the updated
                Terms.
              </p>
            </div>

            <div id="contact">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                11. Contact
              </h2>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
                For questions about these Terms, contact us at{" "}
                <a
                  href="mailto:babytunalovessushi@gmail.com"
                  className="text-teal-600 hover:text-teal-500 transition-colors"
                >
                  babytunalovessushi@gmail.com
                </a>
                .
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-black/10">
            <p className="text-sm text-zinc-500">
              See also:{" "}
              <Link
                href="/privacy"
                className="text-teal-600 hover:text-teal-500 transition-colors"
              >
                Privacy Policy
              </Link>{" "}
              &middot;{" "}
              <Link
                href="/security"
                className="text-teal-600 hover:text-teal-500 transition-colors"
              >
                Security
              </Link>
            </p>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
