"use client";

import React, { useSyncExternalStore } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { CheckCircle, Warning, Error, Google, Search } from "@mui/icons-material";

const subscribeToHydration = () => () => {};

const StatusIcon = ({ status }) => {
  if (status === "ok") return <CheckCircle sx={{ fontSize: 14, color: "#22c55e" }} />;
  if (status === "warning") return <Warning sx={{ fontSize: 14, color: "#eab308" }} />;
  return <Error sx={{ fontSize: 14, color: "#ef4444" }} />;
};

const StatusText = ({ status, okText, warningText, errorText }) => {
  if (status === "ok") return <span className="text-green-500 text-xs font-medium">{okText}</span>;
  if (status === "warning") return <span className="text-yellow-500 text-xs font-medium">{warningText}</span>;
  return <span className="text-red-500 text-xs font-medium">{errorText}</span>;
};

const SEOPreview = React.memo(({ title, metaTitle, metaDescription, slug, image, relatedCars = [], formData }) => {
  const { t, i18n } = useTranslation("common");
  const siteUrl = "https://c4rplatform.com";
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  let keywords = [];
  if (typeof formData?.focusKeywords === "string" && formData.focusKeywords) {
    keywords = formData.focusKeywords.split(",").filter((keyword) => keyword.trim());
  } else if (Array.isArray(formData?.focusKeywords)) {
    keywords = formData.focusKeywords;
  }

  const safeCars = Array.isArray(relatedCars) ? relatedCars : [];
  const linkedCars = safeCars.length > 0
    ? safeCars
    : (() => {
        const carIds = Array.isArray(formData?.relatedCars) ? formData.relatedCars : [];
        const allCars = Array.isArray(formData?.allCars) ? formData.allCars : [];

        if (carIds.length === 0 || allCars.length === 0) {
          return [];
        }

        return carIds
          .map((id) => {
            const car = allCars.find((candidate) => candidate && candidate._id === id);
            return car ? { _id: id, name: car.name || "", image: car.image } : null;
          })
          .filter(Boolean);
      })();

  if (!mounted) {
    return (
      <div className="space-y-6 h-full">
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  const displayTitle = metaTitle || formData?.title || title || "";
  const displaySlug = slug || (formData?.title
    ? formData.title.toLowerCase().replace(/[^a-z0-9-ء-ي]+/g, '-').replace(/(^-|-$)+/g, '')
    : "article-slug"
  );
  const displayDescription = metaDescription || formData?.summary || "";
  const fullUrl = `${siteUrl}/blog/${displaySlug}`;

  const titleLength = displayTitle.length;
  const descLength = displayDescription.length;
  const hasImage = !!(image || formData?.image);

  const getTitleStatus = () => {
    if (!displayTitle) return "error";
    if (titleLength > 60) return "warning";
    return "ok";
  };

  const getDescStatus = () => {
    if (!displayDescription) return "error";
    if (descLength > 160) return "warning";
    return "ok";
  };

  const titleStatus = getTitleStatus();
  const descStatus = getDescStatus();



  return (
    <div className="space-y-6 h-full">
      {/* Google Preview */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-slate-100 px-4 py-3 flex items-center gap-2 border-b border-slate-200">
          <Google sx={{ fontSize: 18, color: "#4285f4" }} />
          <span className="text-xs font-medium text-slate-600">Google</span>
        </div>
        <div className="p-4">
          <div className="space-y-1">
            <div className="text-[#1a0dab] text-lg font-medium leading-tight hover:underline cursor-pointer line-clamp-2">
              {displayTitle || (i18n.language === "ar" ? "عنوان المقال يظهر هنا..." : "Article title appears here...")}
            </div>
            <div className="text-[#006621] text-sm">
              {fullUrl}
            </div>
            <div className="text-[#545454] text-sm leading-relaxed line-clamp-3">
              {displayDescription || (i18n.language === "ar" 
                ? "وصف المقال يظهر هنا في نتائج البحث... هذا نص توضيحي للمعاينة." 
                : "Article description appears here in search results... This is preview text.")}
            </div>
          </div>
        </div>
      </div>

      {/* SEO Stats */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <Search sx={{ fontSize: 16, color: "var(--primary)" }} />
          <span className="text-sm font-bold text-white">{t("blog.validation.seoPreview")}</span>
        </div>
        
        <div className="space-y-3">
          {/* Title */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{t("blog.validation.seoStats.title")}</span>
            <StatusIcon status={titleStatus} />
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 rounded-full ${
                titleStatus === "ok" ? "bg-green-500" 
                : titleStatus === "warning" ? "bg-yellow-500" 
                : "bg-red-500"
              }`}
              style={{ width: `${Math.min((titleLength / 60) * 100, 100)}%` }}
            />
          </div>
          <StatusText 
            status={titleStatus}
            okText={t("blog.validation.seoStats.titleOk", { count: titleLength })}
            warningText={t("blog.validation.seoStats.titleWarning", { count: titleLength })}
            errorText={t("blog.validation.seoStats.titleError")}
          />

          {/* Description */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-slate-400">{t("blog.validation.seoStats.description")}</span>
            <StatusIcon status={descStatus} />
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 rounded-full ${
                descStatus === "ok" ? "bg-green-500" 
                : descStatus === "warning" ? "bg-yellow-500" 
                : "bg-red-500"
              }`}
              style={{ width: `${Math.min((descLength / 160) * 100, 100)}%` }}
            />
          </div>
          <StatusText 
            status={descStatus}
            okText={t("blog.validation.seoStats.descriptionOk", { count: descLength })}
            warningText={t("blog.validation.seoStats.descriptionWarning", { count: descLength })}
            errorText={t("blog.validation.seoStats.descriptionError")}
          />

          {/* Image */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
            <span className="text-xs text-slate-400">{t("blog.validation.seoStats.image")}</span>
            <StatusIcon status={hasImage ? "ok" : "error"} />
          </div>
          <StatusText 
            status={hasImage ? "ok" : "error"}
            okText={t("blog.validation.seoStats.imageOk")}
            errorText={t("blog.validation.seoStats.imageMissing")}
          />

          {/* Keywords */}
          {keywords.length > 0 && (
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
              <span className="text-xs text-slate-400">{t("blog.validation.seoStats.keywords")}</span>
              <span className="text-xs text-primary font-medium">
                {t("blog.validation.seoStats.keywordsCount", { count: keywords.length })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Linked Cars */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <span className="text-sm font-bold text-white">{t("blog.validation.linkedCars")}</span>
        </div>
        <p className="text-xs text-slate-500 mt-2 mb-3">
          {t("blog.validation.linkedCarsHint")}
        </p>
        
        {linkedCars.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(linkedCars) ? linkedCars : []).slice(0, 6).map((car) => (
              <div 
                key={car?._id} 
                className="w-10 h-10 rounded-full bg-slate-800 border-2 border-white/10 overflow-hidden hover:border-primary transition-colors group"
                title={car?.name || ""}
              >
                <Image
                  src={car?.image && car.image !== 'no-photo.jpg' ? car.image : "/images/car-placeholder.png"}
                  alt={car?.name || ""}
                  width={40}
                  height={40}
                  className="object-cover group-hover:scale-110 transition-transform"
                />
              </div>
            ))}
            {linkedCars.length > 6 && (
              <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                +{linkedCars.length - 6}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-slate-500 text-xs">
            {t("blog.validation.noLinkedCars")}
          </div>
        )}
      </div>

      {/* Publish Status */}
      <div className={`rounded-2xl p-4 border ${
        (titleStatus === "ok" && descStatus === "ok" && hasImage) 
          ? "bg-green-500/10 border-green-500/30" 
          : "bg-red-500/10 border-red-500/30"
      }`}>
        <div className="flex items-center gap-2">
          <StatusIcon status={
            (titleStatus === "ok" && descStatus === "ok" && hasImage) ? "ok" : "error"
          } />
          <span className={`text-sm font-bold ${
            (titleStatus === "ok" && descStatus === "ok" && hasImage) 
              ? "text-green-400" 
              : "text-red-400"
          }`}>
            {(titleStatus === "ok" && descStatus === "ok" && hasImage) 
              ? t("blog.validation.publishReady")
              : t("blog.validation.publishBlocked")
            }
          </span>
        </div>
      </div>
    </div>
  );
});

SEOPreview.displayName = 'SEOPreview';

export default SEOPreview;
