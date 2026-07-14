"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { NAV_ITEMS } from "@/lib/constants/nav";
import { useAppStore } from "@/lib/store/useAppStore";
import { cn } from "@/lib/utils/cn";

export function Sidebar() {
  const pathname = usePathname();
  const resetDemo = useAppStore((state) => state.resetDemo);
  const isPlayingDemo = useAppStore((state) => state.isPlayingDemo);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-200 bg-white/80 px-4 py-6 md:flex">
      <div className="flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900">
          <Sparkles className="h-4 w-4 text-white" strokeWidth={2.25} />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight text-zinc-900">LoopAI</p>
          <p className="text-[11px] leading-none text-zinc-400">Clínica Dental Sonrisa</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent-50 text-accent-700"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900",
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2 px-2 pt-6">
        <button
          onClick={() => {
            resetDemo();
            toast("Demo reiniciada", {
              description: "Se han restaurado los datos de ejemplo.",
            });
          }}
          disabled={isPlayingDemo}
          title={isPlayingDemo ? "Detén el modo demo antes de reiniciar" : undefined}
          className="flex items-center gap-2 rounded-lg px-1 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-zinc-400"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reiniciar demo
        </button>
        <p className="px-1 text-[11px] text-zinc-300">Powered by LoopAI</p>
      </div>
    </aside>
  );
}
