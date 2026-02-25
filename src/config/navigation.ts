import { APPSTORE_COMPLIANCE_LINKS } from "@/config/external-links";

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: NavLink[];
}

export const primaryNavLinks: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

export const footerSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Integrations", href: "/integrations" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Support", href: APPSTORE_COMPLIANCE_LINKS.support },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: APPSTORE_COMPLIANCE_LINKS.contact },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: APPSTORE_COMPLIANCE_LINKS.privacy },
      { label: "Terms of Service", href: "/terms" },
      { label: "Security", href: "/security" },
    ],
  },
];
