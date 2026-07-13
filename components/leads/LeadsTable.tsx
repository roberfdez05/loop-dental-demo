"use client";

import { AnimatePresence } from "framer-motion";

import { Card } from "@/components/ui/Card";
import { LeadRow, GRID_COLS } from "@/components/leads/LeadRow";
import { useAppStore } from "@/lib/store/useAppStore";

const COLUMNS = [
  "Nombre",
  "Tratamiento",
  "Estado",
  "Prioridad / Cierre",
  "Última interacción",
  "Próxima acción",
  "",
];

export function LeadsTable() {
  const leads = useAppStore((state) => state.leads);

  const sorted = [...leads].sort(
    (a, b) => new Date(b.lastInteractionAt).getTime() - new Date(a.lastInteractionAt).getTime(),
  );

  return (
    <Card className="overflow-hidden" role="table" aria-label="Lista de leads">
      <div
        className={`hidden items-center gap-4 border-b border-zinc-100 bg-zinc-50/60 px-4 py-2.5 md:grid ${GRID_COLS}`}
        role="row"
      >
        {COLUMNS.map((col) => (
          <span key={col} className="text-xs font-medium text-zinc-400">
            {col}
          </span>
        ))}
      </div>
      <div role="rowgroup">
        <AnimatePresence initial={false}>
          {sorted.map((lead) => (
            <LeadRow key={lead.id} lead={lead} />
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}
