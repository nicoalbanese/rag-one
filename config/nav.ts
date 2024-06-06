import { SidebarLink } from "@/components/SidebarItems";
import { Cog, Globe, HomeIcon, MessageSquare } from "lucide-react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Home", icon: HomeIcon },
  { href: "/settings", title: "Settings", icon: Cog },
];

export const additionalLinks: AdditionalLinks[] = [
  {
    title: "",
    links: [
      {
        href: "/items",
        title: "Knowledge",
        icon: Globe,
      },
      {
        href: "/chat",
        title: "Chat",
        icon: MessageSquare,
      }
    ],
  },

];

