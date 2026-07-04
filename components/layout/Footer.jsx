"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  WhatsApp,
  Email,
  YouTube,
  Instagram,
  DirectionsCar,
  KeyboardArrowLeft,
  X,
  Facebook,
} from "@mui/icons-material";
import { SiTiktok, SiLinktree } from "react-icons/si";

import { useTranslation } from "react-i18next";
import { settingService } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

const Footer = () => {
  const { t, i18n } = useTranslation("common");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Site Settings
  const { data: socialsData } = useQuery({
    queryKey: ["setting", "social_links"],
    queryFn: () => settingService.getOne("social_links"),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const { data: contactData } = useQuery({
    queryKey: ["setting", "contact_info"],
    queryFn: () => settingService.getOne("contact_info"),
    staleTime: 1000 * 60 * 10,
  });

  const socials = socialsData?.data || {
    facebook: "https://www.facebook.com/C4Rplatform",
    twitter: "https://x.com/C4Rplatform",
    instagram: "https://www.instagram.com/c4rplatform",
    whatsapp: "966554118873",
    tiktok: "https://www.tiktok.com/@c4rplatform",
  };

  const contact = contactData?.data || {
    phone: "966554118873",
    whatsapp: "966554118873",
    email: "Team@C4Rplatform.com",
    address: ""
  };

  return (
    <footer 
      className="bg-midnight text-gray-300 font-sans border-t border-white/10"
      dir={i18n.dir()}
      suppressHydrationWarning
    >
      {/* 
        Hero Footer Section - CTA 
        Adds a nice visual break before the main footer 
      */}
      {/* Decorative Gradient Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary via-primary-hover to-primary-hover"></div>
      <div className="bg-linear-to-r from-primary to-primary-hover py-10 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-right">
          <div className="space-y-2">
            <p className="text-xl md:text-3xl font-black text-white leading-tight">
              {t("footer.ctaTitle")}
            </p>
            <p className="text-white/80 text-sm md:text-base font-bold opacity-90">
              {t("footer.ctaSubtitle")}
            </p>
          </div>
          <Link
            href="/cars"
            className="group w-full md:w-auto bg-white text-primary px-10 py-4 rounded-2xl md:rounded-full font-black shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3"
          >
            <span>{t("footer.viewCars")}</span>
            <DirectionsCar className="transform group-hover:translate-x-[-4px] transition-transform" />
          </Link>
        </div>

        {/* Background Decorative Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-5 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 text-center md:text-right">
          {/* Column 1: Brand Info */}
          <div className="space-y-6 md:space-y-8">
            {/* Circular Logo Container */}
            <Link
              href="/"
              className="inline-flex mx-auto md:mx-0 group active:scale-95 transition-transform"
            >
              <Image
                src="/images/c4r-logo-official.png"
                alt="C4R Logo"
                width={96}
                height={96}
                loading="lazy"
                className="h-20 w-20 object-contain logo-premium-glow"
              />
            </Link>
            <p className="text-sm md:text-lg leading-relaxed text-gray-400 font-bold italic max-w-sm mx-auto md:mx-0">
              {t("footer.brandDesc")}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4 justify-center md:justify-start flex-wrap">
              {[
                {
                  icon: <Instagram />,
                  href: socials.instagram,
                  label: "Instagram",
                },
                { 
                  icon: <X />, 
                  href: socials.twitter, 
                  label: "X (Twitter)" 
                },
                {
                  icon: <SiTiktok className="text-xl" />,
                  href: socials.tiktok,
                  label: "TikTok",
                },
                {
                  icon: <Facebook />,
                  href: socials.facebook,
                  label: "Facebook",
                },
                ...(socials.linktree ? [{
                  icon: <SiLinktree className="text-xl" />,
                  href: socials.linktree,
                  label: "Linktree",
                  customColor: "hover:bg-[#39E09B] hover:border-[#39E09B]",
                }] : []),
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.href || "#"}
                  target="_blank"
                  className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 ${social.customColor || "hover:bg-primary hover:border-primary"} hover:text-white transition-all duration-300 group shadow-lg active:scale-90`}
                  aria-label={social.label}
                  title={social.label}
                >
                  <span className="group-hover:scale-110 transition-transform">
                    {social.icon}
                  </span>
                </Link>
              ))}
            </div>

            {/* QR Code */}
            {socials.qrCode && (
              <div className="flex justify-center md:justify-start mt-2">
                <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/10 bg-white p-1 shadow-lg">
                  <Image
                    src={socials.qrCode}
                    alt="QR Code"
                    width={88}
                    height={88}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6 md:space-y-10">
            <h4 className="text-white text-lg md:text-xl font-black border-r-4 border-primary pr-4 inline-block md:block">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-3 md:space-y-4 text-sm md:text-lg font-bold">
              {[
                { label: t("footer.aboutUs"), href: "/about" },
                { label: t("footer.faqShort"), href: "/faq" },
                { label: t("footer.individuals"), href: "/individuals" },
                { label: t("footer.withDriver"), href: "/with-driver" },
                { label: t("footer.companies"), href: "/corporate" },
                { label: t("navbar.blog"), href: "/blog" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-center md:justify-start gap-2 md:gap-3 text-gray-400 hover:text-primary transition-all duration-300 group active:scale-95"
                    aria-label={link.label}
                    title={link.label}
                  >
                    <div className="hidden md:flex items-center gap-2">
                       <KeyboardArrowLeft className="text-gray-600 group-hover:text-primary transition-colors" />
                    </div>
                    <span className="group-hover:translate-x-[-6px] transition-transform">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Booking Locations */}
          <div className="space-y-6 md:space-y-10">
            <h4 className="text-white text-lg md:text-xl font-black border-r-4 border-primary pr-4 inline-block md:block">
              {t("footer.bookingLocations")}
            </h4>
            <ul className="space-y-3 md:space-y-4 text-sm md:text-lg font-bold">
              {[
                { label: t("footer.jeddah"), href: "/jeddah" },
                { label: t("footer.sharqiya"), href: "/eastern" },
                { label: t("footer.riyadh"), href: "/riyadh" },
                { label: t("footer.allCars"), href: "/cars" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-center md:justify-start gap-2 md:gap-3 text-gray-400 hover:text-primary transition-all duration-300 group active:scale-95"
                    aria-label={link.label}
                    title={link.label}
                  >
                    <KeyboardArrowLeft className="text-gray-600 group-hover:text-primary transition-colors hidden md:block" />
                    <span className="group-hover:translate-x-[-6px] transition-transform">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Legal */}
          <div className="space-y-6 md:space-y-10">
            <h4 className="text-white text-lg md:text-xl font-black border-r-4 border-primary pr-4 inline-block md:block">
              {t("footer.contactInfo")}
            </h4>
            <ul className="space-y-6 md:space-y-8 text-base font-bold">
              <li className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-primary-light0/10 flex items-center justify-center text-primary group-hover:bg-primary-light0 group-hover:text-white transition-all shrink-0 shadow-lg border border-primary/20 active:scale-90">
                  <WhatsApp />
                </div>
                <div className="text-center md:text-right">
                  <span className="block text-[10px] text-gray-500 mb-1 font-black uppercase tracking-widest">
                    {t("footer.whatsapp")}
                  </span>
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(/\+/g, "")}`}
                    className="text-xl md:text-2xl font-black text-white hover:text-primary transition-colors tracking-tighter"
                    dir="ltr"
                    style={{ unicodeBidi: "embed", direction: "ltr" }}
                  >
                    {contact.whatsapp.startsWith("+") ? contact.whatsapp : `+${contact.whatsapp}`}
                  </a>
                </div>
              </li>

              <li className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all shrink-0 shadow-lg border border-blue-500/20 active:scale-90">
                  <Email />
                </div>
                <div className="text-center md:text-right">
                  <span className="block text-[10px] text-gray-500 mb-1 font-black uppercase tracking-widest">
                    {t("footer.email")}
                  </span>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm md:text-xl text-gray-300 hover:text-blue-400 transition-colors break-all"
                  >
                    {contact.email}
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-white/5 bg-midnight/40 backdrop-blur-md pb-24 md:pb-8">
        <div className="container mx-auto px-6 py-8 flex flex-col lg:flex-row items-center justify-between gap-6 text-xs md:text-base text-gray-400 font-bold">
          <p className="text-center lg:text-right uppercase tracking-wider order-2 lg:order-1" suppressHydrationWarning>
            © {mounted ? new Date().getFullYear() : 2026} منصة C4R. جميع الحقوق محفوظة.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 order-1 lg:order-2">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors active:scale-95"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              href="/terms"
              className="hover:text-white transition-colors active:scale-95"
            >
              {t("footer.terms")}
            </Link>
            <Link
              href="/policy"
              className="hover:text-white transition-colors active:scale-95"
            >
              {t("navbar.policy")}
            </Link>
            <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] w-full sm:w-auto justify-center mt-2 sm:mt-0">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              {t("footer.poweredBy")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
