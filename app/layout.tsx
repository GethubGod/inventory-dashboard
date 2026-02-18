export const metadata = {
  title: "Babytuna Web",
  description: "Restaurant onboarding, recipe mapping, and analytics portal.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
