"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/leads/StatusBadge";
import { FollowUpButton } from "@/components/leads/FollowUpButton";
import { PriorityFacets } from "@/components/leads/PriorityFacets";
import { useAppStore } from "@/lib/store/useAppStore";
import { useClearFlagAfter } from "@/hooks/useClearFlagAfter";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { treatmentLabel } from "@/lib/data/treatments";
import type { Lead } from "@/lib/types/lead";

const GRID_COLS = "md:grid-cols-[1.7fr_1.2fr_1fr_1.1fr_1.1fr_1.6fr_auto]";

export function LeadRow({ lead }: { lead: Lead }) {
  const clearNewLeadFlag = useAppStore((state) => state.clearNewLeadFlag);
  const openLeadDetail = useAppStore((state) => state.openLeadDetail);

  useClearFlagAfter(!!lead.isNew, 3000, () => clearNewLeadFlag(lead.id));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{
        opacity: 1,
        y: 0,
        backgroundColor: lead.isNew ? "var(--color-accent-50)" : "rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      role="row"
      className="border-b border-zinc-100 last:border-b-0"
    >
      {/* Fila de escritorio */}
      <div className={`hidden items-center gap-4 px-4 py-3.5 md:grid ${GRID_COLS}`}>
        <button
          onClick={() => openLeadDetail(lead.id)}
          className="flex min-w-0 items-center gap-2.5 text-left"
        >
          <Avatar name={lead.name} className="h-8 w-8 text-[11px]" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-900">{lead.name}</p>
            <p className="truncate text-xs text-zinc-400">{lead.phone}</p>
          </div>
        </button>
        <span className="truncate text-sm text-zinc-600">{treatmentLabel(lead.treatment)}</span>
        <div>
          <StatusBadge status={lead.status} />
        </div>
        <PriorityFacets lead={lead} />
        <span className="truncate text-sm text-zinc-500">
          <RelativeTime iso={lead.lastInteractionAt} />
        </span>
        <span className="truncate text-sm text-zinc-600">{lead.nextAction}</span>
        <FollowUpButton leadId={lead.id} status={lead.status} />
      </div>

      {/* Tarjeta móvil */}
      <div className="flex flex-col gap-3 p-4 md:hidden">
        <div className="flex items-start justify-between gap-2">
          <button
            onClick={() => openLeadDetail(lead.id)}
            className="flex items-center gap-2.5 text-left"
          >
            <Avatar name={lead.name} />
            <div>
              <p className="text-sm font-medium text-zinc-900">{lead.name}</p>
              <p className="flex items-center gap-1 text-xs text-zinc-400">
                <Phone className="h-3 w-3" />
                {lead.phone}
              </p>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <PriorityFacets lead={lead} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-zinc-400">Tratamiento</p>
            <p className="mt-0.5 text-zinc-700">{treatmentLabel(lead.treatment)}</p>
          </div>
          <div>
            <p className="text-zinc-400">Estado</p>
            <div className="mt-0.5">
              <StatusBadge status={lead.status} />
            </div>
          </div>
          <div>
            <p className="text-zinc-400">Última interacción</p>
            <p className="mt-0.5 text-zinc-700">
              <RelativeTime iso={lead.lastInteractionAt} />
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-zinc-400">Próxima acción</p>
            <p className="mt-0.5 text-zinc-700">{lead.nextAction}</p>
          </div>
        </div>
        <FollowUpButton leadId={lead.id} status={lead.status} />
      </div>
    </motion.div>
  );
}

export { GRID_COLS };
