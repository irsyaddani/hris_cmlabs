"use client";

import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import React from "react";

interface AuthMessageProps {
  type: "email-confirm" | "link-expired" | "reset-password-success";
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  onAction?: () => void;
}

const titles = {
  "email-confirm": "Check Your Email",
  "link-expired": "Link Expired",
  "reset-password-success": "Your password has been successfully reset",
};

const buttonLabels = {
  "email-confirm": "Open Gmail",
  "link-expired": "Back to Login",
  "reset-password-success": "Login Now",
};

export function AuthMessage({
  type,
  title,
  subtitle,
  onBack,
  onAction,
}: AuthMessageProps) {
  const renderBackButton = type === "email-confirm" && onBack && (
    <Button
      type="button"
      variant="ghost"
      onClick={onBack}
      className="flex items-center gap-2 w-fit px-0"
    >
      <IconArrowLeft className="h-5 w-5" />
      <span className="text-md font-normal">Back</span>
    </Button>
  );

  const renderSuccessIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="75"
      height="73"
      viewBox="0 0 75 73"
      fill="none"
    >
      <g clipPath="url(#clip0_7140_2792)">
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
  );

  const renderExpiredIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="73"
      height="72"
      viewBox="0 0 73 72"
      fill="none"
    >
      <g clipPath="url(#clip0_7140_2892)">
        <path
          d="M36.5 6C53.069 6 66.5 19.431 66.5 36C66.5 52.569 53.069 66 36.5 66C19.931 66 6.5 52.569 6.5 36C6.5 19.431 19.931 6 36.5 6ZM47.3 21.6C46.9848 21.3636 46.6262 21.1916 46.2445 21.0939C45.8629 20.9961 45.4657 20.9744 45.0757 21.0302C44.6857 21.0859 44.3105 21.2179 43.9715 21.4186C43.6325 21.6193 43.3364 21.8848 43.1 22.2L36.5 30.999L29.9 22.2C29.6636 21.8848 29.3675 21.6193 29.0285 21.4186C28.6895 21.2179 28.3143 21.0859 27.9243 21.0302C27.5343 20.9744 27.1371 20.9961 26.7555 21.0939C26.3738 21.1916 26.0152 21.3636 25.7 21.6C25.3848 21.8364 25.1193 22.1325 24.9186 22.4715C24.7179 22.8105 24.5859 23.1857 24.5302 23.5757C24.4744 23.9657 24.4961 24.3629 24.5939 24.7445C24.6916 25.1262 24.8636 25.4848 25.1 25.8L32.75 36L25.1 46.2C24.6226 46.8365 24.4176 47.6366 24.5302 48.4243C24.6427 49.2119 25.0635 49.9226 25.7 50.4C26.3365 50.8774 27.1366 51.0824 27.9243 50.9698C28.7119 50.8573 29.4226 50.4365 29.9 49.8L36.5 41.001L43.1 49.8C43.5774 50.4365 44.2881 50.8573 45.0757 50.9698C45.8634 51.0824 46.6635 50.8774 47.3 50.4C47.9365 49.9226 48.3573 49.2119 48.4698 48.4243C48.5824 47.6366 48.3774 46.8365 47.9 46.2L40.25 36L47.9 25.8C48.1364 25.4848 48.3084 25.1262 48.4061 24.7445C48.5039 24.3629 48.5256 23.9657 48.4698 23.5757C48.4141 23.1857 48.2821 22.8105 48.0814 22.4715C47.8807 22.1325 47.6152 21.8364 47.3 21.6Z"
          fill="#1D3A5E"
        />
      </g>
      <defs>
        <clipPath id="clip0_7140_2892">
          <rect
            width="72"
            height="72"
            fill="white"
            transform="translate(0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );

  const renderIcon =
    type === "link-expired" ? renderExpiredIcon : renderSuccessIcon;

  return (
    <div className="flex flex-col gap-7 items-center font-inter">
      <div className="flex flex-col items-start gap-3">
        {renderBackButton}

        <div className="flex flex-col items-center gap-7">
          {renderIcon}

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
        {buttonLabels[type]}
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
