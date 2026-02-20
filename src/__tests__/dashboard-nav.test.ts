import { describe, expect, it } from "vitest";
import {
  DASHBOARD_NAV_GROUPS,
  DASHBOARD_NAV_ITEMS,
  isActiveRoute,
  isGroupActive,
} from "@/components/layout/dashboard-nav";

describe("isActiveRoute", () => {
  it("returns true for exact match", () => {
    expect(isActiveRoute("/dashboard/overview", "/dashboard/overview")).toBe(true);
  });

  it("returns true for child route", () => {
    expect(isActiveRoute("/dashboard/settings/organization", "/dashboard/settings")).toBe(true);
  });

  it("returns false for different routes", () => {
    expect(isActiveRoute("/dashboard/inventory", "/dashboard/overview")).toBe(false);
  });

  it("returns false for partial prefix that is not a child", () => {
    expect(isActiveRoute("/dashboard/overview-extra", "/dashboard/overview")).toBe(false);
  });
});

describe("DASHBOARD_NAV_GROUPS", () => {
  it("matches the grouped structure", () => {
    const labels = DASHBOARD_NAV_GROUPS.map((group) => group.label);
    expect(labels).toEqual([
      "Main",
      "Operations",
      "Recipes",
      "Integrations",
      "Analytics",
      "Settings",
    ]);
  });

  it("every child has label, href, and icon", () => {
    for (const group of DASHBOARD_NAV_GROUPS) {
      expect(group.id).toBeTruthy();
      expect(group.label).toBeTruthy();
      expect(group.icon).toBeDefined();

      for (const item of group.items) {
        expect(item.label).toBeTruthy();
        expect(item.href).toMatch(/^\/dashboard\//);
        expect(item.icon).toBeDefined();
      }
    }
  });

  it("keeps nav index aligned to grouped items", () => {
    const flattenedCount = DASHBOARD_NAV_GROUPS.flatMap((group) => group.items).length;
    expect(DASHBOARD_NAV_ITEMS).toHaveLength(flattenedCount);
  });
});

describe("isGroupActive", () => {
  it("returns true when any child in group is active", () => {
    const operations = DASHBOARD_NAV_GROUPS.find((group) => group.id === "operations");
    expect(operations).toBeDefined();
    expect(isGroupActive("/dashboard/import", operations!)).toBe(true);
  });

  it("returns false when no child is active", () => {
    const analytics = DASHBOARD_NAV_GROUPS.find((group) => group.id === "analytics");
    expect(analytics).toBeDefined();
    expect(isGroupActive("/dashboard/settings/preferences", analytics!)).toBe(false);
  });
});

