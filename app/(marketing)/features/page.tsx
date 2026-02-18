const features = [
	{
		title: "Desktop Onboarding Workflow",
		description:
			"Connect Square, upload historical files, and validate normalized data through high-volume tables.",
	},
	{
		title: "Recipe Mapping Workspace",
		description:
			"Pair menu items with ingredient usage and save partial progress while teams calibrate mappings.",
	},
	{
		title: "Forecast Transparency",
		description:
			"Expose prediction accuracy, stock timelines, and adjustment behavior to build manager trust.",
	},
	{
		title: "Data Cleanup Utilities",
		description:
			"Flag duplicate inventory items, unmapped sales items, and anomalies that should be excluded.",
	},
];

export default function FeaturesPage() {
	return (
		<div className="mx-auto w-full max-w-5xl px-6 py-16">
			<div className="space-y-3">
				<h1 className="text-3xl font-bold tracking-tight text-slate-900">
					Features
				</h1>
				<p className="max-w-3xl text-slate-600">
					Built for ops managers who need keyboard-first tools for setup,
					cleanup, and forecast decisions.
				</p>
			</div>
			<div className="mt-10 grid gap-5 md:grid-cols-2">
				{features.map((feature) => (
					<article
						key={feature.title}
						className="rounded-xl border border-slate-200 bg-white p-6"
					>
						<h2 className="text-lg font-semibold text-slate-900">
							{feature.title}
						</h2>
						<p className="mt-2 text-sm text-slate-600">{feature.description}</p>
					</article>
				))}
			</div>
		</div>
	);
}
