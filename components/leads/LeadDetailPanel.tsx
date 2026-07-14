"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Phone, X } from "lucide-react";

import { useAppStore } from "@/lib/store/useAppStore";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/leads/StatusBadge";
import { FollowUpButton } from "@/components/leads/FollowUpButton";
import { PriorityFacets } from "@/components/leads/PriorityFacets";
import { LeadTimeline } from "@/components/leads/LeadTimeline";
import { treatmentLabel } from "@/lib/data/treatments";
import { RelativeTime } from "@/components/ui/RelativeTime";

export function LeadDetailPanel() {
  const selectedLeadId = useAppStore((state) => state.selectedLeadId);
  const closeLeadDetail = useAppStore((state) => state.closeLeadDetail);
  const lead = useAppStore((state) => state.leads.find((l) => l.id === selectedLeadId));

  const open = !!selectedLeadId && !!lead;

  return (
    <AnimatePresence>
      {open && lead && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeLeadDetail}
            className="fixed inset-0 z-30 bg-zinc-900/20 backdrop-blur-[2px]"
          />
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col overflow-y-auto border-l border-zinc-200 bg-white shadow-[var(--shadow-soft-lg)]"
          >
            <div className="flex items-start justify-between gap-3 border-b border-zinc-100 p-5">
              <div className="flex items-center gap-3">
                <Avatar name={lead.name} />
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{lead.name}</p>
                  <p className="flex items-center gap-1 text-xs text-zinc-400">
                    <Phone className="h-3 w-3" />
                    {lead.phone}
                  </p>
                </div>
              </div>
              <button
                onClick={closeLeadDetail}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-6 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accentLight">{treatmentLabel(lead.treatment)}</Badge>
                <StatusBadge status={lead.status} />
              </div>

              <PriorityFacets lead={lead} variant="full" />

              <div className="rounded-xl bg-zinc-50 p-4">
                <p className="text-xs font-medium text-zinc-400">Próxima acción</p>
                <p className="mt-1 text-sm font-medium text-zinc-800">{lead.nextAction}</p>
                <div className="mt-3">
                  <FollowUpButton leadId={lead.id} status={lead.status} />
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-medium text-zinc-400">
                  Historial · última actividad <RelativeTime iso={lead.lastInteractionAt} />
                </p>
                <LeadTimeline events={lead.events} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
