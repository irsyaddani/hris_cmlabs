"use client";

import { columns } from "@/components/data-table-components/columns-billing";
import { DataTable } from "@/components/data-table-components/data-table";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { PricingCard } from "@/components/pricing-components/pricing";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function BillingPage() {
  const dummyData = [
    {
      transaction_id: "10290121",
      plan: "Premium",
      amount: "Rp 25.000",
      date: "March 20, 2025",
      payment: "Xendit",
      status: "Failed",
    },
    {
      transaction_id: "10290121",
      plan: "Premium",
      amount: "Rp 25.000",
      date: "March 20, 2025",
      payment: "Xendit",
      status: "Paid",
    },
    {
      transaction_id: "10290121",
      plan: "Premium",
      amount: "Rp 25.000",
      date: "March 20, 2025",
      payment: "Xendit",
      status: "Paid",
    },
    {
      transaction_id: "10290121",
      plan: "Premium",
      amount: "Rp 25.000",
      date: "March 20, 2025",
      payment: "Xendit",
      status: "Paid",
    },
  ];

  return (
    <div className="min-h-[100vh] flex flex-col flex-1 p-6 gap-4">
      <p className="flex flex-col items-start gap-2">
        <span className="text-2xl font-semibold">Select plan</span>
        <span className="text-sm text-muted-foreground">
          Choose the plan that best suits your business! This HRIS offers both
          subscription and pay-as-you-go payment options, available in the
          following packages:
        </span>
      </p>

      <PricingCard />

      <div className="p-6 bg-warning-surface border border-warning-border rounded-md">
        <p className="flex flex-col items-start gap-3">
          <span className="text-2xl font-medium">
            Your trial will expire in 30 days
          </span>
          <span className="text-sm text-muted-foreground">
            You’re currently using a free trial of our system, which gives you
            access to all premium features without limitations.
          </span>
        </p>
      </div>

      {/* If user already Current Billing */}

      <p className="flex flex-col items-start gap-2">
        <span className="text-2xl font-semibold">Plan overview</span>
        <span className="text-sm text-muted-foreground">
          Choose the plan that best suits your business! This HRIS offers both
          subscription and pay-as-you-go payment options, available in the
          following packages:
        </span>
      </p>

      <div className="flex flex-col p-4 gap-2 items-end border border-neutral-200 rounded-md">
        <div className="grid gap-3 w-full">
          <Label className="font-regular">Current Plan</Label>

          <div className="flex items-center justify-between h-auto min-h-[56px] px-4 py-2 border border-input bg-background rounded-md">
            <div className="flex items-center gap-2">
              <span className="text-xl font-regular">Premium</span>
              <div className="w-2 h-2 rounded-full bg-gray-200" />
              <span className="text-xl font-regular">Rp 25.000</span>
            </div>

            <Link href="/billing/pricing-plan">
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:bg-muted hover:text-primary"
              >
                Upgrade Plan
              </Button>
            </Link>
          </div>
        </div>

        <ConfirmDialog
          trigger={
            <Button
              size="sm"
              variant="ghost"
              // className="text-[var(--color-danger-main)] hover:text-[var(--color-danger-hover)]"
              className="text-danger-main hover:text-danger-hover"
            >
              Cancel subscription
            </Button>
          }
          title="Are you sure want to cancel your subscription?"
          description={
            <>
              Canceling your current plan means you will lose access to premium
              features after your billing cycle ends on{" "}
              <span className="text-black font-semibold">
                Saturday, 12 January 2025
              </span>
              . Your data will remain safe, but certain functionalities may be
              limited unless you reactivate or switch to another plan.
            </>
          }
          confirmText="Yes, I'm sure"
          cancelText="No, go back"
          confirmClassName="bg-[var(--color-danger-main)] text-white hover:bg-[var(--color-danger-hover)]"
          cancelClassName="hover:bg-secondary/80"
        />
      </div>

      {/* <DataTable
        data={loading ? [] : dummyData}
        columns={columns}
        toolbarVariant="billing"
      /> */}

      <DataTable
        data={false ? ([] as typeof dummyData) : dummyData}
        columns={columns}
        toolbarVariant="billing"
      />
    </div>
  );
}
