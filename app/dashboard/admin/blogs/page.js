"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService, categoryService, carService } from "@/services/api";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  Autocomplete,
  Tooltip,
  Tabs,
  Tab,
  Pagination,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  Article,
  AccessTime,
  Analytics,
  Settings,
  CloudUpload,
  AutoFixHigh,
  Visibility,
  Lock,
  CheckCircle,
  Crop,
  Search,
  CarRental,
  Translate,
  Language,
  Public,
  Drafts,
  Close,
  ChevronLeft,
  ChevronRight,
  MenuBook,
  Handyman,
  PhotoLibrary,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

import ImageUpload from "@/components/admin/ImageUpload";

// Dynamic import for ReactQuill to prevent SSR issues
const ReactQuill = dynamic(
  async () => {
    const { default: Quill } = await import("react-quill-new");
    return Quill;
  },
  {
    ssr: false,
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress size={30} sx={{ color: 'var(--primary)' }} />
      </Box>
    ),
  }
);
import "react-quill-new/dist/quill.snow.css";

// --- Elite Styling Tokens ---
const eliteInputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "1.25rem",
    bgcolor: "rgba(255,255,255,0.02)",
    color: "white",
    fontWeight: "500",
    border: "1px solid rgba(255,255,255,0.08)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      bgcolor: "rgba(255,255,255,0.04)",
      borderColor: "rgba(10, 35, 115,0.3)",
    },
    "&.Mui-focused": {
      bgcolor: "rgba(255,255,255,0.05)",
      borderColor: "var(--primary)",
      boxShadow: "0 0 0 4px rgba(10, 35, 115,0.15), 0 0 20px rgba(10, 35, 115,0.1)",
    },
    "&.Mui-error": {
      borderColor: "#ef4444",
      boxShadow: "0 0 0 4px rgba(239,68,68,0.1)",
    }
  },
  "& .MuiInputLabel-root": { 
    color: "rgba(255,255,255,0.5)", 
    fontWeight: "600",
    "&.Mui-focused": { color: "var(--primary)" },
  },
  "& .MuiOutlinedInput-input": {
    color: "white",
    fontWeight: "500",
    "&::placeholder": { color: "rgba(255,255,255,0.25)", opacity: 1 },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "transparent",
  },
  "& .MuiFormHelperText-root": {
    color: "rgba(255,255,255,0.4)",
    fontSize: "0.75rem",
    marginTop: "0.5rem",
    fontWeight: "600",
    "&.Mui-error": { color: "#ef4444" }
  },
};

const eliteCardStyle = "bg-[#0f172a]/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-white/20 transition-all duration-500";
const eliteCardTitleStyle = "text-white font-black text-xl mb-8 flex items-center justify-between gap-3";
const eliteLabelStyle = "text-white/40 font-bold text-[11px] mb-3 block uppercase tracking-[0.2em]";

