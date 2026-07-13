import type { StateCreator } from "zustand";
import { toast } from "sonner";

import type { Lead } from "@/lib/types/lead";
import type { TreatmentId } from "@/lib/data/treatments";
import { SEED_LEADS } from "@/lib/data/seed-leads";
import { STATUS_NEXT_ACTION, nextStatus } from "@/lib/constants/status";
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
        if (lead.status === "nuevo") lead.status = "contactado";
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
        target.lastInteractionAt = new Date().toISOString();
      });
    })();

    toast.promise(promise, {
      loading: `Enviando seguimiento a ${lead.name}...`,
      success: `Seguimiento enviado a ${lead.name}`,
      error: "No se pudo enviar el seguimiento",
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
