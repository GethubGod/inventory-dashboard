"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
	{ href: "/overview", label: "Overview" },
	{ href: "/onboarding", label: "Onboarding" },
	{ href: "/recipes", label: "Recipes" },
	{ href: "/inventory", label: "Inventory" },
	{ href: "/forecasts", label: "Forecasts" },
	{ href: "/analytics", label: "Analytics" },
	{ href: "/calibration", label: "Calibration" },
	{ href: "/data", label: "Data Tools" },
	{ href: "/settings", label: "Settings" },
];

export function DashboardSidebar() {
	const pathname = usePathname();

	return (
		<nav className="space-y-1">
			{navItems.map((item) => {
				const isActive =
					pathname === item.href || pathname.startsWith(`${item.href}/`);

				return (
					<Link
						key={item.href}
						href={item.href}
						className={cn(
							"block rounded-md px-3 py-2 text-sm font-medium transition-colors",
							isActive
								? "bg-brand-100 text-brand-700"
								: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
						)}
					>
						{item.label}
					</Link>
				);
			})}
		</nav>
	);
}
