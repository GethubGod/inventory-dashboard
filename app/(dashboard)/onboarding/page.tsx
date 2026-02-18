import Link from "next/link";

export default function OnboardingPage() {
	const steps = [
		{ href: "/onboarding/connect-square", label: "1. Connect Square" },
		{ href: "/onboarding/upload-data", label: "2. Upload Historical Data" },
		{ href: "/onboarding/recipe-mapping", label: "3. Recipe Mapping" },
		{ href: "/onboarding/preferences", label: "4. Preferences" },
	];

	return (
		<main className="space-y-3">
			<h1 className="text-2xl font-semibold text-slate-900">Onboarding</h1>
			<p className="text-sm text-slate-600">
				Phase 2 target: Square connection, historical upload, recipe mapping,
				preferences, and activation review.
			</p>
			<ul className="space-y-2 pt-3 text-sm text-brand-700">
				{steps.map((step) => (
					<li key={step.href}>
						<Link href={step.href} className="font-medium hover:text-brand-600">
							{step.label}
						</Link>
					</li>
				))}
			</ul>
		</main>
	);
}
