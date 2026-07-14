export type LeadEventType =
  | "primer_contacto"
  | "respuesta_ia"
  | "informacion_enviada"
  | "cita_reservada"
  | "diagnostico"
  | "presupuesto_enviado"
  | "seguimiento"
  | "aceptado"
  | "paciente"
  | "campana_reactivacion";

export interface LeadEvent {
  id: string;
  type: LeadEventType;
  label: string;
  timestamp: string;
}
