"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_URL = "http://localhost:8000";

export function AuthGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[]; // contoh: ['admin'] atau ['user', 'admin']
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/auth/login");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userLevel = response.data.level;
        localStorage.setItem("userLevel", userLevel);

        if (!allowedRoles || allowedRoles.includes(userLevel)) {
          setAuthorized(true);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("userLevel");
          router.replace("/auth/login");
        }
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("userLevel");
        router.replace("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [allowedRoles, router]);

  if (loading) {    
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}
