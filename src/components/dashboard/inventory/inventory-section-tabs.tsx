"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const TAB_ITEMS = [
  {
    label: "Items",
    href: "/dashboard/inventory",
    match: (pathname: string) =>
      pathname === "/dashboard/inventory" || !pathname.startsWith("/dashboard/inventory/suppliers"),
  },
  {
    label: "Suppliers",
    href: "/dashboard/inventory/suppliers",
    match: (pathname: string) => pathname.startsWith("/dashboard/inventory/suppliers"),
  },
] as const;

export function InventorySectionTabs() {
  const pathname = usePathname();

  return (
    <div className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
      {TAB_ITEMS.map((tab) => {
        const active = tab.match(pathname);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-[#0d9488]/15 text-[#0d9488]"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
