import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "Privacy Policy | Babytuna Systems",
  description:
    "How Babytuna Systems collects, uses, and protects your personal information.",
};

const sections = [
  { id: "information-we-collect", title: "Information We Collect" },
  { id: "how-we-use-information", title: "How We Use Your Information" },
  { id: "data-storage", title: "Data Storage & Security" },
  { id: "third-party-services", title: "Third-Party Services" },
  { id: "your-rights", title: "Your Rights" },
  { id: "cookies", title: "Cookies & Tracking" },
  { id: "children", title: "Children's Privacy" },
  { id: "changes", title: "Changes to This Policy" },
  { id: "contact", title: "Contact Us" },
];

export default function PrivacyPage() {
  return (
    <MarketingPageShell>
      <PageHero title="Privacy Policy." subtitle="Last updated: February 2026" />

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
              Babytuna Systems Inc. (&quot;Babytuna,&quot; &quot;we,&quot;
              &quot;us,&quot; or &quot;our&quot;) operates the Babytuna Systems
              platform, including the web application at babytunasystems.com and
              the Babytuna iOS app. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you use our
              services.
            </p>

            <div id="information-we-collect">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                1. Information We Collect
              </h2>
              <div className="space-y-4 text-zinc-600 text-sm md:text-base leading-relaxed">
                <p>
                  <strong className="text-zinc-900">Account information.</strong>{" "}
                  When you create an account, we collect your name, email
                  address, and organization details. Team members may be added
                  via access codes rather than personal signups.
                </p>
                <p>
                  <strong className="text-zinc-900">Usage data.</strong> We
                  collect information about how you interact with the
                  platform, including pages visited, features used, voice
                  ordering inputs, and inventory actions taken.
                </p>
                <p>
                  <strong className="text-zinc-900">Device information.</strong>{" "}
                  We may collect device type, operating system, browser type,
                  and IP address for security and performance purposes.
                </p>
              </div>
            </div>

            <div id="how-we-use-information">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                2. How We Use Your Information
              </h2>
              <ul className="space-y-2 text-zinc-600 text-sm md:text-base leading-relaxed list-disc pl-5">
                <li>Provide, operate, and maintain the platform</li>
                <li>Process and fulfill inventory orders</li>
                <li>Send notifications about orders, stock levels, and system updates</li>
                <li>Improve and personalize your experience</li>
                <li>Communicate with you about your account or our services</li>
                <li>Detect, prevent, and address technical issues or fraud</li>
              </ul>
            </div>

            <div id="data-storage">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                3. Data Storage &amp; Security
              </h2>
              <div className="space-y-4 text-zinc-600 text-sm md:text-base leading-relaxed">
                <p>
                  Your data is stored using Supabase infrastructure, which
                  provides encryption at rest and in transit. We use HTTPS/TLS
                  for all data transmission between your device and our servers.
                </p>
                <p>
                  While we implement commercially reasonable security measures,
                  no method of electronic transmission or storage is 100%
                  secure. We cannot guarantee absolute security.
                </p>
              </div>
            </div>

            <div id="third-party-services">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                4. Third-Party Services
              </h2>
              <div className="space-y-4 text-zinc-600 text-sm md:text-base leading-relaxed">
                <p>
                  We may use third-party services for authentication (Supabase
                  Auth), analytics, payment processing, and POS integrations.
                  These services have their own privacy policies and we
                  encourage you to review them.
                </p>
                <p>
                  We do not sell your personal information to third parties.
                </p>
              </div>
            </div>

            <div id="your-rights">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                5. Your Rights
              </h2>
              <div className="space-y-4 text-zinc-600 text-sm md:text-base leading-relaxed">
                <p>
                  You have the right to access, correct, or delete your personal
                  information. You may also request a copy of the data we hold
                  about you. To exercise these rights, contact us at the email
                  below.
                </p>
                <p>
                  If you are located in the European Economic Area, you may
                  have additional rights under GDPR, including the right to data
                  portability and the right to lodge a complaint with a
                  supervisory authority.
                </p>
              </div>
            </div>

            <div id="cookies">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                6. Cookies &amp; Tracking
              </h2>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
                We use essential cookies to maintain your session and
                preferences. We do not use advertising cookies or third-party
                tracking pixels. You can configure your browser to refuse
                cookies, though some features may not function properly.
              </p>
            </div>

            <div id="children">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                7. Children&apos;s Privacy
              </h2>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
                Babytuna Systems is not directed to children under 13. We do not
                knowingly collect personal information from children. If you
                believe a child has provided us with personal data, please
                contact us and we will delete it.
              </p>
            </div>

            <div id="changes">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                8. Changes to This Policy
              </h2>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of material changes by posting the new policy on this
                page and updating the &quot;Last updated&quot; date. Continued
                use of the service after changes constitutes acceptance.
              </p>
            </div>

            <div id="contact">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                9. Contact Us
              </h2>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
                If you have questions about this Privacy Policy, contact us at{" "}
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
                href="/terms"
                className="text-teal-600 hover:text-teal-500 transition-colors"
              >
                Terms of Service
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
