"use client";
import React, { useState, useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Select, MenuItem } from "@mui/material";
import {
  AdminPanelSettings,
  Person,
  Language,
  DarkMode,
  Menu,
  Close,
  DirectionsCar,
  Phone,
  LocationOn,
  Facebook,
  Twitter,
  Instagram,
  Dashboard,
  Logout,
  Home,
  Business,
  EventNote,
  Group,
  Article,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import Tooltip from "@/components/ui/Tooltip";
import NotificationDropdown from "@/components/ui/NotificationDropdown";

const subscribeToHydration = () => () => {};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation("common");
  const [showTopBar, setShowTopBar] = useState(true);
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Hide top bar after scrolling 50px
      if (window.scrollY > 50) {
        setShowTopBar(false);
      } else {
        setShowTopBar(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.dir = i18n.dir();
      document.documentElement.lang = i18n.language;
    }
  }, [i18n, mounted]);


  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 shadow-lg transition-all duration-300 font-sans"
      suppressHydrationWarning
    >
      {/* Top bar */}




      <div
        className={`bg-slate-dark text-orange-400 text-sm font-medium tracking-wide transition-all duration-500 ease-in-out overflow-hidden ${
          showTopBar ? "h-11 opacity-100" : "h-0 opacity-0"
        }`}
      >
        <div
          className="container mx-auto h-full flex items-center justify-between px-6"
          dir="rtl"
        >
          {/* Right Side: Exact Text from Reference */}
          {/* Right Side: Optimized for Mobile */}
          <div className="flex items-center gap-2 sm:gap-6 h-full">
            <Link
              href="/individuals"
              className="hover:text-orange-200 transition-all duration-300 border-l border-orange-700/30 pl-3 sm:pl-6 h-full flex items-center active:scale-95"
              aria-label={t("navbar.individuals")}
              title={t("navbar.individuals")}
            >
              <Tooltip text={t("navbar.individuals")} position="bottom">
                <Group className="md:hidden ml-2" style={{ fontSize: 20 }} />
                <span className="hidden md:inline">
                  {t("navbar.individuals")}
                </span>
              </Tooltip>
            </Link>
            <Link
              href="/corporate"
              className="hover:text-orange-200 transition-all duration-300 border-l border-orange-700/30 pl-3 sm:pl-6 h-full flex items-center active:scale-95"
              aria-label={t("navbar.corporate")}
              title={t("navbar.corporate")}
            >
              <Tooltip text={t("navbar.corporate")} position="bottom">
                <Business className="md:hidden ml-2" style={{ fontSize: 20 }} />
                <span className="hidden md:inline">
                  {t("navbar.corporate")}
                </span>
              </Tooltip>
            </Link>
            <Link
              href="/with-driver"
              className="hover:text-orange-200 transition-all duration-300 border-l border-orange-700/30 pl-3 sm:pl-6 h-full flex items-center active:scale-95"
              aria-label={t("navbar.withDriver")}
              title={t("navbar.withDriver")}
            >
              <Tooltip text={t("navbar.withDriver")} position="bottom">
                <Person className="md:hidden ml-2" style={{ fontSize: 20 }} />
                <span className="hidden md:inline">
                  {t("navbar.withDriver")}
                </span>
              </Tooltip>
            </Link>
            <Link
              href="/policy"
              className="hover:text-orange-200 transition-all duration-300 border-l border-orange-700/30 pl-3 sm:pl-6 h-full flex items-center active:scale-95"
            >
              <Tooltip text={t("navbar.policy")} position="bottom">
                <EventNote
                  className="md:hidden ml-2"
                  style={{ fontSize: 20 }}
                />
                <span className="hidden md:inline">{t("navbar.policy")}</span>
              </Tooltip>
            </Link>
          </div>

          {/* Left Side: Language (Hidden on mobile to save space) */}
          <div className="hidden sm:flex items-center gap-4">
            <Select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              variant="standard"
              disableUnderline
              sx={{
                color: "inherit",
                fontSize: "0.875rem",
                fontWeight: "bold",
                fontFamily: "inherit",
                "& .MuiSelect-icon": { color: "inherit" },
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  py: 0,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#1f2937",
                    color: "white",
                    borderRadius: "0.75rem",
                    mt: 1,
                    "& .MuiMenuItem-root": {
                      justifyContent: "center",
                      fontFamily: "inherit",
                      fontSize: "0.875rem",
                    },
                    "& .MuiMenuItem-root:hover": {
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                    "& .Mui-selected": {
                      bgcolor: "rgba(249,115,22,0.2) !important",
                      color: "#fb923c",
                    },
                  },
                },
              }}
            >
              <MenuItem value="ar" dir="rtl">
                العربية
              </MenuItem>
              <MenuItem value="en" dir="ltr">
                English
              </MenuItem>
            </Select>
          </div>
        </div>
      </div>

      {/* Main navbar */}






      <div className="bg-midnight border-b border-white/10 transition-all duration-300 relative">
        <div className="container mx-auto px-4 sm:px-6 py-3" dir="rtl">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:flex md:items-center md:justify-between">
            {/* RIGHT: City Links + Home */}
            <nav className="hidden md:flex items-center gap-3 min-w-max">
              <Link
                href="/"
                className="text-primary hover:text-primary-hover font-extrabold text-sm lg:text-base transition-colors flex items-center gap-1"
              >
                <Home fontSize="small" />
                {t("navbar.home")}
              </Link>
              <Link
                href="/cars"
                className="text-primary hover:text-primary-hover font-extrabold text-sm lg:text-base transition-colors flex items-center gap-1 border-l border-white/10 pl-6"
              >
                <DirectionsCar fontSize="small" />
                {t("navbar.cars")}
              </Link>
              <Link
                href="/jeddah"
                className="text-primary hover:text-primary-hover font-extrabold text-sm lg:text-base transition-colors"
              >
                {t("navbar.jeddah")}
              </Link>
              <Link
                href="/riyadh"
                className="text-primary hover:text-primary-hover font-extrabold text-sm lg:text-base transition-colors"
              >
                {t("navbar.riyadh")}
              </Link>
              <Link
                href="/sharqiya"
                className="text-primary hover:text-primary-hover font-extrabold text-sm lg:text-base transition-colors border-l border-white/10 pl-6"
              >
                {t("navbar.sharqiya")}
              </Link>
              <Link
                href="/blog"
                className="text-primary hover:text-primary-hover font-extrabold text-sm lg:text-base transition-colors flex items-center gap-1"
              >
                <Article fontSize="small" />
                {t("navbar.blog")}
              </Link>
            </nav>

            {/* CENTER: LOGO - Centered and Scale-Optimized */}
            <div className="col-start-2 justify-self-center shrink-0 px-1 sm:px-2 md:px-4 w-[7rem] sm:w-[8.25rem] md:w-40">
              <Link
                href="/"
                className="group block transition-transform duration-300 ease-out hover:scale-[1.05] active:scale-95 focus:outline-none"
                aria-label="C4R Platform Home"
                title={t("navbar.logoTitle")}
              >
                <Image
                  src="/images/logo.webp"
                  alt={t("navbar.logoAlt")}
                  width={160}
                  height={65}
                  priority
                  sizes="(max-width: 640px) 112px, (max-width: 768px) 132px, 160px"
                  className="h-auto w-full object-contain rounded-[15px] logo-premium-glow"
                />
              </Link>
            </div>

            {/* LEFT: ICONS (Admin, Login) - Strictly Role-Gated */}
            <div className="col-start-3 justify-self-end flex items-center gap-2 sm:gap-6 min-w-max justify-end z-10">
              {/* User Dashboard icon / Login Button */}
              {mounted && (
                <>
                  {user ? (
                    <div className="flex items-center gap-1 sm:gap-4 border-r border-white/10 pr-1 sm:pr-4">
                      <NotificationDropdown />
                      <Link
                        href={
                          user.role === "admin"
                            ? "/dashboard/admin"
                            : "/dashboard/user"
                        }
                        className="flex items-center justify-center gap-2 text-primary hover:text-primary-hover transition-colors active:scale-95 min-h-[44px] min-w-[44px]"
                        title={
                          user.role === "admin"
                            ? t("navbar.adminPanel")
                            : t("navbar.myAccount")
                        }
                      >
                        {user.role === "admin" ? (
                          <AdminPanelSettings className="text-orange-500" />
                        ) : (
                          <Person />
                        )}
                        <span className="hidden lg:inline text-sm font-extrabold">
                          {user.role === "admin"
                            ? t("navbar.adminPanel")
                            : t("navbar.myAccount")}
                        </span>
                      </Link>
                      <button
                        onClick={logout}
                        className="flex items-center justify-center text-red-500 hover:text-red-400 transition-colors active:scale-95 min-h-[44px] min-w-[44px]"
                        title={t("navbar.logout")}
                      >
                        <Logout fontSize="small" />
                        <span className="hidden lg:inline text-sm font-extrabold mr-1">
                          {t("navbar.logout")}
                        </span>
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="flex items-center justify-center gap-2 text-primary hover:text-primary-hover transition-colors border-r border-white/10 pr-2 sm:pr-4 active:scale-95 min-h-[44px] min-w-[44px]"
                      title={t("navbar.login")}
                    >
                      <Person />
                      <span className="hidden lg:inline text-sm font-extrabold">
                        {t("navbar.login")}
                      </span>
                    </Link>
                  )}
                </>
              )}
              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden flex items-center justify-center w-10 h-10 text-white hover:text-primary transition-colors active:scale-95"
                onClick={() => setMobileMenuOpen(true)}
                aria-label={t("navbar.menu")}
                title={t("navbar.menu")}
              >
                <Menu fontSize="medium" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-gray-900/98 backdrop-blur-xl transition-all duration-300 md:hidden flex flex-col ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white">
              {t("navbar.menu")}
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <Close />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold text-white hover:text-primary transition-colors flex items-center gap-3 p-2 rounded-xl hover:bg-white/5"
            >
              <Home className="text-primary" />
              {t("navbar.home")}
            </Link>
            <Link
              href="/cars"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold text-white hover:text-primary transition-colors flex items-center gap-3 p-2 rounded-xl hover:bg-white/5"
            >
              <DirectionsCar className="text-primary" />
              {t("navbar.cars")}
            </Link>
            <Link
              href="/jeddah"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold text-white hover:text-primary transition-colors flex items-center gap-3 p-2 rounded-xl hover:bg-white/5"
            >
              <LocationOn className="text-primary" />
              {t("navbar.jeddah")}
            </Link>
            <Link
              href="/riyadh"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold text-white hover:text-primary transition-colors flex items-center gap-3 p-2 rounded-xl hover:bg-white/5"
            >
              <LocationOn className="text-primary" />
              {t("navbar.riyadh")}
            </Link>
            <Link
              href="/sharqiya"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold text-white hover:text-primary transition-colors flex items-center gap-3 p-2 rounded-xl hover:bg-white/5"
            >
              <LocationOn className="text-primary" />
              {t("navbar.sharqiya")}
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold text-white hover:text-primary transition-colors flex items-center gap-3 p-2 rounded-xl hover:bg-white/5"
            >
              <Article className="text-primary" />
              {t("navbar.blog")}
            </Link>
            <div className="h-px bg-white/10 w-full my-1" />
            <Link
              href="/individuals"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold text-white hover:text-primary transition-colors flex items-center gap-3 p-2 rounded-xl hover:bg-white/5"
            >
              <Group className="text-primary" />
              {t("navbar.individuals")}
            </Link>
            <Link
              href="/corporate"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold text-white hover:text-primary transition-colors flex items-center gap-3 p-2 rounded-xl hover:bg-white/5"
            >
              <Business className="text-primary" />
              {t("navbar.corporate")}
            </Link>
            <Link
              href="/with-driver"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold text-white hover:text-primary transition-colors flex items-center gap-3 p-2 rounded-xl hover:bg-white/5"
            >
              <Person className="text-primary" />
              {t("navbar.withDriver")}
            </Link>
          </nav>

          <div className="h-px bg-white/10 w-full" />

          {/* Mobile Language Selector */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-gray-400">
              {t("navbar.language")}
            </span>
            <Select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              variant="outlined" // Outlined is better for mobile touch targets
              fullWidth
              sx={{
                color: "white",
                bgcolor: "white/5",
                borderRadius: "0.75rem",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.1)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.2)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--primary)",
                },
                "& .MuiSelect-icon": { color: "white" },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#1f2937",
                    color: "white",
                    borderRadius: "0.75rem",
                  },
                },
              }}
            >
              <MenuItem value="ar" dir="rtl">
                العربية
              </MenuItem>
              <MenuItem value="en" dir="ltr">
                English
              </MenuItem>
            </Select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
