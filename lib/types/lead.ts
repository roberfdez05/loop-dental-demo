import type { TreatmentId } from "@/lib/data/treatments";

export type LeadStatus = "nuevo" | "contactado" | "interesado" | "cita_agendada";

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
}
