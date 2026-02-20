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
    <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
      {DASHBOARD_NAV_SECTIONS.map((section) => (
        <div key={section.title} className="space-y-1">
          <p
            className={cn(
              "px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground",
              collapsed && "sr-only",
            )}
          >
            {section.title}
          </p>

          <div className="space-y-0.5">
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
        "group relative flex h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors",
        collapsed ? "justify-center" : "justify-start",
        active
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
      )}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />

      <span
        className={cn(
          "ml-3 truncate transition-opacity duration-200",
          collapsed && "pointer-events-none w-0 opacity-0",
        )}
      >
        {item.label}
      </span>

      {item.comingSoon && !collapsed ? (
        <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          Soon
        </span>
      ) : null}

      {item.comingSoon && collapsed ? (
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-border" />
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
          "fixed inset-y-0 left-0 z-40 hidden border-r border-border bg-card transition-[width] duration-200 ease-in-out lg:flex lg:flex-col",
          desktopCollapsed ? "w-[68px]" : "w-[260px]",
        )}
      >
        <div
          className={cn(
            "flex h-14 items-center border-b border-border px-4",
            desktopCollapsed ? "justify-center" : "justify-start",
          )}
        >
          <Link
            href="/dashboard/overview"
            className={cn(
              "inline-flex items-center gap-2.5 font-semibold text-foreground",
              desktopCollapsed && "justify-center",
            )}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              BT
            </span>
            {!desktopCollapsed ? <span className="text-[15px]">Babytuna</span> : null}
          </Link>
        </div>

        <SidebarNav collapsed={desktopCollapsed} />

        <div className="border-t border-border p-2">
          <button
            type="button"
            onClick={toggleDesktopCollapsed}
            className={cn(
              "flex h-9 w-full items-center rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
              desktopCollapsed ? "justify-center" : "justify-start px-3",
            )}
          >
            {desktopCollapsed ? <PanelLeftOpen className="h-[18px] w-[18px]" /> : <PanelLeftClose className="h-[18px] w-[18px]" />}
            {!desktopCollapsed ? <span className="ml-3">Collapse</span> : null}
          </button>
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[260px] border-border bg-card p-0"
        >
          <SheetTitle className="sr-only">Dashboard Navigation</SheetTitle>
          <div className="flex h-14 items-center border-b border-border px-4">
            <Link href="/dashboard/overview" className="inline-flex items-center gap-2.5 font-semibold text-foreground">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                BT
              </span>
              <span className="text-[15px]">Babytuna</span>
            </Link>
          </div>
          <SidebarNav collapsed={false} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
