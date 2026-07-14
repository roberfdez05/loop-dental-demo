import type { StateCreator } from "zustand";
import { toast } from "sonner";

import { DEMO_SCRIPT } from "@/lib/data/demo-script";
import { delay } from "@/lib/utils/delay";
import type { AppState } from "@/lib/store/useAppStore";

export interface DemoSlice {
  isPlayingDemo: boolean;
  playDemoWeek: () => Promise<void>;
  stopDemoWeek: () => void;
}

/**
 * Reutiliza las acciones YA EXISTENTES del store (nunca duplica su lógica de
 * toasts/plantillas/creación de leads) en una secuencia guionizada con
 * pausas — no es un motor de simulación aparte. `resetDemo()` se llama al
 * empezar para que sea siempre reproducible desde un estado limpio conocido.
 * `setTimeout`/`delay()` no es cancelable a mitad, así que cada beat
 * comprueba `isPlayingDemo` antes de ejecutar su efecto — `stopDemoWeek()`
 * detiene el guion en el siguiente punto de control, no instantáneamente.
 */
export const createDemoSlice: StateCreator<
  AppState,
  [["zustand/immer", never]],
  [],
  DemoSlice
> = (set, get) => ({
  isPlayingDemo: false,

  stopDemoWeek: () => {
    set((state) => {
      state.isPlayingDemo = false;
    });
  },

  playDemoWeek: async () => {
    const isActive = () => get().isPlayingDemo;

    get().resetDemo();
    set((state) => {
      state.isPlayingDemo = true;
    });
    toast("Simulando una semana en la clínica…", {
      description: "Modo demo activado",
    });

    await delay(2000);
    if (!isActive()) return;
    const [patientA, patientB] = DEMO_SCRIPT.newPatients;
    const conv1Id = get().startNewConversation({ name: patientA.name, phone: patientA.phone });
    await get().sendPatientMessage(conv1Id, patientA.message);

    await delay(3000);
    if (!isActive()) return;
    const conv2Id = get().startNewConversation({ name: patientB.name, phone: patientB.phone });
    await get().sendPatientMessage(conv2Id, patientB.message);

    await delay(3000);
    if (!isActive()) return;
    await get().sendFollowUp(DEMO_SCRIPT.midStageLeadId);

    await delay(3000);
    if (!isActive()) return;
    const conv1LeadId = get().conversations.find((c) => c.id === conv1Id)?.leadId;
    if (conv1LeadId) await get().sendFollowUp(conv1LeadId);

    await delay(4000);
    if (!isActive()) return;
    await get().sendFollowUp(DEMO_SCRIPT.closingLeadId);
    toast.success("¡Tratamiento cerrado!", {
      description: "Un lead acaba de convertirse en paciente.",
    });

    await delay(4000);
    if (!isActive()) return;
    await get().sendCampaign(DEMO_SCRIPT.inactivePatientId);

    await delay(1500);
    if (!isActive()) return;
    set((state) => {
      state.isPlayingDemo = false;
    });
    toast.success("Semana simulada completa", {
      description: "2 pacientes nuevos · 1 tratamiento recuperado · 1 campaña enviada",
    });
  },
});
