"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Avatar, CircularProgress } from "@mui/material";
import {
  Article,
  Category,
  Close,
  DirectionsCar,
  EventNote,
  Home,
  Lock,
  Logout,
  Menu,
  Notifications,
  Person,
  Settings,
  Star,
} from "@mui/icons-material";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { useTranslation } from "react-i18next";

function DashboardNavContent({
  isAdmin,
  user,
  logout,
  getInitials,
  prefix,
  onNavigate,
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslation("common");

  const userLinks = [
    { name: t("dashboard.profile"), href: `${prefix}?tab=profile`, icon: <Person /> },
    { name: t("dashboard.bookings"), href: `${prefix}?tab=bookings`, icon: <EventNote /> },
    { name: t("dashboard.changePassword"), href: `${prefix}?tab=password`, icon: <Settings /> },
  ];

  const adminLinks = [
    { name: t("dashboard.adminBookings"), href: `${prefix}?tab=bookings`, icon: <EventNote /> },
    { name: t("dashboard.admin.tabs.notifications"), href: `${prefix}?tab=notifications`, icon: <Notifications /> },
    { name: t("dashboard.adminCars"), href: `${prefix}?tab=cars`, icon: <DirectionsCar /> },
    { name: t("dashboard.adminReviews"), href: `${prefix}?tab=reviews`, icon: <Star /> },
    { name: t("dashboard.admin.tabs.categories"), href: "/dashboard/admin/categories", icon: <Category /> },
    { name: t("dashboard.admin.tabs.blog"), href: "/dashboard/admin/blogs", icon: <Article /> },
    { name: t("dashboard.admin.tabs.settings"), href: "/dashboard/admin/settings", icon: <Settings /> },
    { name: t("dashboard.profile"), href: `${prefix}?tab=profile`, icon: <Person /> },
    { name: t("dashboard.adminPassword"), href: `${prefix}?tab=password`, icon: <Lock /> },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  const isLinkActive = (href) => {
    const currentTab = searchParams.get("tab");
    const [linkPath, linkQuery] = href.split("?");
    const linkTab = new URLSearchParams(linkQuery || "").get("tab");

    if (linkTab) {
      const isDefaultTab =
        (linkTab === "bookings" && isAdmin) ||
        (linkTab === "profile" && !isAdmin);
      return (
        pathname === linkPath &&
        (currentTab === linkTab || (!currentTab && isDefaultTab))
      );
    }

    return (
      pathname.startsWith(linkPath) &&
      linkPath !== "/dashboard/admin" &&
      linkPath !== "/dashboard/user"
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 p-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-3">
            <Avatar
              sx={{
                width: 46,
                height: 46,
                bgcolor: "rgba(10, 35, 115,0.14)",
                color: "#0A2373",
                fontFamily: "inherit",
                fontWeight: "900",
                border: "1px solid rgba(10, 35, 115,0.25)",
              }}
            >
              {getInitials(user?.name)}
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-white">{user?.name}</p>
              <p className="mt-1 text-[11px] font-black uppercase tracking-[0.18em] text-primary">
                {isAdmin ? t("dashboard.roleAdmin") : t("dashboard.roleClient")}
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/"
          onClick={onNavigate}
          className="mt-3 flex min-h-11 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm font-black text-slate-300 transition hover:border-primary/30 hover:bg-primary/10 hover:text-white"
        >
          <Home sx={{ fontSize: 19 }} />
          {t("dashboard.backToHome")}
        </Link>
      </div>

      <div className="px-4 pb-2 pt-4">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
          {t("dashboard.mainMenu")}
        </p>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {links.map((link) => {
          const isActive = isLinkActive(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={`group flex min-h-12 items-center gap-3 rounded-xl border px-3 text-sm font-black transition ${
                isActive
                  ? "border-primary/30 bg-primary/15 text-white"
                  : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-white/[0.04] text-slate-500 group-hover:text-primary"
                }`}
              >
                {link.icon}
              </span>
              <span className="truncate">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={logout}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 text-sm font-black text-red-300 transition hover:bg-red-500 hover:text-white"
        >
          <Logout sx={{ fontSize: 19 }} />
          {t("dashboard.secureLogout")}
        </button>
      </div>
    </div>
  );
}

function DashboardNavFallback() {
  return (
    <div className="space-y-3 p-4">
      <div className="h-24 animate-pulse rounded-2xl bg-white/5" />
      <div className="h-11 animate-pulse rounded-xl bg-white/5" />
      <div className="h-11 animate-pulse rounded-xl bg-white/5" />
      <div className="h-11 animate-pulse rounded-xl bg-white/5" />
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const { user, logout, loading } = useAuth();
  const { t, i18n } = useTranslation("common");
  const [mobileOpen, setMobileOpen] = useState(false);
  const dir = i18n.dir();
  const isRtl = dir === "rtl";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CircularProgress color="primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-10 text-white">
        <h2 className="mb-4 text-2xl font-black">{t("dashboard.loginRequired")}</h2>
        <Link href="/auth/login" className="rounded-xl bg-primary px-8 py-3 font-black">
          {t("dashboard.loginButton")}
        </Link>
      </div>
    );
  }

  const isAdmin = user.role === "admin";
  const prefix = isAdmin ? "/dashboard/admin" : "/dashboard/user";

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const navProps = {
    isAdmin,
    user,
    logout,
    getInitials,
    prefix,
  };

  return (
    <div className="min-h-screen bg-transparent" dir={dir}>
      <aside
        className={`fixed top-24 bottom-4 z-40 hidden w-[288px] overflow-hidden rounded-3xl border border-white/10 bg-midnight/95 backdrop-blur-xl lg:block ${
          isRtl ? "right-4" : "left-4"
        }`}
      >
        <Suspense fallback={<DashboardNavFallback />}>
          <DashboardNavContent {...navProps} />
        </Suspense>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu overlay"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <aside
            className={`absolute top-3 bottom-3 w-[min(360px,calc(100vw-24px))] overflow-hidden rounded-3xl border border-white/10 bg-midnight ${
              isRtl ? "right-3" : "left-3"
            }`}
          >
            <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
              <p className="text-sm font-black text-white">{t("dashboard.mainMenu")}</p>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white"
                aria-label="Close menu"
              >
                <Close sx={{ fontSize: 20 }} />
              </button>
            </div>
            <Suspense fallback={<DashboardNavFallback />}>
              <DashboardNavContent
                {...navProps}
                onNavigate={() => setMobileOpen(false)}
              />
            </Suspense>
          </aside>
        </div>
      )}

      <main
        className={`min-h-screen pb-20 pt-20 ${
          isRtl ? "lg:pr-[320px]" : "lg:pl-[320px]"
        }`}
      >
        <div className="sticky top-20 z-30 border-b border-white/10 bg-background/88 px-4 py-3 backdrop-blur-xl lg:top-0">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                {isAdmin ? t("dashboard.roleAdmin") : t("dashboard.roleClient")}
              </p>
              <div className="mt-1 hidden sm:block">
                <Breadcrumbs />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm font-black text-white lg:hidden"
            >
              <Menu sx={{ fontSize: 20 }} />
              {t("dashboard.mainMenu")}
            </button>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">
          <div className="rounded-3xl border border-white/10 bg-white/[0.018] p-3 sm:p-4 lg:p-5">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
