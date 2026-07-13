const QUICK_REPLIES = [
  "Hola, quería preguntar por los implantes dentales.",
  "¿Cuánto tiempo dura un tratamiento de ortodoncia invisible?",
  "¿Hacéis blanqueamiento dental? ¿Qué precio tiene?",
];

export function QuickReplies({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 px-4 pb-2 pt-3">
      {QUICK_REPLIES.map((text) => (
        <button
          key={text}
          onClick={() => onPick(text)}
          className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600 transition-colors hover:border-accent-200 hover:bg-accent-50 hover:text-accent-700"
        >
          {text}
        </button>
      ))}
    </div>
  );
}
