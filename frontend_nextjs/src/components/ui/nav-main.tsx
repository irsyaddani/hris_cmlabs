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

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: TablerIcon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
              <a
                href={item.url}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg transition 
                  ${
                    pathname === item.url
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
