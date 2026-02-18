import Link from "next/link";
import { signUp } from "../actions";

type SignUpPageProps = {
	searchParams?: Record<string, string | string[] | undefined>;
};

export default function SignUpPage({ searchParams }: SignUpPageProps) {
	const errorMessage =
		typeof searchParams?.error === "string" ? searchParams.error : undefined;

	return (
		<main className="space-y-5">
			<div className="space-y-1">
				<h1 className="text-2xl font-semibold text-slate-900">
					Create account
				</h1>
				<p className="text-sm text-slate-600">
					This account can sign into both mobile and web using Supabase Auth.
				</p>
			</div>

			{errorMessage ? (
				<p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
					{errorMessage}
				</p>
			) : null}

			<form action={signUp} className="space-y-4">
				<div className="space-y-1">
					<label htmlFor="email" className="text-sm font-medium text-slate-700">
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
					/>
				</div>

				<div className="space-y-1">
					<label
						htmlFor="password"
						className="text-sm font-medium text-slate-700"
					>
						Password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						minLength={8}
						className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
					/>
					<p className="text-xs text-slate-500">Use at least 8 characters.</p>
				</div>

				<button
					type="submit"
					className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
				>
					Create account
				</button>
			</form>

			<p className="text-sm text-slate-600">
				Already have an account?{" "}
				<Link
					href="/login"
					className="font-medium text-brand-700 hover:text-brand-600"
				>
					Log in
				</Link>
			</p>
		</main>
	);
}
