import { LayoutDashboard, MessagesSquare } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/leads", label: "Panel", icon: LayoutDashboard },
  { href: "/conversaciones", label: "Conversaciones", icon: MessagesSquare },
] as const;
