import { describe, expect, it } from "vitest";

import { validateRedirectTarget } from "@/lib/security/validate-redirect";

const REQUEST_URL = new URL("https://app.babytunasystems.com/dashboard");

describe("validateRedirectTarget", () => {
  // ── Valid cases ───────────────────────────────────────
  it("accepts a simple relative path", () => {
    expect(validateRedirectTarget("/dashboard", REQUEST_URL)).toBe("/dashboard");
  });

  it("accepts a relative path with query params", () => {
    expect(validateRedirectTarget("/login?next=/dashboard", REQUEST_URL)).toBe(
      "/login?next=/dashboard",
    );
  });

  it("accepts root path", () => {
    expect(validateRedirectTarget("/", REQUEST_URL)).toBe("/");
  });

  it("accepts same-origin absolute URL and returns path", () => {
    expect(validateRedirectTarget("https://app.babytunasystems.com/settings", REQUEST_URL)).toBe(
      "/settings",
    );
  });

  // ── Invalid cases ────────────────────────────────────
  it("rejects null/empty/undefined inputs", () => {
    expect(validateRedirectTarget("", REQUEST_URL)).toBeNull();
    expect(validateRedirectTarget("   ", REQUEST_URL)).toBeNull();
  });

  it("rejects protocol-relative URL", () => {
    expect(validateRedirectTarget("//evil.com/pwned", REQUEST_URL)).toBeNull();
  });

  it("rejects absolute external URL (http)", () => {
    expect(validateRedirectTarget("https://evil.com/pwned", REQUEST_URL)).toBeNull();
  });

  it("rejects absolute external URL (http)", () => {
    expect(validateRedirectTarget("http://evil.com/pwned", REQUEST_URL)).toBeNull();
  });

  it("rejects javascript: protocol", () => {
    expect(validateRedirectTarget("javascript:alert(1)", REQUEST_URL)).toBeNull();
  });

  it("rejects encoded protocol-relative URL", () => {
    expect(validateRedirectTarget("%2f%2fevil.com/pwned", REQUEST_URL)).toBeNull();
  });

  it("rejects encoded javascript protocol", () => {
    expect(validateRedirectTarget("%6aavascript:alert(1)", REQUEST_URL)).toBeNull();
  });

  it("rejects backslash path (Windows-style)", () => {
    expect(validateRedirectTarget("\\\\evil.com\\pwned", REQUEST_URL)).toBeNull();
  });

  it("rejects paths without leading slash", () => {
    expect(validateRedirectTarget("evil.com/pwned", REQUEST_URL)).toBeNull();
  });

  it("rejects paths with null bytes", () => {
    expect(validateRedirectTarget("/path%00evil", REQUEST_URL)).toBeNull();
  });

  it("rejects paths with CRLF injection", () => {
    expect(validateRedirectTarget("/path%0d%0aSet-Cookie:evil", REQUEST_URL)).toBeNull();
  });

  it("rejects different-port same-host URL", () => {
    expect(
      validateRedirectTarget("https://app.babytunasystems.com:8080/pwned", REQUEST_URL),
    ).toBeNull();
  });

  it("rejects data: protocol", () => {
    expect(
      validateRedirectTarget("data:text/html,<script>alert(1)</script>", REQUEST_URL),
    ).toBeNull();
  });
});
