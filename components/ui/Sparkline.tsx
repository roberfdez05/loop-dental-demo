"use client";

import { useId } from "react";
import { motion } from "framer-motion";

export function Sparkline({
  values,
  width = 96,
  height = 32,
  className,
}: {
  values: number[];
  width?: number;
  height?: number;
  className?: string;
}) {
  const gradientId = useId();

  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const paddingY = height * 0.15;

  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = height - paddingY - ((value - min) / range) * (height - paddingY * 2);
    return [x, y] as const;
  });

  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5b5fe0" stopOpacity={0.18} />
          <stop offset="100%" stopColor="#5b5fe0" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
      <motion.path
        d={linePath}
        fill="none"
        stroke="#4a4bc9"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </svg>
  );
}