// --- Tab Panel Wrapper ---
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`blog-tabpanel-${index}`}
      aria-labelledby={`blog-tab-${index}`}
      {...other}
      className="outline-none"
    >
      <AnimatePresence mode="wait">
        {value === index && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="pt-6"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Specialized Components ---

const EliteSEOModule = ({ formData, setFormData, t }) => {
  const titleLength = formData?.metaTitle?.length || 0;
  const descLength = formData?.metaDescription?.length || 0;
  
  const getProgressColor = (length, min, max) => {
    if (length === 0) return "#475569";
    if (length < min) return "#0A2373"; // Orange
    if (length <= max) return "#10b981"; // Emerald Green
    return "#ef4444"; // Red
  };

  const displayTitle = formData.metaTitle || formData.title || "عنوان المقال يظهر هنا...";
  const displayDesc = formData.metaDescription || formData.summary || "وصف المقال سيظهر هنا في نتائج البحث لتحسين ترتيب الموقع...";

  return (
    <div className="space-y-6">
      <div className={eliteCardStyle}>
        <h3 className={eliteCardTitleStyle}>
          <div className="flex items-center gap-2">
            <Search className="text-primary" />
            <span>معاينة نتائج البحث</span>
          </div>
          <div className="bg-emerald-500/10 text-emerald-500 text-[10px] px-2 py-1 rounded-md font-black">Live Preview</div>
        </h3>

        {/* Google Preview */}
        <div className="bg-white rounded-2xl p-5 mb-8 shadow-inner overflow-hidden text-right" dir="rtl">
          <div className="flex items-center gap-2 mb-2 flex-row-reverse">
            <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[#4285f4] text-xs font-bold">G</div>
            <div className="flex flex-col text-right">
              <span className="text-[11px] text-[#202124] font-medium leading-none">Google Search</span>
              <span className="text-[10px] text-[#70757a] leading-none">https://c4rplatform.com › blog</span>
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-[#1a0dab] text-xl font-medium leading-tight hover:underline cursor-pointer truncate">
              {displayTitle}
            </h4>
            <p className="text-[#4d5156] text-sm leading-relaxed line-clamp-2">
              {displayDesc}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Meta Title */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className={eliteLabelStyle}>{t("dashboard.admin.blog.addDialog.metaTitleLabel")}</label>
              <span className="text-[10px] font-black" style={{ color: getProgressColor(titleLength, 50, 60) }}>
                {titleLength}/60
              </span>
            </div>
            <TextField
              fullWidth
              placeholder={t("dashboard.admin.blog.addDialog.metaTitleLabel")}
              value={formData.metaTitle}
              onChange={(e) => setFormData(p => ({...p, metaTitle: e.target.value}))}
              sx={eliteInputStyle}
            />
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((titleLength/60)*100, 100)}%` }}
                className="h-full rounded-full"
                style={{ backgroundColor: getProgressColor(titleLength, 50, 60) }}
              />
            </div>
          </div>

          {/* Meta Description */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className={eliteLabelStyle}>{t("dashboard.admin.blog.addDialog.metaDescLabel")}</label>
              <span className="text-[10px] font-black" style={{ color: getProgressColor(descLength, 150, 160) }}>
                {descLength}/160
              </span>
            </div>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder={t("dashboard.admin.blog.addDialog.metaDescLabel")}
              value={formData.metaDescription}
              onChange={(e) => setFormData(p => ({...p, metaDescription: e.target.value}))}
              sx={eliteInputStyle}
            />
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((descLength/160)*100, 100)}%` }}
                className="h-full rounded-full"
                style={{ backgroundColor: getProgressColor(descLength, 150, 160) }}
              />
            </div>
          </div>

          {/* Focus Keywords */}
          <div className="space-y-2">
            <label className={eliteLabelStyle}>{t("dashboard.admin.blog.addDialog.focusKeywordsLabel") || "الكلمات المفتاحية (تفصل بينها فاصلة)"}</label>
            <TextField
              fullWidth
              placeholder="مثال: تويوتا، لاندكروزر، السعودية..."
              value={formData.focusKeywords}
              onChange={(e) => setFormData(p => ({...p, focusKeywords: e.target.value}))}
              sx={eliteInputStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

export default function AdminBlogs() {
  const { t, i18n } = useTranslation("common");
  const queryClient = useQueryClient();

  const [mounted, setMounted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [slugSync, setSlugSync] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [imageMetadata, setImageMetadata] = useState(null);
  const [page, setPage] = useState(1);

  // Initial Form State
  const initialForm = {
    title: "",
    slug: "",
    category: "",
    content: "",
    summary: "",
    status: "draft",
    image: "",
    relatedCars: [],
    metaTitle: "",
    metaDescription: "",
    focusKeywords: "",
    faqs: [],
  };
  const [formData, setFormData] = useState(initialForm);

  // Helper: Calculate Reading Time
  const readingTime = useMemo(() => {
    const text = formData.content.replace(/<[^>]*>/g, ' ');
    const wordCount = text.trim().split(/\s+/).length;
    return Math.ceil(wordCount / 200) || 1;
  }, [formData.content]);

  // Queries
  const { data: blogsData, isLoading: blogsLoading } = useQuery({
    queryKey: ["adminBlogs", page],
    queryFn: () => blogService.getAll({ sort: '-createdAt', page, limit: 20 }),
    keepPreviousData: true,
  });

  const { data: catData } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: () => categoryService.getAll(),
  });

  const { data: carData } = useQuery({
    queryKey: ["adminCars"],
    queryFn: () => carService.getAll({ limit: 100 }),
  });

  useEffect(() => { setMounted(true); }, []);

  // Slug Generation relying on Backend completely to prevent 404 mismatch

  // Mutations
  const createMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      toast.success(t("feedback.admin.blogCreateSuccess") || "تم إضافة المقال بنجاح");
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
      setOpenDialog(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message || "حدث خطأ أثناء الإضافة")
  });

  const updateMutation = useMutation({
    mutationFn: ({ slug, data }) => blogService.update(slug, data),
    onSuccess: () => {
      toast.success(t("feedback.admin.blogUpdateSuccess") || "تم تحديث المقال بنجاح");
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
      setOpenDialog(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message || "حدث خطأ أثناء التحديث")
  });

  const deleteMutation = useMutation({
    mutationFn: blogService.delete,
    onSuccess: () => {
      toast.success(t("feedback.admin.blogDeleteSuccess") || "تم حذف المقال بنجاح");
      queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
      setDeleteDialog(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message || t("common.error") || "حدث خطأ أثناء الحذف")
  });

  const handleOpenDialog = async (blog = null) => {
    setTabValue(0);
    // Reset file-related state to prevent stale data from previous dialog sessions
    setFile(null);
    setImageMetadata(null);

    if (blog) {
      let fullBlog = blog;
      
      // Fetch full blog data because the paginated list excludes the 'content' field
      try {
        const loadingToast = toast.loading("جاري جلب تفاصيل المقال...");
        const response = await blogService.getOne(blog.slug);
        if (response?.data) {
          fullBlog = response.data;
        }
        toast.dismiss(loadingToast);
      } catch (err) {
        toast.dismiss();
        toast.error("حدث خطأ أثناء استرداد بيانات المقال من الخادم");
        return;
      }

      setSelectedBlog(fullBlog);
      setFormData({
        title: fullBlog.title || "",
        slug: fullBlog.slug || "",
        category: fullBlog.category?._id || fullBlog.category || "",
        content: fullBlog.content || "",
        summary: fullBlog.summary || "",
        status: fullBlog.status || "draft",
        image: fullBlog.image === 'no-photo.jpg' ? '' : (fullBlog.image || ""),
        relatedCars: Array.isArray(fullBlog.relatedCars) ? fullBlog.relatedCars.map(c => typeof c === 'object' ? c._id : c) : [],
        metaTitle: fullBlog.metaTitle || "",
        metaDescription: fullBlog.metaDescription || "",
        focusKeywords: Array.isArray(fullBlog.focusKeywords) ? fullBlog.focusKeywords.join(", ") : (fullBlog.focusKeywords || ""),
        faqs: fullBlog.faqs || [],
      });
      setSlugSync(false);
    } else {
      setSelectedBlog(null);
      setFormData(initialForm);
      setSlugSync(true);
    }
    setOpenDialog(true);
  };

  const handleFileSelect = (f) => {
    setFile(f);
    if (f) {
      const img = new window.Image();
      img.onload = () => {
        setImageMetadata({
          res: `${img.width}x${img.height}`,
          size: (f.size / 1024 / 1024).toFixed(2) + " MB"
        });
      };
      img.src = URL.createObjectURL(f);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) { toast.error(t("notifications.requiredFields") || "العنوان مطلوب"); setTabValue(0); return; }
    if (!formData.category) { toast.error(t("notifications.requiredFields") || "التصنيف مطلوب"); setTabValue(0); return; }
    // Validate content — strip HTML tags to check if there's actual text
    const strippedContent = formData.content.replace(/<[^>]*>/g, '').trim();
    if (!strippedContent) { toast.error("محتوى المقال مطلوب — اكتب محتوى المقال أولاً"); setTabValue(1); return; }

    setUploading(true);
    try {
      let currentImageUrl = formData.image;
      if (file) {
        const uploadData = new FormData();
        uploadData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: uploadData });
        const result = await res.json();
        if (!res.ok) throw new Error(t("notifications.uploadError") || "Upload failed");
        currentImageUrl = result.url;
      }

      const finalData = { 
        ...formData, 
        image: currentImageUrl,
        focusKeywords: typeof formData.focusKeywords === 'string' 
          ? formData.focusKeywords.split(",").map(k => k.trim()).filter(Boolean) 
          : formData.focusKeywords
      };

      // Remove empty slug so backend auto-generates it from title
      if (!finalData.slug || !finalData.slug.trim()) {
        delete finalData.slug;
      }
      
      if (selectedBlog) updateMutation.mutate({ slug: selectedBlog.slug, data: finalData });
      else createMutation.mutate(finalData);
    } catch (error) { toast.error(error.message || t("common.error")); }
    finally { setUploading(false); }
  };

  const categories = Array.isArray(catData?.data) ? catData.data : [];
  const localCars = Array.isArray(carData?.data?.cars) ? carData.data.cars : [];
  const blogs = Array.isArray(blogsData?.data) ? blogsData.data : [];

  if (!mounted) return null;

  return (
    <div className="space-y-8 p-4 md:p-8" dir="rtl">
      {/* Page Header */}
      <div className="bg-[#020617] p-8 md:p-12 rounded-[2.5rem] border border-white/10 relative overflow-hidden flex flex-col md:flex-row justify-between items-center shadow-2xl">
        <div className="relative z-10 text-center md:text-right">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">إدارة المدونة</h1>
          <p className="text-white/40 font-bold">تحكم في محتوى موقعك من مكان واحد</p>
        </div>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            borderRadius: "1.5rem", px: 4, py: 1.5, fontWeight: "900", bgcolor: "var(--primary)",
            boxShadow: "0 10px 20px rgba(10, 35, 115, 0.2)", "&:hover": { transform: "translateY(-3px)" },
            transition: "all 0.3s"
          }}
        >
          أضف مقال
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogsLoading ? (
          <div className="col-span-full py-32 flex flex-col items-center gap-6">
            <CircularProgress size={50} thickness={5} sx={{ color: 'var(--primary)' }} />
            <span className="text-white font-black text-xl animate-pulse tracking-[0.2em]">جاري تحميل البيانات...</span>
          </div>
        ) : (
          blogs.map((blog) => (
            <div 
              key={blog._id} 
              className="bg-[#0f172a]/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-primary/40 transition-all duration-500 shadow-2xl flex flex-col"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image src={blog.image || '/images/blog-placeholder.jpg'} alt={blog.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4">
                   <Chip 
                     label={t(`dashboard.admin.blog.statuses.${blog.status || 'draft'}`)} 
                     size="small" 
                     sx={{ 
                       bgcolor: blog.status === 'published' ? 'rgba(16,185,129,0.9)' : 'rgba(10, 35, 115,0.9)', 
                       color: 'white', 
                       fontWeight: '900',
                       backdropFilter: 'blur(10px)'
                     }} 
                   />
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1 gap-5">
                <div className="space-y-4 flex-1">
                   <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug min-h-[3.5rem] text-right">
                     {blog.title}
                   </h3>
                   <Typography className="text-white/40 text-sm font-bold line-clamp-2 leading-relaxed text-right">
                     {blog.summary || (blog.content ? blog.content.replace(/<[^>]*>/g, ' ').substring(0, 100) + "..." : "")}
                   </Typography>
                </div>

                <div className="flex justify-between items-center text-[10px] text-white/30 font-black uppercase tracking-[0.15em] pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <AccessTime sx={{ fontSize: 16, color: 'primary.main' }} /> 
                    <span>{blog.content ? Math.ceil(blog.content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length / 200) : 1} MIN</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Analytics sx={{ fontSize: 16, color: 'primary.main' }} /> 
                    <span>{blog.views || 0} VIEWS</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Tooltip title="تعديل">
                    <IconButton 
                      onClick={() => handleOpenDialog(blog)} 
                      sx={{ bgcolor: 'white/5', color: 'white', "&:hover": { bgcolor: 'primary.main' } }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="حذف">
                    <IconButton 
                      onClick={() => { setSelectedBlog(blog); setDeleteDialog(true); }} 
                      sx={{ bgcolor: 'rgba(239,68,68,0.1)', color: '#ef4444', "&:hover": { bgcolor: '#ef4444', color: 'white' } }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Button 
                    component={Link} 
                    href={`/blog/${blog.slug}`} 
                    target="_blank" 
                    variant="outlined" 
                    fullWidth 
                    sx={{ 
                      borderRadius: '1rem', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      color: 'white',
                      fontWeight: '900',
                      "&:hover": { borderColor: 'white', bgcolor: 'white/5' }
                    }}
                  >
                    معاينة
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination component */}
      {!blogsLoading && blogsData?.pagination?.totalPages > 1 && (
        <div className="flex justify-center mt-12 mb-8">
          <Pagination
            count={blogsData.pagination.totalPages}
            page={page}
            onChange={(e, value) => {
              setPage(value);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": { color: "white", borderColor: "rgba(255,255,255,0.2)" },
              "& .Mui-selected": { bgcolor: "var(--primary)", color: "white", borderColor: "var(--primary)" }
            }}
            variant="outlined"
            shape="rounded"
            size="large"
          />
        </div>
      )}

      {/* Main Dialog with Tabs */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        dir="rtl"
        PaperProps={{
          sx: {
            borderRadius: "2.5rem",
            bgcolor: "#020617",
            backgroundImage: "radial-gradient(circle at 50% -20%, rgba(10, 35, 115, 0.15) 0%, transparent 80%)",
            border: "1px solid rgba(255,255,255,0.08)",
            maxHeight: "92vh",
            overflow: "hidden",
            boxShadow: "0 0 100px rgba(0,0,0,0.8)"
          }
        }}
      >
        <DialogTitle className="p-6 md:p-8 pb-0">
          <div className="flex justify-between items-center mb-6">
            <Typography variant="h5" className="text-white font-black">
              {selectedBlog ? "تعديل مقال" : "مقال جديد"}
            </Typography>
            <IconButton onClick={() => setOpenDialog(false)} sx={{ color: 'white/40' }}><Close /></IconButton>
          </div>
          
          <Tabs 
            value={tabValue} 
            onChange={(_, val) => setTabValue(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTabs-indicator": { bgcolor: "var(--primary)", height: 4, borderRadius: 2 },
              "& .MuiTab-root": { color: "white/40", fontWeight: "900", minWidth: 100, fontSize: "0.9rem" },
              "& .Mui-selected": { color: "white !important" }
            }}
          >
            <Tab icon={<MenuBook className="mb-1" />} iconPosition="start" label="البيانات" />
            <Tab icon={<AutoFixHigh className="mb-1" />} iconPosition="start" label="المحتوى" />
            <Tab icon={<Search className="mb-1" />} iconPosition="start" label="السيو (SEO)" />
            <Tab icon={<PhotoLibrary className="mb-1" />} iconPosition="start" label="الوسائط" />
          </Tabs>
        </DialogTitle>

        <DialogContent className="p-6 md:p-8 pt-0 overflow-y-auto custom-scrollbar">
          
          {/* Section 1: Basic Info */}
          <TabPanel value={tabValue} index={0}>
            <div className="space-y-6">
              <div className={eliteCardStyle}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    fullWidth
                    label="العنوان"
                    value={formData.title}
                    onChange={(e) => setFormData(p => ({...p, title: e.target.value}))}
                    sx={eliteInputStyle}
                  />
                  <div className="relative">
                    <TextField
                      fullWidth
                      label="Slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(p => ({...p, slug: e.target.value}))}
                      disabled={slugSync}
                      sx={eliteInputStyle}
                      InputProps={{
                        endAdornment: (
                          <IconButton 
                            onClick={() => setSlugSync(!slugSync)} 
                            size="small"
                            sx={{ color: slugSync ? 'primary.main' : 'white/10', mr: 1 }}
                          >
                            <Settings fontSize="small" />
                          </IconButton>
                        )
                      }}
                    />
                  </div>
                  <FormControl fullWidth sx={eliteInputStyle}>
                    <InputLabel>التصنيف</InputLabel>
                    <Select value={formData.category} onChange={(e) => setFormData(p => ({...p, category: e.target.value}))} label="التصنيف">
                      {categories.map(c => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth sx={eliteInputStyle}>
                    <InputLabel>الحالة</InputLabel>
                    <Select value={formData.status} onChange={(e) => setFormData(p => ({...p, status: e.target.value}))} label="الحالة">
                      <MenuItem value="draft">مسودة</MenuItem>
                      <MenuItem value="published">منشور</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="ملخص سريع"
                  value={formData.summary}
                  onChange={(e) => setFormData(p => ({...p, summary: e.target.value}))}
                  sx={{ ...eliteInputStyle, mt: 3 }}
                />
              </div>
            </div>
          </TabPanel>

          {/* Section 2: Editor */}
          <TabPanel value={tabValue} index={1}>
            <div className={eliteCardStyle}>
              <div className="rounded-[1.5rem] overflow-hidden border border-white/10 bg-white/5">
                <style>{`
                  .ql-toolbar.ql-snow { border: none !important; background: rgba(255,255,255,0.05) !important; padding: 10px !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important; }
                  .ql-container.ql-snow { border: none !important; min-height: 350px; font-size: 1.1rem; }
                  .ql-editor { color: white !important; line-height: 1.8; text-align: right; }
                  .ql-stroke { stroke: #94a3b8 !important; }
                `}</style>
                <ReactQuill theme="snow" value={formData.content} onChange={(v) => setFormData(p => ({...p, content: v}))} />
              </div>
            </div>
          </TabPanel>

          {/* Section 3: SEO */}
          <TabPanel value={tabValue} index={2}>
            <EliteSEOModule formData={formData} setFormData={setFormData} t={t} />
          </TabPanel>

          {/* Section 4: Media & Related */}
          <TabPanel value={tabValue} index={3}>
            <div className="space-y-8 py-4">
              <div className={`${eliteCardStyle} p-8`}>
                <label className={`${eliteLabelStyle} mb-10`}>الصورة البارزة (مطلوبة للنشر)</label>
                <div className="rounded-[2.5rem] overflow-hidden border-2 border-dashed border-white/10 hover:border-primary/40 transition-all p-4 bg-white/5">
                  <ImageUpload value={formData.image} onChange={(url) => setFormData(p => ({...p, image: url}))} onFileSelect={handleFileSelect} />
                </div>
                {imageMetadata && (
                  <div className="flex gap-4 mt-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-[10px] font-black text-white/40">RES: <span className="text-white">{imageMetadata.res}</span></span>
                    <span className="text-[10px] font-black text-white/40">SIZE: <span className="text-white">{imageMetadata.size}</span></span>
                  </div>
                )}
              </div>

              <div className={eliteCardStyle}>
                <label className={eliteLabelStyle}>سيارات ذات صلة</label>
                <Autocomplete
                  multiple
                  options={localCars}
                  getOptionLabel={(o) => o.name}
                  value={localCars.filter(c => formData.relatedCars.includes(c._id))}
                  onChange={(_, val) => setFormData(p => ({...p, relatedCars: val.map(v => v._id)}))}
                  renderInput={(params) => <TextField {...params} label="أضف سيارات..." sx={eliteInputStyle} />}
                  renderTags={(tags, getTagProps) => tags.map((t, i) => {
                    const { key, ...tagProps } = getTagProps({ index: i });
                    return (
                      <Chip 
                        key={key} 
                        label={t.name} 
                        {...tagProps} 
                        sx={{ bgcolor: '#0A2373', color: 'white', fontWeight: '900', borderRadius: '8px' }} 
                      />
                    );
                  })}
                />
              </div>
            </div>
          </TabPanel>

        </DialogContent>

        <DialogActions className="p-6 md:p-8 bg-white/5 border-t border-white/10 flex flex-col md:flex-row gap-4">
          <div className="flex gap-2 w-full md:w-auto">
            <Button 
              onClick={() => setTabValue(p => Math.max(0, p - 1))} 
              disabled={tabValue === 0}
              variant="outlined"
              sx={{ borderRadius: '1rem', color: 'white', borderColor: 'white/10', flex: 1 }}
            >السابق</Button>
            <Button 
              onClick={() => setTabValue(p => Math.min(3, p + 1))} 
              disabled={tabValue === 3}
              variant="outlined"
              sx={{ borderRadius: '1rem', color: 'white', borderColor: 'white/10', flex: 1 }}
            >التالي</Button>
          </div>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={uploading || createMutation.isPending || updateMutation.isPending}
            fullWidth
            sx={{
              borderRadius: '1rem', py: 1.5, fontWeight: '900', fontSize: '1.1rem',
              backgroundImage: 'linear-gradient(135deg, var(--primary) 0%, #0A2373 100%)',
              boxShadow: '0 10px 20px rgba(10, 35, 115, 0.2)'
            }}
          >
            {uploading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : (selectedBlog ? t("dashboard.admin.blog.elite.update") : t("dashboard.admin.blog.elite.publish"))}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} PaperProps={{ sx: { bgcolor: "#020617", p: 4, borderRadius: "2rem", border: '1px solid white/10' } }}>
        <div className="text-center space-y-4">
          <Typography variant="h6" color="white">{t("dashboard.admin.blog.deleteDialog.title")}</Typography>
          <Typography color="white/60">{t("dashboard.admin.blog.deleteDialog.message")}</Typography>
          <div className="flex gap-4">
            <Button onClick={() => setDeleteDialog(false)} sx={{ color: 'white' }}>{t("common.cancel")}</Button>
            <Button variant="contained" color="error" disabled={deleteMutation.isPending || !selectedBlog?.slug} onClick={() => selectedBlog?.slug && deleteMutation.mutate(selectedBlog.slug)}>{deleteMutation.isPending ? <CircularProgress size={20} sx={{ color: 'white' }} /> : t("common.delete")}</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}