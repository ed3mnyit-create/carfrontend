"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/api";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import { Add, Delete, Edit, Category as CategoryIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function AdminCategories() {
  const { t, i18n } = useTranslation("common");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: () => categoryService.getAll(),
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const createMutation = useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => {
      toast.success(t("dashboard.admin.blog.addDialog.success"));
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      setOpenDialog(false);
      resetForm();
    },
    onError: (err) => {
      const msg = err.response?.data?.message || err.message || t("dashboard.admin.categories.error");
      toast.error(msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ slug, data }) => categoryService.update(slug, data),
    onSuccess: () => {
      toast.success(t("dashboard.admin.blog.editDialog.success"));
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      setOpenDialog(false);
      resetForm();
    },
    onError: (err) => {
      const msg = err.response?.data?.message || err.message || t("dashboard.admin.categories.error");
      toast.error(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: categoryService.delete,
    onSuccess: () => {
      toast.success(t("dashboard.admin.blog.deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      setDeleteDialog(false);
      setSelectedCategory(null);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || err.message || t("dashboard.admin.blog.deleteError");
      toast.error(msg);
    },
  });

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setSelectedCategory(null);
  };

  const handleOpenDialog = (cat = null) => {
    if (cat) {
      setSelectedCategory(cat);
      setFormData({ name: cat.name, description: cat.description || "" });
    } else {
      resetForm();
    }
    setOpenDialog(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return toast.warning(t("notifications.requiredFields"));

    if (selectedCategory) {
      updateMutation.mutate({ slug: selectedCategory?.slug || selectedCategory?._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const categories = data?.data || [];

  return (
    <div className="space-y-4 md:space-y-6" dir={i18n.dir()}>
      <div className="bg-white/5 backdrop-blur-2xl p-6 md:p-10 rounded-2xl md:rounded-[3rem] border border-white/10 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center shadow-2xl gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-white mb-2 tracking-tighter">
            إدارة <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">الأقسـام</span>
          </h1>
          <p className="text-slate-400 font-bold text-sm md:text-base">
            إضافة وتصنيف المحتوى الـ Elite لضمان أفضل تجربة للمستخدم
          </p>
        </div>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            borderRadius: "1rem",
            px: 4,
            py: 1.5,
            fontWeight: "900",
            bgcolor: "var(--primary)",
            "&:hover": { bgcolor: "var(--primary-hover)" },
          }}
        >
          إضافة تصنيف جديد
        </Button>
      </div>

      <div className="bg-white/5 backdrop-blur-xl p-4 md:p-8 rounded-2xl md:rounded-[3rem] border border-white/10 shadow-2xl min-h-[400px]">
        {isLoading ? (
          <CircularProgress className="m-auto block mt-10" />
        ) : categories.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl mt-4">
            <CategoryIcon sx={{ fontSize: 48, color: "rgba(255,255,255,0.2)" }} className="mb-4" />
            <p className="text-lg font-black text-slate-500">{t("common.noData")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(Array.isArray(categories) ? categories.filter(Boolean) : []).map((cat) => (
              <div key={cat?._id || cat?.slug} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                    <CategoryIcon />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="small"
                      onClick={() => handleOpenDialog(cat)}
                      startIcon={<Edit />}
                      sx={{
                        color: 'white',
                        bgcolor: 'rgba(255,255,255,0.05)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                        borderRadius: '0.75rem',
                        fontWeight: 900,
                        px: 2,
                        fontSize: '0.75rem'
                      }}
                    >
                      {t("common.edit")}
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => { setSelectedCategory(cat); setDeleteDialog(true); }}
                      startIcon={<Delete />}
                      sx={{
                        color: '#ef4444',
                        bgcolor: 'rgba(239,68,68,0.05)',
                        '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' },
                        borderRadius: '0.75rem',
                        fontWeight: 900,
                        px: 2,
                        fontSize: '0.75rem'
                      }}
                    >
                      {t("common.delete")}
                    </Button>
                  </div>
                </div>
                <h3 className="text-xl font-black text-white mb-2">{cat?.name || t("common.noData")}</h3>
                <p className="text-sm text-slate-400 font-medium mb-3 line-clamp-2">{cat?.description || t("common.noData")}</p>
                <div className="text-xs font-black text-slate-500 uppercase tracking-widest bg-white/5 inline-block px-3 py-1 rounded-lg">
                  /{cat?.slug || "بدون رابط"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
  <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "1.5rem", bgcolor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)" } }}>
    <DialogTitle className="text-white font-black">{selectedCategory ? t("dashboard.admin.tabs.categories") + " - " + t("common.edit") : t("dashboard.admin.tabs.categories") + " - " + t("common.add")}</DialogTitle>
        <DialogContent dividers className="border-white/10 space-y-4">
          <TextField
            fullWidth
            label="اسم القسم"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            variant="filled"
            sx={{ input: { color: "white" }, label: { color: "rgba(255,255,255,0.5)" }, bgcolor: "rgba(255,255,255,0.05)" }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="وصف القسم (اختياري)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            variant="filled"
            sx={{ textarea: { color: "white" }, label: { color: "rgba(255,255,255,0.5)" }, bgcolor: "rgba(255,255,255,0.05)" }}
          />
        </DialogContent>
        <DialogActions className="p-4 border-t border-white/10">
          <Button onClick={() => setOpenDialog(false)} sx={{ color: "rgba(255,255,255,0.5)", fontWeight: "bold" }}>{t("common.cancel")}</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} sx={{ bgcolor: "var(--primary)", borderRadius: "0.75rem", fontWeight: "bold" }}>
             {selectedCategory ? t("common.save") : t("common.add")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} PaperProps={{ sx: { borderRadius: "1.5rem", bgcolor: "#0f172a", border: "1px solid rgba(220,38,38,0.2)" } }}>
        <DialogTitle className="text-red-500 font-black">حـذف القسم</DialogTitle>
        <DialogContent className="text-white/80">هل أنت متأكد من رغبتك في حذف قسم ({selectedCategory?.name || ''})؟ هذا الإجراء لا يمكن التراجع عنه.</DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setDeleteDialog(false)} sx={{ color: "rgba(255,255,255,0.5)", fontWeight: "bold" }}>{t("common.cancel")}</Button>
          <Button variant="contained" color="error" onClick={() => selectedCategory && deleteMutation.mutate(selectedCategory?._id || selectedCategory?.slug)} disabled={deleteMutation.isPending || !selectedCategory} sx={{ borderRadius: "0.75rem", fontWeight: "bold" }}>
            {t("common.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
