"use client";

import { useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { ListChecks } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/lib/store/useAppStore";
import { computePriority } from "@/lib/scoring/leadIntelligence";
import { isClosedStatus } from "@/lib/constants/status";
import { ActionCenterItem } from "@/components/dashboard/ActionCenterItem";

const MAX_ITEMS = 6;
const PRIORITY_WEIGHT = { alta: 2, media: 1, baja: 0 };

/**
 * Cola acotada y priorizada — no todos los leads, solo los que necesitan
 * atención ahora. Responde "¿qué hago ahora?", no "¿dónde está todo?" (eso
 * es el Pipeline). Se vacía a medida que actúas.
 */
export function ActionCenter() {
  const leads = useAppStore((state) => state.leads);

  const queue = useMemo(() => {
    return leads
      .filter((l) => !isClosedStatus(l.status))
      .sort((a, b) => {
        const priorityDiff = PRIORITY_WEIGHT[computePriority(b)] - PRIORITY_WEIGHT[computePriority(a)];
        if (priorityDiff !== 0) return priorityDiff;
        return b.estimatedValue - a.estimatedValue;
      })
      .slice(0, MAX_ITEMS);
  }, [leads]);

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <ListChecks className="h-4 w-4 text-zinc-400" />
        <h2 className="text-sm font-semibold text-zinc-900">Centro de acciones</h2>
      </div>
      <Card className="p-4">
        {queue.length === 0 ? (
          <p className="py-2 text-sm text-zinc-400">
            No hay acciones pendientes — todo el pipeline está al día.
          </p>
        ) : (
          <AnimatePresence initial={false}>
            {queue.map((lead) => (
              <ActionCenterItem key={lead.id} lead={lead} />
            ))}
          </AnimatePresence>
        )}
      </Card>
    </div>
  );
}
