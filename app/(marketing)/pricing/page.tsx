const tiers = [
	{
		name: "Starter",
		price: "$0/mo",
		details: "For initial pilot locations and onboarding tests.",
		points: ["1 location", "Core onboarding flow", "Forecast basics"],
	},
	{
		name: "Operations",
		price: "$99/mo",
		details:
			"For active restaurants that need forecasting and cleanup tooling.",
		points: [
			"Up to 5 locations",
			"Recipe mapping + calibration",
			"Analytics dashboards",
		],
	},
	{
		name: "Enterprise",
		price: "Custom",
		details: "For multi-brand groups needing custom integration support.",
		points: [
			"Unlimited locations",
			"Dedicated support",
			"Custom implementation plan",
		],
	},
];

export default function PricingPage() {
	return (
		<div className="mx-auto w-full max-w-6xl px-6 py-16">
			<div className="space-y-3 text-center">
				<h1 className="text-3xl font-bold tracking-tight text-slate-900">
					Pricing
				</h1>
				<p className="mx-auto max-w-2xl text-slate-600">
					Start with a pilot and upgrade as locations, data volume, and
					forecasting complexity grow.
				</p>
			</div>
			<div className="mt-10 grid gap-6 md:grid-cols-3">
				{tiers.map((tier) => (
					<article
						key={tier.name}
						className="rounded-xl border border-slate-200 bg-white p-6"
					>
						<h2 className="text-xl font-semibold text-slate-900">
							{tier.name}
						</h2>
						<p className="mt-2 text-3xl font-bold text-brand-700">
							{tier.price}
						</p>
						<p className="mt-2 text-sm text-slate-600">{tier.details}</p>
						<ul className="mt-5 space-y-2 text-sm text-slate-700">
							{tier.points.map((point) => (
								<li key={point}>- {point}</li>
							))}
						</ul>
					</article>
				))}
			</div>
		</div>
	);
}
