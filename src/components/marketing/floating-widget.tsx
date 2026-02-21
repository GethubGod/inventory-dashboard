"use client";

import { motion, useTransform, MotionValue } from "framer-motion";
import { User, Clock, Mic, Bot, LucideIcon, BarChart2, ShieldCheck, CheckCircle2 } from "lucide-react";

interface FloatingWidgetProps {
  progress: MotionValue<number>;
  inPoint: number;
  outPoint: number;
  side: "left" | "right";
  title: string;
  subtitle: string;
  icon: "user" | "clock" | "mic" | "bot" | "chart" | "check";
}

const icons: Record<string, LucideIcon> = {
  user: User,
  clock: Clock,
  mic: Mic,
  bot: Bot,
  chart: BarChart2,
  check: ShieldCheck,
};

export function FloatingWidget({
  progress,
  inPoint,
  outPoint,
  side,
  title,
  subtitle,
  icon,
}: FloatingWidgetProps) {
  const fadeIn = 0.04;
  const fadeOut = 0.03;

  const opacity = useTransform(
    progress,
    [inPoint, inPoint + fadeIn, outPoint - fadeOut, outPoint],
    [0, 1, 1, 0]
  );

  const slideX = useTransform(
    progress,
    [inPoint, inPoint + fadeIn],
    [side === "left" ? 40 : -40, 0]
  );

  const IconComponent = icons[icon] || CheckCircle2;

  return (
    <motion.div
      style={{ opacity, x: slideX }}
      className={`absolute top-[40%] hidden md:flex items-center gap-4 min-w-[240px] bg-white/95 backdrop-blur-xl px-6 py-5 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.14),0_4px_12px_rgba(0,0,0,0.06)] border border-black/5 z-20 pointer-events-none transform-gpu ${
        side === "left"
          ? "left-[5%] lg:left-[6%] xl:left-[8%]"
          : "right-[5%] lg:right-[6%] xl:right-[8%]"
      }`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-500/10 text-teal-600">
        <IconComponent className="h-6 w-6" />
      </div>
      <div>
        <p className="text-base font-semibold text-zinc-900 leading-tight">{title}</p>
        <p className="text-sm text-zinc-500 mt-0.5">{subtitle}</p>
      </div>
    </motion.div>
  );
}
