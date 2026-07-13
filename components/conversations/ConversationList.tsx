"use client";

import { UserPlus } from "lucide-react";

import { useAppStore } from "@/lib/store/useAppStore";
import { ConversationListItem } from "@/components/conversations/ConversationListItem";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const DEMO_PATIENTS = [
  { name: "Sofía Navarro", phone: "+34 678 901 007" },
  { name: "Diego Herrera", phone: "+34 689 012 008" },
  { name: "Elena Castro", phone: "+34 690 123 009" },
];

export function ConversationList({
  activeId,
  onSelect,
  className,
}: {
  activeId: string | null;
  onSelect: (id: string) => void;
  className?: string;
}) {
  const conversations = useAppStore((state) => state.conversations);
  const startNewConversation = useAppStore((state) => state.startNewConversation);

  const sorted = [...conversations].sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
  );

  const handleNewPatient = () => {
    const patient = DEMO_PATIENTS[conversations.length % DEMO_PATIENTS.length];
    const id = startNewConversation(patient);
    onSelect(id);
  };

  return (
    <div className={cn("flex h-full flex-col border-r border-zinc-200 bg-white", className)}>
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="text-sm font-semibold text-zinc-900">Conversaciones</h2>
        <Button variant="ghost" size="icon" onClick={handleNewPatient} title="Nuevo paciente">
          <UserPlus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-4">
        {sorted.map((conversation) => (
          <ConversationListItem
            key={conversation.id}
            conversation={conversation}
            active={conversation.id === activeId}
            onSelect={() => onSelect(conversation.id)}
          />
        ))}
      </div>
    </div>
  );
}
