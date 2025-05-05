"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import * as React from "react";

export function AppBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((seg) => seg !== "");

  if (segments.length === 0) {
    // kalau di root /, tampilkan kosong atau ga usah render apa-apa
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {segments.length === 0 ? (
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          ) : (
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {segments.map((segment, index) => (
          <React.Fragment key={index}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index === segments.length - 1 ? (
                <BreadcrumbPage>
                  {capitalize(segment.replace(/-/g, " "))}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  href={`/${segments.slice(0, index + 1).join("/")}`}
                >
                  {capitalize(segment.replace(/-/g, " "))}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
