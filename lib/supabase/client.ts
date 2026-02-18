import type { Database } from "@/types/database";
import { createBrowserClient } from "@supabase/ssr";

type BrowserSupabaseClient = ReturnType<typeof createBrowserClient<Database>>;

let client: BrowserSupabaseClient | undefined;

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

export function createBrowserSupabaseClient() {
	if (client) {
		return client;
	}

	const { supabaseUrl, supabaseAnonKey } = getSupabasePublicEnv();
	client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
	return client;
}
