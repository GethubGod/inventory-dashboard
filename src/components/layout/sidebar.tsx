"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Bell,
  ChevronRight,
  CircleHelp,
  CreditCard,
  MenuSquare,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sparkles,
} from "lucide-react";

import {
  DASHBOARD_NAV_GROUPS,
  DASHBOARD_NAV_ITEMS,
  type DashboardNavGroup,
  type DashboardNavItem,
  isActiveRoute,
} from "@/components/layout/dashboard-nav";
import {
  SIDEBAR_COLLAPSED_WIDTH_CLASS,
  SIDEBAR_EXPANDED_WIDTH_CLASS,
  SIDEBAR_MOBILE_WIDTH_CLASS,
} from "@/components/layout/sidebar-dimensions";
import { useSidebarState } from "@/components/layout/sidebar-provider";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const SIDEBAR_UTILITY_ITEMS = [
  { label: "Open notifications", icon: Bell },
  { label: "Open messages", icon: MessageCircle },
  { label: "Open help", icon: CircleHelp },
  { label: "Open shortcuts", icon: Sparkles },
] as const;

type SidebarGroupProps = {
  group: DashboardNavGroup;
  activeItemHrefSet: Set<string>;
  open: boolean;
  active: boolean;
  onToggle: (groupId: string, nextOpen: boolean) => void;
  onNavigate?: () => void;
};

