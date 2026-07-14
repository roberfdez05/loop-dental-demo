import type { StateCreator } from "zustand";

import type { AppState } from "@/lib/store/useAppStore";

/**
 * Estado de UI efímero, deliberadamente separado de `leadsSlice` (dominio) —
 * qué lead está abierto en el slide-over no es un dato del negocio, es una
 * decisión de la interfaz. Mismo patrón que `activeConversationId`.
 */
export interface UiSlice {
  selectedLeadId: string | null;
  openLeadDetail: (leadId: string) => void;
  closeLeadDetail: () => void;
}

export const createUiSlice: StateCreator<
  AppState,
  [["zustand/immer", never]],
  [],
  UiSlice
> = (set) => ({
  selectedLeadId: null,

  openLeadDetail: (leadId) => {
    set((state) => {
      state.selectedLeadId = leadId;
    });
  },

  closeLeadDetail: () => {
    set((state) => {
      state.selectedLeadId = null;
    });
  },
});
