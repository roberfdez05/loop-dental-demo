"use client";

import { useAppStore } from "@/lib/store/useAppStore";
import { STATUS_PIPELINE } from "@/lib/constants/status";
import { PipelineColumn } from "@/components/leads/PipelineColumn";

/**
 * Mapa completo de solo lectura — responde "¿dónde está todo?", no "¿qué
 * hago ahora?" (eso es Action Center). Sin drag-and-drop a propósito: no
 * aporta a la demo de 3 minutos y añade complejidad real; avanzar de etapa
 * ya tiene una acción clara en el panel de detalle.
 */
export function PipelineBoard() {
  const leads = useAppStore((state) => state.leads);

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-zinc-900">Pipeline</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {STATUS_PIPELINE.map((status) => (
          <PipelineColumn
            key={status}
            status={status}
            leads={leads.filter((l) => l.status === status)}
          />
        ))}
      </div>
    </div>
  );
}
