"use client";

import { usePathname } from "next/navigation";

export default function MainLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.includes("/dashboard");

  return (
    <main
      className={`min-h-screen pt-28 transition-all duration-300 ${
        isDashboard ? "pb-8" : "pb-24"
      }`}
    >
      {children}
    </main>
  );
}
