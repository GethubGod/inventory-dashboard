import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { APPSTORE_COMPLIANCE_PATH_REDIRECTS } from "@/config/external-links";
import { validateRedirectTarget } from "@/lib/security/validate-redirect";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  if (process.env.NODE_ENV === "production") {
    const normalizedPath =
      pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
    const redirectTarget = APPSTORE_COMPLIANCE_PATH_REDIRECTS[normalizedPath];

    if (redirectTarget) {
      // Validate redirect target to prevent open redirect
      const safeTarget = validateRedirectTarget(redirectTarget, request.nextUrl);

      if (safeTarget) {
        // Same-origin relative path — build a full URL from the current request
        const targetUrl = new URL(safeTarget, request.nextUrl.origin);
        const sameDestination = request.nextUrl.pathname === targetUrl.pathname;

        if (!sameDestination) {
          return NextResponse.redirect(targetUrl, 308);
        }
      } else {
        // External redirect — validate it's an intentionally allowed external URL
        // Only follow the redirect if the target is in the compliance config
        // (which is a static, developer-controlled list)
        try {
          const targetUrl = new URL(redirectTarget);
          const sameDestination =
            request.nextUrl.protocol === targetUrl.protocol &&
            request.nextUrl.hostname === targetUrl.hostname &&
            request.nextUrl.pathname === targetUrl.pathname;

          if (!sameDestination) {
            return NextResponse.redirect(targetUrl, 308);
          }
        } catch {
          // Invalid URL in config — skip redirect silently
        }
      }
    }
  }

  const { response } = await updateSession(request);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
