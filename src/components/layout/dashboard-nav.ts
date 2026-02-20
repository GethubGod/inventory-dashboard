import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  ChefHat,
  CreditCard,
  Crosshair,
  LayoutDashboard,
  Package,
  Settings,
  Smartphone,
  Target,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type DashboardNavGroup = {
  id: string;
  label: string;
  icon: LucideIcon;
  items: DashboardNavItem[];
};

export const DASHBOARD_NAV_GROUPS: DashboardNavGroup[] = [
  {
    id: "main",
    label: "Main",
    icon: LayoutDashboard,
    items: [
      { label: "Overview", href: "/dashboard/overview", icon: LayoutDashboard },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    icon: Package,
    items: [
      { label: "Inventory", href: "/dashboard/inventory", icon: Package },
      { label: "Import Data", href: "/dashboard/import", icon: Upload },
      { label: "Calibration", href: "/dashboard/calibration", icon: Target },
    ],
  },
  {
    id: "recipes",
    label: "Recipes",
    icon: ChefHat,
    items: [
      { label: "Recipes", href: "/dashboard/recipes", icon: ChefHat },
      { label: "Forecasts", href: "/dashboard/forecasts", icon: TrendingUp },
    ],
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: CreditCard,
    items: [
      { label: "Square POS", href: "/dashboard/square", icon: CreditCard },
      { label: "Mobile App", href: "/dashboard/app-connection", icon: Smartphone },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    items: [
      { label: "Sales Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { label: "Accuracy", href: "/dashboard/accuracy", icon: Crosshair },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    items: [
      { label: "Organization", href: "/dashboard/settings/organization", icon: Building2 },
      { label: "Users & Roles", href: "/dashboard/settings/users", icon: Users },
      { label: "Preferences", href: "/dashboard/settings/preferences", icon: Settings },
    ],
  },
];

export const DASHBOARD_NAV_ITEMS = DASHBOARD_NAV_GROUPS.flatMap((group) => group.items);

export const DASHBOARD_NAV_BY_HREF = new Map(
  DASHBOARD_NAV_ITEMS.map((item) => [item.href, item] as const),
);

export function isActiveRoute(pathname: string, href: string) {
  if (pathname === href) {
    return true;
  }

  return pathname.startsWith(`${href}/`);
}

export function isGroupActive(pathname: string, group: DashboardNavGroup) {
  return group.items.some((item) => isActiveRoute(pathname, item.href));
}
