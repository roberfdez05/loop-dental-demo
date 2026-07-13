import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function formatRelativeTime(isoDate: string): string {
  return formatDistanceToNow(new Date(isoDate), { locale: es, addSuffix: true });
}
