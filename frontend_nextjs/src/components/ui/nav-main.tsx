"use client";

import { usePathname } from "next/navigation";
import { type TablerIcon } from "@tabler/icons-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export interface NavMainProps {
  items: {
    title: string;
    url: string;
    icon?: TablerIcon;
  }[];
  activePath?: string; // Add activePath to the props
}

export function NavMain({ items, activePath }: NavMainProps) {
  // Cari item dengan URL terpanjang yang cocok
  const activeItem = items.reduce(
    (longestMatch, item) => {
      if (
        activePath?.startsWith(item.url) &&
        item.url.length > longestMatch.url.length
      ) {
        return item;
      }
      return longestMatch;
    },
    { url: "" }
  ); // Default nilai awal

  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
              <a
                href={item.url}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg transition 
                  ${
                    activeItem.url === item.url // Hanya item dengan URL terpanjang yang cocok dianggap aktif
                      ? "font-medium text-primary bg-neutral-400/20"
                      : "text-muted-foreground hover:bg-muted"
                  }
                `}
              >
                {item.icon && <item.icon className="h-5 w-5" />}
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
