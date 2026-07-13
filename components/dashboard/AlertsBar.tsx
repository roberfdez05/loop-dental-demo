"use client";

import { AlertCircle, Coins, UserX } from "lucide-react";

import { useAppStore } from "@/lib/store/useAppStore";
import { computePriority } from "@/lib/scoring/leadIntelligence";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export function AlertsBar() {
  const leads = useAppStore((state) => state.leads);
  const inactivePatients = useAppStore((state) => state.inactivePatients);

  const waitingCount = leads.filter(
    (l) => l.status !== "cita_agendada" && computePriority(l) === "alta",
  ).length;
  const pipelineValue = leads
    .filter((l) => l.status !== "cita_agendada")
    .reduce((sum, l) => sum + l.estimatedValue, 0);
  const recoverableCount = inactivePatients.filter((p) => !p.campaignSent).length;

  const alerts = [
    waitingCount > 0 && {
      icon: AlertCircle,
      text: `${waitingCount} paciente${waitingCount === 1 ? "" : "s"} esperando respuesta`,
    },
    pipelineValue > 0 && {
      icon: Coins,
      text: `Valor potencial en curso: ${formatCurrency(pipelineValue)}`,
    },
    recoverableCount > 0 && {
      icon: UserX,
      text: `${recoverableCount} pacientes inactivos recuperables`,
    },
  ].filter(Boolean) as { icon: typeof AlertCircle; text: string }[];

  if (alerts.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {alerts.map(({ icon: Icon, text }) => (
        <div
          key={text}
          className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-zinc-100"
        >
          <Icon className="h-3.5 w-3.5 text-accent-300" strokeWidth={2} />
          {text}
        </div>
      ))}
    </div>
  );
}
