import type { Message } from "./message";

export interface Conversation {
  id: string;
  patientName: string;
  patientPhone: string;
  messages: Message[];
  isTyping: boolean;
  leadId?: string;
  lastMessageAt: string;
}