const SidebarGroup = memo(function SidebarGroup({
  group,
  activeItemHrefSet,
  open,
  active,
  onToggle,
  onNavigate,
}: SidebarGroupProps) {
  const GroupIcon = group.icon;

  return (
    <Collapsible open={open} onOpenChange={(nextOpen) => onToggle(group.id, nextOpen)}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-12 w-full items-center rounded-2xl px-4 text-left text-[16px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            active
              ? "bg-secondary text-foreground"
              : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
          )}
          aria-label={`${group.label} group`}
          data-testid={`sidebar-group-${group.id}`}
        >
          <GroupIcon className="h-5 w-5 shrink-0" />
          <span className="ml-3 truncate">{group.label}</span>
          <ChevronRight
            className={cn(
              "ml-auto h-[18px] w-[18px] shrink-0 text-muted-foreground transition-transform duration-200",
              open && "rotate-90",
            )}
          />
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="mt-1 space-y-1 pb-1 pl-9 pr-2">
          {group.items.map((item) => {
            const itemActive = activeItemHrefSet.has(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={itemActive ? "page" : undefined}
                className={cn(
                  "flex h-10 items-center rounded-xl px-3 text-[15px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  itemActive
                    ? "bg-secondary text-foreground"
                    : "font-normal text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                )}
              >
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
});

const CollapsedSidebarItem = memo(function CollapsedSidebarItem({
  item,
  active,
  onNavigate,
}: {
  item: DashboardNavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={item.label}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-11 items-center justify-center rounded-2xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
    </Link>
  );
});

function SidebarExpandedNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const activeItemHrefSet = useMemo(() => {
    return new Set(
      DASHBOARD_NAV_ITEMS.filter((item) => isActiveRoute(pathname, item.href)).map((item) => item.href),
    );
  }, [pathname]);
  const activeGroupId = useMemo(() => {
    const activeGroup = DASHBOARD_NAV_GROUPS.find((group) =>
      group.items.some((item) => activeItemHrefSet.has(item.href)),
    );
    return activeGroup?.id ?? null;
  }, [activeItemHrefSet]);

  const [openGroupId, setOpenGroupId] = useState<string | null>(() => activeGroupId);

  useEffect(() => {
    if (!activeGroupId) {
      return;
    }

    setOpenGroupId(activeGroupId);
  }, [activeGroupId]);

  const toggleGroup = useCallback((groupId: string, nextOpen: boolean) => {
    setOpenGroupId(nextOpen ? groupId : null);
  }, []);

  return (
    <nav
      className="flex-1 overflow-y-auto px-3 pb-5 pt-4"
      data-testid="sidebar-nav-scroll-region"
      aria-label="Sidebar navigation"
    >
      <div className="space-y-2">
        {DASHBOARD_NAV_GROUPS.map((group) => {
          const active = activeGroupId === group.id;
          const open = openGroupId === group.id;

          return (
            <SidebarGroup
              key={group.id}
              group={group}
              activeItemHrefSet={activeItemHrefSet}
              open={open}
              active={active}
              onToggle={toggleGroup}
              onNavigate={onNavigate}
            />
          );
        })}
      </div>
    </nav>
  );
}

function SidebarCollapsedNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const activeItemHrefSet = useMemo(() => {
    return new Set(
      DASHBOARD_NAV_ITEMS.filter((item) => isActiveRoute(pathname, item.href)).map((item) => item.href),
    );
  }, [pathname]);

  return (
    <nav
      className="flex-1 overflow-y-auto px-2 pb-5 pt-4"
      data-testid="sidebar-nav-scroll-region"
      aria-label="Sidebar navigation"
    >
      <div className="space-y-1.5">
        {DASHBOARD_NAV_ITEMS.map((item) => (
          <CollapsedSidebarItem
            key={item.href}
            item={item}
            active={activeItemHrefSet.has(item.href)}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </nav>
  );
}

type SidebarContentProps = {
  collapsed: boolean;
  onNavigate?: () => void;
  onToggleCollapse?: () => void;
  showCollapseToggle?: boolean;
};

function SidebarContent({
  collapsed,
  onNavigate,
  onToggleCollapse,
  showCollapseToggle = false,
}: SidebarContentProps) {
  return (
    <>
      <div className={cn("border-b border-sidebar-border px-4 pb-4 pt-5", collapsed && "px-3")}>
        <Link
          href="/dashboard/overview"
          onClick={onNavigate}
          className={cn("inline-flex items-center gap-3 text-foreground", collapsed && "w-full justify-center")}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-[#eed188] text-sm font-semibold text-foreground">
            BT
          </span>
          {!collapsed ? (
            <span className="flex flex-col">
              <span className="text-base font-semibold leading-tight text-foreground">Babytuna Systems</span>
              <span className="text-sm text-muted-foreground">@babytuna</span>
            </span>
          ) : null}
        </Link>
      </div>

      <div className={cn("px-4 pb-1 pt-4", collapsed && "px-3")}>
        {collapsed ? (
          <div className="flex justify-center">
            <IconButton variant="subtle" size="md" aria-label="Search navigation">
              <Search className="h-5 w-5" />
            </IconButton>
          </div>
        ) : (
          <label className="relative block">
            <span className="sr-only">Search navigation</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search navigation"
              placeholder="Search"
              className="h-11 rounded-full border-border bg-background pl-10 pr-4 text-sm"
            />
          </label>
        )}
      </div>

      {collapsed ? (
        <SidebarCollapsedNav onNavigate={onNavigate} />
      ) : (
        <SidebarExpandedNav onNavigate={onNavigate} />
      )}

      <div className="border-t border-sidebar-border p-3">
        <Button
          asChild
          className={cn(
            "h-12 w-full rounded-full text-[17px] font-semibold",
            collapsed && "h-11 w-11 rounded-full px-0",
          )}
        >
          <Link href="/dashboard/square" onClick={onNavigate} aria-label="Launch app">
            <CreditCard className="h-5 w-5 shrink-0" />
            {!collapsed ? <span>Launch app</span> : null}
          </Link>
        </Button>

        <div className={cn("mt-3 flex items-center", collapsed ? "flex-col gap-2" : "justify-between")}>
          {SIDEBAR_UTILITY_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <IconButton key={item.label} aria-label={item.label} variant="ghost" size="md">
                <Icon className="h-5 w-5" />
              </IconButton>
            );
          })}
        </div>

        {showCollapseToggle ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              "mt-2 inline-flex h-10 w-full items-center rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
              collapsed && "justify-center px-0",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            {!collapsed ? <span className="ml-2">Collapse</span> : null}
          </button>
        ) : null}
      </div>
    </>
  );
}

export function Sidebar() {
  const { desktopCollapsed, toggleDesktopCollapsed, mobileOpen, setMobileOpen } = useSidebarState();

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ease-in-out lg:flex lg:flex-col",
          desktopCollapsed ? SIDEBAR_COLLAPSED_WIDTH_CLASS : SIDEBAR_EXPANDED_WIDTH_CLASS,
        )}
      >
        <SidebarContent
          collapsed={desktopCollapsed}
          onToggleCollapse={toggleDesktopCollapsed}
          showCollapseToggle
        />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className={cn(SIDEBAR_MOBILE_WIDTH_CLASS, "border-sidebar-border bg-sidebar p-0")}
        >
          <SheetTitle className="sr-only">Dashboard Navigation</SheetTitle>
          <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
          <div className="border-t border-sidebar-border px-3 py-2">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <MenuSquare className="h-[18px] w-[18px]" />
              Close menu
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
