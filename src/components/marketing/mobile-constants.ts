"use client";

import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────
// Shared layout constants for mobile-aware components
// ─────────────────────────────────────────────────

export const MOBILE_BREAKPOINT = 768;  // px — matches Tailwind's md:
export const MOBILE_NAV_H = 60;       // h-[60px] on mobile header
export const DESKTOP_NAV_H = 72;      // lg:h-[72px] on desktop header
export const SAFE_PAD = 24;           // padding above & below device

// ─────────────────────────────────────────────────
// useIsMobile — SSR-safe breakpoint hook via matchMedia
// ─────────────────────────────────────────────────

export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
        setIsMobile(mql.matches);

        function onChange(e: MediaQueryListEvent) {
            setIsMobile(e.matches);
        }

        mql.addEventListener("change", onChange);
        return () => mql.removeEventListener("change", onChange);
    }, []);

    return isMobile;
}
