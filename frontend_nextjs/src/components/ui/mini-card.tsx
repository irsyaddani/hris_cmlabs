"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type TablerIcon } from "@tabler/icons-react";

interface MiniCardProps {
  icon?: TablerIcon;
  title: string;
  value: string;
  description?: string;
}

export function MiniCard({
  icon: Icon,
  title,
  value,
  description,
}: MiniCardProps) {
  return (
    <Card className="p-4">
      <CardHeader className="space-y-2">
        <div className="flex flex-col gap-7">
          <CardTitle className="flex items-center gap-2 font-medium text-md">
            <span className="p-2 rounded-lg bg-neutral-100">
              {Icon && <Icon className="h-5 w-5 text-primary" />}
            </span>
            {title}
          </CardTitle>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-2xl">{value}</span>
            <CardDescription className="text-md">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
