import Link from "next/link";

const cards = [
	{
		title: "Onboarding Progress",
		description:
			"Connect Square and complete recipe mapping to activate forecasts.",
		href: "/onboarding",
		cta: "Go to onboarding",
	},
	{
		title: "Data Quality",
		description:
			"Review unmapped and duplicate items before Phase 3 tools launch.",
		href: "/data",
		cta: "Open data tools",
	},
	{
		title: "Forecast Visibility",
		description:
			"Analytics dashboards are scaffolded and ready for Phase 4 metrics.",
		href: "/analytics",
		cta: "View analytics",
	},
];

export default function OverviewPage() {
	return (
		<main className="space-y-6">
			<header className="space-y-1">
				<h1 className="text-2xl font-semibold text-slate-900">Overview</h1>
				<p className="text-sm text-slate-600">
					Phase 1 foundation is active: auth, protected routes, and desktop
					dashboard shell.
				</p>
			</header>

			<div className="grid gap-4 md:grid-cols-3">
				{cards.map((card) => (
					<article
						key={card.title}
						className="rounded-lg border border-slate-200 p-4"
					>
						<h2 className="text-base font-semibold text-slate-900">
							{card.title}
						</h2>
						<p className="mt-2 text-sm text-slate-600">{card.description}</p>
						<Link
							href={card.href}
							className="mt-4 inline-block text-sm font-medium text-brand-700"
						>
							{card.cta}
						</Link>
					</article>
				))}
			</div>
		</main>
	);
}
