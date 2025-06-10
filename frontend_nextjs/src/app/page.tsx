// "use client";

// export default function Home() {
//   return (
//     <div className="text-center">
//       <img src="/hris-logo.svg" alt="Logo" className="mx-auto mb-4 w-32" />
//       <h1 className="text-3xl font-bold">Welcome to Our App</h1>
//       <p className="text-gray-500">This is the landing page.</p>
//     </div>
//   );
// }

// src/app/layout.tsx
"use client";

import "./globals.css";
import { NavigationMenuItem } from "@/components/ui/navigation-menu";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavigationMenuItem /> {/* panggil di sini */}
        <Header />
        <Hero />
        <main>{children}</main>
      </body>
    </html>
  );
}
