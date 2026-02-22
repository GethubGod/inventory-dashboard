import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "Careers | Babytuna Systems",
  description:
    "We're a small, focused team building intelligent inventory tools for restaurants. See what roles we're thinking about next.",
};

const futureRoles = [
  {
    title: "iOS Engineer",
    description:
      "Build the native ordering experience. SwiftUI, voice input, offline-first architecture.",
  },
  {
    title: "Full-Stack Engineer",
    description:
      "Work across the Next.js dashboard, Supabase backend, and real-time data pipelines.",
  },
  {
    title: "Product Designer",
    description:
      "Shape how restaurant teams interact with inventory and ordering — mobile and web.",
  },
  {
    title: "Operations & Support",
    description:
      "Help onboard restaurants, gather feedback, and ensure every team gets value from day one.",
  },
];

export default function CareersPage() {
  return (
    <MarketingPageShell>
      <PageHero
        title="Join the team."
        subtitle="We're small, focused, and building something restaurants actually need."
      />

      <section className="bg-[#fafaf9] text-zinc-900 py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-black/5 p-6 md:p-10 shadow-sm mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-3">
              We&apos;re not hiring publicly yet.
            </h2>
            <p className="text-zinc-600 text-base leading-relaxed mb-6">
              Babytuna Systems is a small team working closely with real
              restaurants. We don&apos;t have open roles right now, but
              we&apos;re always interested in hearing from people who care about
              building excellent tools.
            </p>
            <a
              href="mailto:babytunalovessushi@gmail.com?subject=Interested in joining Babytuna Systems"
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-500 font-medium transition-colors"
            >
              <Mail className="h-4 w-4" />
              babytunalovessushi@gmail.com
            </a>
          </div>

          <h2 className="text-xl md:text-2xl font-bold mb-6">
            Roles we&apos;re thinking about
          </h2>
          <p className="text-zinc-600 text-sm md:text-base leading-relaxed mb-8">
            When we do grow, these are the kinds of people we&apos;ll be looking
            for. If you fit one of these, reach out — we&apos;d love to talk
            early.
          </p>

          <div className="grid gap-4">
            {futureRoles.map((role) => (
              <div
                key={role.title}
                className="bg-white rounded-xl border border-black/5 p-5 md:p-6 shadow-sm"
              >
                <h3 className="text-base md:text-lg font-semibold mb-1">
                  {role.title}
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-900 text-white py-16 md:py-24 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
            Interested?
          </h2>
          <p className="text-zinc-400 text-base md:text-lg mb-8">
            Drop us a note. Tell us what you&apos;re good at and why restaurant
            tech matters to you.
          </p>
          <a
            href="mailto:babytunalovessushi@gmail.com?subject=Interested in joining Babytuna Systems"
            className="inline-flex items-center gap-2 rounded-full bg-lime-500 hover:bg-lime-400 px-8 py-3 md:py-4 text-sm md:text-lg font-semibold text-black transition-all"
          >
            <Mail className="h-4 w-4 md:h-5 md:w-5" />
            Send us an email
          </a>
        </div>
      </section>
    </MarketingPageShell>
  );
}
