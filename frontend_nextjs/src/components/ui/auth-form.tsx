"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import  {RegisterFormSchema, RegisterFormType } from "@/lib/schemas/SignUpFormSchema";
import { LoginFormSchema, LoginFormType } from "@/lib/schemas/SignInFormSchema";
import { IdLoginFormSchema, IdLoginFormType } from "@/lib/schemas/SignInIdFormSchema";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "./password-input";
import { IconUserCircle, IconArrowLeft } from "@tabler/icons-react";
import { useEffect } from "react";

import React from "react";
import axios from "axios";

const API_URL = "http://localhost:8000";

interface AuthFormProps {
  type: "signup" | "login" | "idlogin" | "forgot-password" | "reset-password";
  onSubmit?: (data: any) => void; // Optional, default fallback ke internal handler
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
  const router = useRouter();
  const getSchema = () => {
    switch (type) {
      case "signup":
        return RegisterFormSchema;
      case "login":
        return LoginFormSchema;
      case "idlogin":
        return IdLoginFormSchema;
      // Tambahkan jika punya schema reset/forgot
      default:
        return LoginFormSchema;
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(getSchema()),
  });

  const [isAgreed, setIsAgreed] = React.useState(false);
  const isSignup = type === "signup";
  const isLogin = type === "login";
  const isIdLogin = type === "idlogin";
  const isForgot = type === "forgot-password";
  const isReset = type === "reset-password";
  
  const [isLoading, setIsLoading] = React.useState(false);

