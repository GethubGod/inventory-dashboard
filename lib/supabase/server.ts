import type { Database } from "@/types/database";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type SupabaseCookie = {
	name: string;
	value: string;
	options?: unknown;
};

function getSupabasePublicEnv() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error(
			"Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
		);
	}

	return { supabaseUrl, supabaseAnonKey };
}

export async function createServerSupabaseClient() {
	const cookieStore = await cookies();
	const { supabaseUrl, supabaseAnonKey } = getSupabasePublicEnv();

	return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet: SupabaseCookie[]) {
				try {
					for (const { name, value, options } of cookiesToSet) {
						cookieStore.set(name, value, options as never);
					}
				} catch {
					// setAll can be called from a Server Component where cookie writes are ignored.
				}
			},
		},
	});
}
