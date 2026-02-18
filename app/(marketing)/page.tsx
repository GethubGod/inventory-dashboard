import Link from "next/link";

export default function MarketingHomePage() {
	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 py-20">
			<section className="grid items-center gap-10 lg:grid-cols-2">
				<div className="space-y-6">
					<p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
						Inventory Intelligence for Restaurants
					</p>
					<h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
						Set up faster forecasts with clean recipe mappings.
					</h1>
					<p className="max-w-xl text-lg text-slate-600">
						Babytuna helps operations teams onboard locations, connect Square
						data, map recipes, and track forecast performance from one
						desktop-first portal.
					</p>
					<div className="flex items-center gap-4">
						<Link
							href="/signup"
							className="rounded-md bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700"
						>
							Create Account
						</Link>
						<Link
							href="/features"
							className="rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:text-slate-900"
						>
							Explore Features
						</Link>
					</div>
				</div>
				<div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
					<h2 className="text-base font-semibold text-slate-900">
						Phase 1 Foundation Includes
					</h2>
					<ul className="mt-4 space-y-3 text-sm text-slate-600">
						<li>Supabase auth setup with protected routes and middleware</li>
						<li>
							Dashboard layout scaffold for onboarding and analytics sections
						</li>
						<li>Marketing pages for product messaging and pricing</li>
					</ul>
				</div>
			</section>

			<section className="grid gap-6 md:grid-cols-3">
				{[
					{
						title: "Onboarding Wizard",
						text: "Guide each restaurant from Square connection to recipe mapping and activation.",
					},
					{
						title: "Data Cleanup Tools",
						text: "Resolve duplicates, unmapped items, and anomalies before they damage forecasts.",
					},
					{
						title: "Analytics Dashboard",
						text: "Track forecast accuracy, usage trends, and suggestion acceptance over time.",
					},
				].map((item) => (
					<article
						key={item.title}
						className="rounded-xl border border-slate-200 bg-white p-6"
					>
						<h3 className="text-lg font-semibold text-slate-900">
							{item.title}
						</h3>
						<p className="mt-2 text-sm text-slate-600">{item.text}</p>
					</article>
				))}
			</section>
		</div>
	);
}
