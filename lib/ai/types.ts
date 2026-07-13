import type { Message } from "@/lib/types/message";
import type { TreatmentId } from "@/lib/data/treatments";

export interface AiResponse {
  content: string;
  detectedTreatment: TreatmentId;
  suggestedNextAction: string;
}

/**
 * Contrato independiente de la implementación: el día que haya un proveedor
 * de IA real, se implementa esta misma interfaz y se cambia solo el factory
 * en `lib/ai/index.ts`, sin tocar componentes ni el store.
 */
export interface AiProvider {
  generateResponse(input: {
    conversationHistory: Message[];
    latestMessage: string;
    patientName: string;
  }): Promise<AiResponse>;
}
