"use client";

import { PageTransition } from "@/components/layout/page-transition";
import { Sidebar } from "@/components/layout/sidebar";
import {
  APP_CONTENT_COLLAPSED_OFFSET_CLASS,
  APP_CONTENT_EXPANDED_OFFSET_CLASS,
} from "@/components/layout/sidebar-dimensions";
import { TopBar } from "@/components/layout/top-bar";
import { useSidebarState } from "@/components/layout/sidebar-provider";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { desktopCollapsed } = useSidebarState();

  return (
    <div className="min-h-screen bg-bg-app text-text">
      <Sidebar />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding-left] duration-200 ease-in-out",
          desktopCollapsed ? APP_CONTENT_COLLAPSED_OFFSET_CLASS : APP_CONTENT_EXPANDED_OFFSET_CLASS,
        )}
      >
        <TopBar />
        <main className="flex-1 px-4 py-6 lg:px-7 lg:py-8">
          <div className="mx-auto w-full max-w-[1500px]">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}
