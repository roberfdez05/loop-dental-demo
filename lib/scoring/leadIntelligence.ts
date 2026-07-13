import { differenceInHours } from "date-fns";
import { CalendarClock, CreditCard, FileText, Phone, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { Lead } from "@/lib/types/lead";
import { treatmentLabel } from "@/lib/data/treatments";

export type Priority = "alta" | "media" | "baja";

/**
 * Prioridad = urgencia (tiempo sin respuesta) + etapa del embudo, a propósito
 * sin `estimatedValue`: mezclar valor aquí hace que dos leads con la misma
 * espera muestren prioridades distintas sin motivo visible en la UI.
 * `cita_agendada` tiene guard explícito: el trato ya está prácticamente
 * ganado, así que nunca debe leerse como urgente aunque lleve días sin tocar.
 */
export function computePriority(lead: Lead, now: number = Date.now()): Priority {
  if (lead.status === "cita_agendada") return "baja";

  const hoursSince = differenceInHours(now, new Date(lead.lastInteractionAt));
  const statusScore = { interesado: 3, nuevo: 2, contactado: 1 }[lead.status];
  const urgencyScore = hoursSince >= 24 ? 3 : hoursSince >= 6 ? 2 : 1;
  const total = statusScore + urgencyScore;

  if (total >= 5) return "alta";
  if (total >= 3) return "media";
  return "baja";
}

const BASE_PROBABILITY_BY_STATUS: Record<Lead["status"], number> = {
  nuevo: 25,
  contactado: 45,
  interesado: 68,
  cita_agendada: 90,
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
 * como un error de cálculo, no como una probabilidad real.
 */
export function computeClosingProbability(lead: Lead): number {
  const base = BASE_PROBABILITY_BY_STATUS[lead.status];
  const jitter = (hashString(lead.id) % 17) - 8; // -8..+8
  return Math.min(95, Math.max(8, base + jitter));
}

export type RecommendedActionType =
  | "llamar_hoy"
  | "enviar_presupuesto"
  | "enviar_financiacion"
  | "recordar_revision"
  | "cerrar_conversacion";

export interface RecommendedAction {
  type: RecommendedActionType;
  label: string;
  icon: LucideIcon;
}

const ACTION_LABEL: Record<RecommendedActionType, string> = {
  llamar_hoy: "Llamar hoy",
  enviar_presupuesto: "Enviar presupuesto",
  enviar_financiacion: "Enviar financiación",
  recordar_revision: "Recordar revisión",
  cerrar_conversacion: "Cerrar conversación",
};

const ACTION_ICON: Record<RecommendedActionType, LucideIcon> = {
  llamar_hoy: Phone,
  enviar_presupuesto: FileText,
  enviar_financiacion: CreditCard,
  recordar_revision: CalendarClock,
  cerrar_conversacion: XCircle,
};

function buildAction(type: RecommendedActionType): RecommendedAction {
  return { type, label: ACTION_LABEL[type], icon: ACTION_ICON[type] };
}

const STALE_THRESHOLD_HOURS = 168; // 7 días
const FINANCING_VALUE_THRESHOLD = 2000;

export function computeRecommendedAction(lead: Lead, now: number = Date.now()): RecommendedAction {
  if (lead.status === "cita_agendada") return buildAction("recordar_revision");

  const hoursSince = differenceInHours(now, new Date(lead.lastInteractionAt));
  if (lead.status === "nuevo" && hoursSince > STALE_THRESHOLD_HOURS) {
    return buildAction("cerrar_conversacion");
  }

  if (computePriority(lead, now) === "alta") return buildAction("llamar_hoy");
  if (lead.status === "interesado") return buildAction("enviar_presupuesto");
  if (lead.status === "contactado" && lead.estimatedValue >= FINANCING_VALUE_THRESHOLD) {
    return buildAction("enviar_financiacion");
  }
  return buildAction("llamar_hoy");
}

const STATUS_SUMMARY_BULLET: Record<Lead["status"], string> = {
  nuevo: "Primer contacto enviado, aún sin respuesta del equipo.",
  contactado: "Ha recibido primer contacto, pendiente de mostrar interés claro.",
  interesado: "Muestra interés claro, pendiente de presupuesto o cita.",
  cita_agendada: "Cita ya agendada, solo pendiente de confirmación.",
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
