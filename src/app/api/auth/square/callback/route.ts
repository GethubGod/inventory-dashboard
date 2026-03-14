import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type SquareTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_at?: string;
  merchant_id?: string;
  token_type?: string;
  short_lived?: boolean;
  errors?: Array<{
    category?: string;
    code?: string;
    detail?: string;
  }>;
};

const DEFAULT_SQUARE_API_BASE = "https://connect.squareup.com";

function buildOnboardingRedirect(request: NextRequest, params: Record<string, string>) {
  const redirectUrl = new URL("/onboarding", request.url);

  Object.entries(params).forEach(([key, value]) => {
    redirectUrl.searchParams.set(key, value);
  });

  return NextResponse.redirect(redirectUrl);
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return buildOnboardingRedirect(request, {
      square: "error",
      message: error,
    });
  }

  if (!code || !state) {
    return buildOnboardingRedirect(request, {
      square: "error",
      message: "Missing code or state.",
    });
  }

  const appId = process.env.NEXT_PUBLIC_SQUARE_APP_ID;
  const appSecret = process.env.SQUARE_APP_SECRET;

  if (!appId || !appSecret) {
    return buildOnboardingRedirect(request, {
      square: "error",
      message: "Square OAuth credentials are not configured.",
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return buildOnboardingRedirect(request, {
      square: "error",
      message: "Sign in before connecting Square.",
    });
  }

  try {
    const tokenResponse = await fetch(`${process.env.SQUARE_API_BASE_URL || DEFAULT_SQUARE_API_BASE}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: appId,
        client_secret: appSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${request.nextUrl.origin}/api/auth/square/callback`,
      }),
      cache: "no-store",
    });

    const payload = (await tokenResponse.json()) as SquareTokenResponse;

    if (!tokenResponse.ok || !payload.access_token) {
      const detail = payload.errors?.[0]?.detail;

      return buildOnboardingRedirect(request, {
        square: "error",
        message: detail || "Square token exchange failed.",
      });
    }

    // Save tokens via the edge function instead of writing directly
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token ?? null;

    const saveResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/v1-save-square-tokens`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          oauthState: state,
          merchantId: payload.merchant_id ?? null,
          accessToken: payload.access_token,
          refreshToken: payload.refresh_token ?? null,
          tokenExpiresAt: payload.expires_at ?? null,
          metadata: {
            token_type: payload.token_type ?? null,
            short_lived: payload.short_lived ?? null,
          },
        }),
      },
    );

    if (!saveResponse.ok) {
      const body = await saveResponse.json().catch(() => null);
      return buildOnboardingRedirect(request, {
        square: "error",
        message: (body as { error?: string } | null)?.error ?? "Failed to save Square tokens.",
      });
    }

    return buildOnboardingRedirect(request, {
      square: "connected",
      state,
    });
  } catch {
    return buildOnboardingRedirect(request, {
      square: "error",
      message: "Unexpected Square callback error.",
    });
  }
}
