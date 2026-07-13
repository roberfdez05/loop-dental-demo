import type { StateCreator } from "zustand";
import { toast } from "sonner";

import type { Conversation } from "@/lib/types/conversation";
import type { Message } from "@/lib/types/message";
import { SEED_CONVERSATIONS } from "@/lib/data/seed-conversations";
import { getAiProvider } from "@/lib/ai";
import { createId } from "@/lib/utils/id";
import { delay } from "@/lib/utils/delay";
import type { AppState } from "@/lib/store/useAppStore";

export interface ConversationsSlice {
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversation: (id: string) => void;
  startNewConversation: (input: { name: string; phone: string }) => string;
  sendPatientMessage: (conversationId: string, content: string) => Promise<void>;
}

const TYPING_DELAY_MS = 1200;

export const createConversationsSlice: StateCreator<
  AppState,
  [["zustand/immer", never]],
  [],
  ConversationsSlice
> = (set, get) => ({
  conversations: SEED_CONVERSATIONS,
  activeConversationId: SEED_CONVERSATIONS[0]?.id ?? null,

  setActiveConversation: (id) => {
    set((state) => {
      state.activeConversationId = id;
    });
  },

  startNewConversation: ({ name, phone }) => {
    const id = createId("conv");
    set((state) => {
      state.conversations.unshift({
        id,
        patientName: name,
        patientPhone: phone,
        messages: [],
        isTyping: false,
        lastMessageAt: new Date().toISOString(),
      });
      state.activeConversationId = id;
    });
    return id;
  },

  sendPatientMessage: async (conversationId, content) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const patientMessage: Message = {
      id: createId("msg"),
      conversationId,
      sender: "patient",
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    set((state) => {
      const conversation = state.conversations.find((c) => c.id === conversationId);
      if (!conversation) return;
      conversation.messages.push(patientMessage);
      conversation.lastMessageAt = patientMessage.timestamp;
      conversation.isTyping = true;
    });

    const conversation = get().conversations.find((c) => c.id === conversationId);
    if (!conversation) return;

    await delay(TYPING_DELAY_MS);

    const aiResponse = await getAiProvider().generateResponse({
      conversationHistory: conversation.messages,
      latestMessage: trimmed,
      patientName: conversation.patientName,
    });

    const aiMessage: Message = {
      id: createId("msg"),
      conversationId,
      sender: "ai",
      content: aiResponse.content,
      timestamp: new Date().toISOString(),
    };

    set((state) => {
      const c = state.conversations.find((item) => item.id === conversationId);
      if (!c) return;
      c.messages.push(aiMessage);
      c.lastMessageAt = aiMessage.timestamp;
      c.isTyping = false;
    });

    const lead = get().createOrUpdateLead({
      conversationId,
      name: conversation.patientName,
      phone: conversation.patientPhone,
      treatment: aiResponse.detectedTreatment,
      nextAction: aiResponse.suggestedNextAction,
    });

    set((state) => {
      const c = state.conversations.find((item) => item.id === conversationId);
      if (c) c.leadId = lead.id;
    });

    if (lead.isNew) {
      toast.success("Nuevo lead añadido", {
        description: `${lead.name} se ha añadido a tu lista de leads.`,
      });
    }
  },
});
