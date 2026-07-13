"use client";

import { Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import {
  computeAiSummary,
  computeRecommendedAction,
} from "@/lib/scoring/leadIntelligence";
import type { Lead } from "@/lib/types/lead";

export function AiSummary({ lead }: { lead: Lead }) {
  const bullets = computeAiSummary(lead);
  const action = computeRecommendedAction(lead);
  const ActionIcon = action.icon;

  return (
    <div className="border-b border-zinc-200 bg-accent-50/40 px-4 py-3">
      <div className="mb-2 flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-accent-500" strokeWidth={2.25} />
        <p className="text-xs font-semibold text-accent-700">Resumen IA</p>
      </div>
      <ul className="space-y-1 text-sm text-zinc-700">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex gap-1.5">
            <span className="text-accent-400">·</span>
            {bullet}
          </li>
        ))}
      </ul>
      <Button
        variant="accent"
        size="sm"
        className="mt-3"
        onClick={() =>
          toast.success(`Acción registrada: ${action.label}`, {
            description: `${lead.name} — próximo paso sugerido por la IA.`,
          })
        }
      >
        <ActionIcon className="h-3.5 w-3.5" />
        {action.label}
      </Button>
    </div>
  );
}
