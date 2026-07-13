import { motion } from "framer-motion";

import { cn } from "@/lib/utils/cn";
import type { Message } from "@/lib/types/message";

export function MessageBubble({ message }: { message: Message }) {
  const isAi = message.sender === "ai";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("flex w-full", isAi ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-[var(--shadow-soft)]",
          isAi
            ? "rounded-br-sm bg-zinc-900 text-white"
            : "rounded-bl-sm bg-zinc-100 text-zinc-800",
        )}
      >
        {message.content}
      </div>
    </motion.div>
  );
}
