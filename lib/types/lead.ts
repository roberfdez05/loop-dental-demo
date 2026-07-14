import type { TreatmentId } from "@/lib/data/treatments";
import type { LeadEvent } from "@/lib/types/leadEvent";

/**
 * Pipeline real de una clínica dental, no estados genéricos de CRM.
 * `aceptado`/`paciente` son los únicos estados "cerrados" (ver CLOSED_STATUSES) —
 * una cita reservada todavía puede caerse, así que no cuenta como ganado.
 */
export type LeadStatus =
  | "nuevo"
  | "contactado"
  | "interesado"
  | "cita_reservada"
  | "diagnostico"
  | "presupuesto"
  | "seguimiento"
  | "aceptado"
  | "paciente";

export interface Lead {
  id: string;
  conversationId?: string;
  name: string;
  phone: string;
  treatment: TreatmentId;
  status: LeadStatus;
  lastInteractionAt: string;
  nextAction: string;
  createdAt: string;
  isNew?: boolean;
  /** Valor potencial del tratamiento en €, usado en las cifras de ingresos del panel. */
  estimatedValue: number;
  /** Historial append-only — nunca se borra, solo se añade. Alimenta el timeline del paciente. */
  events: LeadEvent[];
}
