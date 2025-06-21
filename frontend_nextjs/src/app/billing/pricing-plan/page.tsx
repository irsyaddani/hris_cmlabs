"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import Link from "next/link";

export default function PricingPlanPage() {
  const [selectedTeamSize, setSelectedTeamSize] = useState("options1");

  const handleTeamSizeChange = (value: string) => {
    setSelectedTeamSize(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full p-4">
      {/* Left Section - Pricing Plan */}
      <div className="flex flex-col px-10 pt-10 pb-30 gap-8">
        <h1 className="text-2xl font-medium">Pricing Plan</h1>

        <div className="flex flex-col gap-6">
          <div className="grid gap-3 w-full">
            <Label className="font-regular">Upgrade to</Label>

            <div className="flex items-center justify-between h-auto min-h-[40px] px-4 py-2 border border-input bg-background rounded-md">
              <div className="flex items-center gap-2">
                <span className="text-lg font-regular">Premium</span>
                <div className="w-2 h-2 rounded-full bg-gray-200" />
                <span className="text-lg font-regular">Rp 25.000</span>
              </div>

              <Link href="/billing">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:bg-muted hover:text-primary"
                >
                  Change Plan
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-3 w-full">
            <Label className="font-regular">Billing Period</Label>

            <div className="flex items-center justify-between h-auto min-h-[40px] px-4 py-2 border border-input bg-background rounded-md">
              <span className="text-sm font-regular">Monthly</span>
              <span className="text-sm text-[var(--color-primary-900)] font-regular">
                Rp 25,000/mo
              </span>
            </div>
          </div>

          <div className="grid gap-3 w-full">
            <Label className="font-regular">Team Size</Label>

            <RadioGroup
              value={selectedTeamSize}
              onValueChange={handleTeamSizeChange}
              className="grid grid-cols-2 gap-2 w-full"
            >
              <div className="flex items-center justify-between h-auto min-h-[40px] px-4 py-2 border border-input bg-background rounded-md">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="options1" id="r1" />
                  <Label htmlFor="r1">1-50</Label>
                </div>
              </div>

              <div className="flex items-center justify-between h-auto min-h-[40px] px-4 py-2 border border-input bg-background rounded-md">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="options2" id="r2" />
                  <Label htmlFor="r2">51-100</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-3 w-full">
            <Label className="font-regular">Add ons - number employee</Label>
            <Input placeholder="Input employee amount" />
          </div>

          <Button
            size="default"
            variant="default"
            className="gap-4 bg-[var(--color-primary-900)] hover:bg-[var(--color-primary-700)] text-white hover:text-white"
          >
            Continue payment
          </Button>
        </div>
      </div>

      {/* Right Section - Order Summary */}
      <div className="flex flex-col px-10 pt-10 pb-30 gap-8 bg-[var(--color-neutral-100)] rounded-xl">
        <h2 className="text-2xl font-medium">Order Summary</h2>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 pb-4 border-b border-b-[var(--color-neutral-200)]">
            <p className="flex items-center justify-between">
              <span className="text-base font-regular text-[var(--color-neutral-600)]">
                Package
              </span>
              <span className="text-base font-regular text-[var(--color-neutral-600)]">
                Premium
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-base font-regular text-[var(--color-neutral-600)]">
                Billing Period
              </span>
              <span className="text-base font-regular text-[var(--color-neutral-600)]">
                Monthly
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-base font-regular text-[var(--color-neutral-600)]">
                Team Size
              </span>
              <span className="text-base font-regular text-[var(--color-neutral-600)]">
                {selectedTeamSize === "options1" ? "1-50" : "51-100"}
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-base font-regular text-[var(--color-neutral-600)]">
                Number of Employees
              </span>
              <span className="text-base font-regular text-[var(--color-neutral-600)]">
                17
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-base font-regular text-[var(--color-neutral-600)]">
                Price per User
              </span>
              <span className="text-base font-regular text-[var(--color-neutral-600)]">
                Rp 10.000
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-3 pb-4 border-b border-b-[var(--color-neutral-200)]">
            <p className="flex items-center justify-between">
              <span className="text-lg font-regular">Subtotal</span>
              <span className="text-lg font-regular">Rp 17.000</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-lg font-regular">Tax</span>
              <span className="text-lg font-regular">Rp 0</span>
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <p className="flex items-center justify-between">
              <span className="text-lg font-semibold">Total at Renewal</span>
              <span className="text-lg font-semibold">Rp 34.000</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
