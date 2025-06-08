// lib/user-context.tsx
"use client";

import { createContext, useContext } from "react";
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
  role: "admin" | "user";
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

// Sample user data
const userData: User = {
  name: "Emir Abiyyu",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
  role: "admin", // Change to "user" for testing user role
};

// Function to get navigation items based on role
const getNavMainByRole = (role: User["role"]): NavMainItem[] => {
  switch (role) {
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
  user: User;
  getNavMainByRole: (role: User["role"]) => NavMainItem[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// User Provider Component
export function UserProvider({ children }: { children: React.ReactNode }) {
  return (
    <UserContext.Provider value={{ user: userData, getNavMainByRole }}>
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
