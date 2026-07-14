import type { StateCreator } from "zustand";
import { toast } from "sonner";

import type { Lead, LeadStatus } from "@/lib/types/lead";
import type { LeadEvent, LeadEventType } from "@/lib/types/leadEvent";
import { estimateValueForTreatment, type TreatmentId } from "@/lib/data/treatments";
import { SEED_LEADS } from "@/lib/data/seed-leads";
import { STATUS_LABEL, STATUS_NEXT_ACTION, nextStatus } from "@/lib/constants/status";
import { createId } from "@/lib/utils/id";
import { delay } from "@/lib/utils/delay";
import type { AppState } from "@/lib/store/useAppStore";

export interface LeadsSlice {
  leads: Lead[];
  createOrUpdateLead: (input: {
    conversationId: string;
    name: string;
    phone: string;
    treatment: TreatmentId;
    nextAction: string;
  }) => Lead;
  sendFollowUp: (leadId: string) => Promise<void>;
  clearNewLeadFlag: (leadId: string) => void;
}

const FOLLOW_UP_DELAY_MS = 900;

/** Tipo de evento más representativo al entrar en cada etapa del pipeline. */
const EVENT_TYPE_BY_STATUS: Record<LeadStatus, LeadEventType> = {
  nuevo: "primer_contacto",
  contactado: "respuesta_ia",
  interesado: "informacion_enviada",
  cita_reservada: "cita_reservada",
  diagnostico: "diagnostico",
  presupuesto: "presupuesto_enviado",
  seguimiento: "seguimiento",
  aceptado: "aceptado",
  paciente: "paciente",
};

function buildEvent(status: LeadStatus, timestamp: string): LeadEvent {
  return {
    id: createId("evt"),
    type: EVENT_TYPE_BY_STATUS[status],
    label: STATUS_LABEL[status],
    timestamp,
  };
}

export const createLeadsSlice: StateCreator<
  AppState,
  [["zustand/immer", never]],
  [],
  LeadsSlice
> = (set, get) => ({
  leads: SEED_LEADS,

  createOrUpdateLead: ({ conversationId, name, phone, treatment, nextAction }) => {
    const existing = get().leads.find((lead) => lead.conversationId === conversationId);
    const now = new Date().toISOString();

    if (existing) {
      set((state) => {
        const lead = state.leads.find((l) => l.id === existing.id);
        if (!lead) return;
        lead.treatment = treatment;
        lead.nextAction = nextAction;
        lead.lastInteractionAt = now;
        lead.estimatedValue = estimateValueForTreatment(treatment);
        if (lead.status === "nuevo") lead.status = "contactado";
        lead.events.push({
          id: createId("evt"),
          type: "informacion_enviada",
          label: "Información enviada por el asistente",
          timestamp: now,
        });
      });
      return get().leads.find((l) => l.id === existing.id)!;
    }

    const newLead: Lead = {
      id: createId("lead"),
      conversationId,
      name,
      phone,
      treatment,
      status: "nuevo",
      lastInteractionAt: now,
      nextAction,
      createdAt: now,
      isNew: true,
      estimatedValue: estimateValueForTreatment(treatment),
      events: [
        { id: createId("evt"), type: "primer_contacto", label: "Primer contacto del paciente", timestamp: now },
        { id: createId("evt"), type: "respuesta_ia", label: "Respuesta automática enviada", timestamp: now },
      ],
    };

    set((state) => {
      state.leads.unshift(newLead);
    });

    return newLead;
  },

  sendFollowUp: async (leadId) => {
    const lead = get().leads.find((l) => l.id === leadId);
    if (!lead) return;

    const promise = (async () => {
      await delay(FOLLOW_UP_DELAY_MS);
      set((state) => {
        const target = state.leads.find((l) => l.id === leadId);
        if (!target) return;
        const advanced = nextStatus(target.status);
        target.status = advanced;
        target.nextAction = STATUS_NEXT_ACTION[advanced];
        const now = new Date().toISOString();
        target.lastInteractionAt = now;
        target.events.push(buildEvent(advanced, now));
      });
    })();

    toast.promise(promise, {
      loading: `Actualizando a ${lead.name}...`,
      success: `${lead.name} avanzó de etapa`,
      error: "No se pudo actualizar el lead",
    });

    await promise;
  },

  clearNewLeadFlag: (leadId) => {
    set((state) => {
      const lead = state.leads.find((l) => l.id === leadId);
      if (lead) lead.isNew = false;
    });
  },
});
