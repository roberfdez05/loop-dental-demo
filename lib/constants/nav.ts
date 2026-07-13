import { MessagesSquare, Users } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/conversaciones", label: "Conversaciones", icon: MessagesSquare },
  { href: "/leads", label: "Leads", icon: Users },
] as const;
