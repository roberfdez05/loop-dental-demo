import { TREATMENTS, type TreatmentId } from "@/lib/data/treatments";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Puntúa cada tratamiento del catálogo por nº de keywords presentes en el texto. */
export function detectTreatment(text: string): TreatmentId | null {
  const normalized = normalize(text);

  let bestMatch: { id: TreatmentId; score: number } | null = null;

  for (const treatment of TREATMENTS) {
    const score = treatment.keywords.reduce((count, keyword) => {
      return normalized.includes(normalize(keyword)) ? count + 1 : count;
    }, 0);

    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { id: treatment.id, score };
    }
  }

  return bestMatch?.id ?? null;
}
