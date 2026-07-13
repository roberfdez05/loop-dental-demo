export const TREATMENTS = [
  {
    id: "implantes",
    label: "Implantes dentales",
    keywords: ["implante", "implantes", "diente perdido", "dientes perdidos", "titanio"],
  },
  {
    id: "ortodoncia_invisible",
    label: "Ortodoncia invisible",
    keywords: ["invisalign", "ortodoncia", "alineadores", "alinear", "dientes torcidos"],
  },
  {
    id: "blanqueamiento",
    label: "Blanqueamiento dental",
    keywords: ["blanqueamiento", "blanquear", "manchas", "dientes blancos", "amarillentos"],
  },
  {
    id: "carillas",
    label: "Carillas de porcelana",
    keywords: ["carillas", "porcelana", "estética dental", "sonrisa perfecta"],
  },
  {
    id: "revision_general",
    label: "Revisión general",
    keywords: ["revisión", "revision", "chequeo", "dolor", "limpieza", "muela"],
  },
] as const;

export type TreatmentId = (typeof TREATMENTS)[number]["id"] | "otro";

export function treatmentLabel(id: TreatmentId): string {
  if (id === "otro") return "Consulta general";
  return TREATMENTS.find((t) => t.id === id)?.label ?? "Consulta general";
}
