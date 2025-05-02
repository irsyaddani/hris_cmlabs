"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface AuthFormProps {
  type: "signup" | "signin" | "forgot-password" | "set-new-password";
  onSubmit: (data: any) => void;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
}

export function AuthForm({
  type,
  onSubmit,
  onBack,
  title,
  subtitle,
}: AuthFormProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [isAgreed, setIsAgreed] = React.useState(false);
  const [employeeId, setEmployeeId] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "signup" && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    onSubmit({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      employeeId,
    });
  };

  return (
    <form className="flex flex-col gap-7 font-inter" onSubmit={handleSubmit}>
      <div className="flex flex-col items-start gap-2 text-left">
        <h1 className="text-4xl font-medium">
          {title
            ? title
            : type === "signin"
            ? "Sign In"
            : type === "signup"
            ? "Create an Account"
            : type === "forgot-password"
            ? "Forgot Password"
            : "Set New Password"}
        </h1>
        {subtitle && (
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex flex-col gap-5">
        {type === "signup" && (
          <>
            <div className="flex flex-row gap-2">
              <div className="grid gap-2 w-full">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2 w-full">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
          </>
        )}

        {type !== "set-new-password" && (
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}

        {(type === "signin" ||
          type === "signup" ||
          type === "set-new-password") && (
          <div className="grid gap-2">
            <Label htmlFor="password">
              {type === "set-new-password" ? "New Password" : "Password"}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        )}

        {(type === "signup" || type === "set-new-password") && (
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}

        {type === "signup" && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={isAgreed}
              onChange={() => setIsAgreed(!isAgreed)}
              required
            />
            <Label htmlFor="agreeTerms" className="text-sm">
              I agree with the terms of use of HRIS
            </Label>
          </div>
        )}

        {type === "signin" && (
          <div className="flex items-center justify-between">
            <Label htmlFor="rememberMe" className="text-sm">
              Remember Me
            </Label>
            <Button
              type="button"
              variant="link"
              className="text-sm"
              onClick={() => console.log("Forgot Password")}
            >
              Forgot Password?
            </Button>
          </div>
        )}

        <Button
          type="submit"
          className="bg-[var(--color-primary-900)] text-white hover:bg-[var(--color-primary-700)]"
        >
          {type === "signin"
            ? "Sign In"
            : type === "signup"
            ? "Sign Up"
            : type === "forgot-password"
            ? "Send Link"
            : "Reset Password"}
        </Button>

        {(type === "signin" || type === "signup") && (
          <>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() =>
                console.log(
                  `${type === "signup" ? "Sign Up" : "Sign In"} with Google`
                )
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="24px"
                height="24px"
              >
                <path
                  fill="#4285F4"
                  d="M46.1,24.5c0-1.6-.1-3.2-.4-4.7H24v9.3h12.6c-.5,3-2.1,5.5-4.4,7.2v6h7.1c4.1-3.8,6.8-9.4,6.8-15.8z"
                />
                <path
                  fill="#34A853"
                  d="M24,48c6.1,0,11.3-2,15.1-5.5l-7.1-6c-2,1.3-4.6,2.1-7.9,2.1-6.1,0-11.3-4.1-13.2-9.7H3.6v6.1C7.4,43.3,15.1,48,24,48z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.8,28.7c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7V13.1H3.6C1.3,17.3,0,21.7,0,26.4s1.3,9.1,3.6,13.3l7.2-5.6z"
                />
                <path
                  fill="#EA4335"
                  d="M24,9.6c3.3,0,6.3,1.1,8.6,3.3l6.4-6.4C34.9,2.7,29.7,0,24,0C15.1,0,7.4,4.7,3.6,13.1l7.2,5.6C12.7,13.7,17.9,9.6,24,9.6z"
                />
              </svg>
              {type === "signup"
                ? "Sign Up with Google"
                : "Sign In with Google"}
            </Button>
          </>
        )}

        {type === "signin" && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => console.log("Sign In with Employee ID")}
          >
            Sign In with Employee ID
          </Button>
        )}

        {(type === "signin" || type === "signup") && (
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="/auth/signup" className="underline underline-offset-4">
              Sign up
            </a>
          </div>
        )}

        {type === "forgot-password" && (
          <div className="flex items-center justify-center">
            <Button type="submit">Send Reset Link</Button>
          </div>
        )}

        {onBack && (
          <Button type="button" onClick={onBack} className="mt-2">
            Back
          </Button>
        )}
      </div>
    </form>
  );
}