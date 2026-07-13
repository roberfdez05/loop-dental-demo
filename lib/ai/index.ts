import type { AiProvider } from "@/lib/ai/types";
import { keywordAiProvider } from "@/lib/ai/keywordAiProvider";

/**
 * Punto único de sustitución: para conectar una IA real, crear un
 * `httpAiProvider` que implemente `AiProvider` y devolverlo aquí.
 */
export function getAiProvider(): AiProvider {
  return keywordAiProvider;
}
