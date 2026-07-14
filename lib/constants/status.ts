import type { LeadStatus } from "@/lib/types/lead";

export const STATUS_PIPELINE: LeadStatus[] = [
  "nuevo",
  "contactado",
  "interesado",
  "cita_reservada",
  "diagnostico",
  "presupuesto",
  "seguimiento",
  "aceptado",
  "paciente",
];

/** Únicos estados donde el trato está realmente ganado — una cita reservada aún puede caerse. */
export const CLOSED_STATUSES: LeadStatus[] = ["aceptado", "paciente"];

export function isClosedStatus(status: LeadStatus): boolean {
  return CLOSED_STATUSES.includes(status);
}

export const STATUS_LABEL: Record<LeadStatus, string> = {
  nuevo: "Nuevo lead",
  contactado: "Contactado",
  interesado: "Interesado",
  cita_reservada: "Cita reservada",
  diagnostico: "Diagnóstico",
  presupuesto: "Presupuesto enviado",
  seguimiento: "En seguimiento",
  aceptado: "Presupuesto aceptado",
  paciente: "Paciente",
};

/** Texto de "próxima acción" sugerido al entrar en cada estado del pipeline. */
export const STATUS_NEXT_ACTION: Record<LeadStatus, string> = {
  nuevo: "Enviar primer contacto",
  contactado: "Confirmar interés y resolver dudas",
  interesado: "Proponer cita de valoración",
  cita_reservada: "Confirmar asistencia 24h antes",
  diagnostico: "Preparar y enviar presupuesto",
  presupuesto: "Hacer seguimiento del presupuesto",
  seguimiento: "Resolver dudas y cerrar decisión",
  aceptado: "Agendar el tratamiento",
  paciente: "Programar revisión periódica",
};

export function nextStatus(status: LeadStatus): LeadStatus {
  const index = STATUS_PIPELINE.indexOf(status);
  if (index === -1 || index === STATUS_PIPELINE.length - 1) return status;
  return STATUS_PIPELINE[index + 1];
}
