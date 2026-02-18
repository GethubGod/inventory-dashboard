import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { signOut } from "./actions";

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const supabase = await createServerSupabaseClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	return (
		<div className="min-h-screen bg-slate-100">
			<div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
				<aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
					<div className="mb-6 space-y-1">
						<p className="text-xs font-medium uppercase tracking-wide text-slate-500">
							Babytuna
						</p>
						<p className="text-sm font-semibold text-slate-900">{user.email}</p>
					</div>
					<DashboardSidebar />
					<form
						action={signOut}
						className="mt-6 border-t border-slate-200 pt-4"
					>
						<button
							type="submit"
							className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
						>
							Sign out
						</button>
					</form>
				</aside>
				<section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
					{children}
				</section>
			</div>
		</div>
	);
}
