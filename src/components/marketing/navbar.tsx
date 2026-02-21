"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();

  // Scroll mapping: 0 -> 200px fade into frosted glass
  const opacityBg = useTransform(scrollY, [0, 200, 400], [0, 0, 0.75]);
  const blurValue = useTransform(scrollY, [0, 200, 400], [0, 0, 24]);
  const borderColor = useTransform(
    scrollY,
    [0, 200, 400],
    ["rgba(0,0,0,0)", "rgba(0,0,0,0)", "rgba(0,0,0,0.05)"]
  );
  
  // Transition text color smoothly
  const textColor = useTransform(
    scrollY,
    [0, 600, 1000], // Roughly when hero brightens
    ["#ffffff", "#ffffff", "#0b0b0b"]
  );

  return (
    <motion.header
      style={{
        backgroundColor: useTransform(opacityBg, (v) => `rgba(255,255,255,${v})`),
        backdropFilter: useTransform(blurValue, (v) => `blur(${v}px)`),
        borderColor,
        color: textColor,
      }}
      className="fixed top-0 z-50 w-full border-b transition-colors duration-300"
    >
      <div className="mx-auto flex h-[60px] lg:h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <span>🐟 babytuna</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
          <Link href="#features" className="hover:opacity-70 transition-opacity">Features</Link>
          <Link href="#how-it-works" className="hover:opacity-70 transition-opacity">How It Works</Link>
          <Link href="#pricing" className="hover:opacity-70 transition-opacity">Pricing</Link>
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:opacity-70 transition-opacity">
            Log In
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-lime-500 px-5 py-2 text-sm font-medium text-black hover:bg-lime-400 transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2"
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
          className="lg:hidden absolute top-full left-0 w-full bg-black border-t border-white/10 px-4 py-6 shadow-xl"
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
