"use client";

import { AnimatePresence } from "framer-motion";
import { ArrowLeft, Phone } from "lucide-react";

import { useAppStore } from "@/lib/store/useAppStore";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { ClosingProbabilityRing } from "@/components/ui/ClosingProbabilityRing";
import { MessageBubble } from "@/components/conversations/MessageBubble";
import { TypingIndicator } from "@/components/conversations/TypingIndicator";
import { QuickReplies } from "@/components/conversations/QuickReplies";
import { MessageComposer } from "@/components/conversations/MessageComposer";
import { AiSummary } from "@/components/conversations/AiSummary";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { treatmentLabel } from "@/lib/data/treatments";
import { computePriority, computeClosingProbability } from "@/lib/scoring/leadIntelligence";

export function ChatThread({
  conversationId,
  onBack,
}: {
  conversationId: string;
  onBack?: () => void;
}) {
  const conversation = useAppStore((state) =>
    state.conversations.find((c) => c.id === conversationId),
  );
  const lead = useAppStore((state) =>
    state.leads.find((l) => l.conversationId === conversationId),
  );
  const sendPatientMessage = useAppStore((state) => state.sendPatientMessage);

  const scrollRef = useAutoScroll(
    `${conversation?.messages.length ?? 0}-${conversation?.isTyping}`,
  );

  if (!conversation) {
    return (
      <div className="flex h-full flex-1 items-center justify-center text-sm text-zinc-400">
        Selecciona una conversación
      </div>
    );
  }

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col bg-zinc-50">
      <div className="flex items-center gap-3 border-b border-zinc-200 bg-white px-4 py-3.5">
        {onBack && (
          <button
            onClick={onBack}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 md:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <Avatar name={conversation.patientName} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-900">
            {conversation.patientName}
          </p>
          <p className="flex items-center gap-1 text-xs text-zinc-400">
            <Phone className="h-3 w-3" />
            {conversation.patientPhone}
          </p>
        </div>
        {lead && (
          <div className="flex items-center gap-2">
            <Badge variant="accentLight">{treatmentLabel(lead.treatment)}</Badge>
            <ClosingProbabilityRing probability={computeClosingProbability(lead)} size={30} />
            <PriorityBadge priority={computePriority(lead)} />
          </div>
        )}
      </div>

      {lead && <AiSummary lead={lead} />}

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <AnimatePresence initial={false}>
          {conversation.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </AnimatePresence>
        {conversation.isTyping && <TypingIndicator />}
      </div>

      <QuickReplies onPick={(text) => sendPatientMessage(conversation.id, text)} />
      <MessageComposer
        disabled={conversation.isTyping}
        onSend={(text) => sendPatientMessage(conversation.id, text)}
      />
    </div>
  );
}
