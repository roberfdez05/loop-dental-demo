"use client";

import { isToday } from "date-fns";
import { Users, Sparkles, CalendarCheck2, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/lib/store/useAppStore";

export function StatsCards() {
  const leads = useAppStore((state) => state.leads);

  const total = leads.length;
  const nuevosHoy = leads.filter((l) => isToday(new Date(l.createdAt))).length;
  const citasAgendadas = leads.filter((l) => l.status === "cita_agendada").length;
  const tasaRespuesta = total
    ? Math.round((leads.filter((l) => l.status !== "nuevo").length / total) * 100)
    : 0;

  const stats = [
    { label: "Total de leads", value: total, icon: Users },
    { label: "Nuevos hoy", value: nuevosHoy, icon: Sparkles },
    { label: "Citas agendadas", value: citasAgendadas, icon: CalendarCheck2 },
    { label: "Tasa de respuesta", value: `${tasaRespuesta}%`, icon: TrendingUp },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <Card key={label} className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-zinc-500">{label}</p>
            <Icon className="h-3.5 w-3.5 text-accent-400" />
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">{value}</p>
        </Card>
      ))}
    </div>
  );
}
