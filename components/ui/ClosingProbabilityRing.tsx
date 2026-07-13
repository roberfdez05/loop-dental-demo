"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils/cn";

const RADIUS = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ClosingProbabilityRing({
  probability,
  size = 40,
  className,
}: {
  probability: number;
  size?: number;
  className?: string;
}) {
  const clamped = Math.min(100, Math.max(0, probability));
  const offset = CIRCUMFERENCE * (1 - clamped / 100);
  const strokeColor = clamped >= 70 ? "#4a4bc9" : clamped >= 40 ? "#7d84ec" : "#d4d4d8";

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      title={`Probabilidad de cierre: ${clamped}%`}
    >
      <svg width={size} height={size} viewBox="0 0 40 40" className="-rotate-90">
        <circle cx="20" cy="20" r={RADIUS} fill="none" stroke="#e4e4e7" strokeWidth={4} />
        <motion.circle
          cx="20"
          cy="20"
          r={RADIUS}
          fill="none"
          stroke={strokeColor}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute text-[10px] font-semibold text-zinc-700">{clamped}%</span>
    </div>
  );
}
