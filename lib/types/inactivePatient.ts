export interface InactivePatient {
  id: string;
  name: string;
  phone: string;
  /** Texto libre: pacientes ya tratados pueden tener tratamientos fuera del catálogo activo. */
  lastTreatmentLabel: string;
  lastVisitAt: string;
  estimatedRecoveryValue: number;
  campaignSent?: boolean;
}
