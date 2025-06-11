"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SocialCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const API_URL = "http://localhost:8000";
  const error = searchParams.get("error");

  const [errorMessage, setErrorMessage] = useState("");
  
  useEffect(() => {
    if (error === "unregistered" || error === "invalid_signup") {
      setErrorMessage(
        "Email tidak terdaftar. Hubungi HRD perusahaan Anda untuk mendapatkan akses login."
      );      setTimeout(() => {
        router.push("/auth/login");
      }, 5000);
      return;
    }
    if (token) {
      localStorage.setItem("token", token);

      fetch(`${API_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((user) => {
          localStorage.setItem("userLevel", user.level);
          if (user.level === "admin") {
            router.push("/dashboard");
          } else {
            router.push("/dashboard");
          }
        });
    } else {
      router.push("/auth/login");
    }
  }, [token, error, router]);

  return (
    <div className="flex items-center justify-center h-screen text-center px-4">
      {errorMessage ? (
        <div className="text-red-500 font-semibold text-lg">
          {errorMessage}
        </div>
      ) : (
        <div className="w-full h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      )}
    </div>
  );
}
