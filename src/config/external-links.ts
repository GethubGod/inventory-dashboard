export const APPSTORE_COMPLIANCE_LINKS = {
  support: "https://www.babytunasystems.com/support",
  contact: "https://www.babytunasystems.com/contact",
  privacy: "https://www.babytunasystems.com/privacy",
} as const;

export const APPSTORE_COMPLIANCE_PATH_REDIRECTS: Record<string, string> = {
  "/support": APPSTORE_COMPLIANCE_LINKS.support,
  "/contact": APPSTORE_COMPLIANCE_LINKS.contact,
  "/privacy": APPSTORE_COMPLIANCE_LINKS.privacy,
};
