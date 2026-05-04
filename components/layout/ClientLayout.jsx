"use client";

import React from "react";
import dynamic from "next/dynamic";

// NUCLEAR HYDRATION FIX: 
// These components rely on client-side state (Translations, Auth, Theme).
// By using dynamic with ssr: false HERE (in a client component), we
// completely bypass server/client mismatches for these pieces.

const Navbar = dynamic(() => import("./Navbar"), { ssr: false });
const BottomNav = dynamic(() => import("./BottomNav"), { ssr: false });
const FloatingContact = dynamic(() => import("./FloatingContact"), { ssr: false });
const FooterWrapper = dynamic(() => import("./FooterWrapper"), { ssr: false });
const MainLayoutWrapper = dynamic(() => import("./MainLayoutWrapper"), { ssr: false });

export default function ClientLayout({ children }) {
  return (
    <>
      <Navbar />
      <BottomNav />
      <FloatingContact />
      <MainLayoutWrapper>{children}</MainLayoutWrapper>
      <FooterWrapper />
    </>
  );
}
