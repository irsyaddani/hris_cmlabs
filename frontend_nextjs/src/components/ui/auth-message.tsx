"use client";

import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import React from "react";

interface AuthMessageProps {
  type:
    | "email-confirm"
    | "link-expired"
    | "reset-password-success"
    | "confirm-password";
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  onAction?: () => void;
}

export function AuthMessage({
  type,
  title,
  subtitle,
  onBack,
  onAction,
}: AuthMessageProps) {
  const titles = {
    "email-confirm": "Check Your Email",
    "link-expired": "Link Expired",
    "reset-password-success": "Password Reset Successful",
    "confirm-password": "Confirm Password",
  };

  const buttonLabel =
    type === "email-confirm"
      ? "Open Gmail"
      : type === "link-expired"
      ? "Back to Login"
      : type === "reset-password-success"
      ? "Login Now"
      : "Confirm";

  return (
    <div className="flex flex-col gap-7 items-center font-inter">
      <div className="flex flex-col items-start gap-3">
        {type === "email-confirm" && (
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 w-fit px-0"
          >
            <IconArrowLeft className="h-5 w-5" />
            <span className="text-md font-normal">Back</span>
          </Button>
        )}

        <div className="flex flex-col items-center gap-7">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="75"
            height="73"
            viewBox="0 0 75 73"
            fill="none"
          >
            <g clip-path="url(#clip0_7140_2792)">
              <path
                d="M53.125 10.5199C57.8383 13.1325 61.7592 16.8815 64.4994 21.3958C67.2396 25.9101 68.7042 31.0332 68.7482 36.2579C68.7922 41.4826 67.414 46.6278 64.75 51.184C62.0861 55.7402 58.2289 59.5496 53.5601 62.2349C48.8914 64.9202 43.573 66.3884 38.1315 66.4941C32.6901 66.5998 27.3142 65.3394 22.5361 62.8376C17.758 60.3359 13.7433 56.6795 10.8896 52.2305C8.03582 47.7814 6.4419 42.694 6.26563 37.4719L6.25 36.4999L6.26563 35.5279C6.44063 30.3469 8.01109 25.2978 10.8239 20.8729C13.6367 16.448 17.5958 12.7983 22.3153 10.2796C27.0348 7.76086 32.3536 6.45911 37.7531 6.50123C43.1527 6.54336 48.4488 7.92791 53.125 10.5199ZM49.0844 28.3789C48.5463 27.8624 47.8303 27.5521 47.0709 27.5063C46.3114 27.4604 45.5606 27.6822 44.9594 28.1299L44.6656 28.3789L34.375 38.2549L30.3344 34.3789L30.0406 34.1299C29.4393 33.6825 28.6887 33.461 27.9294 33.507C27.1701 33.553 26.4544 33.8633 25.9164 34.3797C25.3785 34.8961 25.0553 35.5832 25.0073 36.3121C24.9594 37.041 25.1902 37.7617 25.6562 38.3389L25.9156 38.6209L32.1656 44.6209L32.4594 44.8699C33.0074 45.2781 33.6813 45.4997 34.375 45.4997C35.0686 45.4997 35.7426 45.2781 36.2906 44.8699L36.5844 44.6209L49.0844 32.6209L49.3437 32.3389C49.8101 31.7617 50.0411 31.041 49.9934 30.3119C49.9456 29.5828 49.6224 28.8955 49.0844 28.3789Z"
                fill="#1D3A5E"
              />
            </g>
            <defs>
              <clipPath id="clip0_7140_2792">
                <rect
                  width="75"
                  height="72"
                  fill="white"
                  transform="translate(0 0.5)"
                />
              </clipPath>
            </defs>
          </svg>

          <div className="flex flex-col gap-3">
            <h1 className="text-4xl text-center font-medium">
              {title || titles[type]}
            </h1>

            {subtitle && (
              <p className="text-lg/tight text-center text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      <Button
        type="button"
        onClick={onAction}
        className="w-full text-white font-medium bg-[var(--color-primary-900)] hover:bg-[var(--color-primary-700)]"
      >
        {buttonLabel}
      </Button>

      {type === "email-confirm" && (
        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t receive the email?{" "}
          <a href="/auth/signup" className="text-black">
            Click here to resend!
          </a>
        </div>
      )}
    </div>
  );
}
