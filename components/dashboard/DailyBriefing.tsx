"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { useAppStore } from "@/lib/store/useAppStore";
import {
  computePriority,
  computeRecommendedAction,
  computeClosingProbability,
  computeUrgencyLabel,
} from "@/lib/scoring/leadIntelligence";
import { isClosedStatus } from "@/lib/constants/status";
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
  const inactivePatients = useAppStore((state) => state.inactivePatients);

  const { priorityCount, budgetCount, reminderCount, recoverableCount, pipelineValue, topLead } =
    useMemo(() => {
      const openLeads = leads.filter((l) => !isClosedStatus(l.status));
      const priority = openLeads.filter((l) => computePriority(l) === "alta");
      const actions = leads.map((l) => ({ lead: l, action: computeRecommendedAction(l) }));

      const sortedByValue = [...priority].sort((a, b) => b.estimatedValue - a.estimatedValue);

      return {
        priorityCount: priority.length,
        budgetCount: actions.filter(
          (a) => a.action.type === "enviar_presupuesto" || a.action.type === "hacer_seguimiento_presupuesto",
        ).length,
        reminderCount: actions.filter((a) => a.action.type === "recordar_revision").length,
        recoverableCount: inactivePatients.filter((p) => !p.campaignSent).length,
        pipelineValue: openLeads.reduce((sum, l) => sum + l.estimatedValue, 0),
        topLead: sortedByValue[0] ?? null,
      };
    }, [leads, inactivePatients]);

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
        <p className="text-sm font-medium text-zinc-300">¿Qué debería hacer hoy la clínica?</p>
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
          <span className="font-semibold text-white">{recoverableCount}</span>{" "}
          {recoverableCount === 1 ? "paciente recuperable" : "pacientes recuperables"}
        </li>
        <li>
          <span className="font-semibold text-white">{reminderCount}</span>{" "}
          {reminderCount === 1 ? "revisión importante" : "revisiones importantes"}
        </li>
      </ul>

      {topLead && (
        <div className="mt-5 rounded-xl bg-white/5 p-4">
          <p className="text-sm text-zinc-300">
            Empieza llamando a <span className="font-semibold text-white">{topLead.name}</span>.
          </p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div>
              <p className="text-[11px] text-zinc-400">Valor potencial</p>
              <p className="text-base font-semibold text-accent-300">
                {formatCurrency(topLead.estimatedValue)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-zinc-400">Probabilidad</p>
              <p className="text-base font-semibold text-white">
                {computeClosingProbability(topLead)}%
              </p>
            </div>
            <div>
              <p className="text-[11px] text-zinc-400">Esperando</p>
              <p className="text-base font-semibold text-white">{computeUrgencyLabel(topLead)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-1 border-t border-white/10 pt-4">
        <p className="text-xs text-zinc-400">Valor potencial total en curso</p>
        <p className="text-2xl font-semibold tracking-tight text-accent-300">
          {formatCurrency(pipelineValue)}
        </p>
      </div>

      <div className="mt-5">
        <AlertsBar />
      </div>
    </motion.div>
  );
}
