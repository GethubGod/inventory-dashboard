"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-20 md:py-32 bg-zinc-900 overflow-hidden text-center text-white">
      {/* Background Ornaments */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-4xl aspect-square bg-teal-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-5 md:mb-8">
            Stop counting. <br />
            Start <span className="text-teal-400">cooking.</span>
          </h2>
          <p className="text-base md:text-xl text-zinc-400 mb-8 md:mb-12 max-w-lg mx-auto leading-relaxed">
            Join restaurant owners who have eliminated inventory headaches and reclaimed hours per week.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-lime-500 hover:bg-lime-400 px-8 py-3 md:px-8 md:py-4 text-sm md:text-lg font-semibold text-black transition-all shadow-[0_0_30px_rgba(132,204,22,0.3)] hover:shadow-[0_0_40px_rgba(132,204,22,0.5)] hover:scale-105"
            >
              Get started for free
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 hover:bg-white/10 px-8 py-3 md:px-8 md:py-4 text-sm md:text-lg font-medium text-white transition-all"
            >
              Book a Demo
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
