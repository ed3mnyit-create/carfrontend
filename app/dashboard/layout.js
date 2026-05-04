"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Avatar, CircularProgress } from "@mui/material";
import {
  Dashboard,
  DirectionsCar,
  EventNote,
  Person,
  Logout,
  Settings,
  AddCircle,
  Star,
  Home,
  Lock,
  Notifications,
  Article,
  Category,
} from "@mui/icons-material";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";

// Sub-component to handle searchParams safely
function DashboardSidebarContent({
  isAdmin,
  user,
  logout,
  getInitials,
  prefix,
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslation("common");

  const userLinks = [
    {
      name: t("dashboard.profile"),
      href: `${prefix}?tab=profile`,
      icon: <Person />,
    },
    {
      name: t("dashboard.bookings"),
      href: `${prefix}?tab=bookings`,
      icon: <EventNote />,
    },
    {
      name: t("dashboard.changePassword"),
      href: `${prefix}?tab=password`,
      icon: <Settings />,
    },
  ];

  const adminLinks = [
    {
      name: t("dashboard.adminBookings"),
      href: `${prefix}?tab=bookings`,
      icon: <EventNote />,
    },
    {
      name: t("dashboard.admin.tabs.notifications"),
      href: `${prefix}?tab=notifications`,
      icon: <Notifications />,
    },
    {
      name: t("dashboard.adminCars"),
      href: `${prefix}?tab=cars`,
      icon: <DirectionsCar />,
    },
    {
      name: t("dashboard.adminReviews"),
      href: `${prefix}?tab=reviews`,
      icon: <Star />,
    },
    {
      name: t("dashboard.admin.tabs.categories"),
      href: "/dashboard/admin/categories",
      icon: <Category />,
    },
    {
      name: t("dashboard.admin.tabs.blog"),
      href: "/dashboard/admin/blogs",
      icon: <Article />,
    },
    {
      name: t("dashboard.admin.tabs.settings"),
      href: "/dashboard/admin/settings",
      icon: <Settings />,
    },
    {
      name: t("dashboard.profile"),
      href: `${prefix}?tab=profile`,
      icon: <Person />,
    },
    {
      name: t("dashboard.adminPassword"),
      href: `${prefix}?tab=password`,
      icon: <Lock />,
    },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .sidebar-scroll:hover::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
        }
      `}} />
      <aside 
        className="w-[280px] bg-[#020617]/95 backdrop-blur-3xl border-l border-white/5 hidden md:flex flex-col fixed right-0 z-40 sidebar-scroll shadow-[-10px_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 rounded-tl-3xl rounded-bl-3xl overflow-hidden" 
        style={{ top: "125px", height: "calc(100vh - 145px)" }}
      >

        {/* User Card Modernized */}
        <div className="px-6 pt-8 pb-6 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full z-0 pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative">
              <Avatar
                sx={{
                  width: 54,
                  height: 54,
                  bgcolor: "rgba(249,115,22,0.15)",
                  color: "#f97316",
                  fontFamily: "inherit",
                  fontWeight: "900",
                  fontSize: "1.2rem",
                  border: "1px solid rgba(249,115,22,0.3)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}
              >
                {getInitials(user?.name)}
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#020617]" title="Online" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-white text-[15px] tracking-tight truncate">
                {user?.name}
              </h3>
              <p className="text-primary text-[11px] uppercase tracking-widest font-bold mt-0.5">
                {isAdmin ? t("dashboard.roleAdmin") : t("dashboard.roleClient")}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-400 bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-300 border border-white/5 group"
          >
            <div className="bg-white/5 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Home className="text-slate-500 group-hover:text-primary transition-colors" sx={{ fontSize: 18 }} />
            </div>
            <span className="text-xs tracking-wide">{t("dashboard.backToHome")}</span>
          </Link>
        </div>

        <div className="px-8 pt-4 pb-2">
          <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent mb-4" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            {t("dashboard.mainMenu")}
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto sidebar-scroll pb-6">
          {links.map((link) => {
            const basePath = pathname;
            const currentTabUrl = searchParams.get("tab");
            
            const [linkPath, linkQuery] = link.href.split("?");
            const linkTabObj = new URLSearchParams(linkQuery || "");
            const linkTabVal = linkTabObj.get("tab");
            
            let isActive = false;
            
            if (linkTabVal) {
              const isDefaultTab = (linkTabVal === "bookings" && isAdmin) || (linkTabVal === "profile" && !isAdmin);
              const isPathMatch = basePath === linkPath;
              const isTabMatch = currentTabUrl === linkTabVal || (!currentTabUrl && isDefaultTab && isPathMatch);
              isActive = isPathMatch && isTabMatch;
            } else {
              isActive = basePath.startsWith(linkPath) && linkPath !== "/dashboard/admin" && linkPath !== "/dashboard/user";
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 group relative ${
                  isActive
                    ? "bg-linear-to-r from-primary/20 to-transparent text-white border border-primary/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
                }`}
              >
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full shadow-[0_0_10px_#f97316]" />
                )}
                <div className={`transition-all duration-300 p-1.5 rounded-lg ${isActive ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-slate-300"}`}>
                  {link.icon}
                </div>
                <span className={`text-[13px] tracking-wide ${isActive ? "font-black" : "font-semibold"}`}>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Improved Logout Panel */}
        <div className="p-4 mt-auto">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/20 group"
          >
            <Logout className="group-hover:-translate-x-1 transition-transform" sx={{ fontSize: 20 }} />
            <span className="text-[13px] tracking-wide">{t("dashboard.secureLogout")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default function DashboardLayout({ children }) {
  const { user, logout, loading } = useAuth();
  const { t, i18n } = useTranslation("common");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress color="primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white p-10">
        <h2 className="text-2xl font-black mb-4">
          {t("dashboard.loginRequired")}
        </h2>
        <Link
          href="/auth/login"
          className="bg-primary px-8 py-3 rounded-xl font-black"
        >
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
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-transparent flex" dir={i18n.dir()}>
      <Suspense
        fallback={
          <div className="w-80 hidden md:block bg-white/5 animate-pulse" />
        }
      >
        <DashboardSidebarContent
          isAdmin={isAdmin}
          user={user}
          logout={logout}
          getInitials={getInitials}
          prefix={prefix}
        />
      </Suspense>

      {/* Main Content */}
      <main className="flex-1 md:mr-80 pt-20 pb-20 md:pb-0 relative z-10">
        <div className="p-4 sm:p-6 md:p-8 lg:p-12 animate-in fade-in duration-1000">
          {children}
        </div>
      </main>
    </div>
  );
}
