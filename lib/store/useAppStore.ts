import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import {
  createConversationsSlice,
  type ConversationsSlice,
} from "@/lib/store/slices/conversationsSlice";
import { createLeadsSlice, type LeadsSlice } from "@/lib/store/slices/leadsSlice";
import { createPatientsSlice, type PatientsSlice } from "@/lib/store/slices/patientsSlice";
import { createUiSlice, type UiSlice } from "@/lib/store/slices/uiSlice";
import { createDemoSlice, type DemoSlice } from "@/lib/store/slices/demoSlice";
import { SEED_CONVERSATIONS } from "@/lib/data/seed-conversations";
import { SEED_LEADS } from "@/lib/data/seed-leads";
import { SEED_INACTIVE_PATIENTS } from "@/lib/data/seed-inactive-patients";

export type AppState = ConversationsSlice &
  LeadsSlice &
  PatientsSlice &
  UiSlice &
  DemoSlice & {
    resetDemo: () => void;
  };

export const useAppStore = create<AppState>()(
  immer((...a) => ({
    ...createConversationsSlice(...a),
    ...createLeadsSlice(...a),
    ...createPatientsSlice(...a),
    ...createUiSlice(...a),
    ...createDemoSlice(...a),
    resetDemo: () => {
      const [set] = a;
      set((state) => {
        state.conversations = SEED_CONVERSATIONS;
        state.leads = SEED_LEADS;
        state.activeConversationId = SEED_CONVERSATIONS[0]?.id ?? null;
        state.inactivePatients = SEED_INACTIVE_PATIENTS;
        state.selectedLeadId = null;
      });
    },
  })),
);
