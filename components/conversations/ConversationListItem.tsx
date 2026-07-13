import { Avatar } from "@/components/ui/Avatar";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { cn } from "@/lib/utils/cn";
import type { Conversation } from "@/lib/types/conversation";

export function ConversationListItem({
  conversation,
  active,
  onSelect,
}: {
  conversation: Conversation;
  active: boolean;
  onSelect: () => void;
}) {
  const lastMessage = conversation.messages[conversation.messages.length - 1];

  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors",
        active ? "bg-accent-50" : "hover:bg-zinc-50",
      )}
    >
      <Avatar name={conversation.patientName} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-zinc-900">
            {conversation.patientName}
          </p>
          <span className="shrink-0 text-[11px] text-zinc-400">
            <RelativeTime iso={conversation.lastMessageAt} />
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-zinc-500">
          {conversation.isTyping
            ? "Escribiendo…"
            : (lastMessage?.content ?? "Conversación nueva")}
        </p>
      </div>
    </button>
  );
}
