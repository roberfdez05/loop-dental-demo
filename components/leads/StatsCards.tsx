"use client";

import { useMemo } from "react";
import { isThisMonth, isToday } from "date-fns";
import {
  CalendarCheck2,
  Clock,
  Coins,
  MessagesSquare,
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

interface Stat {
  value: string;
  label: string;
}

interface Tile {
  label: string;
  icon: LucideIcon;
  stats: Stat[];
}

export function StatsCards() {
  const leads = useAppStore((state) => state.leads);
  const conversations = useAppStore((state) => state.conversations);
  const inactivePatients = useAppStore((state) => state.inactivePatients);

  const tiles = useMemo<Tile[]>(() => {
    const total = leads.length;
    const nuevosHoy = leads.filter((l) => isToday(new Date(l.createdAt))).length;
    const citasAgendadas = leads.filter((l) => l.status === "cita_agendada").length;
    const tasaRespuesta = total
      ? Math.round((leads.filter((l) => l.status !== "nuevo").length / total) * 100)
      : 0;

    const ingresosRecuperados = leads
      .filter((l) => l.status === "cita_agendada" && isThisMonth(new Date(l.createdAt)))
      .reduce((sum, l) => sum + l.estimatedValue, 0);

    const inactiveValue = inactivePatients.reduce((sum, p) => sum + p.estimatedRecoveryValue, 0);

    const activas = conversations.length;
    const pendientes = conversations.filter((c) => {
      const last = c.messages[c.messages.length - 1];
      return last?.sender === "patient" && !c.isTyping;
    }).length;

    return [
      { label: "Total de leads", icon: Users, stats: [{ value: `${total}`, label: "leads" }] },
      { label: "Nuevos hoy", icon: Sparkles, stats: [{ value: `${nuevosHoy}`, label: "hoy" }] },
      {
        label: "Citas agendadas",
        icon: CalendarCheck2,
        stats: [{ value: `${citasAgendadas}`, label: "citas" }],
      },
      {
        label: "Tasa de respuesta",
        icon: TrendingUp,
        stats: [{ value: `${tasaRespuesta}%`, label: "respondidos" }],
      },
      {
        label: "Ingresos recuperados",
        icon: Coins,
        stats: [{ value: formatCurrency(ingresosRecuperados), label: "este mes" }],
      },
      {
        label: "Tiempo medio de respuesta",
        icon: Clock,
        stats: [{ value: `${AVG_RESPONSE_TIME_MINUTES} min`, label: "de media" }],
      },
      {
        label: "Pacientes inactivos",
        icon: UserX,
        stats: [
          { value: `${inactivePatients.length}`, label: "inactivos" },
          { value: formatCurrency(inactiveValue), label: "recuperables" },
        ],
      },
      {
        label: "Conversaciones",
        icon: MessagesSquare,
        stats: [
          { value: `${activas}`, label: "activas" },
          { value: `${pendientes}`, label: "pendientes" },
        ],
      },
    ];
  }, [leads, conversations, inactivePatients]);

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map(({ label, icon: Icon, stats }) => (
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
        </Card>
      ))}
    </div>
  );
}
