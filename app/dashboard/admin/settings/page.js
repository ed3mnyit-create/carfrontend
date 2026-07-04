"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingService } from "@/services/api";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Grid,
  IconButton,
  InputAdornment,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";
import {
  Settings,
  Business,
  Facebook,
  Twitter,
  Instagram,
  WhatsApp,
  Phone,
  Email,
  LocationOn,
  Save,
  Info,
  Share,
  Add,
  Delete,
  DirectionsCar,
  SupportAgent,
  LibraryAddCheck,
  VerifiedUser,
  AutoGraph,
  Handyman,
  WorkspacePremium,
  Link as LinkIcon,
  Language,
  QrCode2,
  CloudUpload,
} from "@mui/icons-material";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { SiTiktok, SiLinktree } from "react-icons/si";
import Image from "next/image";
import { defaultHomeSettings, mergeHomeSettings } from "@/components/home/homeSettings";

// --- Static Constants Outside Component ---
const eliteInputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.875rem",
    bgcolor: "rgba(255,255,255,0.025)",
    color: "white",
    fontWeight: "700",
    border: "1px solid rgba(255,255,255,0.08)",
    transition: "border-color 0.2s ease, background-color 0.2s ease",
    "&:hover": {
      bgcolor: "rgba(255,255,255,0.04)",
      borderColor: "rgba(255,255,255,0.16)",
    },
    "&.Mui-focused": {
      bgcolor: "rgba(255,255,255,0.05)",
      borderColor: "var(--primary)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.46)",
    fontWeight: "800",
    "&.Mui-focused": { color: "var(--primary)" },
  },
  "& .MuiFormHelperText-root": {
    color: "rgba(255,255,255,0.42)",
    fontWeight: "700",
    mx: 0,
  },
};

const iconOptions = [
  { key: "LibraryAddCheck", label: "Checkmark" },
  { key: "DirectionsCar", label: "Car" },
  { key: "SupportAgent", label: "Support" },
  { key: "VerifiedUser", label: "Verified" },
  { key: "AutoGraph", label: "Growth" },
  { key: "Handyman", label: "Maintenance" },
  { key: "WorkspacePremium", label: "Premium" },
  { key: "Info", label: "Info" },
  { key: "WhatsApp", label: "WhatsApp" },
  { key: "Instagram", label: "Instagram" },
  { key: "Facebook", label: "Facebook" },
  { key: "Twitter", label: "Twitter (X)" },
  { key: "Tiktok", label: "TikTok" },
  { key: "Language", label: "Website" },
  { key: "LocationOn", label: "Location" },
  { key: "Email", label: "Email" },
];

