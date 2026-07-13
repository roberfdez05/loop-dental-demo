"use client";

import { useEffect, useState } from "react";

import { formatRelativeTime } from "@/lib/utils/formatRelativeTime";

const REFRESH_MS = 60_000;

/**
 * El texto depende de `Date.now()` en el momento del render: si se calculara
 * durante el SSR y de nuevo al hidratar, ambos instantes difieren y React
 * marca un hydration mismatch. Por eso se renderiza vacío hasta montar y
 * luego se calcula solo en cliente, refrescando cada minuto.
 */
export function RelativeTime({ iso }: { iso: string }) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(formatRelativeTime(iso));
    const interval = setInterval(() => setLabel(formatRelativeTime(iso)), REFRESH_MS);
    return () => clearInterval(interval);
  }, [iso]);

  return <>{label ?? " "}</>;
}
