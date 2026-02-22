"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence, type Variants } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { Brand } from "@/components/marketing/brand";
import { Menu, X } from "lucide-react";
import { useMotionPreferences } from "@/lib/motion";

// ─────────────────────────────────────────────────
// Navbar — scroll-tracked, with compact translucent mobile menu
// ─────────────────────────────────────────────────

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const { shouldReduceMotion } = useMotionPreferences();
  const menuRef = useRef<HTMLDivElement>(null);

  // ─── Close on ESC key ─────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // ─── Body scroll lock when menu open ──────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ─── Focus trap inside menu ───────────────────────
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const focusableEls = menuRef.current.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableEls.length === 0) return;

    const first = focusableEls[0];
    const last = focusableEls[focusableEls.length - 1];

    // Focus the close button on open
    first.focus();

    function trapFocus(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", trapFocus);
    return () => document.removeEventListener("keydown", trapFocus);
  }, [isOpen]);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  // ─── Scroll-driven background transition ──────────
  const navBg = useTransform(
    scrollY,
    [0, 400, 1200, 2400, 3200, 4000],
    [
      "rgba(0,0,0,0.0)",
      "rgba(0,0,0,0.12)",
      "rgba(0,0,0,0.18)",
      "rgba(20,20,20,0.15)",
      "rgba(255,255,255,0.35)",
      "rgba(255,255,255,0.55)",
    ]
  );

  const navBorder = useTransform(
    scrollY,
    [0, 2400, 3200, 4000],
    [
      "rgba(255,255,255,0.0)",
      "rgba(255,255,255,0.08)",
      "rgba(0,0,0,0.04)",
      "rgba(0,0,0,0.08)",
    ]
  );

  // ─── Text/icon color ─────────────────────────────
  const textColor = useTransform(
    scrollY,
    [0, 600, 2400, 3200, 4000],
    [
      "rgba(255,255,255,0.9)",
      "rgba(255,255,255,0.9)",
      "rgba(255,255,255,0.85)",
      "rgba(30,30,30,0.7)",
      "rgba(11,11,11,0.85)",
    ]
  );

  const brandSwap = useTransform(scrollY, [2600, 3400], [0, 1]);
  const lightBrandOpacity = useTransform(brandSwap, [0, 1], [1, 0]);
  const darkBrandOpacity = useTransform(brandSwap, [0, 1], [0, 1]);

  // ─── Liquid-glass pill backgrounds ────────────────
  const pillBg = useTransform(
    scrollY,
    [0, 2400, 3600, 4000],
    [
      "rgba(255,255,255,0.07)",
      "rgba(255,255,255,0.10)",
      "rgba(255,255,255,0.35)",
      "rgba(255,255,255,0.50)",
    ]
  );

  const pillBorder = useTransform(
    scrollY,
    [0, 2400, 3600, 4000],
    [
      "rgba(255,255,255,0.10)",
      "rgba(255,255,255,0.12)",
      "rgba(0,0,0,0.06)",
      "rgba(0,0,0,0.08)",
    ]
  );

  // ─── Menu animation variants ──────────────────────
  // Panel slides down from top, slight scale
  const EASE_APPLE = [0.25, 0.46, 0.45, 0.94] as const;

  const panelVariants: Variants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden: { opacity: 0, y: -12, scale: 0.97 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.28, ease: EASE_APPLE },
        },
        exit: {
          opacity: 0,
          y: -8,
          scale: 0.97,
          transition: { duration: 0.18, ease: EASE_APPLE },
        },
      };

  const itemVariants: Variants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 8 },
        visible: (i: number) => ({
          opacity: 1,
          y: 0,
          transition: { delay: 0.06 + i * 0.04, duration: 0.25, ease: EASE_APPLE },
        }),
      };

  const NAV_ITEMS = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <>
      <motion.header
        style={{
          backgroundColor: navBg,
          borderColor: navBorder,
          color: textColor,
        }}
        className="fixed top-0 z-50 w-full border-b backdrop-blur-xl"
      >
        <div className="mx-auto flex h-[60px] lg:h-[72px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              aria-label="Babytuna homepage"
              className="relative inline-flex h-7 items-center"
            >
              <span aria-hidden="true" className="invisible">
                <Brand
                  variant="light"
                  text="Babytuna Systems"
                  textClassName="text-xl leading-none whitespace-nowrap"
                  className="text-current"
                />
              </span>

              <motion.span
                aria-hidden="true"
                className="absolute inset-0 flex items-center pointer-events-none"
                style={{ opacity: lightBrandOpacity }}
              >
                <Brand
                  variant="light"
                  text="Babytuna Systems"
                  textClassName="text-xl leading-none whitespace-nowrap"
                  className="text-current"
                />
              </motion.span>

              <motion.span
                aria-hidden="true"
                className="absolute inset-0 flex items-center pointer-events-none"
                style={{ opacity: darkBrandOpacity }}
              >
                <Brand
                  variant="dark"
                  text="Babytuna Systems"
                  textClassName="text-xl leading-none whitespace-nowrap"
                  className="text-current"
                />
              </motion.span>
            </Link>
          </div>

          {/* Desktop center nav */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="hover:opacity-70 transition-opacity">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:opacity-70 transition-opacity">
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-lime-500 px-5 py-2 text-sm font-medium text-black hover:bg-lime-400 transition-colors focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-black"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 focus:outline-none focus:ring-2 focus:ring-white/30 rounded-lg relative z-[60]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </motion.header>

      {/* ─── Compact Translucent Mobile Menu ─── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Scrim backdrop — tap to close */}
            <motion.div
              className="fixed inset-0 z-[54] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
              style={{ background: "rgba(0,0,0,0.4)" }}
            />

            {/* Floating glass panel */}
            <motion.div
              ref={menuRef}
              className="fixed z-[55] lg:hidden"
              style={{
                top: 72,
                left: 12,
                right: 12,
                maxHeight: "calc(65vh)",
              }}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(28, 28, 30, 0.78)",
                  backdropFilter: "blur(40px) saturate(1.5)",
                  WebkitBackdropFilter: "blur(40px) saturate(1.5)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 24px 48px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              >
                <nav className="flex flex-col py-3 px-2">
                  {NAV_ITEMS.map((item, i) => (
                    <motion.div
                      key={item.href}
                      variants={itemVariants}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="block text-[15px] font-medium text-white/90 hover:text-white hover:bg-white/8 rounded-xl px-4 py-3 transition-colors active:scale-[0.98] transform"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}

                  {/* Divider */}
                  <div className="mx-4 my-1.5 h-px bg-white/10" />

                  {/* Log In */}
                  <motion.div
                    variants={itemVariants}
                    custom={NAV_ITEMS.length}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="block text-[15px] font-medium text-white/55 hover:text-white/80 hover:bg-white/8 rounded-xl px-4 py-3 transition-colors"
                    >
                      Log In
                    </Link>
                  </motion.div>

                  {/* Get Started CTA */}
                  <motion.div
                    className="px-2 pt-1 pb-1"
                    variants={itemVariants}
                    custom={NAV_ITEMS.length + 1}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      href="/signup"
                      onClick={closeMenu}
                      className="block w-full text-center rounded-xl bg-lime-500 py-2.5 text-sm font-semibold text-black hover:bg-lime-400 transition-colors active:scale-[0.97] transform shadow-[0_0_20px_rgba(132,204,22,0.2)]"
                    >
                      Get Started
                    </Link>
                  </motion.div>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
