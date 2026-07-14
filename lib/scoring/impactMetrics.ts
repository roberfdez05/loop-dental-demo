import { isThisMonth } from "date-fns";

import type { Lead } from "@/lib/types/lead";
import type { Conversation } from "@/lib/types/conversation";

/**
 * Minutos que recepción tardaría en recoger datos, explicar el tratamiento y
 * pedir contacto manualmente por cada conversación — cifra simulada y
 * documentada como tal, no medida; es la base de "horas ahorradas".
 */
const AVG_MINUTES_SAVED_PER_CONVERSATION = 12;

function hasEventThisMonth(lead: Lead, types: string[]): boolean {
  return lead.events.some((e) => types.includes(e.type) && isThisMonth(new Date(e.timestamp)));
}

/** Leads que llegaron a "aceptado"/"paciente" este mes — no `createdAt`, que solo marca cuándo se creó el lead. */
export function tratamientosRecuperadosEsteMes(leads: Lead[]): number {
  return leads.filter((l) => hasEventThisMonth(l, ["aceptado", "paciente"])).length;
}

export function citasGeneradasEsteMes(leads: Lead[]): number {
  return leads.filter((l) => hasEventThisMonth(l, ["cita_reservada"])).length;
}

export function horasAhorradas(conversations: Conversation[]): number {
  return Math.round((conversations.length * AVG_MINUTES_SAVED_PER_CONVERSATION) / 60);
}

/** Suma de `estimatedValue` de los leads que se cerraron este mes (evento real, no fecha de creación). */
export function ingresosGeneradosEsteMes(leads: Lead[]): number {
  return leads
    .filter((l) => hasEventThisMonth(l, ["aceptado", "paciente"]))
    .reduce((sum, l) => sum + l.estimatedValue, 0);
}
