import Image from "next/image";
import Link from "next/link";
import { 
  ArrowBack, 
  BookmarkBorder, 
  CarRental,
  Facebook,
  Twitter,
  WhatsApp,
} from "@mui/icons-material";
import CarCard from "@/components/cards/CarCard";
import { notFound } from "next/navigation";
import { cache } from "react";
import { sanitizeHtml } from "@/lib/sanitizeHtml";

import BlogProgressBar from "@/components/blog/BlogProgressBar";
import TableOfContents from "@/components/blog/TableOfContents";
import RelatedArticles from "@/components/blog/RelatedArticles";
import AuthorBio from "@/components/blog/AuthorBio";
import StickyMobileCTA from "@/components/blog/StickyMobileCTA";
import DynamicContentCTA from "@/components/blog/DynamicContentCTA";
import ContinueReading from "@/components/blog/ContinueReading";
import { SiLinktree } from "react-icons/si";

import { Tooltip, IconButton } from "@mui/material";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://c4r-platform-backend.vercel.app/api";

const formatArabicDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const day = date.getDate();
    const year = date.getFullYear();
    const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    return `${day} ${monthNames[date.getMonth()]} ${year}`;
  } catch (e) {
    return "";
  }
};

const getBlog = cache(async (id) => {
  try {
    const apiUrl = `${API_URL}/blogs/${id}`;
    const res = await fetch(apiUrl, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    return null;
  }
});

export async function generateMetadata({ params }) {
  const { id } = await params;
  if (!id) return { title: "المدونة | C4R" };
  try {
    const blog = await getBlog(id);
    if (!blog) return { title: "مقال غير موجود | C4R" };
    const imageUrl = blog.image && blog.image !== 'no-photo.jpg' ? blog.image : "https://c4rplatform.com/images/blog-default.jpg";
    const canonicalSlug = blog.slug || id;
    return {
      title: blog.metaTitle || `${blog.title} | تأجير سيارات في السعودية`,
      description: blog.metaDescription || blog.summary || blog.title,
      keywords: Array.isArray(blog.focusKeywords) ? blog.focusKeywords.join(', ') : (blog.focusKeywords || ''),
      alternates: { canonical: `https://c4rplatform.com/blog/${canonicalSlug}` },
      openGraph: {
        title: blog.metaTitle || blog.title,
        description: blog.metaDescription || blog.summary,
        url: `https://c4rplatform.com/blog/${canonicalSlug}`,
        images: [{ url: imageUrl, width: 1200, height: 630, alt: blog.title }],
        type: "article",
        publishedTime: blog.createdAt,
        modifiedTime: blog.updatedAt,
        section: blog.category?.name || 'تأجير سيارات',
        tags: Array.isArray(blog.focusKeywords) ? blog.focusKeywords : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.metaTitle || blog.title,
        description: blog.metaDescription || blog.summary,
        images: [imageUrl],
      },
    };
  } catch (error) {
    return { title: "مدونة C4R" };
  }
}

async function getSocialLinks() {
  try {
    const res = await fetch(`${API_URL}/settings/social_links`, { next: { revalidate: 3600 } });
    if (!res.ok) return {};
    const json = await res.json();
    return json.data || {};
  } catch (error) {
    return {};
  }
}

export default async function BlogPostPage({ params }) {
  const { id } = await params;
  if (!id) return notFound();
  
  // Parallel fetch for blog and settings
  const [blog, socials] = await Promise.all([
    getBlog(id),
    getSocialLinks()
  ]);

  if (!blog) return notFound();

  const wordCount = blog.content ? blog.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length : 0;
  const calculatedReadingTime = Math.ceil(wordCount / 200) || 1;

  // Sanitize HTML content to prevent XSS attacks.
  // Uses a lightweight server-safe sanitizer (no jsdom dependency) to strip
  // script tags, event handlers, and dangerous URI schemes while preserving formatting.
  const sanitizedContent = sanitizeHtml(blog.content);
  const sanitizedSummary = sanitizeHtml(blog.summary);

  const canonicalSlug = blog.slug || id;
  const shareUrl = `https://c4rplatform.com/blog/${canonicalSlug}`;
  const shareTitle = blog.title;

  // Article JSON-LD Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "description": blog.metaDescription || blog.summary || blog.title,
    "image": blog.image && blog.image !== 'no-photo.jpg' ? blog.image : "https://c4rplatform.com/images/blog-default.jpg",
    "url": shareUrl,
    "datePublished": blog.createdAt,
    "dateModified": blog.updatedAt || blog.createdAt,
    "inLanguage": "ar-SA",
    "author": {
      "@type": "Organization",
      "name": "فريق C4R",
      "url": "https://c4rplatform.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "C4R Platform",
      "url": "https://c4rplatform.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://c4rplatform.com/images/logo.jpeg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": shareUrl
    },
    ...(blog.category?.name ? { "articleSection": blog.category.name } : {}),
    ...(Array.isArray(blog.focusKeywords) && blog.focusKeywords.length > 0 ? { "keywords": blog.focusKeywords.join(', ') } : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://c4rplatform.com" },
      { "@type": "ListItem", "position": 2, "name": "المدونة", "item": "https://c4rplatform.com/blog" },
      { "@type": "ListItem", "position": 3, "name": blog.title, "item": shareUrl },
    ]
  };

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <BlogProgressBar />
      <StickyMobileCTA />
      
      {/* 1. Cinematic Header Area */}
      <header className="relative pt-24 pb-12 lg:pt-32 lg:pb-16 bg-[#020617]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] mb-4 hover:opacity-70 transition-opacity">
            <ArrowBack fontSize="small" className="rotate-180" /> 
            العودة للمقالات
          </Link>
          
          <div className="flex justify-center">
            <span className="bg-primary/20 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              {blog.category?.name || "تصنيف عام"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-7xl font-black leading-tight tracking-tight text-white px-4">
            {blog.title}
          </h1>

          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-sm font-bold text-slate-500 border-t border-white/5 pt-8">
            <div className="flex items-center gap-2 font-black text-primary/80 uppercase tracking-widest">فريق C4R</div>
            <div className="w-1 h-1 bg-white/10 rounded-full" />
            <div className="flex items-center gap-2" suppressHydrationWarning>{formatArabicDate(blog.createdAt)}</div>
            <div className="w-1 h-1 bg-white/10 rounded-full" />
            <div className="flex items-center gap-2">{calculatedReadingTime} دقائق للقراءة</div>
            <div className="w-1 h-1 bg-white/10 rounded-full" />
            <div className="flex items-center gap-2">{blog.views || 0} مشاهدة</div>
          </div>
        </div>
      </header>

      {/* 2. Main Article Content Area */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12 md:py-20 mb-20">
        <article className="w-full">
          {/* Featured Image */}
          <div className="relative w-full aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl mb-16 ring-1 ring-white/10 group">
            <Image 
              src={blog.image || "/images/blog-placeholder.jpg"} 
              alt={blog.title} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/40 to-transparent" />
          </div>

          {/* Description / Summary Area - Restored Standard Layout */}
          <div className="max-w-4xl mx-auto mb-16 px-8 text-center">
            {blog.summary && (
              <div className="relative inline-block w-full py-4">
                <div className="inline-flex items-center gap-3 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-6 bg-primary/10 px-5 py-2 rounded-full border border-primary/20">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                   مقدّمة المقال
                </div>
                
                <div 
                  className="text-xl md:text-2xl font-bold text-white leading-[1.8] text-center whitespace-normal"
                  dangerouslySetInnerHTML={{ __html: sanitizedSummary }}
                />
              </div>
            )}
          </div>

          {/* Article Body Content - Optimized News-Style Narrow Column */}
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <div 
              className="prose md:prose-lg prose-invert w-full max-w-none
                prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-8
                prose-h3:text-2xl md:prose-h3:text-3xl prose-h3:mt-12 prose-h3:mb-6
                prose-p:text-slate-300 prose-p:leading-[2.2] prose-p:mb-10 prose-p:text-lg md:prose-p:text-xl prose-p:font-medium
                prose-a:text-primary prose-a:font-bold hover:prose-a:text-primary-hover transition-colors
                prose-strong:text-white prose-strong:font-black
                prose-ul:text-slate-300 prose-ul:my-6
                prose-li:text-lg md:prose-li:text-xl prose-li:my-2 prose-li:font-medium
                prose-blockquote:border-r-4 prose-blockquote:border-l-0 prose-blockquote:border-primary prose-blockquote:bg-white/5 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-l-2xl prose-blockquote:text-white prose-blockquote:font-bold prose-blockquote:not-italic prose-blockquote:my-12 prose-blockquote:text-xl md:prose-blockquote:text-2xl prose-blockquote:leading-relaxed
                prose-img:rounded-3xl prose-img:shadow-2xl prose-img:my-16 prose-img:w-full prose-img:object-cover prose-img:ring-1 prose-img:ring-white/10
                whitespace-normal break-normal
              "
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </div>

          {/* Suggested Cars - Centered Grid */}
          {blog.relatedCars && blog.relatedCars.filter(c => c && typeof c === 'object').length > 0 && (
            <div className="mt-32 p-10 md:p-20 bg-white/5 border border-white/10 rounded-[4rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32" />
              <div className="relative z-10 text-center">
                <h3 className="text-3xl md:text-5xl font-black text-white mb-12 flex items-center justify-center gap-6">
                  <CarRental sx={{ fontSize: 48, color: 'primary.main' }} />
                  سيارات مقترحة لتجربة لا تُنسى
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {blog.relatedCars.filter(c => c && typeof c === 'object').map((car) => {
                    const carImg = Array.isArray(car.image) ? car.image[0] : (car.image || "/images/car-placeholder.png");
                    return <CarCard key={car._id} car={{ ...car, image: carImg }} variant="dark" />;
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Share & Social Footer */}
          <footer className="mt-32 pt-20 border-t border-white/10 space-y-16">
            <AuthorBio />

            {/* Premium Linktree CTA */}
            <div className="relative group bg-linear-to-r from-orange-600 to-amber-500 p-[2px] rounded-[2.5rem] overflow-hidden transition-transform duration-500 hover:scale-[1.01]">
              <div className="bg-[#020617] rounded-[2.4rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-right">
                  <div className="w-16 h-16 rounded-2xl bg-[#39E09B]/10 flex items-center justify-center text-[#39E09B] group-hover:scale-110 transition-transform duration-500 shadow-xl border border-[#39E09B]/20">
                    <SiLinktree style={{ fontSize: 32 }} />
                  </div>
                  <div>
                    <h4 className="text-xl md:text-2xl font-black text-white mb-2">تابعنا على جميع المنصات</h4>
                    <p className="text-gray-400 text-sm md:text-base font-bold">تواصل معنا، احجز سيارتك، واعرف آخر عروضنا في مكان واحد</p>
                  </div>
                </div>
                <Link 
                  href={socials.linktree || "#"} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto px-10 py-4 bg-[#39E09B] hover:bg-[#2bc486] text-black font-black rounded-2xl md:rounded-full text-center transition-all duration-300 shadow-lg shadow-[#39E09B]/25 active:scale-95 flex items-center justify-center gap-3 group"
                >
                  <span>جميع روابط التواصل</span>
                  <SiLinktree className="text-black group-hover:rotate-12 transition-transform scale-125" />
                </Link>
              </div>
            </div>
          </footer>
        </article>
      </div>

      {/* 3. Global Discovery Area - Large Scale Navigation */}
      <div className="bg-[#0f172a]/30 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          <ContinueReading currentBlogId={blog._id} categoryId={blog.category?._id} />
          <RelatedArticles currentBlogId={blog._id} />
        </div>
      </div>
    </main>
  );
}
