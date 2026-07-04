"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { carService, reviewService } from "@/services/api";
import {
  CircularProgress,
  Container,
  Chip,
  Divider,
} from "@mui/material";
import {
  AirlineSeatReclineExtra,
  LocalGasStation,
  CheckCircle,
  ArrowBack,
  Star,
  EventAvailable,
  LocationOn,
} from "@mui/icons-material";

import Link from "next/link";
import Image from "next/image";
import { Avatar, Rating } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function CarDetailsClient({ initialCarData }) {
  const { t, i18n } = useTranslation("common");
  const params = useParams();
  const id = params.id;

  const { data: carResponse, isLoading: carLoading } = useQuery({
    queryKey: ["car", id],
    queryFn: () => carService.getOne(id).catch(() => null),
    initialData: initialCarData ? { data: { car: initialCarData } } : undefined,
  });

  const { data: reviewsResponse, isLoading: reviewsLoading } = useQuery({
    queryKey: ["carReviews", id],
    queryFn: () => reviewService.getAllCarReviews(id).catch(() => ({ data: { reviews: [], pagination: { total: 0 } } })),
  });

  const car = carResponse?.data?.car || carResponse?.data || carResponse || initialCarData;
  const reviews = reviewsResponse?.data?.reviews || [];
  const reviewsCount = reviewsResponse?.data?.pagination?.total || 0;

  const [selectedImage, setSelectedImage] = useState(null);

  if (carLoading && !car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress color="primary" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">{t("carDetails.notFound")}</h2>
        <Link href="/" className="text-primary">
          {t("carDetails.backHome")}
        </Link>
      </div>
    );
  }

  const imageUrl =
    car.image ||
    car.imageUrl ||
    car.images?.[0]?.url ||
    car.images?.[0] ||
    "/images/car-home.png";

  const displayImage = selectedImage || imageUrl;
  const galleryImages = car.images?.length > 0 
    ? car.images.map(img => img.url || img) 
    : [imageUrl];

  return (
    <div
      className="min-h-screen bg-[#020617] relative overflow-hidden pt-24 pb-20"
      dir={i18n.dir()}
    >
      {/* Background Decorative elements */}
      <div className="absolute top-0 right-0 w-[50%] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[500px] bg-accent/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 opacity-30" />

      <Container maxWidth="lg" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
          {/* Right: Images Section */}
          <div className="lg:col-span-7 order-1 lg:order-1">
            <div className="relative h-[280px] sm:h-[350px] md:h-[400px] lg:h-[500px] rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 group">
              <Image
                src={displayImage}
                alt={`${car.name || ""} ${car.brand || ""} ${car.model || ""} - تأجير سيارة من C4R`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-6 right-6">
                <Chip
                  label={`${t("carDetails.model")} ${car.year || "2024"}`}
                  sx={{
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "white",
                    fontWeight: "bold",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                />
              </div>
              {car.region && (
                <div className="absolute top-6 left-6">
                  <Chip
                    icon={
                      <LocationOn style={{ color: "white", fontSize: 18 }} />
                    }
                    label={t(`regions.${car.region}`)}
                    sx={{
                      bgcolor: "#0A2373",
                      color: "white",
                      fontWeight: "900",
                      height: "32px",
                      px: 0.5,
                      boxShadow: "0 4px 15px rgba(10, 35, 115, 0.5)",
                      "& .MuiChip-label": {
                        paddingLeft: "8px",
                        paddingRight: "8px",
                      },
                      "& .MuiChip-icon": {
                        marginRight: "4px",
                        marginLeft: "-4px",
                      },
                    }}
                  />
                </div>
              )}
            </div>

            {/* Image Gallery (Thumbnails) */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4 md:mt-6">
                {galleryImages.slice(0, 4).map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-14 sm:h-18 md:h-20 lg:h-28 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                      displayImage === img
                        ? "border-primary opacity-100 scale-105"
                        : "border-white/10 opacity-70 hover:opacity-100 hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${car.name || "سيارة"} - صورة ${i + 1}`}
                      fill
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Left: Info Section */}
          <div className="lg:col-span-5 order-2 lg:order-2">
            <div className="flex flex-col h-full">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Rating
                      value={car.averageRating || 5}
                      readOnly
                      precision={0.5}
                      size="small"
                    />
                  </div>
                  <span className="text-slate-400 text-xs font-bold font-mono tracking-widest uppercase">
                    ({car.averageRating || 5}/5) • {reviewsCount}{" "}
                    {t("carDetails.reviewsCount")}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-3 tracking-tighter">
                  تأجير {car.name} في السعودية | منصة C4R
                </h1>
                <div className="flex items-center gap-3">
                  <p className="text-slate-400 font-bold text-lg font-mono tracking-tight">
                    {car.brand} <span className="text-primary/50 mx-1">•</span>{" "}
                    {car.model}
                  </p>
                  {car.category && car.category !== "regular" && (
                    <Chip
                      label={
                        car.category === "with_driver"
                          ? t("departments.driverTitle")
                          : t("departments.corporateTitle")
                      }
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        color: "white",
                        fontSize: "0.75rem",
                        fontWeight: "900",
                        borderRadius: "10px",
                        border: "1px solid rgba(255,255,255,0.1)",
                        px: 1,
                      }}
                    />
                  )}
                </div>
              </div>

              <section className="bg-white/5 backdrop-blur-2xl rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-2 h-full bg-primary/20" />
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-400 font-black text-sm uppercase tracking-widest">
                    {t("carDetails.pricePerDay")}
                  </span>
                  <div className="text-left">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-black text-primary">
                      {car.pricePerDay}
                    </span>
                    <span className="text-slate-500 font-black mr-2 text-sm uppercase">
                      {t("carDetails.currency")}
                    </span>
                  </div>
                </div>
                <Divider
                  sx={{ my: 3, borderColor: "rgba(255,255,255,0.05)" }}
                />
                <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                  <EventAvailable fontSize="small" />
                  <span>{t("carDetails.available")}</span>
                </div>
              </section>

              <div className="space-y-6 flex-grow">
                <section>
                  <h2 className="font-black text-white mb-5 uppercase tracking-widest text-sm">
                    {t("carDetails.specsTitle")}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 bg-white/5 backdrop-blur-lg rounded-lg sm:rounded-xl md:rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                      <LocalGasStation className="text-primary" />
                      <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter mb-1">
                          {t("fuelType")}
                        </p>
                        <p className="text-xs font-black text-white">
                          {car.fuelType || t("carDetails.fuelValue")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                      <AirlineSeatReclineExtra className="text-primary" />
                      <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter mb-1">
                          {t("seats")}
                        </p>
                        <p className="text-xs font-black text-white">
                          {car.seats || 5}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="bg-white/5 backdrop-blur-xl p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/5">
                  <h2 className="font-black text-white mb-2 sm:mb-3 uppercase tracking-widest text-xs sm:text-sm">
                    {t("carDetails.descTitle")}
                  </h2>
                  <p className="text-slate-400 leading-relaxed text-xs sm:text-sm font-bold whitespace-pre-wrap">
                    {car.description || t("hero.description")}
                  </p>
                </section>

                <section className="bg-white/5 backdrop-blur-xl p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/5">
                  <h2 className="font-black text-white mb-3 sm:mb-4 uppercase tracking-widest text-xs sm:text-sm">
                    {t("carDetails.includesTitle")}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {[
                      t("carDetails.includes.insurance"),
                      t("carDetails.includes.support"),
                      t("carDetails.includes.maintenance"),
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 text-sm text-slate-300 font-bold"
                      >
                        <CheckCircle
                          className="text-primary"
                          style={{ fontSize: 20 }}
                        />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="mt-4 sm:mt-6 md:mt-8">
                <Link
                  href={`/booking/${car._id}`}
                  onClick={() => {
                    if (typeof window !== "undefined" && window.gtag) {
                      window.gtag("event", "begin_checkout", {
                        item_id: car._id,
                        item_name: car.name,
                        currency: "SAR",
                        value: car.pricePerDay
                      });
                    }
                  }}
                  className="w-full bg-primary hover:bg-primary-hover text-white py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl md:rounded-[2rem] font-black text-base sm:text-lg md:text-xl transition-all shadow-[0_20px_40px_-10px_rgba(10, 35, 115,0.4)] flex items-center justify-center gap-2 sm:gap-4 group hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="tracking-tighter">
                    {t("carDetails.bookButton")}
                  </span>
                  <ArrowBack
                    className={`transition-transform ${i18n.dir() === "rtl" ? "group-hover:-translate-x-2" : "group-hover:translate-x-2 rotate-180"}`}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <section className="mt-12 sm:mt-16 md:mt-24 border-t border-white/10 pt-8 sm:pt-12 md:pt-16">
          <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tighter">
              {t("carDetails.reviewsTitle")}
            </h2>
            <Chip
              label={reviewsCount}
              sx={{
                bgcolor: "primary.main",
                color: "white",
                fontWeight: "900",
                fontSize: "1.2rem",
                height: "40px",
                px: 1,
              }}
            />
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-10 sm:py-16 md:py-20 bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl md:rounded-[3.5rem] border border-dashed border-white/10">
              <Star
                sx={{ fontSize: 80, color: "rgba(255,255,255,0.05)", mb: 4 }}
              />
              <p className="text-2xl font-black text-slate-500 mb-2">
                {t("carDetails.noReviews")}
              </p>
              <p className="text-lg text-slate-600 font-bold">
                {t("carDetails.beFirst")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {reviews.map((review) => (
                <article
                  key={review._id}
                  className="bg-white/5 backdrop-blur-2xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] border border-white/10 hover:bg-white/10 transition-all duration-500 group relative overflow-hidden shadow-2xl"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 relative z-10">
                    <Avatar
                      src={review.user?.image}
                      alt={review.user?.name}
                      sx={{
                        width: { xs: 48, sm: 56, md: 64 },
                        height: { xs: 48, sm: 56, md: 64 },
                        bgcolor: "rgba(255,255,255,0.05)",
                        color: "white",
                        fontWeight: "black",
                        border: "2px solid rgba(255,255,255,0.1)",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                      }}
                    >
                      {review.user?.name?.charAt(0)}
                    </Avatar>
                    <div>
                      <h3 className="font-black text-white text-base sm:text-lg">
                        {review.user?.name}
                      </h3>
                      <p className="text-[9px] sm:text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1" suppressHydrationWarning>
                        {new Date(review.createdAt).toLocaleDateString(
                          i18n.language === "en" ? "en-US" : "ar-EG",
                          { year: "numeric", month: "long", day: "numeric" },
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-3 sm:mb-5">
                    <Rating
                      value={review.rating}
                      readOnly
                      precision={1}
                      size="small"
                      sx={{
                        "& .MuiRating-iconFilled": { color: "#0A2373" },
                        "& .MuiRating-iconEmpty": {
                          color: "rgba(255,255,255,0.1)",
                        },
                      }}
                    />
                  </div>

                  <p className="text-slate-300 text-xs sm:text-[15px] leading-relaxed font-bold bg-white/5 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/5 min-h-[80px] sm:min-h-[100px] md:min-h-[120px] relative">
                    <span className="text-primary text-4xl absolute -top-2 right-4 opacity-50 font-serif">
                      &quot;
                    </span>
                    {review.comment}
                    <span className="text-primary text-4xl absolute -bottom-6 left-4 opacity-50 font-serif">
                      &quot;
                    </span>
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </Container>
    </div>
  );
}
