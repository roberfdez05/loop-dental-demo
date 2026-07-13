import type { LeadStatus } from "@/lib/types/lead";

export const STATUS_PIPELINE: LeadStatus[] = [
  "nuevo",
  "contactado",
  "interesado",
  "cita_agendada",
];

export const STATUS_LABEL: Record<LeadStatus, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  interesado: "Interesado",
  cita_agendada: "Cita agendada",
};

/** Texto de "próxima acción" sugerido al entrar en cada estado del pipeline. */
export const STATUS_NEXT_ACTION: Record<LeadStatus, string> = {
  nuevo: "Enviar primer contacto",
  contactado: "Confirmar interés y resolver dudas",
  interesado: "Enviar presupuesto y proponer cita",
  cita_agendada: "Confirmar asistencia 24h antes",
};

export function nextStatus(status: LeadStatus): LeadStatus {
  const index = STATUS_PIPELINE.indexOf(status);
  if (index === -1 || index === STATUS_PIPELINE.length - 1) return status;
  return STATUS_PIPELINE[index + 1];
}
