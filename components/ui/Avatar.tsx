import { cn } from "@/lib/utils/cn";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase();
}

const PALETTE = [
  "bg-accent-100 text-accent-700",
  "bg-zinc-200 text-zinc-700",
  "bg-accent-50 text-accent-600",
];

function paletteFor(name: string): string {
  const sum = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PALETTE[sum % PALETTE.length];
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
        paletteFor(name),
        className,
      )}
    >
      {initials(name)}
    </div>
  );
}
