'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormSchema, RegisterFormType } from "@/lib/schemas/SignUpFormSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "./password-input";
import { IconUserCircle, IconArrowLeft } from "@tabler/icons-react";
import React from "react";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  type: "email-confirm" | "link-expired" | "password-confirm";
  onSubmit: (data: any) => void;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
}

export function AuthFormConfirm({
    type,
    onSubmit,
    onBack,
    title,
    subtitle,
  }: AuthFormProps) {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm({
      resolver: zodResolver(RegisterFormSchema),
    });
    const router = useRouter();
    const isEmail = type === "email-confirm";
    const isExpired = type === "link-expired";
    const isConfirm = type === "password-confirm";
  
    const titles = {
      "email-confirm": "Confirm Your Email",
      "link-expired": "Link Expired",
      "password-confirm": "Confirm New Password",
    };
  
    const submitForm = (data: any) => {
      onSubmit(data);
    };

    // SVG Icons for different types
    const renderLogo = () => {
      if (isEmail) {
        return (
<svg xmlns="http://www.w3.org/2000/svg" width="75" height="73" viewBox="0 0 75 73" fill="none">
  <g clipPath="url(#clip0_7025_5957)">
    <path d="M53.125 10.52C57.8383 13.1325 61.7592 16.8816 64.4994 21.3959C67.2396 25.9102 68.7042 31.0333 68.7482 36.258C68.7922 41.4827 67.414 46.6278 64.75 51.1841C62.0861 55.7403 58.2289 59.5496 53.5601 62.2349C48.8914 64.9202 43.573 66.3884 38.1315 66.4942C32.6901 66.5999 27.3142 65.3395 22.5361 62.8377C17.758 60.3359 13.7433 56.6795 10.8896 52.2305C8.03582 47.7815 6.4419 42.6941 6.26563 37.472L6.25 36.5L6.26563 35.528C6.44063 30.3469 8.01109 25.2979 10.8239 20.873C13.6367 16.4481 17.5958 12.7983 22.3153 10.2796C27.0348 7.76092 32.3536 6.45917 37.7531 6.5013C43.1527 6.54342 48.4488 7.92798 53.125 10.52ZM49.0844 28.379C48.5463 27.8624 47.8303 27.5522 47.0709 27.5063C46.3114 27.4605 45.5606 27.6822 44.9594 28.13L44.6656 28.379L34.375 38.255L30.3344 34.379L30.0406 34.13C29.4393 33.6825 28.6887 33.4611 27.9294 33.507C27.1701 33.553 26.4544 33.8633 25.9164 34.3798C25.3785 34.8962 25.0553 35.5833 25.0073 36.3122C24.9594 37.0411 25.1902 37.7617 25.6562 38.339L25.9156 38.621L32.1656 44.621L32.4594 44.87C33.0074 45.2782 33.6813 45.4997 34.375 45.4997C35.0686 45.4997 35.7426 45.2782 36.2906 44.87L36.5844 44.621L49.0844 32.621L49.3437 32.339C49.8101 31.7618 50.0411 31.041 49.9934 30.3119C49.9456 29.5829 49.6224 28.8956 49.0844 28.379Z" fill="#1D3A5E"/>
  </g>
  <defs>
    <clipPath id="clip0_7025_5957">
      <rect width="75" height="72" fill="white" transform="translate(0 0.5)"/>
    </clipPath>
  </defs>
</svg>
        );
      } else if (isExpired) {
        return (
<svg xmlns="http://www.w3.org/2000/svg" width="73" height="72" viewBox="0 0 73 72" fill="none">
  <g clipPath="url(#clip0_7025_6057)">
    <path d="M36.5 6C53.069 6 66.5 19.431 66.5 36C66.5 52.569 53.069 66 36.5 66C19.931 66 6.5 52.569 6.5 36C6.5 19.431 19.931 6 36.5 6ZM47.3 21.6C46.9848 21.3636 46.6262 21.1916 46.2445 21.0939C45.8629 20.9961 45.4657 20.9744 45.0757 21.0302C44.6857 21.0859 44.3105 21.2179 43.9715 21.4186C43.6325 21.6193 43.3364 21.8848 43.1 22.2L36.5 30.999L29.9 22.2C29.6636 21.8848 29.3675 21.6193 29.0285 21.4186C28.6895 21.2179 28.3143 21.0859 27.9243 21.0302C27.5343 20.9744 27.1371 20.9961 26.7555 21.0939C26.3738 21.1916 26.0152 21.3636 25.7 21.6C25.3848 21.8364 25.1193 22.1325 24.9186 22.4715C24.7179 22.8105 24.5859 23.1857 24.5302 23.5757C24.4744 23.9657 24.4961 24.3629 24.5939 24.7445C24.6916 25.1262 24.8636 25.4848 25.1 25.8L32.75 36L25.1 46.2C24.6226 46.8365 24.4176 47.6366 24.5302 48.4243C24.6427 49.2119 25.0635 49.9226 25.7 50.4C26.3365 50.8774 27.1366 51.0824 27.9243 50.9698C28.7119 50.8573 29.4226 50.4365 29.9 49.8L36.5 41.001L43.1 49.8C43.5774 50.4365 44.2881 50.8573 45.0757 50.9698C45.8634 51.0824 46.6635 50.8774 47.3 50.4C47.9365 49.9226 48.3573 49.2119 48.4698 48.4243C48.5824 47.6366 48.3774 46.8365 47.9 46.2L40.25 36L47.9 25.8C48.1364 25.4848 48.3084 25.1262 48.4061 24.7445C48.5039 24.3629 48.5256 23.9657 48.4698 23.5757C48.4141 23.1857 48.2821 22.8105 48.0814 22.4715C47.8807 22.1325 47.6152 21.8364 47.3 21.6Z" fill="#1D3A5E"/>
  </g>
  <defs>
    <clipPath id="clip0_7025_6057">
      <rect width="72" height="72" fill="white" transform="translate(0.5)"/>
    </clipPath>
  </defs>
</svg>
        );
      } else if (isConfirm) {
        return (
<svg xmlns="http://www.w3.org/2000/svg" width="75" height="72" viewBox="0 0 75 72" fill="none">
  <g clipPath="url(#clip0_7025_6027)">
    <path d="M53.125 10.02C57.8383 12.6325 61.7592 16.3816 64.4994 20.8959C67.2396 25.4102 68.7042 30.5333 68.7482 35.758C68.7922 40.9827 67.414 46.1278 64.75 50.6841C62.0861 55.2403 58.2289 59.0496 53.5601 61.7349C48.8914 64.4202 43.573 65.8884 38.1315 65.9942C32.6901 66.0999 27.3142 64.8395 22.5361 62.3377C17.758 59.8359 13.7433 56.1795 10.8896 51.7305C8.03582 47.2815 6.4419 42.1941 6.26563 36.972L6.25 36L6.26563 35.028C6.44063 29.8469 8.01109 24.7979 10.8239 20.373C13.6367 15.9481 17.5958 12.2983 22.3153 9.77963C27.0348 7.26092 32.3536 5.95917 37.7531 6.0013C43.1527 6.04342 48.4488 7.42798 53.125 10.02ZM49.0844 27.879C48.5463 27.3624 47.8303 27.0522 47.0709 27.0063C46.3114 26.9605 45.5606 27.1822 44.9594 27.63L44.6656 27.879L34.375 37.755L30.3344 33.879L30.0406 33.63C29.4393 33.1825 28.6887 32.9611 27.9294 33.007C27.1701 33.053 26.4544 33.3633 25.9164 33.8798C25.3785 34.3962 25.0553 35.0833 25.0073 35.8122C24.9594 36.5411 25.1902 37.2617 25.6562 37.839L25.9156 38.121L32.1656 44.121L32.4594 44.37C33.0074 44.7782 33.6813 44.9997 34.375 44.9997C35.0686 44.9997 35.7426 44.7782 36.2906 44.37L36.5844 44.121L49.0844 32.121L49.3437 31.839C49.8101 31.2618 50.0411 30.541 49.9934 29.8119C49.9456 29.0829 49.6224 28.3956 49.0844 27.879Z" fill="#1D3A5E"/>
  </g>
  <defs>
    <clipPath id="clip0_7025_6027">
      <rect width="75" height="72" fill="white"/>
    </clipPath>
  </defs>
</svg>
        );
      }
    };
  
    return (
      <form
        className="flex flex-col items-center justify-center gap-7 font-inter text-center"
        onSubmit={handleSubmit(submitForm)}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="mb-4">
            {renderLogo()}
          </div>
  
          <h1 className="text-4xl font-medium">{title || titles[type] || ""}</h1>
          {subtitle && (
            <p className="text-lg/tight text-muted-foreground">{subtitle}</p>
          )}
        </div>
  
        {isEmail ? (
  <Button
    type="button"
    onClick={() => window.open("https://mail.google.com", "_blank")}
    className="w-full text-white font-medium bg-[var(--color-primary-900)] hover:bg-[var(--color-primary-700)]"
  >
    Open Gmail
  </Button>
) : (
  <Button
    type="button"
    onClick={() => {
      if (isExpired || isConfirm) {
        router.push("/auth/login");
      } else {
        onSubmit({});
      }
    }}
    className="w-full text-white font-medium bg-[var(--color-primary-900)] hover:bg-[var(--color-primary-700)]"
  >
    {isExpired ? "Back to Login" : "Login Now"}
  </Button>
)}




      </form>
    );
  }
