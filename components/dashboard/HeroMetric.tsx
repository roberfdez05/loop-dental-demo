"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

import { useAppStore } from "@/lib/store/useAppStore";
import {
  ingresosGeneradosEsteMes,
  tratamientosRecuperadosEsteMes,
  citasGeneradasEsteMes,
  horasAhorradas,
} from "@/lib/scoring/impactMetrics";
import { formatCurrency } from "@/lib/utils/formatCurrency";

/** El dato más importante de toda la aplicación — todo lo demás es soporte de este número. */
export function HeroMetric() {
  const leads = useAppStore((state) => state.leads);
  const conversations = useAppStore((state) => state.conversations);
  const isPlayingDemo = useAppStore((state) => state.isPlayingDemo);

  const { ingresos, tratamientos, citas, horas } = useMemo(
    () => ({
      ingresos: ingresosGeneradosEsteMes(leads),
      tratamientos: tratamientosRecuperadosEsteMes(leads),
      citas: citasGeneradasEsteMes(leads),
      horas: horasAhorradas(conversations),
    }),
    [leads, conversations],
  );

  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 text-zinc-500">
        <TrendingUp className="h-3.5 w-3.5" />
        <p className="text-xs font-medium">LoopAI ha generado este mes</p>
      </div>
      <motion.p
        key={ingresos}
        initial={{ opacity: 0.4, scale: isPlayingDemo ? 1.04 : 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl"
      >
        {formatCurrency(ingresos)}
      </motion.p>
      <p className="mt-2 text-sm text-zinc-500">
        <span className="font-medium text-zinc-700">+{tratamientos}</span> tratamientos recuperados
        {" · "}
        <span className="font-medium text-zinc-700">+{citas}</span> citas generadas
        {" · "}
        <span className="font-medium text-zinc-700">+{horas}</span> horas ahorradas
      </p>
    </div>
  );
}
