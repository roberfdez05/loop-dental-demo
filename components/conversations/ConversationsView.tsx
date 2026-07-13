"use client";

import { useState } from "react";

import { useAppStore } from "@/lib/store/useAppStore";
import { ConversationList } from "@/components/conversations/ConversationList";
import { ChatThread } from "@/components/conversations/ChatThread";
import { cn } from "@/lib/utils/cn";

export function ConversationsView() {
  const activeConversationId = useAppStore((state) => state.activeConversationId);
  const setActiveConversation = useAppStore((state) => state.setActiveConversation);
  const [mobileShowThread, setMobileShowThread] = useState(false);

  const handleSelect = (id: string) => {
    setActiveConversation(id);
    setMobileShowThread(true);
  };

  return (
    <div className="flex h-full min-h-0">
      <ConversationList
        activeId={activeConversationId}
        onSelect={handleSelect}
        className={cn("w-full md:w-80", mobileShowThread ? "hidden md:flex" : "flex")}
      />
      <div className={cn("min-w-0 flex-1", mobileShowThread ? "flex" : "hidden md:flex")}>
        {activeConversationId && (
          <ChatThread
            conversationId={activeConversationId}
            onBack={() => setMobileShowThread(false)}
          />
        )}
      </div>
    </div>
  );
}
