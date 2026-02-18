import type { Database } from "@/types/database";
import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type SupabaseCookie = {
	name: string;
	value: string;
	options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

const authRoutes = ["/login", "/signup"];
const protectedRoutes = [
	"/overview",
	"/onboarding",
	"/recipes",
	"/inventory",
	"/forecasts",
	"/analytics",
	"/calibration",
	"/settings",
	"/data",
];

function getSupabasePublicEnv() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		return null;
	}

	return { supabaseUrl, supabaseAnonKey };
}

function matchesPath(pathname: string, path: string) {
	return pathname === path || pathname.startsWith(`${path}/`);
}

function copyCookies(fromResponse: NextResponse, toResponse: NextResponse) {
	for (const cookie of fromResponse.cookies.getAll()) {
		const { name, value, ...options } = cookie;
		toResponse.cookies.set(name, value, options);
	}

	return toResponse;
}

export async function updateSession(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const env = getSupabasePublicEnv();

	if (!env) {
		return NextResponse.next({
			request,
		});
	}

	const { supabaseUrl, supabaseAnonKey } = env;

	let response = NextResponse.next({
		request,
	});

	const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll() {
				return request.cookies.getAll();
			},
			setAll(cookiesToSet: SupabaseCookie[]) {
				for (const { name, value } of cookiesToSet) {
					request.cookies.set(name, value);
				}
				response = NextResponse.next({
					request,
				});
				for (const { name, value, options } of cookiesToSet) {
					response.cookies.set(name, value, options);
				}
			},
		},
	});

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const isProtectedRoute = protectedRoutes.some((route) =>
		matchesPath(pathname, route),
	);
	const isAuthRoute = authRoutes.some((route) => matchesPath(pathname, route));

	if (!user && isProtectedRoute) {
		const loginUrl = request.nextUrl.clone();
		loginUrl.pathname = "/login";
		loginUrl.searchParams.set("next", pathname);
		return copyCookies(response, NextResponse.redirect(loginUrl));
	}

	if (user && isAuthRoute) {
		const overviewUrl = request.nextUrl.clone();
		overviewUrl.pathname = "/overview";
		overviewUrl.search = "";
		return copyCookies(response, NextResponse.redirect(overviewUrl));
	}

	return response;
}
