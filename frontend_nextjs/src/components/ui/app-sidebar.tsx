"use client";

import * as React from "react";
import { usePathname } from "next/navigation"; // Import usePathname
import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";

import { NavMain } from "@/components/ui/nav-main";
import { NavUser } from "@/components/ui/nav-user";
import { TeamSwitcher } from "@/components/ui/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  IconCategory,
  IconClockPin,
  IconReceipt,
  IconUsersGroup,
} from "@tabler/icons-react";

// This is sample data.
const data = {
  user: {
    name: "Emir Abiyyu",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconCategory,
    },
    {
      title: "Employment",
      url: "/dashboard/employment",
      icon: IconUsersGroup,
    },
    {
      title: "Check Clock",
      url: "/dashboard/checkclock",
      icon: IconClockPin,
    },
    {
      title: "Billing",
      url: "/dashboard/billing",
      icon: IconReceipt,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname(); // Dapatkan URL saat ini

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {/* Teruskan pathname ke NavMain */}
        <NavMain items={data.navMain} activePath={pathname} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
