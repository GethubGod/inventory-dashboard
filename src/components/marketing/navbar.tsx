"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { Brand } from "@/components/marketing/brand";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();

  // ─── Scroll-driven background transition ───────────
  // Dark phase: frosted dark glass over hero
  // Light phase: frosted light glass over features section
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

  // ─── Text/icon color ───────────────────────────────
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
  // brand swap timeline from dark to light
  const brandSwap = useTransform(scrollY, [2600, 3400], [0, 1]);

  //crossfade two logo variants
  const lightBrandOpacity = useTransform(brandSwap, [0, 1], [1, 0]);
  const darkBrandOpacity = useTransform(brandSwap, [0, 1], [0, 1]);


  // ─── Liquid-glass pill backgrounds ─────────────────
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

  return (
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
            {/* Invisible sizer keeps the link width equal to the full brand width */}
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
              style={{ opacity: lightBrandOpacity}}
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
              style={{ opacity: darkBrandOpacity}}
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

        {/* Desktop center nav — perfectly centered */}
        <nav
          className="hidden lg:flex items-center gap-8 text-sm font-medium absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <Link href="#features" className="hover:opacity-70 transition-opacity">Features</Link>
          <Link href="#how-it-works" className="hover:opacity-70 transition-opacity">How It Works</Link>
          <Link href="#pricing" className="hover:opacity-70 transition-opacity">Pricing</Link>
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
          className="lg:hidden p-2 focus:outline-none focus:ring-2 focus:ring-white/30 rounded-lg"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-xl border-t border-white/10 px-4 py-6 shadow-xl"
        >
          <nav className="flex flex-col gap-4 text-white">
            <Link href="#features" onClick={() => setIsOpen(false)} className="px-2 py-3 border-b border-white/10 text-lg">Features</Link>
            <Link href="#how-it-works" onClick={() => setIsOpen(false)} className="px-2 py-3 border-b border-white/10 text-lg">How It Works</Link>
            <Link href="#pricing" onClick={() => setIsOpen(false)} className="px-2 py-3 border-b border-white/10 text-lg">Pricing</Link>
            <div className="flex flex-col gap-3 mt-4 pt-4">
              <Link href="/login" onClick={() => setIsOpen(false)} className="text-center py-3 text-lg">Log In</Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-lime-500 py-3 text-center text-lg font-medium text-black"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
