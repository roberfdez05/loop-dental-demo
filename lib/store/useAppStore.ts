import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import {
  createConversationsSlice,
  type ConversationsSlice,
} from "@/lib/store/slices/conversationsSlice";
import { createLeadsSlice, type LeadsSlice } from "@/lib/store/slices/leadsSlice";
import { SEED_CONVERSATIONS } from "@/lib/data/seed-conversations";
import { SEED_LEADS } from "@/lib/data/seed-leads";

export type AppState = ConversationsSlice &
  LeadsSlice & {
    resetDemo: () => void;
  };

export const useAppStore = create<AppState>()(
  immer((...a) => ({
    ...createConversationsSlice(...a),
    ...createLeadsSlice(...a),
    resetDemo: () => {
      const [set] = a;
      set((state) => {
        state.conversations = SEED_CONVERSATIONS;
        state.leads = SEED_LEADS;
        state.activeConversationId = SEED_CONVERSATIONS[0]?.id ?? null;
      });
    },
  })),
);
