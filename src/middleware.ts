import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { APPSTORE_COMPLIANCE_PATH_REDIRECTS } from "@/config/external-links";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  if (process.env.NODE_ENV === "production") {
    const normalizedPath = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
    const redirectTarget = APPSTORE_COMPLIANCE_PATH_REDIRECTS[normalizedPath];

    if (redirectTarget) {
      const currentUrl = request.nextUrl;
      const targetUrl = new URL(redirectTarget);
      const sameDestination =
        currentUrl.protocol === targetUrl.protocol &&
        currentUrl.hostname === targetUrl.hostname &&
        currentUrl.pathname === targetUrl.pathname;

      if (!sameDestination) {
        return NextResponse.redirect(redirectTarget, 308);
      }
    }
  }

  const { response } = await updateSession(request);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
