"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { MenuItem, Select } from "@mui/material";
import {
  AdminPanelSettings,
  Article,
  Business,
  Close,
  DarkMode,
  DirectionsCar,
  Group,
  Home,
  LightMode,
  LocationOn,
  Logout,
  Menu,
  Person,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { useThemeMode } from "@/app/providers";
import NotificationDropdown from "@/components/ui/NotificationDropdown";
import Tooltip from "@/components/ui/Tooltip";

const subscribeToHydration = () => () => {};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const { t, i18n } = useTranslation("common");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  const isArabic = i18n.language?.startsWith("ar");
  const dir = isArabic ? "rtl" : "ltr";
  const themeLabel =
    mode === "dark" ? t("navbar.lightMode") : t("navbar.darkMode");

  useEffect(() => {
    if (mounted) {
      document.dir = i18n.dir();
      document.documentElement.lang = i18n.language;
    }
  }, [i18n, mounted]);

  const links = [
    { href: "/", label: t("navbar.home"), icon: <Home fontSize="small" /> },
    {
      href: "/cars",
      label: t("navbar.cars"),
      icon: <DirectionsCar fontSize="small" />,
    },
    { href: "/individuals", label: t("navbar.individuals"), icon: <Group /> },
    { href: "/with-driver", label: t("navbar.withDriver"), icon: <Person /> },
    { href: "/corporate", label: t("navbar.corporate"), icon: <Business /> },
    { href: "/blog", label: t("navbar.blog"), icon: <Article /> },
  ];

  const cityLinks = [
    { href: "/jeddah", label: t("navbar.jeddah") },
    { href: "/riyadh", label: t("navbar.riyadh") },
    { href: "/sharqiya", label: t("navbar.sharqiya") },
  ];

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-midnight/55 font-sans backdrop-blur-2xl transition-all duration-300 supports-[backdrop-filter]:bg-midnight/45"
      suppressHydrationWarning
      dir={dir}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid min-h-12 grid-cols-[1fr_auto_1fr] items-center gap-3">
          <nav className="hidden items-center gap-1 lg:flex">
            {links.slice(0, 5).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-xs font-bold text-white/78 transition-colors hover:text-primary"
              >
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-all hover:bg-white/10 hover:text-primary lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label={t("navbar.menu")}
            title={t("navbar.menu")}
            type="button"
          >
            <Menu />
          </button>

          <Link
            href="/"
            className="col-start-2 justify-self-center transition-transform duration-300 hover:scale-[1.03] active:scale-95"
            aria-label="C4R Platform Home"
            title={t("navbar.logoTitle")}
          >
            <Image
              src="/images/c4r-logo-official.png"
              alt={t("navbar.logoAlt")}
              width={56}
              height={56}
              priority
              sizes="56px"
              className="h-12 w-12 object-contain sm:h-14 sm:w-14"
            />
          </Link>

          <div className="col-start-3 flex items-center justify-end gap-2">
            <nav className="hidden items-center gap-1 xl:flex">
              {cityLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-3 py-1.5 text-xs font-bold text-white/78 transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/blog"
                className="rounded-full px-3 py-1.5 text-xs font-bold text-white/78 transition-colors hover:text-primary"
              >
                {t("navbar.blog")}
              </Link>
            </nav>

            <Select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              variant="standard"
              disableUnderline
              className="hidden sm:block"
              sx={{
                color: "rgba(255,255,255,0.78)",
                fontSize: "0.75rem",
                fontWeight: 700,
                fontFamily: "inherit",
                minWidth: 72,
                "& .MuiSelect-icon": { color: "rgba(255,255,255,0.78)" },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "var(--midnight)",
                    color: "var(--foreground)",
                    borderRadius: "0.75rem",
                    border: "1px solid var(--app-frame-border)",
                    mt: 1,
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

            {mounted && (
              <Tooltip text={themeLabel} position="bottom">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex min-h-10 min-w-10 items-center justify-center rounded-full text-white/78 transition-all hover:bg-white/10 hover:text-primary active:scale-95"
                  aria-label={themeLabel}
                  title={themeLabel}
                >
                  {mode === "dark" ? (
                    <LightMode fontSize="small" />
                  ) : (
                    <DarkMode fontSize="small" />
                  )}
                  <span className="hidden px-2 text-xs font-bold xl:inline">
                    {themeLabel}
                  </span>
                </button>
              </Tooltip>
            )}

            {mounted && user && <NotificationDropdown />}

            {mounted &&
              (user ? (
                <div className="hidden items-center gap-2 sm:flex">
                  <Link
                    href={
                      user.role === "admin"
                        ? "/dashboard/admin"
                        : "/dashboard/user"
                    }
                    className="flex min-h-10 min-w-10 items-center justify-center gap-2 rounded-full text-white/78 transition-colors hover:bg-white/10 hover:text-primary"
                    title={
                      user.role === "admin"
                        ? t("navbar.adminPanel")
                        : t("navbar.myAccount")
                    }
                  >
                    {user.role === "admin" ? (
                      <AdminPanelSettings className="text-primary" />
                    ) : (
                      <Person />
                    )}
                  </Link>
                  <button
                    onClick={logout}
                    className="flex min-h-10 min-w-10 items-center justify-center rounded-full text-red-400 transition-colors hover:bg-white/10 hover:text-red-300"
                    title={t("navbar.logout")}
                    type="button"
                  >
                    <Logout fontSize="small" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden min-h-10 items-center justify-center gap-2 rounded-full px-3 text-xs font-bold text-white/78 transition-colors hover:bg-white/10 hover:text-primary sm:flex"
                  title={t("navbar.login")}
                >
                  <Person />
                  <span className="hidden xl:inline">{t("navbar.login")}</span>
                </Link>
              ))}
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[60] flex flex-col bg-gray-900/98 backdrop-blur-xl transition-all duration-300 lg:hidden ${
          mobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        dir={dir}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <span className="text-xl font-black text-white">
            {t("navbar.menu")}
          </span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition-colors hover:bg-white/10"
            type="button"
          >
            <Close />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
          <nav className="grid grid-cols-1 gap-3">
            {[...links, ...cityLinks].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 text-base font-bold text-white transition-colors hover:border-primary/35 hover:text-primary"
              >
                {link.icon || <LocationOn className="text-primary" />}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex min-h-12 items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 text-white transition-all hover:border-primary/35 hover:bg-white/10"
            >
              <span className="text-sm font-bold">{themeLabel}</span>
              {mode === "dark" ? <LightMode /> : <DarkMode />}
            </button>

            <Select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{
                color: "var(--foreground)",
                borderRadius: "0.75rem",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--app-frame-border)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--primary)",
                },
                "& .MuiSelect-icon": { color: "var(--foreground)" },
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
