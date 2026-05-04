"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Article, ArrowBackIosNew } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import api from "@/services/api";

const RelatedArticles = ({ currentBlogId }) => {
  const { t, i18n } = useTranslation("common");
  const isRtl = i18n.dir() === "rtl";

  const { data, isLoading } = useQuery({
    queryKey: ["relatedBlogs", currentBlogId],
    queryFn: async () => {
      const res = await api.get(`/blogs/${currentBlogId}/related?limit=3`);
      return res.data;
    },
    enabled: !!currentBlogId,
  });

  const blogs = data?.data || [];

  if (!isLoading && blogs.length === 0) return null;

  return (
    <section className="mt-20 border-t border-white/5 pt-20">
      <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-white tracking-tighter">
            {t("blog.relatedArticles.sectionTitle")}
          </h2>
          <p className="text-slate-400 font-bold">
            {t("blog.relatedArticles.sectionSubtitle")}
          </p>
        </div>
        
        <Link 
          href="/blog" 
          className="text-primary font-black flex items-center gap-2 hover:gap-4 transition-all"
        >
          {t("blog.relatedArticles.viewAll")}
          <ArrowBackIosNew sx={{ fontSize: 14, transform: isRtl ? "rotate(0deg)" : "rotate(180deg)" }} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading
          ? [1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-white/5 rounded-3xl animate-pulse"></div>
            ))
          : blogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blog/${blog.slug}`}
                className="group bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-4 hover:bg-white/10 transition-all duration-300 h-full shadow-2xl hover:shadow-primary/5"
              >
                <div className="relative h-40 w-full bg-slate-800 rounded-2xl overflow-hidden">
                  {blog.image && blog.image !== "no-photo.jpg" ? (
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Article sx={{ fontSize: 40, opacity: 0.2 }} />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] text-primary font-black uppercase tracking-widest">
                    {blog.category?.name || t("blog.sidebar.noCategory")}
                  </div>
                  <h3 className="text-lg font-black text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold line-clamp-2 opacity-80">
                    {blog.summary}
                  </p>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
};

export default RelatedArticles;
