import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle, ArrowRight } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PageHero } from "@/components/marketing/page-hero";
import { APPSTORE_COMPLIANCE_LINKS } from "@/config/external-links";

export const metadata: Metadata = {
  title: "Contact | Babytuna Systems",
  description:
    "Get in touch with Babytuna Systems. Support, sales inquiries, and feedback — we're here to help.",
};

export default function ContactPage() {
  return (
    <MarketingPageShell>
      <PageHero
        title="Get in touch."
        subtitle="Whether you need help with your account or want to learn more about Babytuna Systems."
      />

      <section className="bg-[#fafaf9] text-zinc-900 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-white rounded-2xl border border-black/5 p-6 md:p-8 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center mb-5">
                <MessageCircle className="h-5 w-5 text-teal-600" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-3">
                For support
              </h2>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed mb-6">
                Include your account email, organization name, and device info
                so we can help faster.
              </p>
              <a
                href="mailto:babytunalovessushi@gmail.com?subject=Support Request&body=Account email:%0AOrganization name:%0ADevice:%0A%0ADescribe your issue:%0A"
                className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-500 font-medium transition-colors text-sm md:text-base"
              >
                <Mail className="h-4 w-4" />
                babytunalovessushi@gmail.com
              </a>
              <div className="mt-4 pt-4 border-t border-black/5">
                <Link
                  href={APPSTORE_COMPLIANCE_LINKS.support}
                  className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1"
                >
                  Visit Support Center
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 p-6 md:p-8 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-lime-50 border border-lime-200 flex items-center justify-center mb-5">
                <Mail className="h-5 w-5 text-lime-600" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-3">
                For sales &amp; demos
              </h2>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed mb-6">
                Want to see Babytuna in action? Reach out and we&apos;ll walk
                you through the product.
              </p>
              <a
                href="mailto:babytunalovessushi@gmail.com?subject=Demo Request"
                className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-500 font-medium transition-colors text-sm md:text-base"
              >
                <Mail className="h-4 w-4" />
                babytunalovessushi@gmail.com
              </a>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-2xl border border-black/5 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl md:text-2xl font-bold mb-3">
              General inquiries
            </h2>
            <p className="text-zinc-600 text-sm md:text-base leading-relaxed mb-4">
              For partnerships, press, feedback, or anything else — we read
              every email.
            </p>
            <a
              href="mailto:babytunalovessushi@gmail.com?subject=General Inquiry"
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-500 font-medium transition-colors text-sm md:text-base"
            >
              <Mail className="h-4 w-4" />
              babytunalovessushi@gmail.com
            </a>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