export default function AdminSettings() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);

  // Form States
  const [socials, setSocials] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    tiktok: "",
    whatsapp: "",
    snapchat: "",
    linktree: "",
    qrCode: "",
  });

  const [qrUploading, setQrUploading] = useState(false);

  const [about, setAbout] = useState({
    badge: "",
    mainTitlePart1: "",
    mainTitlePart2: "",
    description: "",
    storyTitle: "",
    storyText: "",
    featuresTitle: "",
    features: [],
  });

  const getIconByKey = (key) => {
    const icons = {
      LibraryAddCheck: <LibraryAddCheck />,
      DirectionsCar: <DirectionsCar />,
      SupportAgent: <SupportAgent />,
      VerifiedUser: <VerifiedUser />,
      AutoGraph: <AutoGraph />,
      Handyman: <Handyman />,
      WorkspacePremium: <WorkspacePremium />,
      Info: <Info />,
      WhatsApp: <WhatsApp />,
      Instagram: <Instagram />,
      Facebook: <Facebook />,
      Twitter: <Twitter />,
      Tiktok: <SiTiktok />,
      Language: <Language />,
      LocationOn: <LocationOn />,
      Email: <Email />,
    };
    return icons[key] || <Info />;
  };

  const [contact, setContact] = useState({
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
  });
  const [homeSettings, setHomeSettings] = useState(defaultHomeSettings);

  // Fetch Settings
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: settingService.getAll,
  });

  // Populate form when data arrives
  useEffect(() => {
    if (settingsData?.data && Array.isArray(settingsData.data)) {
      settingsData.data.forEach((item) => {
        if (item.key === "social_links" && item.data) {
          setSocials(prev => ({ ...prev, ...item.data }));
        }
        if (item.key === "about_content" && item.data) {
          setAbout(prev => ({
            ...prev,
            ...item.data,
            features: item.data.features || []
          }));
        }
        if (item.key === "contact_info" && item.data) {
          setContact(prev => ({ ...prev, ...item.data }));
        }
        if (item.key === "homepage_content" && item.data) {
          const merged = mergeHomeSettings(item.data);
          setHomeSettings(merged);
        }
      });
    }
  }, [settingsData]);

  const addFeature = () => {
    setAbout({
      ...about,
      features: [...about.features, { title: "", description: "", icon: "Info" }]
    });
  };

  const removeFeature = (index) => {
    const newFeatures = [...about.features];
    newFeatures.splice(index, 1);
    setAbout({ ...about, features: newFeatures });
  };

  const updateFeature = (index, field, value) => {
    const newFeatures = [...about.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setAbout({ ...about, features: newFeatures });
  };

  // Mutation for saving
  const saveMutation = useMutation({
    mutationFn: settingService.upsert,
    onSuccess: () => {
      queryClient.invalidateQueries(["site-settings"]);
      queryClient.invalidateQueries({ queryKey: ["setting", "homepage_content"] });
      toast.success(t("dashboard.admin.settings.saveSuccess"));
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.error || error.message || t("dashboard.admin.settings.saveError");
      toast.error(errorMsg);
    },
  });

  const handleSave = (key, data) => {
    saveMutation.mutate({ key, data });
  };

  const updateHome = (path, value) => {
    setHomeSettings((current) => {
      const next = structuredClone(current);
      let cursor = next;
      path.slice(0, -1).forEach((key) => {
        cursor[key] = cursor[key] ?? {};
        cursor = cursor[key];
      });
      cursor[path[path.length - 1]] = value;
      return next;
    });
  };

  const updateHomeLocalized = (path, lang, value) => {
    const currentValue = path.reduce((cursor, key) => cursor?.[key], homeSettings) || {};
    updateHome(path, { ...currentValue, [lang]: value });
  };

  const handleSaveHome = () => {
    handleSave("homepage_content", mergeHomeSettings(homeSettings));
  };

  const sectionLabels = {
    hero: "الهيرو",
    departments: "بطاقات الأقسام",
    about: "من نحن",
    features: "المميزات",
    cars: "السيارات",
    driverCars: "سيارات بسائق",
    services: "الخدمات",
    cta: "دعوة لاتخاذ إجراء",
    promos: "العروض",
    reviews: "التقييمات",
    faq: "الأسئلة الشائعة",
    contact: "التواصل",
  };

  const homeNavItems = [
    { id: "home-visibility", label: "الظهور", description: "تشغيل وإيقاف الأقسام" },
    { id: "home-hero", label: "الهيرو", description: "الخلفية والعنوان والأزرار" },
    { id: "home-departments", label: "بطاقات الأقسام", description: "الأفراد، السائق، الشركات" },
    { id: "home-about", label: "من نحن", description: "النص التعريفي والمميزات" },
    { id: "home-cars", label: "السيارات", description: "سياراتنا وسيارات بسائق" },
    { id: "home-services", label: "الخدمات", description: "بطاقات وروابط الخدمات" },
    { id: "home-cta", label: "CTA", description: "دعوة الحجز الرئيسية" },
    { id: "home-faq", label: "FAQ", description: "أعلى 5 أسئلة" },
    { id: "home-contact", label: "التواصل", description: "النموذج وبيانات التواصل" },
  ];

  const corporateNavItems = [
    { id: "corporate-hero", label: "الهيرو", description: "الصورة، العنوان، والوصف" },
    { id: "corporate-features", label: "المميزات", description: "لماذا تختار الشركات الخدمة" },
    { id: "corporate-services", label: "الخدمات", description: "بطاقات خدمات الشركات" },
    { id: "corporate-cta", label: "CTA", description: "دعوة طلب العرض" },
    { id: "corporate-steps", label: "طريقة العمل", description: "خطوات الحصول على عرض" },
    { id: "corporate-faq", label: "FAQ", description: "أسئلة صفحة الشركات" },
    { id: "corporate-form", label: "نموذج العرض", description: "عنوان ونص النموذج" },
  ];

  const getHomeValue = (path) =>
    path.reduce((cursor, key) => cursor?.[key], homeSettings);

  const getInputRows = (options = {}) => {
    if (!options.multiline) return 1;
    return Math.max(options.rows || 5, 4);
  };

  const getInputSx = (options = {}) => ({
    ...eliteInputStyle,
    "& .MuiOutlinedInput-root": {
      ...eliteInputStyle["& .MuiOutlinedInput-root"],
      minHeight: options.multiline ? "136px" : "56px",
      alignItems: options.multiline ? "flex-start" : "center",
    },
    "& textarea": {
      minHeight: options.multiline ? "96px" : undefined,
      lineHeight: 1.75,
    },
  });

  const fieldGroupSx = {
    p: 2.25,
    borderRadius: "1rem",
    bgcolor: "rgba(0,0,0,0.12)",
    border: "1px solid rgba(255,255,255,0.07)",
    height: "100%",
  };

  const renderFieldLabel = (title, hint) => (
    <Box sx={{ mb: 1.5 }}>
      <Typography sx={{ color: "white", fontSize: "0.92rem", fontWeight: "900" }}>
        {title}
      </Typography>
      {hint && (
        <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", fontWeight: "700", mt: 0.4 }}>
          {hint}
        </Typography>
      )}
    </Box>
  );

  const renderHomeField = (label, path, options = {}) => (
    <Box sx={fieldGroupSx}>
      {renderFieldLabel(label, options.hint)}
      <TextField
        fullWidth
        multiline={options.multiline}
        rows={getInputRows(options)}
        label={options.placeholder || label}
        value={getHomeValue(path) || ""}
        onChange={(e) => updateHome(path, e.target.value)}
        sx={getInputSx(options)}
        InputProps={options.link ? {
          startAdornment: <InputAdornment position="start"><LinkIcon sx={{ color: "var(--primary)" }} /></InputAdornment>,
        } : undefined}
      />
    </Box>
  );

  const renderLocalizedHomeFields = (labelAr, labelEn, path, options = {}) => {
    const title = options.title || labelAr.replace(" بالعربية", "").replace(" عربي", "");

    return (
      <Grid item xs={12}>
        <Box sx={fieldGroupSx}>
          {renderFieldLabel(title, options.hint)}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline={options.multiline}
                rows={getInputRows(options)}
                label="العربية"
                value={getHomeValue([...path, "ar"]) || ""}
                onChange={(e) => updateHomeLocalized(path, "ar", e.target.value)}
                sx={getInputSx(options)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline={options.multiline}
                rows={getInputRows(options)}
                label="English"
                value={getHomeValue([...path, "en"]) || ""}
                onChange={(e) => updateHomeLocalized(path, "en", e.target.value)}
                sx={getInputSx(options)}
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    );
  };

  const renderArrayLocalizedFields = (title, path, index, field, options = {}) => (
    <Grid item xs={12}>
      <Box sx={fieldGroupSx}>
        {renderFieldLabel(title, options.hint)}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              multiline={options.multiline}
              rows={getInputRows(options)}
              label="العربية"
              value={getHomeValue(path)?.[index]?.[field]?.ar || ""}
              onChange={(e) => updateHomeArrayLocalized(path, index, field, "ar", e.target.value)}
              sx={getInputSx(options)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              multiline={options.multiline}
              rows={getInputRows(options)}
              label="English"
              value={getHomeValue(path)?.[index]?.[field]?.en || ""}
              onChange={(e) => updateHomeArrayLocalized(path, index, field, "en", e.target.value)}
              sx={getInputSx(options)}
            />
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );

  const renderArrayField = (label, path, index, field, options = {}) => (
    <Box sx={fieldGroupSx}>
      {renderFieldLabel(label, options.hint)}
      <TextField
        fullWidth
        label={options.placeholder || label}
        value={getHomeValue(path)?.[index]?.[field] || ""}
        onChange={(e) => updateHomeArrayItem(path, index, field, e.target.value)}
        sx={getInputSx(options)}
        InputProps={options.link ? {
          startAdornment: <InputAdornment position="start"><LinkIcon sx={{ color: "var(--primary)" }} /></InputAdornment>,
        } : undefined}
      />
    </Box>
  );

  const updateHomeArrayItem = (path, index, field, value) => {
    const currentArray = getHomeValue(path) || [];
    const nextArray = [...currentArray];
    nextArray[index] = { ...nextArray[index], [field]: value };
    updateHome(path, nextArray);
  };

  const updateHomeArrayLocalized = (path, index, field, lang, value) => {
    const currentArray = getHomeValue(path) || [];
    const item = currentArray[index] || {};
    const localizedValue = item[field] || {};
    updateHomeArrayItem(path, index, field, { ...localizedValue, [lang]: value });
  };

  const addHomeArrayItem = (path, item) => {
    updateHome(path, [...(getHomeValue(path) || []), item]);
  };

  const removeHomeArrayItem = (path, index) => {
    updateHome(path, (getHomeValue(path) || []).filter((_, itemIndex) => itemIndex !== index));
  };

  const panelSx = {
    p: { xs: 2.5, md: 3 },
    borderRadius: "1.25rem",
    bgcolor: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.08)",
    overflow: "hidden",
  };

  const renderPanelTitle = (title, subtitle) => (
    <Box sx={{ mb: 3, pb: 2.5, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <Typography sx={{ color: "white", fontWeight: "900", fontSize: "1.15rem", letterSpacing: "-0.01em" }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography sx={{ color: "rgba(255,255,255,0.52)", fontWeight: "700", mt: 0.75, fontSize: "0.9rem" }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 20 }}>
        <CircularProgress sx={{ color: "var(--primary)" }} />
      </Box>
    );
  }

  return (
    <div className="p-4 md:p-8 pt-24 max-w-7xl mx-auto" dir="rtl">
      {/* Header Area */}
      <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.025] p-5 md:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center border border-primary/20">
              <Settings className="text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              {t("dashboard.admin.settings.title")}
            </h1>
          </div>
          <p className="text-slate-400 font-bold max-w-xl">
            {t("dashboard.admin.settings.subtitle")}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-sm font-black text-slate-300">
          إعدادات الموقع
        </div>
        </div>
      </div>

      {/* Tabs */}
      <Box sx={{ mb: 6, p: 1, borderRadius: "1.25rem", border: "1px solid rgba(255,255,255,0.08)", bgcolor: "rgba(255,255,255,0.025)" }}>
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 0,
            "& .MuiTabs-indicator": { display: "none" },
            "& .MuiTabs-flexContainer": { gap: 1 },
            "& .MuiTab-root": {
              color: "rgba(255,255,255,0.4)",
              fontWeight: "900",
              fontSize: "0.9rem",
              minHeight: 0,
              borderRadius: "1rem",
              py: 1.5,
              px: { xs: 2, md: 3 },
              border: "1px solid transparent",
              "&.Mui-selected": {
                color: "white",
                bgcolor: "rgba(10, 35, 115,0.13)",
                borderColor: "rgba(10, 35, 115,0.25)",
              },
            },
          }}
        >
          <Tab icon={<Share sx={{ mb: 1 }} />} label={t("dashboard.admin.settings.tabs.social")} />
          <Tab icon={<Info sx={{ mb: 1 }} />} label={t("dashboard.admin.settings.tabs.about")} />
          <Tab icon={<Phone sx={{ mb: 1 }} />} label={t("dashboard.admin.settings.tabs.contact")} />
          <Tab icon={<DirectionsCar sx={{ mb: 1 }} />} label={t("dashboard.admin.settings.tabs.home")} />
          <Tab icon={<Business sx={{ mb: 1 }} />} label={t("dashboard.admin.settings.tabs.corporate")} />
        </Tabs>
      </Box>

      <AnimatePresence mode="wait">
        {activeTab === 0 && (
          <motion.div
            key="social"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Paper sx={{ p: 4, borderRadius: "2rem", bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t("dashboard.admin.settings.social.instagram")}
                    value={socials.instagram}
                    onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
                    sx={eliteInputStyle}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Instagram sx={{ color: "var(--primary)" }} /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t("dashboard.admin.settings.social.twitter")}
                    value={socials.twitter}
                    onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
                    sx={eliteInputStyle}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Twitter sx={{ color: "var(--primary)" }} /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t("dashboard.admin.settings.social.facebook")}
                    value={socials.facebook}
                    onChange={(e) => setSocials({ ...socials, facebook: e.target.value })}
                    sx={eliteInputStyle}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Facebook sx={{ color: "var(--primary)" }} /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t("dashboard.admin.settings.social.whatsapp")}
                    value={socials.whatsapp}
                    onChange={(e) => setSocials({ ...socials, whatsapp: e.target.value })}
                    sx={eliteInputStyle}
                    InputProps={{ startAdornment: <InputAdornment position="start"><WhatsApp sx={{ color: "var(--primary)" }} /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t("dashboard.admin.settings.social.tiktok")}
                    value={socials.tiktok}
                    onChange={(e) => setSocials({ ...socials, tiktok: e.target.value })}
                    sx={eliteInputStyle}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SiTiktok sx={{ color: "var(--primary)", fontSize: '1.2rem' }} /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="رابط Linktree"
                    value={socials.linktree}
                    onChange={(e) => setSocials({ ...socials, linktree: e.target.value })}
                    sx={eliteInputStyle}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SiLinktree style={{ color: "var(--primary)", fontSize: '1.2rem' }} /></InputAdornment> }}
                  />
                </Grid>

                {/* QR Code Upload Section */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 4, borderRadius: '1.5rem', bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <QrCode2 sx={{ color: 'var(--primary)', fontSize: 28 }} />
                      <Typography sx={{ color: 'white', fontWeight: '900', fontSize: '1.1rem' }}>
                        QR Code (يظهر في الفوتر)
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center' }}>
                      {/* QR Preview */}
                      {socials.qrCode && (
                        <Box sx={{ 
                          width: 120, height: 120, borderRadius: '1rem', overflow: 'hidden', 
                          border: '2px solid rgba(255,255,255,0.1)', bgcolor: 'white', p: 0.5,
                          flexShrink: 0, position: 'relative'
                        }}>
                          <Image src={socials.qrCode} alt="QR Code" fill style={{ objectFit: 'contain' }} />
                        </Box>
                      )}
                      
                      <Box sx={{ flex: 1, width: '100%' }}>
                        <TextField
                          fullWidth
                          label="رابط صورة QR Code"
                          value={socials.qrCode}
                          onChange={(e) => setSocials({ ...socials, qrCode: e.target.value })}
                          sx={eliteInputStyle}
                          placeholder="الصق رابط الصورة أو ارفع صورة"
                          InputProps={{ 
                            startAdornment: <InputAdornment position="start"><QrCode2 sx={{ color: 'var(--primary)' }} /></InputAdornment>
                          }}
                        />
                        <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Button
                            variant="outlined"
                            component="label"
                            disabled={qrUploading}
                            startIcon={qrUploading ? <CircularProgress size={18} /> : <CloudUpload />}
                            sx={{
                              borderRadius: '1rem', fontWeight: '700', color: 'white',
                              borderColor: 'rgba(255,255,255,0.15)',
                              '&:hover': { borderColor: 'var(--primary)', bgcolor: 'rgba(10, 35, 115,0.05)' },
                              '& .MuiButton-startIcon': { ml: 1, mr: -0.5 }
                            }}
                          >
                            {qrUploading ? 'جاري الرفع...' : 'رفع صورة QR'}
                            <input
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (!file.type.startsWith('image/')) { toast.error('يجب اختيار صورة فقط'); return; }
                                if (file.size > 5 * 1024 * 1024) { toast.error('حجم الصورة أكبر من 5MB'); return; }
                                setQrUploading(true);
                                try {
                                  const formData = new FormData();
                                  formData.append('file', file);
                                  const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                  const result = await res.json();
                                  if (!res.ok) throw new Error(result.error || 'Upload failed');
                                  setSocials(prev => ({ ...prev, qrCode: result.url }));
                                  toast.success('تم رفع صورة QR بنجاح');
                                } catch (err) {
                                  toast.error(err.message || 'فشل رفع الصورة');
                                } finally {
                                  setQrUploading(false);
                                }
                              }}
                            />
                          </Button>
                          {socials.qrCode && (
                            <Button
                              variant="text"
                              color="error"
                              onClick={() => setSocials(prev => ({ ...prev, qrCode: '' }))}
                              sx={{ borderRadius: '1rem', fontWeight: '700', fontSize: '0.85rem' }}
                            >
                              حذف
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={() => handleSave("social_links", socials)}
                    disabled={saveMutation.isPending}
                    sx={{
                      borderRadius: "1rem",
                      py: 1.5,
                      px: 6,
                      fontWeight: "900",
                      background: "linear-gradient(45deg, var(--primary), #071A55)",
                      "& .MuiButton-startIcon": { ml: 1.5, mr: -0.5 } // RTL spacing fix
                    }}
                    startIcon={<Save />}
                  >
                    {saveMutation.isPending && saveMutation.variables?.key === "social_links" 
                      ? t("dashboard.admin.settings.saving") 
                      : t("common.save")}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        )}

        {activeTab === 1 && (
          <motion.div key="about" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <Paper sx={{ p: 4, borderRadius: "2rem", bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label={t("dashboard.admin.settings.about.badge")}
                    value={about.badge}
                    onChange={(e) => setAbout({ ...about, badge: e.target.value })}
                    sx={eliteInputStyle}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label={t("dashboard.admin.settings.about.mainTitlePart1")}
                    value={about.mainTitlePart1}
                    onChange={(e) => setAbout({ ...about, mainTitlePart1: e.target.value })}
                    sx={eliteInputStyle}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label={t("dashboard.admin.settings.about.mainTitlePart2")}
                    value={about.mainTitlePart2}
                    onChange={(e) => setAbout({ ...about, mainTitlePart2: e.target.value })}
                    sx={eliteInputStyle}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label={t("dashboard.admin.settings.about.description")}
                    value={about.description}
                    onChange={(e) => setAbout({ ...about, description: e.target.value })}
                    sx={eliteInputStyle}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t("dashboard.admin.settings.about.storyTitle")}
                    value={about.storyTitle}
                    onChange={(e) => setAbout({ ...about, storyTitle: e.target.value })}
                    sx={eliteInputStyle}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={5}
                    label={t("dashboard.admin.settings.about.storyText")}
                    value={about.storyText}
                    onChange={(e) => setAbout({ ...about, storyText: e.target.value })}
                    sx={eliteInputStyle}
                  />
                </Grid>

                {/* Dynamic Features Manager */}
                <Grid item xs={12}>
                   <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: '900' }}>
                        {t("dashboard.admin.settings.about.featuresTitle")}
                      </Typography>
                      <Button 
                        startIcon={<Add />} 
                        onClick={addFeature}
                        sx={{ color: 'var(--primary)', fontWeight: 'bold' }}
                      >
                        إضافة ميزة
                      </Button>
                   </Box>
                   
                   <Grid container spacing={3}>
                      {about.features.map((feature, index) => (
                        <Grid item xs={12} key={index}>
                           <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                              <Grid container spacing={2} alignItems="center">
                                 <Grid item xs={12} md={3}>
                                    <FormControl fullWidth sx={eliteInputStyle}>
                                       <InputLabel id={`feature-icon-${index}`}>الأيقونة</InputLabel>
                                       <Select
                                          labelId={`feature-icon-${index}`}
                                          value={feature.icon}
                                          label="الأيقونة"
                                          onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                                          startAdornment={<Box sx={{ mr: 1, display: 'flex' }}>{getIconByKey(feature.icon)}</Box>}
                                       >
                                          {iconOptions.map(opt => (
                                            <MenuItem key={opt.key} value={opt.key}>
                                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                {getIconByKey(opt.key)} {opt.label}
                                              </Box>
                                            </MenuItem>
                                          ))}
                                       </Select>
                                    </FormControl>
                                 </Grid>
                                 <Grid item xs={12} md={4}>
                                    <TextField
                                       fullWidth
                                       label="عنوان الميزة"
                                       value={feature.title}
                                       onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                       sx={eliteInputStyle}
                                    />
                                 </Grid>
                                 <Grid item xs={11} md={4}>
                                    <TextField
                                       fullWidth
                                       label="الوصف"
                                       value={feature.description}
                                       onChange={(e) => updateFeature(index, 'description', e.target.value)}
                                       sx={eliteInputStyle}
                                    />
                                 </Grid>
                                 <Grid item xs={1} md={1}>
                                    <IconButton onClick={() => removeFeature(index)} color="error">
                                       <Delete />
                                    </IconButton>
                                 </Grid>
                              </Grid>
                           </Paper>
                        </Grid>
                      ))}
                   </Grid>
                </Grid>

                <Grid item xs={12}>
                   <Button
                    variant="contained"
                    onClick={() => handleSave("about_content", about)}
                    disabled={saveMutation.isPending}
                    sx={{ 
                      borderRadius: "1rem", 
                      py: 1.5, 
                      px: 6, 
                      fontWeight: "900", 
                      background: "linear-gradient(45deg, var(--primary), #071A55)",
                      "& .MuiButton-startIcon": { ml: 1.5, mr: -0.5 } // RTL spacing fix
                    }}
                    startIcon={<Save />}
                  >
                    {saveMutation.isPending && saveMutation.variables?.key === "about_content" 
                      ? t("dashboard.admin.settings.saving") 
                      : t("common.save")}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        )}

        {activeTab === 2 && (
          <motion.div key="contact" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <Paper sx={{ p: 4, borderRadius: "2rem", bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t("dashboard.admin.settings.contact.phone")}
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    sx={eliteInputStyle}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Phone sx={{ color: "var(--primary)" }} /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t("dashboard.admin.settings.contact.whatsapp")}
                    value={contact.whatsapp}
                    onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                    sx={eliteInputStyle}
                    InputProps={{ startAdornment: <InputAdornment position="start"><WhatsApp sx={{ color: "var(--primary)" }} /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t("dashboard.admin.settings.contact.email")}
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    sx={eliteInputStyle}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: "var(--primary)" }} /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t("dashboard.admin.settings.contact.address")}
                    value={contact.address}
                    onChange={(e) => setContact({ ...contact, address: e.target.value })}
                    sx={eliteInputStyle}
                    InputProps={{ startAdornment: <InputAdornment position="start"><LocationOn sx={{ color: "var(--primary)" }} /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12}>
                    <Button
                    variant="contained"
                    onClick={() => handleSave("contact_info", contact)}
                    disabled={saveMutation.isPending}
                    sx={{ 
                      borderRadius: "1rem", 
                      py: 1.5, 
                      px: 6, 
                      fontWeight: "900", 
                      background: "linear-gradient(45deg, var(--primary), #071A55)",
                      "& .MuiButton-startIcon": { ml: 1.5, mr: -0.5 } // RTL spacing fix
                    }}
                    startIcon={<Save />}
                  >
                    {saveMutation.isPending && saveMutation.variables?.key === "contact_info" 
                      ? t("dashboard.admin.settings.saving") 
                      : t("common.save")}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        )}

        {activeTab === 3 && (
          <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-3">
                  <div className="border-b border-white/10 px-3 pb-4 pt-2">
                    <p className="text-sm font-black text-white">إعدادات الرئيسية</p>
                    <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                      انتقل مباشرة للقسم المطلوب وعدل الحقول بدون تعقيد.
                    </p>
                  </div>
                  <nav className="mt-3 grid gap-1">
                    {homeNavItems.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="rounded-2xl border border-transparent px-3 py-3 transition hover:border-primary/25 hover:bg-primary/10"
                      >
                        <span className="block text-sm font-black text-white">{item.label}</span>
                        <span className="mt-1 block text-xs font-bold leading-5 text-slate-500">
                          {item.description}
                        </span>
                      </a>
                    ))}
                  </nav>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSaveHome}
                    disabled={saveMutation.isPending}
                    sx={{
                      mt: 2,
                      borderRadius: "1rem",
                      py: 1.35,
                      fontWeight: "900",
                      background: "linear-gradient(45deg, var(--primary), #071A55)",
                      "& .MuiButton-startIcon": { ml: 1.5, mr: -0.5 },
                    }}
                    startIcon={<Save />}
                  >
                    {saveMutation.isPending && saveMutation.variables?.key === "homepage_content"
                      ? t("dashboard.admin.settings.saving")
                      : t("common.save")}
                  </Button>
                </div>
              </aside>

              <div className="space-y-6">
            <Paper sx={{ p: { xs: 2.5, md: 4 }, borderRadius: "1.5rem", bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography sx={{ color: "white", fontWeight: "900", fontSize: "1.4rem", mb: 1 }}>
                    {t("dashboard.admin.settings.home.title")}
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.55)", fontWeight: "700", mb: 3 }}>
                    {t("dashboard.admin.settings.home.subtitle")}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Paper id="home-visibility" sx={{ ...panelSx, scrollMarginTop: "7rem" }}>
                    <Typography sx={{ color: "white", fontWeight: "900", mb: 2 }}>
                      {t("dashboard.admin.settings.home.visibility")}
                    </Typography>
                    <Grid container spacing={1}>
                      {Object.keys(homeSettings.sections).map((key) => (
                        <Grid item xs={12} sm={6} md={4} key={key}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={Boolean(homeSettings.sections[key])}
                                onChange={(event) => updateHome(["sections", key], event.target.checked)}
                                sx={{
                                  "& .MuiSwitch-switchBase.Mui-checked": { color: "var(--primary)" },
                                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "var(--primary)" },
                                }}
                              />
                            }
                            label={<span className="font-bold text-white">{sectionLabels[key] || key}</span>}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
                </Grid>

                <Grid item xs={12}>
                  <Paper id="home-hero" sx={{ ...panelSx, scrollMarginTop: "7rem" }}>
                    {renderPanelTitle("قسم الهيرو", "الصورة الرئيسية، العنوان، الوصف، وأزرار البداية")}
                    <Grid container spacing={3}>
                      {renderLocalizedHomeFields("عنوان الهيرو بالعربية", "Hero title English", ["hero", "title"])}
                      {renderLocalizedHomeFields("وصف الهيرو بالعربية", "Hero description English", ["hero", "description"], { multiline: true, rows: 5 })}
                      <Grid item xs={12}>{renderHomeField("رابط صورة خلفية الهيرو", ["hero", "backgroundImage"], { link: true })}</Grid>
                      {renderLocalizedHomeFields("نص الزر الأساسي بالعربية", "Primary button English", ["hero", "primaryLabel"])}
                      <Grid item xs={12} md={6}>{renderHomeField("رابط الزر الأساسي", ["hero", "primaryHref"], { link: true })}</Grid>
                      {renderLocalizedHomeFields("نص الزر الثانوي بالعربية", "Secondary button English", ["hero", "secondaryLabel"])}
                      <Grid item xs={12} md={6}>{renderHomeField("رابط الزر الثانوي", ["hero", "secondaryHref"], { link: true })}</Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper id="home-departments" sx={{ ...panelSx, scrollMarginTop: "7rem" }}>
                    {renderPanelTitle("بطاقات الأقسام", "الأفراد، سيارات بسائق، والشركات")}
                    <Grid container spacing={3}>
                      {renderLocalizedHomeFields("عنوان القسم الرئيسي بالعربية", "Main title English", ["departments", "titlePart1"])}
                      {renderLocalizedHomeFields("العنوان المميز بالعربية", "Highlighted title English", ["departments", "titlePart2"])}
                      {(homeSettings.departments.cards || []).map((card, index) => (
                        <Grid item xs={12} key={`department-${index}`}>
                          <Paper sx={{ p: 3, borderRadius: "1.25rem", bgcolor: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <Typography sx={{ color: "var(--primary)", fontWeight: "900" }}>
                                  بطاقة {index + 1}
                                </Typography>
                              </Grid>
                              {renderArrayLocalizedFields("عنوان البطاقة", ["departments", "cards"], index, "title")}
                              {renderArrayLocalizedFields("وصف البطاقة", ["departments", "cards"], index, "description", { multiline: true, rows: 4 })}
                              <Grid item xs={12} md={6}>
                                {renderArrayField("رابط البطاقة", ["departments", "cards"], index, "href", { link: true })}
                              </Grid>
                              <Grid item xs={12} md={6}>
                                {renderArrayField("رابط الصورة", ["departments", "cards"], index, "image", { link: true })}
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper id="home-about" sx={{ ...panelSx, scrollMarginTop: "7rem" }}>
                    {renderPanelTitle("قسم من نحن والمميزات", "النص التعريفي وبطاقات المميزات")}
                    <Grid container spacing={3}>
                      {renderLocalizedHomeFields("العنوان الصغير بالعربية", "Eyebrow English", ["about", "eyebrow"])}
                      {renderLocalizedHomeFields("العنوان بالعربية", "Title English", ["about", "title"])}
                      {renderLocalizedHomeFields("الوصف بالعربية", "Description English", ["about", "text"], { multiline: true, rows: 5 })}
                      <Grid item xs={12}>{renderHomeField("رابط صورة قسم من نحن", ["about", "image"], { link: true })}</Grid>
                      {renderLocalizedHomeFields("النص فوق الصورة بالعربية", "Image note English", ["about", "imageNote"], { multiline: true, rows: 4 })}
                      {(homeSettings.features || []).map((feature, index) => (
                        <Grid item xs={12} key={`home-feature-${index}`}>
                          <Paper sx={{ p: 2.5, borderRadius: "1.25rem", bgcolor: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <Typography sx={{ color: "var(--primary)", fontWeight: "900" }}>ميزة {index + 1}</Typography>
                              </Grid>
                              {renderArrayLocalizedFields("عنوان الميزة", ["features"], index, "title")}
                              {renderArrayLocalizedFields("وصف الميزة", ["features"], index, "text", { multiline: true, rows: 4 })}
                            </Grid>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper id="home-cars" sx={{ ...panelSx, scrollMarginTop: "7rem" }}>
                    {renderPanelTitle("السيارات وسيارات بسائق", "عناوين وروابط أقسام عرض السيارات في الصفحة الرئيسية")}
                    <Grid container spacing={3}>
                      {renderLocalizedHomeFields("عنوان سياراتنا بالعربية", "Cars title English", ["cars", "title"])}
                      {renderLocalizedHomeFields("وصف سياراتنا بالعربية", "Cars text English", ["cars", "text"], { multiline: true, rows: 4 })}
                      <Grid item xs={12} md={6}>{renderHomeField("رابط عرض كل السيارات", ["cars", "href"], { link: true })}</Grid>
                      {renderLocalizedHomeFields("عنوان سيارات بسائق بالعربية", "Driver cars title English", ["driverCars", "title"])}
                      {renderLocalizedHomeFields("وصف سيارات بسائق بالعربية", "Driver cars text English", ["driverCars", "text"], { multiline: true, rows: 4 })}
                      <Grid item xs={12} md={6}>{renderHomeField("رابط سيارات بسائق", ["driverCars", "href"], { link: true })}</Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper id="home-services" sx={{ ...panelSx, scrollMarginTop: "7rem" }}>
                    {renderPanelTitle("قسم الخدمات", "بطاقات الخدمات وروابطها")}
                    <Grid container spacing={3}>
                      {renderLocalizedHomeFields("عنوان الخدمات بالعربية", "Services title English", ["services", "title"])}
                      {renderLocalizedHomeFields("وصف الخدمات بالعربية", "Services text English", ["services", "text"], { multiline: true, rows: 4 })}
                      {(homeSettings.services.items || []).map((service, index) => (
                        <Grid item xs={12} key={`service-${index}`}>
                          <Paper sx={{ p: 3, borderRadius: "1.25rem", bgcolor: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography sx={{ color: "var(--primary)", fontWeight: "900" }}>خدمة {index + 1}</Typography>
                                {(homeSettings.services.items || []).length > 1 && (
                                  <IconButton color="error" onClick={() => removeHomeArrayItem(["services", "items"], index)}><Delete /></IconButton>
                                )}
                              </Grid>
                              {renderArrayLocalizedFields("عنوان الخدمة", ["services", "items"], index, "title")}
                              {renderArrayLocalizedFields("وصف الخدمة", ["services", "items"], index, "text", { multiline: true, rows: 4 })}
                              <Grid item xs={12}>{renderHomeField("رابط الخدمة", ["services", "items", index, "href"], { link: true })}</Grid>
                            </Grid>
                          </Paper>
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Button startIcon={<Add />} onClick={() => addHomeArrayItem(["services", "items"], { title: { ar: "", en: "" }, text: { ar: "", en: "" }, href: "/cars" })} sx={{ color: "var(--primary)", fontWeight: "900" }}>
                          إضافة خدمة
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper id="home-cta" sx={{ ...panelSx, scrollMarginTop: "7rem" }}>
                    {renderPanelTitle("قسم CTA", "البطاقة الكبيرة قبل الأسئلة والتواصل")}
                    <Grid container spacing={3}>
                      {renderLocalizedHomeFields("العنوان الصغير بالعربية", "Eyebrow English", ["cta", "eyebrow"])}
                      {renderLocalizedHomeFields("العنوان بالعربية", "Title English", ["cta", "title"])}
                      {renderLocalizedHomeFields("الوصف بالعربية", "Description English", ["cta", "text"], { multiline: true, rows: 4 })}
                      {renderLocalizedHomeFields("زر أساسي بالعربية", "Primary button English", ["cta", "primaryLabel"])}
                      <Grid item xs={12} md={6}>{renderHomeField("رابط الزر الأساسي", ["cta", "primaryHref"], { link: true })}</Grid>
                      {renderLocalizedHomeFields("زر ثانوي بالعربية", "Secondary button English", ["cta", "secondaryLabel"])}
                      <Grid item xs={12} md={6}>{renderHomeField("رابط الزر الثانوي", ["cta", "secondaryHref"], { link: true })}</Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper id="home-faq" sx={{ ...panelSx, scrollMarginTop: "7rem" }}>
                    {renderPanelTitle("قسم الأسئلة الشائعة", "أعلى 5 أسئلة تظهر في الصفحة الرئيسية")}
                    <Grid container spacing={3}>
                      {renderLocalizedHomeFields("عنوان أول بالعربية", "Title part 1 English", ["faq", "titlePart1"])}
                      {renderLocalizedHomeFields("عنوان ثاني بالعربية", "Title part 2 English", ["faq", "titlePart2"])}
                      {renderLocalizedHomeFields("وصف القسم بالعربية", "Section description English", ["faq", "description"], { multiline: true, rows: 4 })}
                      <Grid item xs={12}>{renderHomeField("رابط صورة FAQ", ["faq", "image"], { link: true })}</Grid>
                      {(homeSettings.faq.items || []).slice(0, 5).map((item, index) => (
                        <Grid item xs={12} key={`faq-${index}`}>
                          <Paper sx={{ p: 3, borderRadius: "1.25rem", bgcolor: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography sx={{ color: "var(--primary)", fontWeight: "900" }}>سؤال {index + 1}</Typography>
                                {(homeSettings.faq.items || []).length > 1 && (
                                  <IconButton color="error" onClick={() => removeHomeArrayItem(["faq", "items"], index)}><Delete /></IconButton>
                                )}
                              </Grid>
                              {renderArrayLocalizedFields("السؤال", ["faq", "items"], index, "question")}
                              {renderArrayLocalizedFields("الإجابة", ["faq", "items"], index, "answer", { multiline: true, rows: 3 })}
                            </Grid>
                          </Paper>
                        </Grid>
                      ))}
                      {(homeSettings.faq.items || []).length < 5 && (
                        <Grid item xs={12}>
                          <Button startIcon={<Add />} onClick={() => addHomeArrayItem(["faq", "items"], { question: { ar: "", en: "" }, answer: { ar: "", en: "" } })} sx={{ color: "var(--primary)", fontWeight: "900" }}>
                            إضافة سؤال
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper id="home-contact" sx={{ ...panelSx, scrollMarginTop: "7rem" }}>
                    {renderPanelTitle("قسم التواصل في الرئيسية", "النص الظاهر فوق كروت التواصل والنموذج")}
                    <Grid container spacing={3}>
                      {renderLocalizedHomeFields("العنوان الصغير بالعربية", "Eyebrow English", ["contact", "eyebrow"])}
                      {renderLocalizedHomeFields("العنوان بالعربية", "Title English", ["contact", "title"])}
                      {renderLocalizedHomeFields("الوصف بالعربية", "Description English", ["contact", "text"], { multiline: true, rows: 4 })}
                      {renderLocalizedHomeFields("نطاق التغطية بالعربية", "Coverage English", ["contact", "coverage"])}
                      {renderLocalizedHomeFields("زر الإرسال بالعربية", "Submit button English", ["contact", "submit"])}
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={handleSaveHome}
                    disabled={saveMutation.isPending}
                    sx={{
                      borderRadius: "1rem",
                      py: 1.5,
                      px: 6,
                      fontWeight: "900",
                      background: "linear-gradient(45deg, var(--primary), #071A55)",
                      "& .MuiButton-startIcon": { ml: 1.5, mr: -0.5 },
                    }}
                    startIcon={<Save />}
                  >
                    {saveMutation.isPending && saveMutation.variables?.key === "homepage_content"
                      ? t("dashboard.admin.settings.saving")
                      : t("common.save")}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 4 && (
          <motion.div key="corporate-page" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-3">
                  <div className="border-b border-white/10 px-3 pb-4 pt-2">
                    <p className="text-sm font-black text-white">إعدادات صفحة الشركات</p>
                    <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                      كل محتوى صفحة الشركات قابل للتعديل من هنا بدون JSON.
                    </p>
                  </div>
                  <nav className="mt-3 grid gap-1">
                    {corporateNavItems.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="rounded-2xl border border-transparent px-3 py-3 transition hover:border-primary/25 hover:bg-primary/10"
                      >
                        <span className="block text-sm font-black text-white">{item.label}</span>
                        <span className="mt-1 block text-xs font-bold leading-5 text-slate-500">
                          {item.description}
                        </span>
                      </a>
                    ))}
                  </nav>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSaveHome}
                    disabled={saveMutation.isPending}
                    sx={{
                      mt: 2,
                      borderRadius: "1rem",
                      py: 1.35,
                      fontWeight: "900",
                      background: "linear-gradient(45deg, var(--primary), #071A55)",
                      "& .MuiButton-startIcon": { ml: 1.5, mr: -0.5 },
                    }}
                    startIcon={<Save />}
                  >
                    {saveMutation.isPending && saveMutation.variables?.key === "homepage_content"
                      ? t("dashboard.admin.settings.saving")
                      : t("common.save")}
                  </Button>
                </div>
              </aside>

              <div className="space-y-6">
                <Paper sx={{ p: { xs: 2.5, md: 4 }, borderRadius: "1.5rem", bgcolor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <Typography sx={{ color: "white", fontWeight: "900", fontSize: "1.4rem", mb: 1 }}>
                        إعدادات صفحة الشركات
                      </Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.55)", fontWeight: "700" }}>
                        عدّل نصوص صفحة الشركات، أقسامها، الأسئلة، ودعوة طلب العرض من تبويب مستقل بجانب الصفحة الرئيسية.
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Paper id="corporate-hero" sx={{ ...panelSx, scrollMarginTop: "7rem" }}>
                        {renderPanelTitle("قسم الهيرو", "الخلفية، الشارة، العنوان، الوصف، وزر طلب العرض")}
                        <Grid container spacing={3}>
                          <Grid item xs={12}>{renderHomeField("رابط صورة خلفية الهيرو", ["corporatePage", "hero", "backgroundImage"], { link: true })}</Grid>
                          {renderLocalizedHomeFields("الشارة بالعربية", "Badge English", ["corporatePage", "hero", "badge"])}
                          {renderLocalizedHomeFields("عنوان الهيرو بالعربية", "Hero title English", ["corporatePage", "hero", "title"], { multiline: true, rows: 4 })}
                          {renderLocalizedHomeFields("النص المميز بالعربية", "Highlighted text English", ["corporatePage", "hero", "highlight"])}
                          {renderLocalizedHomeFields("وصف الهيرو بالعربية", "Hero description English", ["corporatePage", "hero", "description"], { multiline: true, rows: 5 })}
                          {renderLocalizedHomeFields("نص زر طلب العرض بالعربية", "Offer button English", ["corporatePage", "hero", "primaryLabel"])}
                          <Grid item xs={12} md={6}>{renderHomeField("رابط زر طلب العرض", ["corporatePage", "hero", "primaryHref"], { link: true })}</Grid>
                        </Grid>
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Paper id="corporate-features" sx={{ ...panelSx, scrollMarginTop: "7rem" }}>
                        {renderPanelTitle("قسم المميزات", "العنوان وبطاقات الأسباب التي تقنع الشركات بالخدمة")}
                        <Grid container spacing={3}>
                          {renderLocalizedHomeFields("العنوان الصغير بالعربية", "Eyebrow English", ["corporatePage", "features", "eyebrow"])}
                          {renderLocalizedHomeFields("عنوان القسم بالعربية", "Section title English", ["corporatePage", "features", "title"], { multiline: true, rows: 4 })}
                          {(homeSettings.corporatePage.features.items || []).map((item, index) => (
                            <Grid item xs={12} key={`corporate-feature-${index}`}>
                              <Paper sx={{ p: 3, borderRadius: "1.25rem", bgcolor: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Typography sx={{ color: "var(--primary)", fontWeight: "900" }}>ميزة {index + 1}</Typography>
                                    {(homeSettings.corporatePage.features.items || []).length > 1 && (
                                      <IconButton color="error" onClick={() => removeHomeArrayItem(["corporatePage", "features", "items"], index)}><Delete /></IconButton>
                                    )}
                                  </Grid>
                                  {renderArrayLocalizedFields("عنوان الميزة", ["corporatePage", "features", "items"], index, "title")}
                                  {renderArrayLocalizedFields("وصف الميزة", ["corporatePage", "features", "items"], index, "text", { multiline: true, rows: 4 })}
                                </Grid>
                              </Paper>
                            </Grid>
                          ))}
                          <Grid item xs={12}>
                            <Button startIcon={<Add />} onClick={() => addHomeArrayItem(["corporatePage", "features", "items"], { title: { ar: "", en: "" }, text: { ar: "", en: "" } })} sx={{ color: "var(--primary)", fontWeight: "900" }}>
                              إضافة ميزة
                            </Button>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Paper id="corporate-services" sx={{ ...panelSx, scrollMarginTop: "7rem" }}>
                        {renderPanelTitle("قسم خدمات الشركات", "بطاقات الخدمات التي تظهر في الصفحة")}
                        <Grid container spacing={3}>
                          {renderLocalizedHomeFields("العنوان الصغير بالعربية", "Eyebrow English", ["corporatePage", "services", "eyebrow"])}
                          {renderLocalizedHomeFields("عنوان الخدمات بالعربية", "Services title English", ["corporatePage", "services", "title"], { multiline: true, rows: 4 })}
                          {renderLocalizedHomeFields("وصف الخدمات بالعربية", "Services text English", ["corporatePage", "services", "text"], { multiline: true, rows: 4 })}
                          {(homeSettings.corporatePage.services.items || []).map((service, index) => (
                            <Grid item xs={12} key={`corporate-service-${index}`}>
                              <Paper sx={{ p: 3, borderRadius: "1.25rem", bgcolor: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Typography sx={{ color: "var(--primary)", fontWeight: "900" }}>خدمة {index + 1}</Typography>
                                    {(homeSettings.corporatePage.services.items || []).length > 1 && (
                                      <IconButton color="error" onClick={() => removeHomeArrayItem(["corporatePage", "services", "items"], index)}><Delete /></IconButton>
                                    )}
                                  </Grid>
                                  {renderArrayLocalizedFields("عنوان الخدمة", ["corporatePage", "services", "items"], index, "title")}
                                  {renderArrayLocalizedFields("وصف الخدمة", ["corporatePage", "services", "items"], index, "text", { multiline: true, rows: 4 })}
                                </Grid>
                              </Paper>
                            </Grid>
                          ))}
                          <Grid item xs={12}>
                            <Button startIcon={<Add />} onClick={() => addHomeArrayItem(["corporatePage", "services", "items"], { title: { ar: "", en: "" }, text: { ar: "", en: "" } })} sx={{ color: "var(--primary)", fontWeight: "900" }}>
                              إضافة خدمة
                            </Button>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Paper id="corporate-cta" sx={{ ...panelSx, scrollMarginTop: "7rem" }}>
                        {renderPanelTitle("قسم CTA", "دعوة واضحة قبل خطوات العمل")}
                        <Grid container spacing={3}>
                          {renderLocalizedHomeFields("العنوان الصغير بالعربية", "Eyebrow English", ["corporatePage", "cta", "eyebrow"])}
                          {renderLocalizedHomeFields("العنوان بالعربية", "Title English", ["corporatePage", "cta", "title"], { multiline: true, rows: 4 })}
                          {renderLocalizedHomeFields("الوصف بالعربية", "Text English", ["corporatePage", "cta", "text"], { multiline: true, rows: 4 })}
                          {renderLocalizedHomeFields("نص الزر بالعربية", "Button English", ["corporatePage", "cta", "action"])}
                        </Grid>
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Paper id="corporate-steps" sx={{ ...panelSx, scrollMarginTop: "7rem" }}>
                        {renderPanelTitle("قسم طريقة العمل", "العنوان والوصف وخطوات الحصول على عرض")}
                        <Grid container spacing={3}>
                          {renderLocalizedHomeFields("العنوان الصغير بالعربية", "Eyebrow English", ["corporatePage", "steps", "eyebrow"])}
                          {renderLocalizedHomeFields("عنوان القسم بالعربية", "Section title English", ["corporatePage", "steps", "title"], { multiline: true, rows: 4 })}
                          {renderLocalizedHomeFields("وصف القسم بالعربية", "Section text English", ["corporatePage", "steps", "text"], { multiline: true, rows: 4 })}
                          {(homeSettings.corporatePage.steps.items || []).map((step, index) => (
                            <Grid item xs={12} key={`corporate-step-${index}`}>
                              <Paper sx={{ p: 3, borderRadius: "1.25rem", bgcolor: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Typography sx={{ color: "var(--primary)", fontWeight: "900" }}>خطوة {index + 1}</Typography>
                                    {(homeSettings.corporatePage.steps.items || []).length > 1 && (
                                      <IconButton color="error" onClick={() => removeHomeArrayItem(["corporatePage", "steps", "items"], index)}><Delete /></IconButton>
                                    )}
                                  </Grid>
                                  {renderArrayLocalizedFields("نص الخطوة", ["corporatePage", "steps", "items"], index, "text", { multiline: true, rows: 3 })}
                                </Grid>
                              </Paper>
                            </Grid>
                          ))}
                          <Grid item xs={12}>
                            <Button startIcon={<Add />} onClick={() => addHomeArrayItem(["corporatePage", "steps", "items"], { text: { ar: "", en: "" } })} sx={{ color: "var(--primary)", fontWeight: "900" }}>
                              إضافة خطوة
                            </Button>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Paper id="corporate-faq" sx={{ ...panelSx, scrollMarginTop: "7rem" }}>
                        {renderPanelTitle("قسم الأسئلة الشائعة", "أسئلة واعتراضات الشركات قبل طلب العرض")}
                        <Grid container spacing={3}>
                          {renderLocalizedHomeFields("العنوان الصغير بالعربية", "Eyebrow English", ["corporatePage", "faq", "eyebrow"])}
                          {renderLocalizedHomeFields("عنوان القسم بالعربية", "Section title English", ["corporatePage", "faq", "title"])}
                          {(homeSettings.corporatePage.faq.items || []).map((item, index) => (
                            <Grid item xs={12} key={`corporate-faq-${index}`}>
                              <Paper sx={{ p: 3, borderRadius: "1.25rem", bgcolor: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Typography sx={{ color: "var(--primary)", fontWeight: "900" }}>سؤال {index + 1}</Typography>
                                    {(homeSettings.corporatePage.faq.items || []).length > 1 && (
                                      <IconButton color="error" onClick={() => removeHomeArrayItem(["corporatePage", "faq", "items"], index)}><Delete /></IconButton>
                                    )}
                                  </Grid>
                                  {renderArrayLocalizedFields("السؤال", ["corporatePage", "faq", "items"], index, "question")}
                                  {renderArrayLocalizedFields("الإجابة", ["corporatePage", "faq", "items"], index, "answer", { multiline: true, rows: 4 })}
                                </Grid>
                              </Paper>
                            </Grid>
                          ))}
                          <Grid item xs={12}>
                            <Button startIcon={<Add />} onClick={() => addHomeArrayItem(["corporatePage", "faq", "items"], { question: { ar: "", en: "" }, answer: { ar: "", en: "" } })} sx={{ color: "var(--primary)", fontWeight: "900" }}>
                              إضافة سؤال
                            </Button>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Paper id="corporate-form" sx={{ ...panelSx, scrollMarginTop: "7rem" }}>
                        {renderPanelTitle("قسم نموذج طلب العرض", "النصوص التي تظهر قبل النموذج وزر الإرسال")}
                        <Grid container spacing={3}>
                          {renderLocalizedHomeFields("العنوان الصغير بالعربية", "Eyebrow English", ["corporatePage", "form", "eyebrow"])}
                          {renderLocalizedHomeFields("عنوان النموذج بالعربية", "Form title English", ["corporatePage", "form", "title"], { multiline: true, rows: 4 })}
                          {renderLocalizedHomeFields("وصف النموذج بالعربية", "Form text English", ["corporatePage", "form", "text"], { multiline: true, rows: 4 })}
                          {renderLocalizedHomeFields("Placeholder الرسالة بالعربية", "Message placeholder English", ["corporatePage", "form", "placeholder"], { multiline: true, rows: 3 })}
                          {renderLocalizedHomeFields("نص الإرسال إلى بالعربية", "Send to label English", ["corporatePage", "form", "sendTo"])}
                          {renderLocalizedHomeFields("نص زر الإرسال بالعربية", "Submit button English", ["corporatePage", "form", "submit"])}
                        </Grid>
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        onClick={handleSaveHome}
                        disabled={saveMutation.isPending}
                        sx={{
                          borderRadius: "1rem",
                          py: 1.5,
                          px: 6,
                          fontWeight: "900",
                          background: "linear-gradient(45deg, var(--primary), #071A55)",
                          "& .MuiButton-startIcon": { ml: 1.5, mr: -0.5 },
                        }}
                        startIcon={<Save />}
                      >
                        {saveMutation.isPending && saveMutation.variables?.key === "homepage_content"
                          ? t("dashboard.admin.settings.saving")
                          : t("common.save")}
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
