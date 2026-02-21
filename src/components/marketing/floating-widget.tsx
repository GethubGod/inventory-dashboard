"use client";

import { motion, useTransform, MotionValue } from "framer-motion";
import { User, Clock, Mic, Bot, LucideIcon, BarChart2, ShieldCheck, CheckCircle2 } from "lucide-react";

interface FloatingWidgetProps {
  progress: MotionValue<number>;
  inPoint: number;
  outPoint: number;
  side: "left" | "right";
  offsetY?: string;
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
  offsetY = "0px",
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
    [side === "left" ? 30 : -30, 0]
  );

  const IconComponent = icons[icon] || CheckCircle2;

  return (
    <motion.div
      style={{ opacity, x: slideX }}
      className={`absolute top-1/2 hidden md:flex items-center gap-4 bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-black/5 z-20 pointer-events-none transform-gpu ${
        side === "left"
          ? "right-[55%] lg:right-[56%]"
          : "left-[55%] lg:left-[56%]"
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-500/10 text-teal-600">
        <IconComponent className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-zinc-900">{title}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>
      </div>
    </motion.div>
  );
}
