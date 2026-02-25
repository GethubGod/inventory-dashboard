import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle, BookOpen, ArrowRight, Clock } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PageHero } from "@/components/marketing/page-hero";
import { APPSTORE_COMPLIANCE_LINKS } from "@/config/external-links";

export const metadata: Metadata = {
  title: "Support | Babytuna Systems",
  description:
    "Get help with Babytuna Systems. Browse FAQs, find answers, and contact our support team.",
};

const faqSections = [
  {
    title: "Getting Started",
    faqs: [
      {
        q: "How do I get access to the app?",
        a: 'Your restaurant manager will provide a location access code. Download the Babytuna Systems app from the App Store, tap "Join Organization," and enter the code to get started.',
      },
      {
        q: "I can\u2019t log in or my access code isn\u2019t working.",
        a: "Access codes are set by your restaurant manager. If your code isn\u2019t working, ask your manager for a new one. If the issue persists, email our support team with your organization name and the code you\u2019re trying to use.",
      },
      {
        q: "Can I use the app on multiple devices?",
        a: "Yes. You can sign in with your account on any supported iOS device.",
      },
      {
        q: "How do I switch between restaurant locations?",
        a: "Select your location from the location picker when you open the app. You\u2019ll only see locations your organization has set up.",
      },
    ],
  },
  {
    title: "Ordering & Inventory",
    faqs: [
      {
        q: "How do I place an order?",
        a: "You can browse items by category in the Browse tab, or search by name in the Quick tab. Add items to your cart with the quantity you need, review everything in the Cart tab, then tap Submit.",
      },
      {
        q: "Can I edit an order after submitting it?",
        a: "Once submitted, orders cannot be changed in the app. Contact your restaurant manager to modify a submitted order.",
      },
      {
        q: "How do I search for a specific item?",
        a: "Open the Quick tab and start typing the item name. Results appear as you type, showing category badges and unit info so you can quickly find the right product.",
      },
      {
        q: "What do the stock levels and reorder units mean?",
        a: "Each item displays its reorder unit (e.g., case, bag, lb) and may show min/max stock levels configured by your manager. These help you know how much to order and in what quantity.",
      },
    ],
  },
  {
    title: "App Features & Settings",
    faqs: [
      {
        q: "How do I change the text size or display settings?",
        a: "Go to the Settings tab where you can adjust text size (0.8\u00d7 to 1.4\u00d7), UI scale, button size, theme, haptic feedback, and motion settings to fit your preference.",
      },
      {
        q: "What is the Voice tab?",
        a: "The Voice tab is a preview of Tuna Specialist, an upcoming AI-powered voice ordering feature. It is not yet active and will be enabled in a future update.",
      },
      {
        q: "What devices are supported?",
        a: "The app is available for iPhone on the App Store. A web version is also available at babytunasystems.com.",
      },
    ],
  },
  {
    title: "Account & Billing",
    faqs: [
      {
        q: "Is Babytuna Systems free to use?",
        a: "Yes. Babytuna Systems is currently free for all restaurants and their employees. There are no charges to download the app, create an organization, or use any features.",
      },
      {
        q: "Do I need to pay to create an account?",
        a: "No. Accounts are completely free. Your restaurant manager creates the organization and distributes access codes to team members at no cost.",
      },
      {
        q: "How do I delete my account or data?",
        a: "Email us at babytunalovessushi@gmail.com with your account email and organization name. We\u2019ll process your request and confirm deletion within 5 business days.",
      },
    ],
  },
];

export default function SupportPage() {
  return (
    <MarketingPageShell>
      <PageHero
        title="Support."
        subtitle="Find answers, get help, and reach our team."
      />

      <section className="bg-[#fafaf9] text-zinc-900 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-black/5 p-6 md:p-10 shadow-sm mb-12">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">
                  Contact Support
                </h2>
                <p className="text-zinc-600 text-sm md:text-base leading-relaxed mb-2">
                  Can&apos;t find your answer below? Send us an email with your
                  account email, organization name, and a description of your
                  issue.
                </p>
                <div className="flex items-center gap-2 text-sm text-zinc-500 mb-5">
                  <Clock className="h-4 w-4" />
                  <span>We respond within 24 hours, Monday through Friday</span>
                </div>
                <a
                  href="mailto:babytunalovessushi@gmail.com?subject=Support Request&body=Account email:%0AOrganization name:%0ADevice (iOS/Web):%0A%0ADescribe your issue:%0A"
                  className="inline-flex items-center gap-2 rounded-full bg-zinc-900 hover:bg-zinc-800 px-6 py-2.5 text-sm font-semibold text-white transition-all"
                >
                  <Mail className="h-4 w-4" />
                  babytunalovessushi@gmail.com
                </a>
              </div>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-10">
            {faqSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-lg md:text-xl font-bold mb-4">
                  {section.title}
                </h3>
                <div className="space-y-4">
                  {section.faqs.map((faq) => (
                    <div
                      key={faq.q}
                      className="bg-white rounded-xl border border-black/5 p-5 md:p-6 shadow-sm"
                    >
                      <h4 className="text-sm md:text-base font-semibold mb-2">
                        {faq.q}
                      </h4>
                      <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid sm:grid-cols-2 gap-4">
            <Link
              href={APPSTORE_COMPLIANCE_LINKS.contact}
              className="bg-white rounded-xl border border-black/5 p-5 shadow-sm flex items-center gap-3 hover:bg-zinc-50 transition-colors group"
            >
              <MessageCircle className="h-5 w-5 text-zinc-400 group-hover:text-teal-600 transition-colors shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold">Contact us</span>
                <p className="text-xs text-zinc-500">
                  Sales, demos, and general inquiries
                </p>
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
                <p className="text-xs text-zinc-500">
                  Learn how we protect your data
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-400 shrink-0" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
