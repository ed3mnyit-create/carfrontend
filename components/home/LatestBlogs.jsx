"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Article, ArrowBackIosNew } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import api from "@/services/api";

const LatestBlogs = () => {
  const { t, i18n } = useTranslation("common");
  const isRtl = i18n.dir() === "rtl";

  const { data, isLoading } = useQuery({
    queryKey: ["latestBlogs"],
    queryFn: async () => {
      const res = await api.get("/blogs?status=published&limit=3&sort=-createdAt");
      return res.data;
    },
  });

  const blogs = data?.data || [];

  if (!isLoading && blogs.length === 0) return null;

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden bg-midnight">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12 md:mb-16">
          <div className="space-y-4 text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-2">
              <Article sx={{ fontSize: 18 }} />
              <span className="text-xs font-black uppercase tracking-widest">
                {t("blog.latestNews")}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight">
              {t("blog.fromBlog")}
              <span className="text-primary block mt-2 text-2xl md:text-3xl lg:text-4xl opacity-90">
                {t("blog.guideTitle")}
              </span>
            </h2>
          </div>

          <Link
            href="/blog"
            className="group flex items-center gap-3 text-white/60 hover:text-primary font-black transition-all duration-300 bg-white/5 hover:bg-white/10 px-8 py-4 rounded-2xl border border-white/5"
          >
            <span>{t("blog.viewAll")}</span>
            <ArrowBackIosNew 
              sx={{ 
                fontSize: 16, 
                transform: isRtl ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.3s ease"
              }} 
              className="group-hover:translate-x-[-4px]"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? [1, 2, 3].map((i) => (
                <div key={i} className="h-[450px] bg-white/5 rounded-[2.5rem] animate-pulse"></div>
              ))
            : blogs.map((blog) => (
                <Link
                  key={blog._id}
                  href={`/blog/${blog.slug}`}
                  className="group bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:bg-white/10 transition-all duration-500 flex flex-col items-start h-full shadow-2xl hover:shadow-primary/5 shadow-none"
                >
                  <div className="relative h-64 w-full bg-slate-800 overflow-hidden">
                    {blog.image && blog.image !== "no-photo.jpg" ? (
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <Article sx={{ fontSize: 60, opacity: 0.5 }} />
                      </div>
                    )}
                    <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl text-xs text-white font-black border border-white/10">
                      {blog.category?.name || t("blog.generalCategory")}
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col w-full text-right" dir="rtl">
                    <h3 className="text-xl md:text-2xl font-black text-white mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors min-h-[3.5rem]">
                      {blog.title}
                    </h3>
                    <p className="text-sm md:text-base text-slate-400 font-bold mb-8 line-clamp-3 leading-relaxed flex-1 opacity-80">
                      {blog.summary}
                    </p>

                    <div className="flex justify-between items-center w-full pt-6 border-t border-white/5 mt-auto">
                      <div className="flex flex-col">
                         <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">
                            {t("blog.publishDate")}
                         </span>
                         <span className="text-xs font-bold text-slate-400" suppressHydrationWarning>
                            {new Date(blog.createdAt).toLocaleDateString(i18n.language === "ar" ? "ar-SA" : "en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            })}
                         </span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                         <ArrowBackIosNew sx={{ fontSize: 18 }} className={isRtl ? "" : "rotate-180"} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
};

export default LatestBlogs;
