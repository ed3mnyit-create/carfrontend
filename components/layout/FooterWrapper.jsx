"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();

  // Hide footer on dashboard pages (Admin & User)
  if (pathname?.includes("/dashboard")) {
    return null;
  }

  return <Footer />;
}
