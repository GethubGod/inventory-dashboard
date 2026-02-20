"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const SIDEBAR_STORAGE_KEY = "babytuna.sidebar.collapsed";

type SidebarContextValue = {
  desktopCollapsed: boolean;
  setDesktopCollapsed: (value: boolean) => void;
  toggleDesktopCollapsed: () => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

type SidebarProviderProps = {
  children: ReactNode;
};

export function SidebarProvider({ children }: SidebarProviderProps) {
  const pathname = usePathname();
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);

    if (storedValue !== null) {
      setDesktopCollapsed(storedValue === "true");
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(desktopCollapsed));
  }, [desktopCollapsed, hydrated]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const value = useMemo(
    () => ({
      desktopCollapsed,
      setDesktopCollapsed,
      toggleDesktopCollapsed: () => {
        setDesktopCollapsed((previous) => !previous);
      },
      mobileOpen,
      setMobileOpen,
    }),
    [desktopCollapsed, mobileOpen],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebarState() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebarState must be used within a SidebarProvider.");
  }

  return context;
}
