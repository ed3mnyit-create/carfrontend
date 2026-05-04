"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Article } from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import { blogService } from "@/services/api";

export default function BlogListClient({ initialData, searchParams }) {
  const [blogs, setBlogs] = useState(initialData?.data || []);
  const [pagination, setPagination] = useState(initialData?.pagination || { totalPages: 1, currentPage: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // If searchParams change (like a new search query), reset the list
  useEffect(() => {
    setBlogs(initialData?.data || []);
    setPagination(initialData?.pagination || { totalPages: 1, currentPage: 1 });
    setPage(1);
  }, [initialData, searchParams.q]);

  const handleLoadMore = async () => {
    try {
      setLoading(true);
      const nextPage = page + 1;
      const response = await blogService.getAll({ 
        page: nextPage, 
        limit: 9, 
        q: searchParams.q,
        status: "published"
      });
      
      if (response?.data) {
        setBlogs((prev) => [...prev, ...response.data]);
        setPagination(response.pagination || { totalPages: 1, currentPage: 1 });
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (blogs.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-white/10 rounded-[3rem] mt-4">
        <Article sx={{ fontSize: 60, color: "rgba(255,255,255,0.2)" }} className="mb-4" />
        <h2 className="text-2xl font-black text-slate-500">لا يوجد مقالات حتى الآن</h2>
      </div>
    );
  }

  const hasMore = pagination.totalPages > page;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {blogs.map((blog) => (
          <Link 
            key={blog._id} 
            href={`/blog/${blog.slug}`}
            className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500 group flex flex-col items-start"
          >
            <div className="relative h-56 w-full bg-slate-800 overflow-hidden">
              {blog.image && blog.image !== 'no-photo.jpg' ? (
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
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs text-white font-black">
                {blog.category?.name || "عام"}
              </div>
            </div>
            
            <div className="p-6 md:p-8 flex-1 flex flex-col">
              <h2 className="text-xl md:text-2xl font-black text-white mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                {blog.title}
              </h2>
              <p className="text-sm md:text-base text-slate-400 font-medium mb-6 line-clamp-3 leading-relaxed flex-1">
                {blog.summary}
              </p>
              
              <div className="flex justify-between items-center w-full pt-4 border-t border-white/5 mt-auto">
                <span className="text-xs font-bold text-slate-500" suppressHydrationWarning>
                  {new Date(blog.createdAt).toLocaleDateString("ar-SA", { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <span className="text-primary font-black text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  اقرأ المزيد <span>←</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="mt-16 flex justify-center">
          <Button
            variant="contained"
            size="large"
            onClick={handleLoadMore}
            disabled={loading}
            sx={{
              borderRadius: "1.5rem",
              fontWeight: "900",
              px: 6,
              py: 2,
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
              boxShadow: "0 20px 40px rgba(249, 115, 22, 0.2)",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "تحميل المزيد"
            )}
          </Button>
        </div>
      )}
    </>
  );
}
