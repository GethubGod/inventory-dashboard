import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open?: boolean;
  }) => (open ? <div>{children}</div> : null),
  SheetContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTitle: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

import { Sidebar } from "@/components/layout/sidebar";
import { SidebarProvider } from "@/components/layout/sidebar-provider";

afterEach(cleanup);

beforeEach(() => {
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
  it("renders grouped nav and can expand/collapse a group", async () => {
    const user = userEvent.setup();
    renderSidebar();

    expect(screen.getByRole("button", { name: "Main group" })).toBeInTheDocument();
    const operationsGroup = screen.getByRole("button", { name: "Operations group" });

    expect(screen.getByRole("link", { name: "Overview" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Inventory" })).not.toBeInTheDocument();

    await user.click(operationsGroup);
    expect(screen.getByRole("link", { name: "Inventory" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Overview" })).not.toBeInTheDocument();

    await user.click(operationsGroup);
    expect(screen.queryByRole("link", { name: "Inventory" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Overview" })).not.toBeInTheDocument();
  });

  it("keeps the active child route group expanded", () => {
    renderSidebar("/dashboard/settings/preferences");

    expect(screen.getByRole("link", { name: "Preferences" })).toBeInTheDocument();
  });

  it("highlights the active child route", () => {
    renderSidebar("/dashboard/inventory");
    const inventoryLink = screen.getByRole("link", { name: "Inventory" });
    expect(inventoryLink.getAttribute("aria-current")).toBe("page");
  });

  it("renders Launch app label and does not render Connect Square label", () => {
    renderSidebar();
    expect(screen.getByRole("link", { name: "Launch app" })).toBeInTheDocument();
    expect(screen.queryByText("Connect Square")).not.toBeInTheDocument();
  });

  it("renders the sidebar search bar and utility icon buttons", () => {
    renderSidebar();
    expect(screen.getByRole("textbox", { name: /search navigation/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open notifications" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open messages" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open help" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open shortcuts" })).toBeInTheDocument();
  });
});
