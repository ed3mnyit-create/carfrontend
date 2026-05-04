"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  Home,
  DirectionsCar,
  Person,
  WhatsApp,
  Email,
} from "@mui/icons-material";

/**
 * BottomNav Component
 * Provides a native-app-like navigation experience on mobile devices.
 * Visible on: default (mobile) to sm.
 * Hidden on: md (tablet) and above.
 */
const BottomNav = () => {
  const { t } = useTranslation("common");
  const pathname = usePathname();

  const navLinks = [
    {
      label: t("bottomNav.home"),
      href: "/",
      icon: <Home />,
    },
    {
      label: t("bottomNav.cars"),
      href: "/cars",
      icon: <DirectionsCar />,
    },
    {
      label: t("bottomNav.whatsapp"),
      href: "https://wa.me/966554118873",
      icon: <WhatsApp />,
      isExternal: true,
    },
    {
      label: t("bottomNav.email"),
      href: "mailto:Team@C4Rplatform.com",
      icon: <Email />,
      isExternal: true,
    },
    {
      label: t("bottomNav.myAccount"),
      href: "/dashboard/user",
      icon: <Person />,
    },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-[100] bg-midnight/80 backdrop-blur-xl border-t border-white/10 md:hidden flex items-center justify-around px-2 py-2 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
      suppressHydrationWarning
    >
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        let iconColorClass = isActive ? "text-primary" : "text-slate-400";

        if (link.label === t("bottomNav.whatsapp"))
          iconColorClass = "text-green-500";
        if (link.label === t("bottomNav.email"))
          iconColorClass = "text-pink-500";

        const content = (
          <div
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? "scale-110" : "active:scale-95"}`}
          >
            <div
              className={`p-2 rounded-xl transition-colors ${isActive ? "bg-primary/10 shadow-[0_0_15px_rgba(249,115,22,0.2)]" : ""} ${iconColorClass}`}
            >
              {link.icon}
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-primary" : "text-slate-400"}`}
              suppressHydrationWarning
            >
              {link.label}
            </span>
          </div>
        );

        if (link.isExternal) {
          return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-[70px] flex justify-center"
            >
              {content}
            </a>
          );
        }

        return (
          <Link
            key={link.label}
            href={link.href}
            className="min-w-[70px] flex justify-center"
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
