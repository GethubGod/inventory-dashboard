import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
			<div className="w-full max-w-md space-y-6">
				<Link
					href="/"
					className="block text-center text-lg font-semibold text-slate-900"
				>
					Babytuna
				</Link>
				<div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
					{children}
				</div>
			</div>
		</div>
	);
}
