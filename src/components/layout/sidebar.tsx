"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import {
  DASHBOARD_NAV_SECTIONS,
  type DashboardNavItem,
  isActiveRoute,
} from "@/components/layout/dashboard-nav";
import { useSidebarState } from "@/components/layout/sidebar-provider";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type SidebarNavProps = {
  collapsed: boolean;
  onNavigate?: () => void;
};

function SidebarNav({ collapsed, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
      {DASHBOARD_NAV_SECTIONS.map((section) => (
        <div key={section.title} className="space-y-2">
          <p
            className={cn(
              "px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500",
              collapsed && "sr-only",
            )}
          >
            {section.title}
          </p>

          <div className="space-y-1">
            {section.items.map((item) => {
              const active = isActiveRoute(pathname, item.href);
              return (
                <SidebarNavItem
                  key={item.href}
                  item={item}
                  active={active}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

type SidebarNavItemProps = {
  item: DashboardNavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
};

function SidebarNavItem({ item, active, collapsed, onNavigate }: SidebarNavItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group relative flex h-10 items-center rounded-lg border px-2.5 text-sm font-medium transition-all duration-200",
        collapsed ? "justify-center" : "justify-start",
        active
          ? "border-[#0d9488]/20 bg-[#0d9488]/10 text-[#0d9488] dark:border-[#0d9488]/30 dark:bg-[#0d9488]/20 dark:text-teal-300"
          : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-100",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />

      <span
        className={cn(
          "ml-3 truncate transition-opacity duration-200",
          collapsed && "pointer-events-none w-0 opacity-0",
        )}
      >
        {item.label}
      </span>

      {item.comingSoon && !collapsed ? (
        <span className="ml-auto rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
          Coming Soon
        </span>
      ) : null}

      {item.comingSoon && collapsed ? (
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
      ) : null}
    </Link>
  );
}

export function Sidebar() {
  const { desktopCollapsed, toggleDesktopCollapsed, mobileOpen, setMobileOpen } = useSidebarState();

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-slate-200/80 bg-slate-100/95 backdrop-blur transition-[width] duration-200 ease-in-out dark:border-slate-800 dark:bg-[#0f172a]/95 lg:flex lg:flex-col",
          desktopCollapsed ? "w-[68px]" : "w-[280px]",
        )}
      >
        <div
          className={cn(
            "flex h-16 items-center border-b border-slate-200/80 px-4 dark:border-slate-800",
            desktopCollapsed ? "justify-center" : "justify-start",
          )}
        >
          <Link
            href="/dashboard/overview"
            className={cn(
              "inline-flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100",
              desktopCollapsed && "justify-center",
            )}
          >
            <span className="text-xl leading-none">🐟</span>
            {!desktopCollapsed ? <span className="text-base">Babytuna</span> : null}
          </Link>
        </div>

        <SidebarNav collapsed={desktopCollapsed} />

        <div className="border-t border-slate-200/80 p-2 dark:border-slate-800">
          <button
            type="button"
            onClick={toggleDesktopCollapsed}
            className={cn(
              "flex h-10 w-full items-center rounded-lg border border-transparent text-sm font-medium text-slate-600 transition-colors hover:border-slate-200 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-100",
              desktopCollapsed ? "justify-center" : "justify-start px-2.5",
            )}
          >
            {desktopCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            {!desktopCollapsed ? <span className="ml-3">Collapse Sidebar</span> : null}
          </button>
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[280px] border-slate-200/80 bg-slate-100 p-0 dark:border-slate-800 dark:bg-[#0f172a]"
        >
          <SheetTitle className="sr-only">Dashboard Navigation</SheetTitle>
          <div className="flex h-16 items-center border-b border-slate-200/80 px-4 dark:border-slate-800">
            <Link href="/dashboard/overview" className="inline-flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
              <span className="text-xl leading-none">🐟</span>
              <span className="text-base">Babytuna</span>
            </Link>
          </div>
          <SidebarNav collapsed={false} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
