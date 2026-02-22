import type { Metadata } from "next";
import Link from "next/link";
import { Mail, BookOpen, MessageCircle, ArrowRight } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "Support | Babytuna Systems",
  description:
    "Get help with Babytuna Systems. Contact support, browse common topics, and find answers.",
};

const supportTopics = [
  {
    title: "Account & access",
    description:
      "Issues with logging in, access codes, team member management, or organization settings.",
  },
  {
    title: "Inventory & ordering",
    description:
      "Questions about stock levels, voice ordering, draft carts, or supplier routing.",
  },
  {
    title: "Integrations",
    description:
      "Help with POS connections, CSV imports, vendor guide uploads, or notification setup.",
  },
  {
    title: "Billing & plans",
    description:
      "Upgrade, downgrade, cancel, or manage your subscription and payment details.",
  },
];

export default function SupportPage() {
  return (
    <MarketingPageShell>
      <PageHero
        title="Support."
        subtitle="We're here to help you get the most out of Babytuna Systems."
      />

      <section className="bg-[#fafaf9] text-zinc-900 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-black/5 p-6 md:p-10 shadow-sm mb-10">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">
                  Email support
                </h2>
                <p className="text-zinc-600 text-sm md:text-base leading-relaxed mb-4">
                  Send us an email with your account email, organization name,
                  and a description of your issue. We aim to respond within 24
                  hours.
                </p>
                <a
                  href="mailto:babytunalovessushi@gmail.com?subject=Support Request&body=Account email:%0AOrganization name:%0ADevice (iOS/Web):%0A%0ADescribe your issue:%0A"
                  className="inline-flex items-center gap-2 rounded-full bg-zinc-900 hover:bg-zinc-800 px-6 py-2.5 text-sm font-semibold text-white transition-all"
                >
                  <Mail className="h-4 w-4" />
                  Contact Support
                </a>
              </div>
            </div>
          </div>

          <h2 className="text-lg md:text-xl font-bold mb-6">Common topics</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {supportTopics.map((topic) => (
              <div
                key={topic.title}
                className="bg-white rounded-xl border border-black/5 p-5 shadow-sm"
              >
                <h3 className="text-base font-semibold mb-1">{topic.title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  {topic.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            <Link
              href="/contact"
              className="bg-white rounded-xl border border-black/5 p-5 shadow-sm flex items-center gap-3 hover:bg-zinc-50 transition-colors group"
            >
              <MessageCircle className="h-5 w-5 text-zinc-400 group-hover:text-teal-600 transition-colors shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold">Contact us</span>
                <p className="text-xs text-zinc-500">Sales, demos, and general inquiries</p>
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-400 shrink-0" />
            </Link>
            <Link
              href="/security"
              className="bg-white rounded-xl border border-black/5 p-5 shadow-sm flex items-center gap-3 hover:bg-zinc-50 transition-colors group"
            >
              <BookOpen className="h-5 w-5 text-zinc-400 group-hover:text-teal-600 transition-colors shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold">Security</span>
                <p className="text-xs text-zinc-500">Learn how we protect your data</p>
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-400 shrink-0" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
