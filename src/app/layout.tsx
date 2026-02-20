import type { Metadata } from "next";
import { Toaster } from "sonner";

import { QueryProvider } from "@/components/providers/query-provider";
import { SupabaseProvider } from "@/components/providers/supabase-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Babytuna Systems",
  description: "B2B SaaS portal for restaurant inventory operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <QueryProvider>
            <SupabaseProvider>
              {children}
              <Toaster position="top-right" richColors />
            </SupabaseProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
