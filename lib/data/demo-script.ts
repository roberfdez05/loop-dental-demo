/**
 * Guion del "Modo Demo" — contenido editable sin tocar la orquestación
 * (ver `lib/store/slices/demoSlice.ts`). IDs de leads/pacientes referencian
 * los datos semilla en `seed-leads.ts` / `seed-inactive-patients.ts`.
 */
export const DEMO_SCRIPT = {
  newPatients: [
    {
      name: "Nuria Salgado",
      phone: "+34 611 222 013",
      message: "Hola, quería preguntar por la ortodoncia invisible, ¿cuánto tiempo dura el tratamiento?",
    },
    {
      name: "Diego Marín",
      phone: "+34 622 333 014",
      message: "Buenas, me han hablado de los implantes dentales, ¿me podéis dar información?",
    },
  ],
  /** Elena Vidal, en "presupuesto" — avanza a "seguimiento". */
  midStageLeadId: "lead-9",
  /** Miguel Castro, en "seguimiento" — avanza a "aceptado" (el momento "wow"). */
  closingLeadId: "lead-10",
  /** Roberto Álvarez, paciente inactivo con mayor antigüedad. */
  inactivePatientId: "inactive-1",
} as const;
