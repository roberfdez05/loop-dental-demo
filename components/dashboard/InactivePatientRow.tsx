"use client";

import { useState } from "react";
import { Check, Phone, Send } from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { useAppStore } from "@/lib/store/useAppStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { InactivePatient } from "@/lib/types/inactivePatient";

const GRID_COLS = "md:grid-cols-[1.8fr_1.3fr_1.1fr_1fr_auto]";

export function InactivePatientRow({ patient }: { patient: InactivePatient }) {
  const sendCampaign = useAppStore((state) => state.sendCampaign);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await sendCampaign(patient.id);
    setLoading(false);
  };

  return (
    <div className="border-b border-zinc-100 last:border-b-0">
      <div className={`hidden items-center gap-4 px-4 py-3.5 md:grid ${GRID_COLS}`}>
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar name={patient.name} className="h-8 w-8 text-[11px]" />
          <span className="truncate text-sm font-medium text-zinc-900">{patient.name}</span>
        </div>
        <span className="truncate text-sm text-zinc-600">{patient.lastTreatmentLabel}</span>
        <span className="truncate text-sm text-zinc-500">
          <RelativeTime iso={patient.lastVisitAt} />
        </span>
        <span className="truncate text-sm font-medium text-zinc-700">
          {formatCurrency(patient.estimatedRecoveryValue)}
        </span>
        <CampaignButton loading={loading} sent={!!patient.campaignSent} onClick={handleClick} />
      </div>

      <div className="flex flex-col gap-3 p-4 md:hidden">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Avatar name={patient.name} />
            <div>
              <p className="text-sm font-medium text-zinc-900">{patient.name}</p>
              <p className="flex items-center gap-1 text-xs text-zinc-400">
                <Phone className="h-3 w-3" />
                {patient.phone}
              </p>
            </div>
          </div>
          <span className="text-sm font-medium text-zinc-700">
            {formatCurrency(patient.estimatedRecoveryValue)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-zinc-400">Último tratamiento</p>
            <p className="mt-0.5 text-zinc-700">{patient.lastTreatmentLabel}</p>
          </div>
          <div>
            <p className="text-zinc-400">Última visita</p>
            <p className="mt-0.5 text-zinc-700">
              <RelativeTime iso={patient.lastVisitAt} />
            </p>
          </div>
        </div>
        <CampaignButton loading={loading} sent={!!patient.campaignSent} onClick={handleClick} />
      </div>
    </div>
  );
}

function CampaignButton({
  loading,
  sent,
  onClick,
}: {
  loading: boolean;
  sent: boolean;
  onClick: () => void;
}) {
  return (
    <Button variant={sent ? "outline" : "subtle"} size="sm" loading={loading} onClick={onClick} disabled={loading}>
      {!loading && (sent ? <Check className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />)}
      {sent ? "Campaña enviada" : "Enviar campaña"}
    </Button>
  );
}

export { GRID_COLS as INACTIVE_GRID_COLS };
