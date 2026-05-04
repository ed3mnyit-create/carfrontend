"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AirlineSeatReclineExtra,
  LocalGasStation,
  ArrowBack,
  LocationOn,
} from "@mui/icons-material";

import { useTranslation } from "react-i18next";

const CarCard = ({ car, variant = "light" }) => {
  const { t, i18n } = useTranslation("common");
  const isDark = variant === "dark";
  
  const imageUrl =
    car.image ||
    car.images?.[0]?.url ||
    car.images?.[0] ||
    "/images/car-home.png";

  const cardClasses = isDark
    ? "bg-white/5 border-white/10 hover:border-primary/30 shadow-lg hover:shadow-primary/10"
    : "bg-white rounded-[2rem] border border-slate-100 hover:border-orange-500/30 shadow-md hover:shadow-[0_25px_50px_-12px_rgba(249,115,22,0.25)]";

  const imageContainerClasses = isDark
    ? "h-48 sm:h-52 md:h-56"
    : "h-48 sm:h-52 md:h-64";

  const titleClasses = isDark
    ? "text-white group-hover:text-primary"
    : "text-slate-800 group-hover:text-orange-600";

  const subtitleClasses = isDark
    ? "text-slate-400"
    : "text-slate-500";

  const priceContainerClasses = isDark
    ? "bg-primary/10 border border-primary/20"
    : "bg-orange-50 border border-orange-100";

  const priceTextClasses = isDark
    ? "from-primary to-orange-400"
    : "from-orange-600 to-amber-500";

  const priceSubtextClasses = isDark
    ? "text-primary/70"
    : "text-orange-600/70";

  const specItemClasses = isDark
    ? "bg-white/5 border-white/10 hover:border-primary/30 hover:bg-white/10"
    : "bg-slate-50/80 border border-slate-100 hover:border-orange-200 hover:bg-white";

  const specIconClasses = isDark ? "text-primary" : "text-orange-500";
  const specTextClasses = isDark ? "text-slate-300" : "text-slate-600";

  const detailsBtnClasses = isDark
    ? "bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/20"
    : "bg-white text-slate-700 border-2 border-slate-100 hover:border-slate-300 hover:bg-slate-50";

  return (
    <div
      className={`${cardClasses} rounded-2xl overflow-hidden transition-all duration-500 group flex flex-col h-full relative hover:-translate-y-1 w-full min-w-[280px]`}
      dir={i18n.dir()}
      suppressHydrationWarning
    >
      {!isDark && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
      )}

      {/* Image Section */}
      <div className={`relative ${imageContainerClasses} w-full shrink-0 overflow-hidden z-10 ${isDark ? 'rounded-t-2xl' : ''}`}>
        <Image
          src={imageUrl}
          alt={car.name || t("carCard.fallbackImage")}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-115 group-hover:rotate-1"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-midnight/80 via-transparent to-transparent opacity-70' : 'from-slate-900/80 via-transparent to-transparent opacity-60'}`} />

        {/* Year Badge */}
        <div className="absolute top-3 right-3">
          <span className={`${isDark ? 'bg-white/10 backdrop-blur-lg border-white/20' : 'bg-black/30 backdrop-blur-lg border-white/20'} text-white text-[10px] sm:text-xs font-bold px-3 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-xl flex items-center justify-center backdrop-blur-sm`}>
            {t("carCard.model")} {car.year || "2024"}
          </span>
        </div>

        {/* Region & Category Badges */}
        {car.region && (
          <div className="absolute bottom-3 left-3 flex flex-col gap-2">
            <span className={`${isDark ? 'bg-primary/90 backdrop-blur-md border-primary/30' : 'bg-orange-600/90 backdrop-blur-md border-orange-400/30'} text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg backdrop-blur-sm`}>
              <LocationOn style={{ fontSize: 14 }} />
              {t(`regions.${car.region}`) || car.region}
            </span>
            {car.category && (
              <span
                className={`backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg border border-white/20 backdrop-blur-sm ${
                  car.category === "with_driver"
                    ? "bg-purple-600/80"
                    : car.category === "corporate"
                    ? "bg-emerald-600/80"
                    : isDark ? "bg-slate-600/80" : "bg-sky-600/80"
                }`}
              >
                {t(`carCard.categories.${car.category}`) || car.category}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={`${isDark ? 'p-5 sm:p-6' : 'p-3 sm:px-5 sm:pb-5 sm:pt-3'} flex flex-col grow relative z-10`}>
        {/* Name & Price Row */}
        <div className="flex justify-between items-start mb-6 gap-4">
          <div className="min-w-0 flex-1">
            <h3 className={`text-xl sm:text-2xl font-black ${titleClasses} truncate tracking-tight transition-colors duration-300 leading-tight antialiased`}>
              {car.name}
            </h3>
            <p className={`${subtitleClasses} text-xs sm:text-sm font-bold truncate mt-1.5 antialiased`}>
              {car.brand} {car.model}
            </p>
          </div>
          <div className={`text-left shrink-0 ${priceContainerClasses} px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl transition-colors duration-300`}>
            <span className={`bg-gradient-to-r ${priceTextClasses} bg-clip-text text-transparent font-black text-xl sm:text-2xl md:text-2xl block leading-none antialiased`}>
              {car.pricePerDay}
            </span>
            <span className={`${priceSubtextClasses} text-[10px] sm:text-xs font-bold block mt-1 uppercase tracking-wider text-center antialiased`}>
              {t("carCard.priceDay")}
            </span>
          </div>
        </div>

        {/* Specs Grid - More breathing room */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className={`flex items-center gap-3 ${specItemClasses} px-4 py-3 rounded-xl transition-all duration-300 flex-1`}>
            <LocalGasStation sx={{ fontSize: 20 }} className={`${specIconClasses} shrink-0`} />
            <span className={`${specTextClasses} text-xs sm:text-sm font-semibold truncate antialiased`}>
              {car.fuelType || t("carCard.specs.petrol")}
            </span>
          </div>
          <div className={`flex items-center gap-3 ${specItemClasses} px-4 py-3 rounded-xl transition-all duration-300 flex-1`}>
            <AirlineSeatReclineExtra sx={{ fontSize: 20 }} className={`${specIconClasses} shrink-0`} />
            <span className={`${specTextClasses} text-xs sm:text-sm font-semibold truncate antialiased`}>
              {`${car.seats || 5} ${t("seats")}`}
            </span>
          </div>
        </div>

        {/* Action Buttons - More balanced */}
        <div className="mt-auto flex gap-4">
          <Link
            href={`/cars/${car._id}`}
            className={`flex-1 ${detailsBtnClasses} text-center py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 flex items-center justify-center shadow-sm`}
          >
            {t("carCard.details")}
          </Link>
          <Link
            href={`/booking/${car._id}`}
            className="flex-[1.2] bg-gradient-to-l from-orange-600 to-orange-500 text-white text-center py-3 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm hover:from-orange-700 hover:to-orange-600 transition-all shadow-[0_10px_20px_-10px_rgba(249,115,22,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(249,115,22,0.6)] active:scale-95 flex items-center justify-center gap-2 relative overflow-hidden group/btn"
          >
            <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover/btn:translate-x-[150%] transition-transform duration-[1.5s] ease-in-out" />
            <span className="relative z-10">{t("carCard.bookNow")}</span>
            <ArrowBack
              fontSize="small"
              className="relative z-10 transition-transform group-hover/btn:-translate-x-1.5 !text-[18px]"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
