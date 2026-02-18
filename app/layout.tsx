import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
	title: {
		default: "Babytuna Web",
		template: "%s | Babytuna Web",
	},
	description: "Restaurant onboarding, recipe mapping, and analytics portal.",
};

export default function RootLayout({
	children,
}: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en">
			<body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
				{children}
			</body>
		</html>
	);
}
