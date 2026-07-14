"use client";

import { useMemo } from "react";
import { isToday } from "date-fns";
import {
  CalendarCheck2,
  Clock,
  Coins,
  Sparkles,
  TrendingUp,
  UserX,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/lib/store/useAppStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { AVG_RESPONSE_TIME_MINUTES } from "@/lib/data/seed-metrics";
import { horasAhorradas } from "@/lib/scoring/impactMetrics";
import { isClosedStatus } from "@/lib/constants/status";

interface Stat {
  value: string;
  label: string;
}

interface Tile {
  label: string;
  icon: LucideIcon;
  stats: Stat[];
  impactText: string;
}

export function StatsCards() {
  const leads = useAppStore((state) => state.leads);
  const conversations = useAppStore((state) => state.conversations);
  const inactivePatients = useAppStore((state) => state.inactivePatients);

  const tiles = useMemo<Tile[]>(() => {
    const total = leads.length;
    const nuevosHoy = leads.filter((l) => isToday(new Date(l.createdAt))).length;
    const citasAgendadas = leads.filter((l) => l.status === "cita_reservada").length;
    const respondidos = leads.filter((l) => l.status !== "nuevo").length;
    const tasaRespuesta = total ? Math.round((respondidos / total) * 100) : 0;

    const pipelineValue = leads
      .filter((l) => !isClosedStatus(l.status))
      .reduce((sum, l) => sum + l.estimatedValue, 0);

    const inactiveValue = inactivePatients.reduce((sum, p) => sum + p.estimatedRecoveryValue, 0);
    const horas = horasAhorradas(conversations);
    const jornadas = Math.max(1, Math.round(horas / 8));

    return [
      {
        label: "Total de leads",
        icon: Users,
        stats: [{ value: `${total}`, label: "leads" }],
        impactText: "en el pipeline activo",
      },
      {
        label: "Nuevos hoy",
        icon: Sparkles,
        stats: [{ value: `${nuevosHoy}`, label: "hoy" }],
        impactText: "captados sin intervención manual",
      },
      {
        label: "Citas agendadas",
        icon: CalendarCheck2,
        stats: [{ value: `${citasAgendadas}`, label: "citas" }],
        impactText: "próximas visitas confirmadas",
      },
      {
        label: "Tasa de respuesta",
        icon: TrendingUp,
        stats: [{ value: `${tasaRespuesta}%`, label: "respondidos" }],
        impactText: `${respondidos} de ${total} leads ya tienen respuesta`,
      },
      {
        label: "Valor en pipeline",
        icon: Coins,
        stats: [{ value: formatCurrency(pipelineValue), label: "por cerrar" }],
        impactText: "suma de leads todavía abiertos",
      },
      {
        label: "Tiempo medio de respuesta",
        icon: Clock,
        stats: [{ value: `${AVG_RESPONSE_TIME_MINUTES} min`, label: "de media" }],
        impactText: "recepción tardaría horas en responder esto",
      },
      {
        label: "Pacientes inactivos",
        icon: UserX,
        stats: [
          { value: `${inactivePatients.length}`, label: "inactivos" },
          { value: formatCurrency(inactiveValue), label: "recuperables" },
        ],
        impactText: "no han vuelto en varios meses",
      },
      {
        label: "Tiempo ahorrado",
        icon: Clock,
        stats: [{ value: `${horas}h`, label: "este mes" }],
        impactText: `equivalente a ${jornadas} ${jornadas === 1 ? "jornada" : "jornadas"} de recepción`,
      },
    ];
  }, [leads, conversations, inactivePatients]);

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map(({ label, icon: Icon, stats, impactText }) => (
        <Card key={label} className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-zinc-500">{label}</p>
            <Icon className="h-3.5 w-3.5 text-accent-400" />
          </div>
          <div className="mt-2 flex items-end gap-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-semibold tracking-tight text-zinc-900">
                  {stat.value}
                </p>
                <p className="text-[11px] text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-snug text-zinc-400">{impactText}</p>
        </Card>
      ))}
    </div>
  );
}
