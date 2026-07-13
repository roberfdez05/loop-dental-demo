import type { StateCreator } from "zustand";
import { toast } from "sonner";

import type { InactivePatient } from "@/lib/types/inactivePatient";
import { SEED_INACTIVE_PATIENTS } from "@/lib/data/seed-inactive-patients";
import { delay } from "@/lib/utils/delay";
import type { AppState } from "@/lib/store/useAppStore";

export interface PatientsSlice {
  inactivePatients: InactivePatient[];
  sendCampaign: (patientId: string) => Promise<void>;
}

const CAMPAIGN_DELAY_MS = 900;

export const createPatientsSlice: StateCreator<
  AppState,
  [["zustand/immer", never]],
  [],
  PatientsSlice
> = (set, get) => ({
  inactivePatients: SEED_INACTIVE_PATIENTS,

  sendCampaign: async (patientId) => {
    const patient = get().inactivePatients.find((p) => p.id === patientId);
    if (!patient) return;

    const promise = (async () => {
      await delay(CAMPAIGN_DELAY_MS);
      set((state) => {
        const target = state.inactivePatients.find((p) => p.id === patientId);
        if (target) target.campaignSent = true;
      });
    })();

    toast.promise(promise, {
      loading: `Enviando campaña a ${patient.name}...`,
      success: `Campaña de reactivación enviada a ${patient.name}`,
      error: "No se pudo enviar la campaña",
    });

    await promise;
  },
});
