"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { useAppStore } from "@/lib/store/useAppStore";
import {
  computePriority,
  computeRecommendedAction,
} from "@/lib/scoring/leadIntelligence";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { AlertsBar } from "@/components/dashboard/AlertsBar";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 20) return "Buenas tardes";
  return "Buenas noches";
}

export function DailyBriefing() {
  const leads = useAppStore((state) => state.leads);

  const { priorityCount, budgetCount, reminderCount, pipelineValue, topLead } = useMemo(() => {
    const openLeads = leads.filter((l) => l.status !== "cita_agendada");
    const priority = openLeads.filter((l) => computePriority(l) === "alta");
    const actions = leads.map((l) => ({ lead: l, action: computeRecommendedAction(l) }));

    const sortedByValue = [...priority].sort((a, b) => b.estimatedValue - a.estimatedValue);

    return {
      priorityCount: priority.length,
      budgetCount: actions.filter((a) => a.action.type === "enviar_presupuesto").length,
      reminderCount: actions.filter((a) => a.action.type === "recordar_revision").length,
      pipelineValue: openLeads.reduce((sum, l) => sum + l.estimatedValue, 0),
      topLead: sortedByValue[0] ?? null,
    };
  }, [leads]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-2xl bg-zinc-900 p-5 text-white shadow-[var(--shadow-soft-lg)] sm:p-6"
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
          <Sparkles className="h-3.5 w-3.5 text-accent-300" strokeWidth={2.25} />
        </div>
        <p className="text-sm font-medium text-zinc-300">Resumen diario · LoopAI</p>
      </div>

      <p className="text-lg font-semibold tracking-tight sm:text-xl">{greeting()}.</p>
      <p className="mt-1 text-sm text-zinc-400">Hoy tienes:</p>

      <ul className="mt-3 space-y-1.5 text-sm text-zinc-200">
        <li>
          <span className="font-semibold text-white">{priorityCount}</span>{" "}
          {priorityCount === 1 ? "paciente prioritario" : "pacientes prioritarios"}
        </li>
        <li>
          <span className="font-semibold text-white">{budgetCount}</span>{" "}
          {budgetCount === 1 ? "presupuesto pendiente" : "presupuestos pendientes"}
        </li>
        <li>
          <span className="font-semibold text-white">{reminderCount}</span>{" "}
          {reminderCount === 1 ? "revisión" : "revisiones"}
        </li>
      </ul>

      <div className="mt-5 flex flex-col gap-1 border-t border-white/10 pt-4">
        <p className="text-xs text-zinc-400">Valor potencial</p>
        <p className="text-2xl font-semibold tracking-tight text-accent-300">
          {formatCurrency(pipelineValue)}
        </p>
      </div>

      {topLead && (
        <p className="mt-4 text-sm text-zinc-300">
          Recomendación: empieza llamando a{" "}
          <span className="font-medium text-white">{topLead.name}</span>.
        </p>
      )}

      <div className="mt-5">
        <AlertsBar />
      </div>
    </motion.div>
  );
}
