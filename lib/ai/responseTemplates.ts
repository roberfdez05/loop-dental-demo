import type { TreatmentId } from "@/lib/data/treatments";

interface Template {
  variants: (name: string) => string[];
  nextAction: string;
}

const TEMPLATES: Record<Exclude<TreatmentId, "otro">, Template> = {
  implantes: {
    variants: (name) => [
      `¡Hola${name ? `, ${name}` : ""}! Gracias por escribirnos. Los implantes dentales son una solución permanente para reemplazar piezas perdidas, con una tasa de éxito superior al 95%. Para darte un presupuesto orientativo necesitaríamos ver tu caso: ¿podrías confirmarnos tu nombre y un teléfono de contacto para que el equipo clínico te llame?`,
      `Un placer atenderte${name ? `, ${name}` : ""}. Trabajamos con implantes de titanio de alta gama y ofrecemos una primera consulta con radiografía incluida para valorar tu caso sin compromiso. Déjanos tu nombre y teléfono y te contactamos hoy mismo para agendarla.`,
    ],
    nextAction: "Llamar para agendar consulta de valoración con radiografía",
  },
  ortodoncia_invisible: {
    variants: (name) => [
      `¡Hola${name ? `, ${name}` : ""}! La ortodoncia invisible es una de nuestras opciones más solicitadas: alineadores prácticamente imperceptibles y tratamientos que suelen durar entre 6 y 18 meses según el caso. ¿Nos compartes tu nombre y teléfono para que te preparemos un plan personalizado?`,
      `Gracias por tu interés en la ortodoncia invisible${name ? `, ${name}` : ""}. Podemos hacerte un escáner 3D gratuito para mostrarte cómo quedaría tu sonrisa antes de empezar. Solo necesitamos tu nombre y un teléfono para coordinar la cita.`,
    ],
    nextAction: "Coordinar cita para escáner 3D gratuito",
  },
  blanqueamiento: {
    variants: (name) => [
      `¡Hola${name ? `, ${name}` : ""}! Nuestro blanqueamiento dental profesional aclara hasta 8 tonos en una sola sesión de aproximadamente 1 hora. ¿Nos dejas tu nombre y teléfono para reservarte una franja horaria esta semana?`,
      `Buenas${name ? `, ${name}` : ""}, el blanqueamiento es un tratamiento rápido y muy agradecido. Podemos combinarlo con una limpieza previa para mejores resultados. Compártenos tu nombre y teléfono y te proponemos horarios disponibles.`,
    ],
    nextAction: "Proponer franjas horarias disponibles esta semana",
  },
  carillas: {
    variants: (name) => [
      `¡Hola${name ? `, ${name}` : ""}! Las carillas de porcelana permiten transformar la sonrisa manteniendo un aspecto totalmente natural. Para diseñar tu caso nos gustaría verte en consulta: ¿nos compartes tu nombre y teléfono?`,
      `Encantados de ayudarte${name ? `, ${name}` : ""}. Hacemos un diseño de sonrisa digital antes de empezar para que veas el resultado esperado. Déjanos tu nombre y teléfono y coordinamos una primera visita.`,
    ],
    nextAction: "Agendar visita para diseño de sonrisa digital",
  },
  revision_general: {
    variants: (name) => [
      `¡Hola${name ? `, ${name}` : ""}! Gracias por contactarnos. Podemos ofrecerte una revisión completa con diagnóstico y presupuesto sin compromiso. ¿Nos indicas tu nombre y teléfono para agendarla?`,
      `Buenas${name ? `, ${name}` : ""}, lamentamos que tengas molestias. Podemos darte cita esta misma semana para valorar tu caso. Compártenos tu nombre y un teléfono de contacto y te confirmamos horario.`,
    ],
    nextAction: "Agendar revisión y diagnóstico esta semana",
  },
};

const FALLBACK: Template = {
  variants: (name) => [
    `¡Hola${name ? `, ${name}` : ""}! Gracias por escribirnos a Clínica Dental Sonrisa. Cuéntanos un poco más sobre lo que necesitas y con gusto te ayudamos a encontrar el tratamiento adecuado. Si nos compartes tu nombre y teléfono, un especialista se pondrá en contacto contigo.`,
  ],
  nextAction: "Cualificar la consulta y ofrecer cita de valoración",
};

export function pickTemplate(
  treatment: TreatmentId,
  patientName: string,
  variantSeed: number,
): { content: string; nextAction: string } {
  const template = treatment === "otro" ? FALLBACK : TEMPLATES[treatment];
  const variants = template.variants(patientName);
  const content = variants[variantSeed % variants.length];
  return { content, nextAction: template.nextAction };
}
