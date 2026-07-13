import type { InactivePatient } from "@/lib/types/inactivePatient";

const daysAgo = (d: number) => new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();

export const SEED_INACTIVE_PATIENTS: InactivePatient[] = [
  {
    id: "inactive-1",
    name: "Roberto Álvarez",
    phone: "+34 611 222 101",
    lastTreatmentLabel: "Limpieza dental",
    lastVisitAt: daysAgo(210),
    estimatedRecoveryValue: 900,
  },
  {
    id: "inactive-2",
    name: "Carmen Ortiz",
    phone: "+34 622 333 102",
    lastTreatmentLabel: "Empaste",
    lastVisitAt: daysAgo(260),
    estimatedRecoveryValue: 650,
  },
  {
    id: "inactive-3",
    name: "Miguel Serrano",
    phone: "+34 633 444 103",
    lastTreatmentLabel: "Ortodoncia",
    lastVisitAt: daysAgo(320),
    estimatedRecoveryValue: 1400,
  },
  {
    id: "inactive-4",
    name: "Isabel Domínguez",
    phone: "+34 644 555 104",
    lastTreatmentLabel: "Endodoncia",
    lastVisitAt: daysAgo(190),
    estimatedRecoveryValue: 780,
  },
  {
    id: "inactive-5",
    name: "Francisco León",
    phone: "+34 655 666 105",
    lastTreatmentLabel: "Revisión general",
    lastVisitAt: daysAgo(400),
    estimatedRecoveryValue: 500,
  },
  {
    id: "inactive-6",
    name: "Patricia Vidal",
    phone: "+34 666 777 106",
    lastTreatmentLabel: "Blanqueamiento dental",
    lastVisitAt: daysAgo(240),
    estimatedRecoveryValue: 320,
  },
  {
    id: "inactive-7",
    name: "Alberto Cano",
    phone: "+34 677 888 107",
    lastTreatmentLabel: "Implante dental",
    lastVisitAt: daysAgo(280),
    estimatedRecoveryValue: 3100,
  },
  {
    id: "inactive-8",
    name: "Beatriz Molina",
    phone: "+34 688 999 108",
    lastTreatmentLabel: "Carillas de porcelana",
    lastVisitAt: daysAgo(365),
    estimatedRecoveryValue: 3600,
  },
];
