"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "./button";
import { IconArrowLeft } from "@tabler/icons-react";
import * as React from "react";
export function AppBreadcrumb() {
  const pathname = usePathname();
  const router = useRouter();
  const segments = pathname.split("/").filter((seg) => seg !== "");

  // Ambil segmen terakhir
  const currentPage = segments[segments.length - 1] || "Dashboard";

  // Tentukan apakah ini adalah sub-page
  const isSubPage = segments.length > 2;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {isSubPage && (
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <IconArrowLeft className="text-black w-6 h-6" />
          </Button>
        )}
        <BreadcrumbItem>
          <BreadcrumbPage>
            {capitalize(currentPage.replace(/-/g, " "))}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
