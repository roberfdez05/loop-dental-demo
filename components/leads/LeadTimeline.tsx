import {
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  MessageCircle,
  RefreshCw,
  Stethoscope,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { RelativeTime } from "@/components/ui/RelativeTime";
import type { LeadEvent, LeadEventType } from "@/lib/types/leadEvent";

const EVENT_ICON: Record<LeadEventType, LucideIcon> = {
  primer_contacto: UserPlus,
  respuesta_ia: MessageCircle,
  informacion_enviada: MessageCircle,
  cita_reservada: Calendar,
  diagnostico: Stethoscope,
  presupuesto_enviado: FileText,
  seguimiento: RefreshCw,
  aceptado: ClipboardCheck,
  paciente: CheckCircle2,
  campana_reactivacion: RefreshCw,
};

export function LeadTimeline({ events }: { events: LeadEvent[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-zinc-400">Sin actividad todavía.</p>;
  }

  return (
    <ol className="space-y-4">
      {events.map((event, index) => {
        const Icon = EVENT_ICON[event.type];
        const isLast = index === events.length - 1;
        return (
          <li key={event.id} className="relative flex gap-3 pb-1">
            {!isLast && (
              <span className="absolute left-[13px] top-7 h-[calc(100%-4px)] w-px bg-zinc-200" />
            )}
            <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-600">
              <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
            </span>
            <div className="pt-0.5">
              <p className="text-sm font-medium text-zinc-800">{event.label}</p>
              <p className="text-xs text-zinc-400">
                <RelativeTime iso={event.timestamp} />
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
