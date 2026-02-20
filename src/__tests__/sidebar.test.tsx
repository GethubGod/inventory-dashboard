import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock Next.js modules
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

let mockPathname = "/dashboard/overview";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

// Mock sheet to just render children
vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTitle: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

import { Sidebar } from "@/components/layout/sidebar";
import { SidebarProvider } from "@/components/layout/sidebar-provider";

afterEach(cleanup);

beforeEach(() => {
  // Ensure localStorage is available in jsdom
  const store: Record<string, string> = {};
  vi.stubGlobal("localStorage", {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach((k) => delete store[k]);
    }),
    length: 0,
    key: vi.fn(() => null),
  });
});

function renderSidebar(pathname = "/dashboard/overview") {
  mockPathname = pathname;
  return render(
    <SidebarProvider>
      <Sidebar />
    </SidebarProvider>,
  );
}

describe("Sidebar", () => {
  it("renders the Babytuna logo", () => {
    renderSidebar();
    expect(screen.getAllByText("BT").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Babytuna").length).toBeGreaterThan(0);
  });

  it("renders all nav section headers", () => {
    renderSidebar();
    for (const title of ["Main", "Data", "Integrations", "Analytics", "Settings"]) {
      expect(screen.getAllByText(title).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("renders nav links for all items", () => {
    renderSidebar();
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(13);
  });

  it("highlights the active route", () => {
    renderSidebar("/dashboard/inventory");
    const inventoryLinks = screen.getAllByText("Inventory");
    const hasActive = inventoryLinks.some((el) => {
      const link = el.closest("a");
      return link?.className.includes("bg-secondary") && link?.className.includes("text-foreground");
    });
    expect(hasActive).toBe(true);
  });

  it("shows 'Soon' badge for coming-soon items", () => {
    renderSidebar();
    const soonBadges = screen.getAllByText("Soon");
    expect(soonBadges.length).toBeGreaterThan(0);
  });

  it("uses semantic color tokens (no hardcoded teal/slate)", () => {
    const { container } = renderSidebar();
    const allClassNames = container.innerHTML;
    expect(allClassNames).not.toContain("bg-teal");
    expect(allClassNames).not.toContain("text-teal");
    expect(allClassNames).not.toContain("bg-slate");
    expect(allClassNames).not.toContain("text-slate");
  });
});
