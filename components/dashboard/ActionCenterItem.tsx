"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store/useAppStore";
import {
  computeRecommendedAction,
  computeUrgencyLabel,
  type RecommendedActionType,
} from "@/lib/scoring/leadIntelligence";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { treatmentLabel } from "@/lib/data/treatments";
import type { Lead } from "@/lib/types/lead";

/** Acciones que son literalmente "avanzar a la siguiente etapa" — se ejecutan directas. */
const DIRECT_ACTION_TYPES: RecommendedActionType[] = [
  "agendar_cita",
  "enviar_presupuesto",
  "hacer_seguimiento_presupuesto",
  "enviar_financiacion",
  "agendar_tratamiento",
];

export function ActionCenterItem({ lead }: { lead: Lead }) {
  const sendFollowUp = useAppStore((state) => state.sendFollowUp);
  const openLeadDetail = useAppStore((state) => state.openLeadDetail);
  const [loading, setLoading] = useState(false);

  const action = computeRecommendedAction(lead);
  const ActionIcon = action.icon;
  const isDirect = DIRECT_ACTION_TYPES.includes(action.type);

  const handleClick = async () => {
    if (isDirect) {
      setLoading(true);
      await sendFollowUp(lead.id);
      setLoading(false);
    } else {
      openLeadDetail(lead.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-3 border-b border-zinc-100 py-3 last:border-b-0"
    >
      <button
        onClick={() => openLeadDetail(lead.id)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <Avatar name={lead.name} className="h-8 w-8 text-[11px]" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-900">{lead.name}</p>
          <p className="truncate text-xs text-zinc-400">
            {treatmentLabel(lead.treatment)} · {formatCurrency(lead.estimatedValue)} ·{" "}
            {computeUrgencyLabel(lead)}
          </p>
        </div>
      </button>
      <Button variant="subtle" size="sm" loading={loading} onClick={handleClick} disabled={loading}>
        <ActionIcon className="h-3.5 w-3.5" />
        {action.label}
      </Button>
    </motion.div>
  );
}
