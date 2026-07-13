import type { Conversation } from "@/lib/types/conversation";

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

export const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    patientName: "María Fernández",
    patientPhone: "+34 612 345 001",
    leadId: "lead-1",
    isTyping: false,
    lastMessageAt: minutesAgo(12),
    messages: [
      {
        id: "conv-1-msg-1",
        conversationId: "conv-1",
        sender: "patient",
        content:
          "Hola, buenas tardes. Perdí una muela hace unos meses y me han hablado de los implantes dentales, ¿me podéis dar información?",
        timestamp: minutesAgo(180),
      },
      {
        id: "conv-1-msg-2",
        conversationId: "conv-1",
        sender: "ai",
        content:
          "¡Hola María! Gracias por escribirnos. Los implantes dentales son una solución permanente para reemplazar piezas perdidas, con una tasa de éxito superior al 95%. Para darte un presupuesto orientativo necesitaríamos ver tu caso: ¿podrías confirmarnos un teléfono de contacto para que el equipo clínico te llame?",
        timestamp: minutesAgo(179),
      },
      {
        id: "conv-1-msg-3",
        conversationId: "conv-1",
        sender: "patient",
        content: "Claro, mi teléfono es 612 345 001. ¿Y aproximadamente cuánto cuesta?",
        timestamp: minutesAgo(175),
      },
      {
        id: "conv-1-msg-4",
        conversationId: "conv-1",
        sender: "ai",
        content:
          "El precio depende del diagnóstico (número de piezas, estado del hueso, etc.), por eso la primera consulta con radiografía panorámica es gratuita y sin compromiso. Así te damos un presupuesto cerrado. ¿Te viene bien esta semana?",
        timestamp: minutesAgo(174),
      },
      {
        id: "conv-1-msg-5",
        conversationId: "conv-1",
        sender: "patient",
        content: "Perfecto, el jueves por la tarde me viene genial.",
        timestamp: minutesAgo(170),
      },
      {
        id: "conv-1-msg-6",
        conversationId: "conv-1",
        sender: "ai",
        content:
          "Te reservo el jueves a las 17:30 para la valoración con radiografía incluida. Te llegará un recordatorio 24h antes. ¡Nos vemos pronto, María!",
        timestamp: minutesAgo(12),
      },
    ],
  },
  {
    id: "conv-2",
    patientName: "Javier Ruiz",
    patientPhone: "+34 623 456 002",
    leadId: "lead-2",
    isTyping: false,
    lastMessageAt: minutesAgo(90),
    messages: [
      {
        id: "conv-2-msg-1",
        conversationId: "conv-2",
        sender: "patient",
        content:
          "Buenas, quería preguntar por la ortodoncia invisible. Tengo los dientes de abajo un poco torcidos y me da vergüenza llevar brackets normales.",
        timestamp: minutesAgo(200),
      },
      {
        id: "conv-2-msg-2",
        conversationId: "conv-2",
        sender: "ai",
        content:
          "¡Hola Javier! La ortodoncia invisible es una de nuestras opciones más solicitadas: alineadores prácticamente imperceptibles y tratamientos que suelen durar entre 6 y 18 meses según el caso. Podemos hacerte un escáner 3D gratuito para mostrarte cómo quedaría tu sonrisa antes de empezar. ¿Nos dejas un teléfono para coordinar la cita?",
        timestamp: minutesAgo(198),
      },
      {
        id: "conv-2-msg-3",
        conversationId: "conv-2",
        sender: "patient",
        content: "623 456 002. ¿Y el precio ronda cuánto, más o menos?",
        timestamp: minutesAgo(95),
      },
      {
        id: "conv-2-msg-4",
        conversationId: "conv-2",
        sender: "ai",
        content:
          "Depende de la complejidad del caso, pero en el escáner 3D te damos un presupuesto exacto al momento y sin compromiso. ¿Te viene mejor por la mañana o por la tarde?",
        timestamp: minutesAgo(90),
      },
    ],
  },
  {
    id: "conv-3",
    patientName: "Lucía Gómez",
    patientPhone: "+34 634 567 003",
    leadId: "lead-3",
    isTyping: false,
    lastMessageAt: minutesAgo(300),
    messages: [
      {
        id: "conv-3-msg-1",
        conversationId: "conv-3",
        sender: "patient",
        content:
          "Hola! Se me han empezado a manchar un poco los dientes por el café, ¿hacéis blanqueamiento dental?",
        timestamp: minutesAgo(310),
      },
      {
        id: "conv-3-msg-2",
        conversationId: "conv-3",
        sender: "ai",
        content:
          "¡Hola Lucía! Sí, nuestro blanqueamiento dental profesional aclara hasta 8 tonos en una sola sesión de aproximadamente 1 hora. ¿Nos dejas un teléfono para reservarte una franja horaria esta semana?",
        timestamp: minutesAgo(308),
      },
      {
        id: "conv-3-msg-3",
        conversationId: "conv-3",
        sender: "patient",
        content: "Sí, claro: 634 567 003.",
        timestamp: minutesAgo(300),
      },
    ],
  },
];
