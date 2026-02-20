"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  UserCircle2,
} from "lucide-react";

import { DashboardBreadcrumbs } from "@/components/layout/breadcrumbs";
import { useSidebarState } from "@/components/layout/sidebar-provider";
import { useSupabase } from "@/components/providers/supabase-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/use-user";

export function TopBar() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { setMobileOpen } = useSidebarState();
  const { supabase } = useSupabase();
  const { user, organization, profile } = useUser();

  const isDark = resolvedTheme === "dark";

  const initialsFromName = profile?.full_name
    ?.split(" ")
    .slice(0, 2)
    .map((segment) => segment.charAt(0).toUpperCase())
    .join("");

  const initialsFromEmail = user?.email
    ?.split("@")
    .at(0)
    ?.split(/[._-]/)
    .slice(0, 2)
    .map((segment) => segment.charAt(0).toUpperCase())
    .join("");

  const initials = initialsFromName || initialsFromEmail || "BT";

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg-app/95 backdrop-blur">
      <div className="flex h-[60px] items-center justify-between px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <DashboardBreadcrumbs />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary md:inline-flex">
                <span className="max-w-[180px] truncate">{organization?.name ?? "Organization"}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Organization</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{organization?.name ?? "Default workspace"}</DropdownMenuItem>
              <DropdownMenuItem disabled>Additional workspaces coming soon</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-2 rounded-full p-0.5 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="truncate">{user?.email ?? "User"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/dashboard/settings/users")}>
                <UserCircle2 className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard/settings/preferences")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
