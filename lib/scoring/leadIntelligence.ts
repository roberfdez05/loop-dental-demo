import { differenceInHours } from "date-fns";
import {
  Calendar,
  CalendarClock,
  ClipboardCheck,
  CreditCard,
  FileText,
  Phone,
  RefreshCw,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { Lead, LeadStatus } from "@/lib/types/lead";
import { treatmentLabel } from "@/lib/data/treatments";
import { isClosedStatus } from "@/lib/constants/status";

export type Priority = "alta" | "media" | "baja";

/**
 * Prioridad = urgencia (tiempo sin respuesta) + etapa del embudo, a propósito
 * sin `estimatedValue`: mezclar valor aquí hace que dos leads con la misma
 * espera muestren prioridades distintas sin motivo visible en la UI.
 * Los estados cerrados (`aceptado`/`paciente`) tienen guard explícito: el
 * trato ya está ganado, así que nunca deben leerse como urgentes.
 */
export function computePriority(lead: Lead, now: number = Date.now()): Priority {
  if (isClosedStatus(lead.status)) return "baja";

  const hoursSince = differenceInHours(now, new Date(lead.lastInteractionAt));
  const statusScore: Record<Exclude<LeadStatus, "aceptado" | "paciente">, number> = {
    nuevo: 2,
    contactado: 1,
    interesado: 3,
    cita_reservada: 2,
    diagnostico: 2,
    presupuesto: 3,
    seguimiento: 2,
  };
  const urgencyScore = hoursSince >= 24 ? 3 : hoursSince >= 6 ? 2 : 1;
  const total = statusScore[lead.status as keyof typeof statusScore] + urgencyScore;

  if (total >= 5) return "alta";
  if (total >= 3) return "media";
  return "baja";
}

/** Faceta independiente de "prioridad": cuánto tiempo lleva esperando, en texto legible. */
export function computeUrgencyLabel(lead: Lead, now: number = Date.now()): string {
  const hoursSince = differenceInHours(now, new Date(lead.lastInteractionAt));
  if (hoursSince < 1) return "Hace menos de 1 hora";
  if (hoursSince < 24) return `${hoursSince}h esperando`;
  const days = Math.floor(hoursSince / 24);
  return `${days} ${days === 1 ? "día" : "días"} esperando`;
}

const BASE_PROBABILITY_BY_STATUS: Record<LeadStatus, number> = {
  nuevo: 10,
  contactado: 25,
  interesado: 40,
  cita_reservada: 55,
  diagnostico: 62,
  presupuesto: 70,
  seguimiento: 75,
  aceptado: 90,
  paciente: 95,
};

/** Hash determinista simple (djb2) para variar el % sin aleatoriedad real. */
function hashString(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return Math.abs(hash);
}

/**
 * Probabilidad de cierre basada puramente en la etapa del embudo (igual que
 * un CRM real calcula "stage-based probability"), con una pequeña variación
 * determinista por lead para que no todos los leads del mismo estado
 * muestren el mismo porcentaje exacto. Clamp a [8, 95]: un 0% o 100% se lee
 * como un error de cálculo, no como una probabilidad real. Para estados
 * cerrados, el componente que consume esto debe mostrar "Ganado" en vez del
 * número — ver `isClosedStatus`.
 */
export function computeClosingProbability(lead: Lead): number {
  const base = BASE_PROBABILITY_BY_STATUS[lead.status];
  const jitter = (hashString(lead.id) % 17) - 8; // -8..+8
  return Math.min(95, Math.max(8, base + jitter));
}

export type RecommendedActionType =
  | "llamar_hoy"
  | "agendar_cita"
  | "enviar_presupuesto"
  | "hacer_seguimiento_presupuesto"
  | "enviar_financiacion"
  | "agendar_tratamiento"
  | "recordar_revision"
  | "cerrar_conversacion";

export interface RecommendedAction {
  type: RecommendedActionType;
  label: string;
  icon: LucideIcon;
}

const ACTION_LABEL: Record<RecommendedActionType, string> = {
  llamar_hoy: "Llamar hoy",
  agendar_cita: "Agendar cita",
  enviar_presupuesto: "Enviar presupuesto",
  hacer_seguimiento_presupuesto: "Seguir presupuesto",
  enviar_financiacion: "Enviar financiación",
  agendar_tratamiento: "Agendar tratamiento",
  recordar_revision: "Recordar revisión",
  cerrar_conversacion: "Cerrar conversación",
};

const ACTION_ICON: Record<RecommendedActionType, LucideIcon> = {
  llamar_hoy: Phone,
  agendar_cita: Calendar,
  enviar_presupuesto: FileText,
  hacer_seguimiento_presupuesto: RefreshCw,
  enviar_financiacion: CreditCard,
  agendar_tratamiento: ClipboardCheck,
  recordar_revision: CalendarClock,
  cerrar_conversacion: XCircle,
};

function buildAction(type: RecommendedActionType): RecommendedAction {
  return { type, label: ACTION_LABEL[type], icon: ACTION_ICON[type] };
}

const STALE_THRESHOLD_HOURS = 168; // 7 días
const FINANCING_VALUE_THRESHOLD = 2000;

export function computeRecommendedAction(lead: Lead, now: number = Date.now()): RecommendedAction {
  if (lead.status === "paciente") return buildAction("recordar_revision");
  if (lead.status === "aceptado") return buildAction("agendar_tratamiento");

  const hoursSince = differenceInHours(now, new Date(lead.lastInteractionAt));
  if (lead.status === "nuevo" && hoursSince > STALE_THRESHOLD_HOURS) {
    return buildAction("cerrar_conversacion");
  }

  if (computePriority(lead, now) === "alta") return buildAction("llamar_hoy");
  if (lead.status === "interesado") return buildAction("agendar_cita");
  if (lead.status === "diagnostico") return buildAction("enviar_presupuesto");
  if (lead.status === "presupuesto") {
    return lead.estimatedValue >= FINANCING_VALUE_THRESHOLD
      ? buildAction("enviar_financiacion")
      : buildAction("hacer_seguimiento_presupuesto");
  }
  return buildAction("llamar_hoy");
}

const STATUS_SUMMARY_BULLET: Record<LeadStatus, string> = {
  nuevo: "Primer contacto enviado, aún sin respuesta del equipo.",
  contactado: "Ha recibido primer contacto, pendiente de mostrar interés claro.",
  interesado: "Muestra interés claro, pendiente de agendar cita.",
  cita_reservada: "Cita ya agendada, pendiente de confirmar asistencia.",
  diagnostico: "Diagnóstico realizado, pendiente de enviar presupuesto.",
  presupuesto: "Presupuesto enviado, pendiente de decisión del paciente.",
  seguimiento: "En seguimiento activo tras el presupuesto.",
  aceptado: "Presupuesto aceptado, pendiente de agendar el tratamiento.",
  paciente: "Tratamiento en marcha o completado.",
};

/**
 * Bullets generados por reglas sobre los datos del lead (tratamiento, etapa,
 * valor, urgencia) — no un resumen real de la conversación, a propósito:
 * el objetivo es que el dueño de la clínica capte el caso en 2 segundos.
 */
export function computeAiSummary(lead: Lead, now: number = Date.now()): string[] {
  const bullets = [
    `Busca ${treatmentLabel(lead.treatment).toLowerCase()}.`,
    STATUS_SUMMARY_BULLET[lead.status],
  ];

  if (lead.estimatedValue >= FINANCING_VALUE_THRESHOLD) {
    bullets.push("Tratamiento de alto valor — podría necesitar financiación.");
  } else if (computePriority(lead, now) === "alta") {
    bullets.push("Lleva tiempo sin respuesta, requiere atención prioritaria.");
  }

  if (lead.status === "interesado") {
    bullets.push("Parece listo para agendar cita en los próximos días.");
  }

  return bullets;
}
