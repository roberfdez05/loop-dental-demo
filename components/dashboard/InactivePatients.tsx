"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/lib/store/useAppStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { InactivePatientRow, INACTIVE_GRID_COLS } from "@/components/dashboard/InactivePatientRow";

const COLLAPSED_COUNT = 3;

export function InactivePatients() {
  const patients = useAppStore((state) => state.inactivePatients);
  const [expanded, setExpanded] = useState(false);

  const sorted = [...patients].sort(
    (a, b) => b.estimatedRecoveryValue - a.estimatedRecoveryValue,
  );
  const visible = expanded ? sorted : sorted.slice(0, COLLAPSED_COUNT);
  const totalValue = patients.reduce((sum, p) => sum + p.estimatedRecoveryValue, 0);

  return (
    <div>
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">Pacientes inactivos</h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            No han vuelto en varios meses — {formatCurrency(totalValue)} recuperables.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden" role="table" aria-label="Pacientes inactivos">
        <div
          className={`hidden items-center gap-4 border-b border-zinc-100 bg-zinc-50/60 px-4 py-2.5 md:grid ${INACTIVE_GRID_COLS}`}
          role="row"
        >
          {["Nombre", "Último tratamiento", "Última visita", "Valor recuperable", ""].map(
            (col) => (
              <span key={col} className="text-xs font-medium text-zinc-400">
                {col}
              </span>
            ),
          )}
        </div>
        <div role="rowgroup">
          {visible.map((patient) => (
            <InactivePatientRow key={patient.id} patient={patient} />
          ))}
        </div>
        {sorted.length > COLLAPSED_COUNT && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex w-full items-center justify-center gap-1.5 border-t border-zinc-100 py-2.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
          >
            {expanded ? "Ver menos" : `Ver los ${sorted.length}`}
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </Card>
    </div>
  );
}
