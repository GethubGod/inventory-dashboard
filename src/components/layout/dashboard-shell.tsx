"use client";

import { Header } from "@/components/layout/header";
import { PageTransition } from "@/components/layout/page-transition";
import { Sidebar } from "@/components/layout/sidebar";
import {
  SidebarProvider,
  useSidebarState,
} from "@/components/layout/sidebar-provider";
import { cn } from "@/lib/utils";

function DashboardShellInner({ children }: { children: React.ReactNode }) {
  const { desktopCollapsed } = useSidebarState();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#111827] dark:text-slate-100">
      <Sidebar />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding-left] duration-200 ease-in-out",
          desktopCollapsed ? "lg:pl-[68px]" : "lg:pl-[280px]",
        )}
      >
        <Header />
        <main className="flex-1 px-4 py-4 lg:px-6 lg:py-6">
          <div className="mx-auto w-full max-w-[1400px]">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardShellInner>{children}</DashboardShellInner>
    </SidebarProvider>
  );
}
