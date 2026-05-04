"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { CloudUpload, CheckCircle, Error } from "@mui/icons-material";

const ImageUpload = ({ 
  value, 
  onChange, 
  onFileSelect,
  error = false 
}) => {
  const { t, i18n } = useTranslation("common");
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value || null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        onFileSelect?.(file);
        onChange?.(url);
      }
    }
  }, [onChange, onFileSelect]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onFileSelect?.(file);
      onChange?.(url);
    }
  };

  const hasImage = !!(previewUrl || value);

  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-white flex items-center gap-2">
        {t("blog.validation.imageUpload.title")}
        {!hasImage && (
          <span className="text-xs text-red-400 font-normal">
            {t("blog.validation.imageUpload.required")}
          </span>
        )}
      </div>
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer
          ${isDragging 
            ? "border-primary bg-primary/10 scale-[1.02]" 
            : hasImage 
              ? "border-primary/50 bg-primary/5" 
              : error 
                ? "border-red-500/50 bg-red-500/5 hover:border-red-500 hover:bg-red-500/10" 
                : "border-white/10 hover:border-primary/30 hover:bg-white/5"
          }
        `}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />

        {hasImage ? (
          <div className="relative h-56 group">
            <Image
              src={previewUrl || value}
              alt="Preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                  <CloudUpload sx={{ fontSize: 32, color: "white" }} />
                </div>
                <span className="text-white font-bold text-sm">
                  {t("blog.validation.imageUpload.changeImage")}
                </span>
              </div>
            </div>
            <div className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <CheckCircle sx={{ fontSize: 14, color: "white" }} />
              <span className="text-white text-xs font-bold">
                {i18n.language === "ar" ? "تم الرفع" : "Uploaded"}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className={`
              w-20 h-20 mb-4 rounded-full flex items-center justify-center transition-all duration-500 border-2 border-dashed
              ${isDragging 
                ? "border-primary bg-primary/20 scale-110" 
                : "border-white/20 bg-white/5"
              }
            `}>
              <CloudUpload 
                sx={{ 
                  fontSize: 40, 
                  color: isDragging ? "var(--primary)" : "rgba(255,255,255,0.4)",
                  className: isDragging ? "animate-bounce" : ""
                }} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 justify-center">
                <span className={`
                  font-bold text-xl transition-colors
                  ${isDragging ? "text-primary" : "text-white"}
                `}>
                  {t("blog.validation.imageUpload.dragDrop")}
                </span>
              </div>
              <span className="text-slate-500 text-sm font-medium">
                {t("blog.validation.imageUpload.orClick")}
              </span>
            </div>
            
            <div className="mt-4 px-4 py-2 bg-white/5 rounded-full">
              <span className="text-xs text-slate-400 font-medium">
                {t("blog.validation.imageUpload.hint")}
              </span>
            </div>

            {isDragging && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-4 border-2 border-primary border-dashed rounded-2xl animate-pulse" />
              </div>
            )}
          </div>
        )}
      </div>

      {!hasImage && (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Error sx={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }} />
          <span>{t("blog.validation.imageUpload.required")}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
