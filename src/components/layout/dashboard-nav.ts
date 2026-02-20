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
  comingSoon?: boolean;
};

export type DashboardNavSection = {
  title: string;
  items: DashboardNavItem[];
};

export const DASHBOARD_NAV_SECTIONS: DashboardNavSection[] = [
  {
    title: "Main",
    items: [
      { label: "Overview", href: "/dashboard/overview", icon: LayoutDashboard },
      { label: "Inventory", href: "/dashboard/inventory", icon: Package },
      { label: "Forecasts", href: "/dashboard/forecasts", icon: TrendingUp, comingSoon: true },
    ],
  },
  {
    title: "Data",
    items: [
      { label: "Import Data", href: "/dashboard/import", icon: Upload },
      { label: "Recipes", href: "/dashboard/recipes", icon: ChefHat },
      { label: "Calibration", href: "/dashboard/calibration", icon: Target, comingSoon: true },
    ],
  },
  {
    title: "Integrations",
    items: [
      { label: "Square POS", href: "/dashboard/square", icon: CreditCard },
      { label: "Mobile App", href: "/dashboard/app-connection", icon: Smartphone, comingSoon: true },
    ],
  },
  {
    title: "Analytics",
    items: [
      { label: "Sales Analytics", href: "/dashboard/analytics", icon: BarChart3, comingSoon: true },
      { label: "Accuracy", href: "/dashboard/accuracy", icon: Crosshair, comingSoon: true },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Organization", href: "/dashboard/settings/organization", icon: Building2 },
      { label: "Users & Roles", href: "/dashboard/settings/users", icon: Users },
      { label: "Preferences", href: "/dashboard/settings/preferences", icon: Settings },
    ],
  },
];

export const DASHBOARD_NAV_ITEMS = DASHBOARD_NAV_SECTIONS.flatMap((section) => section.items);

export const DASHBOARD_NAV_BY_HREF = new Map(
  DASHBOARD_NAV_ITEMS.map((item) => [item.href, item] as const),
);

export function isActiveRoute(pathname: string, href: string) {
  if (pathname === href) {
    return true;
  }

  return pathname.startsWith(`${href}/`);
}
