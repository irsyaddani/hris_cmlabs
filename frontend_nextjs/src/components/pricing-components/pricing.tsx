import { Check, MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const PricingCard = () => (
  <div className="grid text-left grid-cols-1 lg:grid-cols-3 w-full gap-4">
    <Card className="w-full rounded-md">
      <CardHeader className="px-5">
        <CardTitle>
          <span className="flex flex-row gap-4 items-center font-normal text-2xl">
            Lite
          </span>
        </CardTitle>
        <CardDescription className="text-sm">
          Our goal is to streamline SMB trade, making it easier and faster than
          ever for everyone and everywhere.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8 justify-start">
          <p className="flex flex-row  items-center gap-2 text-xl">
            <span className="text-4xl font-semibold">Rp 15.000</span>
            <span className="text-sm text-muted-foreground"> / month</span>
          </p>
          <div className="flex flex-col gap-4 justify-start">
            <div className="flex flex-row gap-4 items-center">
              <Check className="w-4 h-4 text-primary items-center" />
              <p className="text-sm text-muted-foreground">
                GPS-based attandence validation
              </p>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Check className="w-4 h-4 text-primary items-center" />
              <p className="text-sm text-muted-foreground">
                Employee data management
              </p>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Check className="w-4 h-4 text-primary items-center" />
              <p className="text-sm text-muted-foreground">
                Leave & time-off request
              </p>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Check className="w-4 h-4 text-primary items-center" />
              <p className="text-sm text-muted-foreground">
                Fixed work shedule management
              </p>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Check className="w-4 h-4 text-primary items-center" />
              <p className="text-sm text-muted-foreground">
                Automatic tax calculation
              </p>
            </div>
          </div>
          <Link href="/billing/pricing-plan">
            <Button
              variant="outline"
              className="gap-4 bg-primary-900 hover:bg-primary-700 text-white hover:text-white"
            >
              Select Package
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>

    <Card className="w-full rounded-md bg-primary-900">
      <CardHeader className="px-5">
        <CardTitle>
          <span className="flex flex-row gap-4 items-center font-normal text-2xl text-white">
            Premium
          </span>
        </CardTitle>
        <CardDescription className="text-white">
          Our goal is to streamline SMB trade, making it easier and faster than
          ever for everyone and everywhere.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8 justify-start">
          <p className="flex flex-row  items-center gap-2 text-xl">
            <span className="text-4xl font-semibold text-white">Rp 25.000</span>
            <span className="text-sm text-white"> / month</span>
          </p>
          <div className="flex flex-col gap-4 justify-start">
            <div className="flex flex-row gap-4 items-center">
              <Check className="w-4 h-4 text-white items-center" />
              <p className="text-sm text-white">
                GPS-based attandence validation
              </p>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Check className="w-4 h-4 text-white items-center" />
              <p className="text-sm text-white">Employee data management</p>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Check className="w-4 h-4 text-white items-center" />
              <p className="text-sm text-white">Leave & time-off request</p>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Check className="w-4 h-4 text-white items-center" />
              <p className="text-sm text-white">
                Fixed work shedule management
              </p>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Check className="w-4 h-4 text-white items-center" />
              <p className="text-sm text-white">Automatic tax calculation</p>
            </div>
          </div>
          <Link href="/billing/pricing-plan">
            <Button variant="outline" className="gap-4 text-primary-900">
              Select Package
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>

    <Card className="w-full rounded-md">
      <CardHeader className="px-5">
        <CardTitle>
          <span className="flex flex-row gap-4 items-center font-normal text-2xl">
            Ultra
          </span>
        </CardTitle>
        <CardDescription className="text-sm">
          Our goal is to streamline SMB trade, making it easier and faster than
          ever for everyone and everywhere.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8 justify-start">
          <p className="flex flex-row  items-center gap-2 text-xl">
            <span className="text-4xl font-semibold">Rp 120.000</span>
            <span className="text-sm text-muted-foreground"> / month</span>
          </p>
          <div className="flex flex-col gap-4 justify-start">
            <div className="flex flex-row gap-4 items-center">
              <Check className="w-4 h-4 text-primary items-center" />
              <p className="text-sm text-muted-foreground">
                GPS-based attandence validation
              </p>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Check className="w-4 h-4 text-primary items-center" />
              <p className="text-sm text-muted-foreground">
                Employee data management
              </p>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Check className="w-4 h-4 text-primary items-center" />
              <p className="text-sm text-muted-foreground">
                Leave & time-off request
              </p>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Check className="w-4 h-4 text-primary items-center" />
              <p className="text-sm text-muted-foreground">
                Fixed work shedule management
              </p>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Check className="w-4 h-4 text-primary items-center" />
              <p className="text-sm text-muted-foreground">
                Automatic tax calculation
              </p>
            </div>
          </div>
          <Link href="/billing/pricing-plan">
            <Button
              variant="outline"
              className="gap-4 bg-primary-900 hover:bg-primary-700 text-white hover:text-white"
            >
              Select Package
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  </div>
);
