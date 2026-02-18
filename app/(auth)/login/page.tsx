import Link from "next/link";
import { signIn } from "../actions";

type LoginPageProps = {
	searchParams?: Record<string, string | string[] | undefined>;
};

export default function LoginPage({ searchParams }: LoginPageProps) {
	const errorMessage =
		typeof searchParams?.error === "string" ? searchParams.error : undefined;
	const infoMessage =
		typeof searchParams?.message === "string"
			? searchParams.message
			: undefined;
	const nextParam =
		typeof searchParams?.next === "string" ? searchParams.next : undefined;

	const nextPath =
		nextParam?.startsWith("/") && !nextParam.startsWith("//")
			? nextParam
			: "/overview";

	return (
		<main className="space-y-5">
			<div className="space-y-1">
				<h1 className="text-2xl font-semibold text-slate-900">Log in</h1>
				<p className="text-sm text-slate-600">
					Use the same Supabase account as your mobile app.
				</p>
			</div>

			{errorMessage ? (
				<p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
					{errorMessage}
				</p>
			) : null}

			{infoMessage ? (
				<p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
					{infoMessage}
				</p>
			) : null}

			<form action={signIn} className="space-y-4">
				<input type="hidden" name="next" value={nextPath} />
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
						className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
					/>
				</div>

				<button
					type="submit"
					className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
				>
					Log in
				</button>
			</form>

			<p className="text-sm text-slate-600">
				No account yet?{" "}
				<Link
					href="/signup"
					className="font-medium text-brand-700 hover:text-brand-600"
				>
					Sign up
				</Link>
			</p>
		</main>
	);
}
