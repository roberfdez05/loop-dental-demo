"use client";

import { Play, Square } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store/useAppStore";

export function DemoModeButton() {
  const isPlayingDemo = useAppStore((state) => state.isPlayingDemo);
  const playDemoWeek = useAppStore((state) => state.playDemoWeek);
  const stopDemoWeek = useAppStore((state) => state.stopDemoWeek);

  return (
    <Button
      variant={isPlayingDemo ? "outline" : "accent"}
      size="sm"
      onClick={() => (isPlayingDemo ? stopDemoWeek() : playDemoWeek())}
    >
      {isPlayingDemo ? (
        <>
          <Square className="h-3.5 w-3.5" />
          Detener
        </>
      ) : (
        <>
          <Play className="h-3.5 w-3.5" />
          Reproducir una semana
        </>
      )}
    </Button>
  );
}
