"use client";

import { AppShell } from "@/components/layout/app-shell";
import {
  SidebarProvider,
} from "@/components/layout/sidebar-provider";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppShell>{children}</AppShell>
    </SidebarProvider>
  );
}
