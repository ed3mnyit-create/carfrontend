"use client";
import { useTranslation } from "react-i18next";

import React from "react";
import { usePathname } from "next/navigation";
import { WhatsApp, Email } from "@mui/icons-material";

const FloatingContact = () => {
  const { t } = useTranslation("common");
  const pathname = usePathname();

  // Hide on auth and dashboard pages
  const hidePaths = ["/auth", "/dashboard"];
  const shouldHide = hidePaths.some((path) => pathname?.includes(path));

  if (shouldHide) return null;

  return (
    <>
      {/* WhatsApp - Bottom Right */}
      <a
        href="https://wa.me/966554118873"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "generate_lead", { method: "WhatsApp" });
          }
        }}
        className="hidden md:flex fixed bottom-8 right-8 z-[9999] w-12 h-12 rounded-2xl bg-green-500/10 items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all duration-300 shadow-lg border border-green-500/20 active:scale-90"
        aria-label={t("floatingContact.whatsapp")}
      >
        <WhatsApp
          sx={{ fontSize: 32 }}
          className="group-hover:rotate-12 transition-transform"
        />
      </a>

      {/* Email - Bottom Left */}
      <a
        href="mailto:Team@C4Rplatform.com"
        className="hidden md:flex fixed bottom-8 left-8 z-[9999] bg-white/10 backdrop-blur-xl border border-white/20 text-white w-14 h-14 rounded-2xl items-center justify-center shadow-2xl hover:bg-white/20 hover:scale-110 transition-all duration-300 group"
        aria-label={t("floatingContact.email")}
      >
        <Email
          sx={{ fontSize: 28 }}
          className="group-hover:-translate-y-1 transition-transform"
        />
      </a>
    </>
  );
};

export default FloatingContact;
