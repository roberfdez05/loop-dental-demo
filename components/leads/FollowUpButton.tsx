"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store/useAppStore";
import { STATUS_NEXT_ACTION } from "@/lib/constants/status";
import type { LeadStatus } from "@/lib/types/lead";

/**
 * "Cerrado" (aceptado/paciente) es un estado de urgencia — sigue permitiendo
 * avanzar (aceptado → paciente es agendar el tratamiento, una acción real).
 * Solo "paciente" es terminal de verdad: no hay siguiente etapa en el pipeline.
 */
export function FollowUpButton({ leadId, status }: { leadId: string; status: LeadStatus }) {
  const sendFollowUp = useAppStore((state) => state.sendFollowUp);
  const [loading, setLoading] = useState(false);
  const [justSent, setJustSent] = useState(false);

  const isTerminal = status === "paciente";

  const handleClick = async () => {
    setLoading(true);
    await sendFollowUp(leadId);
    setLoading(false);
    setJustSent(true);
    setTimeout(() => setJustSent(false), 2000);
  };

  return (
    <Button
      variant={isTerminal ? "outline" : "subtle"}
      size="sm"
      loading={loading}
      onClick={handleClick}
      disabled={loading || isTerminal}
      title={isTerminal ? undefined : STATUS_NEXT_ACTION[status]}
    >
      {!loading && (justSent ? <Check className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />)}
      {justSent ? "Actualizado" : isTerminal ? "Completado" : "Avanzar etapa"}
    </Button>
  );
}
