"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Article, TrendingUp, DirectionsCar, Star } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import api from "@/services/api";

export const PopularArticles = ({ excludeId }) => {
  const { t, i18n } = useTranslation("common");

  const { data, isLoading } = useQuery({
    queryKey: ["popularBlogs"],
    queryFn: async () => {
      const res = await api.get("/blogs?status=published&limit=6&sort=-views");
      return res.data;
    },
  });

  const blogs = (data?.data || []).filter(b => b._id !== excludeId).slice(0, 5);

  if (!isLoading && blogs.length === 0) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden mb-8" suppressHydrationWarning>
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <TrendingUp className="text-primary" />
        <h3 className="font-black text-white">
          {t("blog.sidebar.popularArticles")}
        </h3>
      </div>
      <div className="p-4 space-y-4">
        {isLoading
          ? [1, 2, 3].map((i) => <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />)
          : blogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blog/${blog.slug}`}
                className="flex items-start gap-4 p-2 rounded-2xl hover:bg-white/5 transition-all group"
              >
                 <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                    {blog.image && blog.image !== "no-photo.jpg" ? (
                        <Image src={blog.image} alt={blog.title} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Article sx={{ fontSize: 20, opacity: 0.2 }} />
                        </div>
                    )}
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-sm font-black text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                        {blog.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-bold">
                        👁 {blog.views} {t("blog.article.views")}
                    </span>
                 </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export const TrendingCars = () => {
  const { t, i18n } = useTranslation("common");

  const { data, isLoading } = useQuery({
    queryKey: ["trendingCars"],
    queryFn: async () => {
      const res = await api.get("/cars?limit=4&sort=-averageRating,-createdAt");
      return res.data;
    },
  });

  const cars = data?.data || [];

  if (!isLoading && cars.length === 0) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden mb-8" suppressHydrationWarning>
      <div className="p-6 border-b border-white/10 flex items-center gap-3 bg-primary/5">
        <DirectionsCar className="text-primary" />
        <h3 className="font-black text-white uppercase tracking-tight text-sm">
          {t("blog.sidebar.trendingCars")}
        </h3>
      </div>
      <div className="p-4 space-y-4">
        {isLoading
          ? [1, 2, 3].map((i) => <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />)
          : cars.map((car) => (
              <Link
                key={car._id}
                href={`/cars/${car._id}`}
                className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group"
              >
                 <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                    <Image src={car.image || car.images?.[0]} alt={car.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                 </div>
                 <div className="flex-1">
                    <h4 className="text-sm font-black text-white group-hover:text-primary transition-colors">
                        {car.name || `${car.make} ${car.model}`}
                    </h4>
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-primary font-black">
                            {car.pricePerDay} {i18n.language === "ar" ? "ريال" : "SAR"}
                        </span>
                        {car.averageRating && (
                        <div className="flex items-center text-yellow-500 text-[10px]">
                           <Star sx={{ fontSize: 10 }} /> 
                           <span className="font-black">{car.averageRating}</span>
                        </div>
                        )}
                    </div>
                 </div>
              </Link>
            ))}
      </div>
      <div className="p-4 pt-0">
         <Link href="/cars" className="block w-full py-3 rounded-2xl bg-primary hover:bg-orange-600 text-white text-center text-xs font-black transition-all shadow-lg shadow-primary/20">
            {t("blog.sidebar.browseAll")}
         </Link>
      </div>
    </div>
  );
};
