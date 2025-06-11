"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<"login" | "signup" | null>(null);

  const handleRedirect = (path: string, type: "login" | "signup") => {
    setIsLoading(type);
    router.push(path);
  };

  return (
    <div className="w-full  py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 items-center lg:grid-cols-2">
          <div className="flex gap-4 flex-col">
            <div>
              <Badge variant="outline">We&apos;re live!</Badge>
            </div>
            <div className="flex gap-4 flex-col">
              <h1 className="text-5xl md:text-7xl max-w-lg tracking-tighter text-left font-regular">
                This is the start of something!
              </h1>
              <p className="text-xl leading-relaxed tracking-tight text-muted-foreground max-w-md text-left">
                Managing a small business today is already tough. Avoid further
                complications by ditching outdated, tedious trade methods. Our
                goal is to streamline SMB trade, making it easier and faster than
                ever.
              </p>
            </div>
            <div className="flex flex-row gap-4">
              <Button
                size="lg"
                variant="outline"
                className="gap-4 cursor-pointer"
                disabled={isLoading !== null}
                onClick={() => handleRedirect("/auth/login", "login")}
              >
                {isLoading === "login" ? "Loading..." : "Login"}
              </Button>
              <Button
                size="lg"
                className="bg-primary-900 text-white hover:bg-primary-700 gap-4 cursor-pointer"
                disabled={isLoading !== null}
                onClick={() => handleRedirect("/auth/signup", "signup")}
              >
                {isLoading === "signup" ? "Loading..." : "Sign up here"}
              </Button>
            </div>
          </div>
          <div className="bg-muted rounded-md aspect-square"></div>
        </div>
      </div>
    </div>
  );
};