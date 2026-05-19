/**
 * Validates redirect targets to prevent open redirect vulnerabilities.
 *
 * Returns the sanitized redirect path if valid, or null if the target
 * is external, protocol-relative, or otherwise unsafe.
 */

/**
 * Check if a redirect target is a safe, same-origin relative path.
 *
 * @param target - The redirect target string (from config or query params)
 * @param requestUrl - The current request URL for same-origin comparison
 * @returns The safe redirect URL string, or null if the target is unsafe
 */
export function validateRedirectTarget(target: string, requestUrl: URL): string | null {
  if (!target || typeof target !== "string") {
    return null;
  }

  const trimmed = target.trim();

  // Block empty strings
  if (trimmed.length === 0) {
    return null;
  }

  // Block protocol-relative URLs (//evil.com)
  if (trimmed.startsWith("//")) {
    return null;
  }

  // Block absolute URLs with protocols
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
    // Only allow same-origin absolute URLs
    try {
      const targetUrl = new URL(trimmed);
      if (
        targetUrl.protocol !== requestUrl.protocol ||
        targetUrl.hostname !== requestUrl.hostname ||
        targetUrl.port !== requestUrl.port
      ) {
        return null;
      }
      // Same origin absolute URL — use the path
      return targetUrl.pathname + targetUrl.search + targetUrl.hash;
    } catch {
      return null;
    }
  }

  // Block encoded protocol sequences (%2f%2f, javascript:, etc.)
  const decoded = decodeURIComponent(trimmed).toLowerCase();
  if (
    decoded.startsWith("//") ||
    decoded.startsWith("\\\\") ||
    /^[a-z][a-z0-9+.-]*:/i.test(decoded)
  ) {
    return null;
  }

  // Block path traversal that starts with backslash (Windows-style redirect)
  if (trimmed.startsWith("\\")) {
    return null;
  }

  // Ensure it starts with / for relative paths
  if (!trimmed.startsWith("/")) {
    return null;
  }

  // Block paths that contain encoded newlines or nulls (header injection)
  if (/%0[aAdD]|%00/i.test(trimmed)) {
    return null;
  }

  // Valid relative path
  return trimmed;
}
