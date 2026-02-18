"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const DEFAULT_NEXT_PATH = "/overview";

function normalizeNextPath(value: FormDataEntryValue | null) {
	if (typeof value !== "string") {
		return DEFAULT_NEXT_PATH;
	}

	if (!value.startsWith("/") || value.startsWith("//")) {
		return DEFAULT_NEXT_PATH;
	}

	return value;
}

function readTrimmedField(value: FormDataEntryValue | null) {
	return typeof value === "string" ? value.trim() : "";
}

function readRawField(value: FormDataEntryValue | null) {
	return typeof value === "string" ? value : "";
}

export async function signIn(formData: FormData) {
	const email = readTrimmedField(formData.get("email"));
	const password = readRawField(formData.get("password"));
	const nextPath = normalizeNextPath(formData.get("next"));

	if (!email || !password) {
		redirect(
			`/login?error=${encodeURIComponent("Email and password are required.")}&next=${encodeURIComponent(nextPath)}`,
		);
	}

	const supabase = await createServerSupabaseClient();
	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		redirect(
			`/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(nextPath)}`,
		);
	}

	redirect(nextPath);
}

export async function signUp(formData: FormData) {
	const email = readTrimmedField(formData.get("email"));
	const password = readRawField(formData.get("password"));

	if (!email || !password) {
		redirect(
			`/signup?error=${encodeURIComponent("Email and password are required.")}`,
		);
	}

	if (password.length < 8) {
		redirect(
			`/signup?error=${encodeURIComponent("Password must be at least 8 characters.")}`,
		);
	}

	const supabase = await createServerSupabaseClient();
	const { error } = await supabase.auth.signUp({
		email,
		password,
	});

	if (error) {
		redirect(`/signup?error=${encodeURIComponent(error.message)}`);
	}

	redirect(
		`/login?message=${encodeURIComponent("Signup successful. Check your email to confirm the account.")}`,
	);
}
