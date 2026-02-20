import { describe, expect, it } from "vitest";
import { DASHBOARD_NAV_SECTIONS, isActiveRoute } from "@/components/layout/dashboard-nav";

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

describe("DASHBOARD_NAV_SECTIONS", () => {
  it("has Main, Data, Integrations, Analytics, Settings sections", () => {
    const titles = DASHBOARD_NAV_SECTIONS.map((s) => s.title);
    expect(titles).toEqual(["Main", "Data", "Integrations", "Analytics", "Settings"]);
  });

  it("every item has label, href, and icon", () => {
    for (const section of DASHBOARD_NAV_SECTIONS) {
      for (const item of section.items) {
        expect(item.label).toBeTruthy();
        expect(item.href).toMatch(/^\/dashboard\//);
        expect(item.icon).toBeDefined();
      }
    }
  });

  it("marks forecast-related items as comingSoon", () => {
    const forecastItem = DASHBOARD_NAV_SECTIONS.flatMap((s) => s.items).find((i) => i.label === "Forecasts");
    expect(forecastItem?.comingSoon).toBe(true);
  });
});
