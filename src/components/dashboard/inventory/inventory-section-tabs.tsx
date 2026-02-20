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
    <div className="inline-flex h-10 items-center rounded-lg border border-border bg-card p-1">
      {TAB_ITEMS.map((tab) => {
        const active = tab.match(pathname);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
