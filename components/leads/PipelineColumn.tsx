"use client";

import { useAppStore } from "@/lib/store/useAppStore";
import { Avatar } from "@/components/ui/Avatar";
import { STATUS_LABEL } from "@/lib/constants/status";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { treatmentLabel } from "@/lib/data/treatments";
import type { Lead, LeadStatus } from "@/lib/types/lead";

export function PipelineColumn({ status, leads }: { status: LeadStatus; leads: Lead[] }) {
  const openLeadDetail = useAppStore((state) => state.openLeadDetail);
  const totalValue = leads.reduce((sum, l) => sum + l.estimatedValue, 0);

  return (
    <div className="flex w-64 shrink-0 flex-col rounded-xl bg-zinc-50/60 p-2.5">
      <div className="mb-2 flex items-center justify-between px-1.5 py-1">
        <p className="text-xs font-semibold text-zinc-700">{STATUS_LABEL[status]}</p>
        <span className="text-[11px] text-zinc-400">{leads.length}</span>
      </div>
      {leads.length > 0 && (
        <p className="mb-2 px-1.5 text-[11px] text-zinc-400">{formatCurrency(totalValue)}</p>
      )}
      <div className="flex flex-col gap-2">
        {leads.map((lead) => (
          <button
            key={lead.id}
            onClick={() => openLeadDetail(lead.id)}
            className="flex items-start gap-2 rounded-lg border border-zinc-200 bg-white p-2.5 text-left shadow-[var(--shadow-soft)] transition-colors hover:border-accent-200"
          >
            <Avatar name={lead.name} className="h-6 w-6 text-[10px]" />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-zinc-900">{lead.name}</p>
              <p className="truncate text-[11px] text-zinc-400">{treatmentLabel(lead.treatment)}</p>
              <p className="mt-0.5 text-[11px] font-medium text-accent-600">
                {formatCurrency(lead.estimatedValue)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
