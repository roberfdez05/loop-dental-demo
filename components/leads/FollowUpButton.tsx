"use client";

import { useState } from "react";
import { Send, Check } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store/useAppStore";
import type { LeadStatus } from "@/lib/types/lead";

export function FollowUpButton({ leadId, status }: { leadId: string; status: LeadStatus }) {
  const sendFollowUp = useAppStore((state) => state.sendFollowUp);
  const [loading, setLoading] = useState(false);
  const [justSent, setJustSent] = useState(false);

  const isClosed = status === "cita_agendada";

  const handleClick = async () => {
    setLoading(true);
    await sendFollowUp(leadId);
    setLoading(false);
    setJustSent(true);
    setTimeout(() => setJustSent(false), 2000);
  };

  return (
    <Button
      variant={isClosed ? "outline" : "subtle"}
      size="sm"
      loading={loading}
      onClick={handleClick}
      disabled={loading}
    >
      {!loading && (justSent ? <Check className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />)}
      {justSent ? "Enviado" : "Enviar seguimiento"}
    </Button>
  );
}
