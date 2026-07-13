import type { AiProvider } from "@/lib/ai/types";
import { detectTreatment } from "@/lib/ai/detectTreatment";
import { pickTemplate } from "@/lib/ai/responseTemplates";

/**
 * Implementación actual del contrato AiProvider: detección de tratamiento
 * por keywords + plantillas de respuesta. Sin llamadas de red.
 */
export const keywordAiProvider: AiProvider = {
  async generateResponse({ conversationHistory, latestMessage, patientName }) {
    const previousTreatment = conversationHistory
      .filter((m) => m.sender === "ai")
      .length;

    const detectedTreatment = detectTreatment(latestMessage) ?? "otro";
    const firstName = patientName.trim().split(/\s+/)[0] ?? "";
    const { content, nextAction } = pickTemplate(detectedTreatment, firstName, previousTreatment);

    return {
      content,
      detectedTreatment,
      suggestedNextAction: nextAction,
    };
  },
};
