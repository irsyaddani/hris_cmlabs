// lib/user-context.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  IconCategory,
  IconClockPin,
  IconReceipt,
  IconUsersGroup,
  type TablerIcon, // Import the TablerIcon type
} from "@tabler/icons-react";

// Define User type
interface User {
  name: string;
  email: string;
  avatar: string;
  level: string;
}

// Define NavMain item type - Match exactly with your NavMain component
interface NavMainItem {
  title: string;
  url: string;
  icon?: TablerIcon;
}

// Menu untuk admin
const adminNavMain: NavMainItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconCategory,
  },
  {
    title: "Employment",
    url: "/employment",
    icon: IconUsersGroup,
  },
  {
    title: "Check Clock",
    url: "/checkclock",
    icon: IconClockPin,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: IconReceipt,
  },
];

// Menu untuk user biasa
const userNavMain: NavMainItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconCategory,
  },
  {
    title: "Check Clock",
    url: "/checkclock",
    icon: IconClockPin,
  },
];

// // Sample user data
// const userData: User = {
//   name: "Emir Abiyyu",
//   email: "m@example.com",
//   avatar: "/avatars/shadcn.jpg",
//   level: "admin", // Change to "user" for testing user level
// };

// Function to get navigation items based on level
const getNavMainByLevel = (level: User["level"]): NavMainItem[] => {
  switch (level) {
    case "admin":
      return adminNavMain;
    case "user":
      return userNavMain;
    default:
      return userNavMain; // Default to user menu
  }
};

// Create User Context
interface UserContextType {
  user: User | null;
  loading: boolean;
  getNavMainByLevel: (level: User["level"]) => NavMainItem[];
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// User Provider Component
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, getNavMainByLevel }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to access User Context
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