  const titles = {
    login: "Sign In with Email",
    idlogin: "Sign In with Employee ID",
    signup: "Admin Sign Up",
    "forgot-password": "Forgot Password",
    "reset-password": "Set New Password",
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const level = localStorage.getItem("userLevel");

    if (token && level === "admin") {
      router.replace("/dashboard");
    } else if (token && level === "user") {
      router.replace("/employee-dashboard");
    }
  }, [router]);

  // Fungsi submit utama berdasarkan type
  const submitForm = (data: RegisterFormType | LoginFormType | IdLoginFormType) => {
    console.log("Submit Form triggered with data:", data);
    if (type === "login") return handleLogin(data);
    if (type === "idlogin") return handleLogin(data);
    if (type === "signup") return handleSignup(data);
    if (onSubmit) return onSubmit(data);
    console.log("Unhandled submit type", type);
  };

  // Fungsi handle login
  const handleLogin = async (data: LoginFormType) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/login`,
        {
          identifier: data.identifier,
          password: data.password,
        },
        { withCredentials: true }
      );
      
      const token = res.data.token;
      localStorage.setItem("token", token);

      const userRes = await axios.get(`${API_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const level = userRes.data.level;
      localStorage.setItem("userLevel", level);

      if (level === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/employee-dashboard");
      }

      console.log("Login success", { token, level });
      
    } catch (error: any) {
      console.error("Login error", error.response?.data || error.message);
      alert("Login failed: " + (error.response?.data?.message || "Unknown error"));

    } finally {
      setIsLoading(false);
    } 

  };


  // Fungsi handle signup
  const handleSignup = async (data: RegisterFormType) => {
    if (!isAgreed) {
      alert("Please agree to the terms");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/signup`,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          password_confirmation: data.confirmPassword,
        },
        { withCredentials: true }
      );
      console.log("Signup success", res.data);
      router.push("/auth/login");
    } catch (error: any) {
      console.error("Signup error", error.response?.data || error.message);
      alert("Signup failed: " + (error.response?.data?.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-7 font-inter"
      onSubmit={handleSubmit(submitForm)}
    >
      {}
      <div className="flex flex-col items-start gap-3 text-left">
        {(isForgot || isReset) && onBack && (
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 w-fit px-0"
          >
            <IconArrowLeft className="h-24 w-24" />
            <span className="text-md font-normal">Back</span>
          </Button>
        )}
        <h1 className="text-4xl font-medium">{title || titles[type] || ""}</h1>
        {subtitle && (
          <p className="text-lg/tight text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {/* Form Body */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          {isSignup && (
            <div className="flex flex-row gap-2">
              <div className="grid gap-2 w-full">
                <Label htmlFor="name">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              <div className="grid gap-2 w-full">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {!isReset && !isIdLogin && (
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register(isLogin ? "identifier" : "email")}
              />
              {isLogin ? (
                errors.identifier && (
                  <p className="text-sm text-red-500">{errors.identifier.message}</p>
                )
              ) : (
                errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )
              )}
            </div>
          )}

          {isIdLogin && (
            <div className="grid gap-2">
              <Label htmlFor="employee_code">Employee ID</Label>
              <Input
                id="employee_code"
                type="text"
                placeholder="EM12345"
                {...register("identifier")}
              />
              {errors.identifier && (
                <p className="text-sm text-red-500">{errors.identifier.message}</p>
              )}
            </div>
          )}

          {(isLogin || isIdLogin || isSignup || isReset) && (
            <div className="grid gap-2">
              <Label htmlFor="password">
                {isReset ? "New Password" : "Password"}
              </Label>
              <PasswordInput 
              {...register("password")} />
              {errors.password?.message && (
                <div>
                  {/* Jika error berupa array, loop dan tampilkan */}
                  {Array.isArray(errors.password.message) ? (
                    errors.password.message.map((msg, idx) => (
                      <p key={idx} className="text-sm text-red-500">
                        {msg}
                      </p>
                    ))
                  ) : (
                    // Jika hanya ada satu pesan error, tampilkan saja
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {(isSignup || isReset) && (
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <PasswordInput
                id="confirmPassword"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}

          {isSignup && (
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

          {(isLogin || isIdLogin) && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={isAgreed}
                  onChange={() => setIsAgreed(!isAgreed)}
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm text-[var(--color-neutral-500)]"
                >
                  Remember Me
                </Label>
              </div>
              <a
                href="/auth/forgot-password"
                className="text-[var(--color-primary-700)] text-sm"
              >
                Forgot Password?
              </a>
            </div>
          )}
        </div>

        {}
        <Button
          disabled={isLoading}
          type="submit"
          className="text-white font-medium bg-[var(--color-primary-900)] hover:bg-[var(--color-primary-700)]"
        >
          {isLoading
            ? "Loading..."
            : isLogin
            ? "Sign in"
            : isSignup
            ? "Sign up"
            : isIdLogin
            ? "Sign in"
            : isForgot
            ? "Send link"
            : "Reset password"}
        </Button>

        {/* Social/Auth Extras */}
        <div className="flex flex-col gap-4">
          {(isLogin || isIdLogin || isSignup) && (
            <>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={() => {
                  console.log(`${isSignup ? "Sign Up" : "Sign In"} with Google`);
                  window.location.href = `http://localhost:8000/auth/google?mode=${isSignup ? "signup" : "login"}`;
                }}
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
                {isSignup ? "Sign Up with Google" : "Sign In with Google"}
              </Button>
            </>
          )}

          {isLogin && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                router.push("/auth/id-login")
                console.log("Sign In with Employee ID")
              }}
            >
              <IconUserCircle />
              Sign In with Employee ID
            </Button>
          )}

          {isIdLogin && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                router.push("/auth/login")
                console.log("Sign In with Employee ID")
              }}
            >
              <IconUserCircle />
              Sign In with Email
            </Button>
          )}

          {isSignup && (
            <div className="text-center text-sm text-muted-foreground">
              Already have an admin or employee account?{" "}
              <a href="/auth/login" className="text-black">
                Sign in here
              </a>
            </div>
          )}

          {(isLogin || isIdLogin) && (
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account yet?{" "}
              <a href="/auth/signup" className="text-black">
                Sign up now and get started
              </a>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
