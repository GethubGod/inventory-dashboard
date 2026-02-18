import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
	{ href: "/features", label: "Features" },
	{ href: "/pricing", label: "Pricing" },
	{ href: "/login", label: "Log in" },
];

export default function MarketingLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<div className="min-h-screen bg-slate-50">
			<header className="border-b border-slate-200 bg-white">
				<div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
					<Link
						href="/"
						className="text-lg font-semibold tracking-tight text-slate-900"
					>
						Babytuna
					</Link>
					<nav className="flex items-center gap-6 text-sm text-slate-600">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="hover:text-slate-900"
							>
								{item.label}
							</Link>
						))}
						<Link
							href="/signup"
							className="rounded-md bg-brand-600 px-3 py-2 font-medium text-white hover:bg-brand-700"
						>
							Start Free
						</Link>
					</nav>
				</div>
			</header>
			<main>{children}</main>
			<footer className="border-t border-slate-200 bg-white">
				<div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 text-xs text-slate-500">
					<p>Restaurant onboarding, recipe mapping, and inventory analytics.</p>
					<p>Babytuna Web</p>
				</div>
			</footer>
		</div>
	);
}
