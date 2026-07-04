"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import api, {
  bookingService,
  carService,
  reviewService,
  userService,
  authService,
  notificationService,
  promoService,
} from "@/services/api";
import {
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Box,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Rating,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  EventNote,
  DirectionsCar,
  Check,
  CheckCircle,
  Close,
  Delete,
  Add,
  AttachMoney,
  Description as DescIcon,
  Phone,
  Person,
  Speed,
  WhatsApp,
  Star,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Settings as SettingsIcon,
  Edit,
  Notifications,
  Error as ErrorIcon,
  Info as InfoIcon,
  Article,
  UploadFile,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import Image from "next/image";
import dynamic from "next/dynamic";

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <CircularProgress size={20} />,
});
import "react-quill/dist/quill.snow.css";

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other} className="py-6">
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const AdminTabsContent = ({ user }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, i18n } = useTranslation("common");

  // Tabs mapping: bookings=0, cars=1, reviews=2, profile=3, password=4
  const tabParam = searchParams.get("tab");
  const getTabIndex = (tab) => {
    if (tab === "notifications") return 1;
    if (tab === "blog") return 2;
    if (tab === "users") return 3;
    if (tab === "cars") return 4;
    if (tab === "reviews") return 5;
    if (tab === "profile") return 6;
    if (tab === "password") return 7;
    if (tab === "promos") return 8;
    return 0; // default: bookings
  };

  const value = getTabIndex(tabParam);

  const handleChange = (event, newValue) => {
    if (newValue === 2) {
      router.push(`/dashboard/admin/blogs`);
      return;
    }
    const tabName =
      newValue === 1
        ? "notifications"
        : newValue === 2
          ? "blog"
          : newValue === 3
            ? "users"
            : newValue === 4
              ? "cars"
              : newValue === 5
                ? "reviews"
                : newValue === 6
                  ? "profile"
                  : newValue === 7
                    ? "password"
                    : newValue === 8
                      ? "promos"
                      : "bookings";

    router.push(`/dashboard/admin?tab=${tabName}`);
  };

  const handlePromosRedirect = () => {
    router.push(`/dashboard/admin?tab=promos`);
  };

  return (
    <div className="min-h-[520px] rounded-3xl border border-white/10 bg-white/[0.025] p-3 sm:p-5 lg:p-6">
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="admin dashboard tabs"
        variant="fullWidth"
        orientation="vertical"
        sx={{
          display: "none",
          "& .MuiTabs-flexContainer": {
            flexDirection: { xs: "column", sm: "row" },
          },
          "& .MuiTab-root": {
            fontSize: { xs: "0.75rem", md: "1.1rem" },
            fontWeight: "900",
            fontFamily: "inherit",
            color: "rgba(255,255,255,0.4)",
            minHeight: { xs: "48px", md: "70px" },
            px: { xs: 2, md: 4 },
            transition: "all 0.3s ease",
            alignItems: { xs: "flex-start", sm: "center" },
            textAlign: "right",
            justifyContent: "flex-start",
            borderBottom: {
              xs: "1px solid rgba(255,255,255,0.05)",
              sm: "none",
            },
            "&:hover": { color: "white" },
          },
          "& .Mui-selected": {
            color: "#0A2373 !important",
            bgcolor: { xs: "rgba(10, 35, 115,0.05)", sm: "transparent" },
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#0A2373",
            height: { xs: "100%", sm: "4px" },
            width: { xs: "4px", sm: "auto" },
            borderRadius: "4px",
            // Correct indicator position for RTL/Vertical
            left: { xs: 0, sm: "auto" },
            right: { xs: "auto", sm: "auto" },
            boxShadow: "0 0 15px rgba(10, 35, 115,0.5)",
          },
          borderBottom: { xs: "none", sm: "1px solid rgba(255,255,255,0.05)" },
          mb: { xs: 1, md: 4 },
        }}
      >
        <Tab
          icon={<EventNote sx={{ fontSize: { xs: 18, sm: 24 } }} />}
          iconPosition="start"
          label={t("dashboard.admin.tabs.bookings")}
        />
        <Tab
          icon={<Notifications sx={{ fontSize: { xs: 18, sm: 24 } }} />}
          iconPosition="start"
          label={t("dashboard.admin.tabs.notifications")}
        />
        <Tab
          icon={<Article sx={{ fontSize: { xs: 18, sm: 24 } }} />}
          iconPosition="start"
          label={t("dashboard.admin.tabs.blog")}
        />
        <Tab
          icon={<Person sx={{ fontSize: { xs: 18, sm: 24 } }} />}
          iconPosition="start"
          label={t("dashboard.admin.tabs.users", "المستخدمين")}
        />
        <Tab
          icon={<DirectionsCar sx={{ fontSize: { xs: 18, sm: 24 } }} />}
          iconPosition="start"
          label={t("dashboard.admin.tabs.cars")}
        />
        <Tab
          icon={<Star sx={{ fontSize: { xs: 18, sm: 24 } }} />}
          iconPosition="start"
          label={t("dashboard.admin.tabs.reviews")}
        />
        <Tab
          icon={<Person sx={{ fontSize: { xs: 18, sm: 24 } }} />}
          iconPosition="start"
          label={t("dashboard.admin.tabs.profile")}
        />
        <Tab
          icon={<Lock sx={{ fontSize: { xs: 18, sm: 24 } }} />}
          iconPosition="start"
          label={t("dashboard.admin.tabs.security")}
        />
        <Tab
          icon={<SettingsIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />}
          iconPosition="start"
          label={t("dashboard.admin.tabs.promos", "العروض والبنرات")}
        />
      </Tabs>

      <TabPanel value={value} index={0}>
        <ManageBookings />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ManageNotifications />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Box className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
          <Article
            sx={{ fontSize: 80, color: "rgba(255,255,255,0.05)", mb: 4 }}
          />
          <Typography className="text-2xl font-black text-slate-400 mb-6">
            جاري الانتقال لصفحة الإدارة المتطورة...
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push("/dashboard/admin/blogs")}
            sx={{ borderRadius: "1.5rem", fontWeight: "900", px: 6, py: 2 }}
          >
            فتح إدارة المدونة (Elite)
          </Button>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ManageUsers />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <ManageCars />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <ManageReviews />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <ProfileSection user={user} />
      </TabPanel>
      <TabPanel value={value} index={7}>
        <ChangePasswordSection />
      </TabPanel>
      <TabPanel value={value} index={8}>
        <ManagePromos />
      </TabPanel>
    </div>
  );
};

function AdminStatsSection() {
  const { i18n } = useTranslation("common");

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const [usersResponse, adminStatsResponse] = await Promise.all([
        userService.getAll({ limit: 1 }).catch(() => null),
        api
          .get("/admin/stats")
          .then((response) => response.data)
          .catch(() => null),
      ]);

      return {
        totalUsers:
          usersResponse?.data?.pagination?.total ??
          usersResponse?.data?.users?.length ??
          0,
        totalBookings: adminStatsResponse?.data?.totalBookings ?? 0,
        totalCars: adminStatsResponse?.data?.totalCars ?? 0,
        availableCars: adminStatsResponse?.data?.availableCars ?? 0,
        totalBlogs: adminStatsResponse?.data?.totalBlogs ?? 0,
      };
    },
  });

  const stats = [
    {
      label: i18n.language === "ar" ? "إجمالي المستخدمين" : "Total Users",
      value: statsData?.totalUsers ?? 0,
      icon: <Person sx={{ fontSize: 26 }} />,
      loading: statsLoading,
    },
    {
      label: i18n.language === "ar" ? "إجمالي الحجوزات" : "Total Bookings",
      value: statsData?.totalBookings ?? 0,
      icon: <EventNote sx={{ fontSize: 26 }} />,
      loading: statsLoading,
    },
    {
      label: i18n.language === "ar" ? "إجمالي المقالات" : "Blog Articles",
      value: statsData?.totalBlogs ?? 0,
      icon: <Article sx={{ fontSize: 26 }} />,
      loading: statsLoading,
    },
    {
      label: i18n.language === "ar" ? "السيارات المتاحة" : "Available Cars",
      value: statsData?.availableCars ?? 0,
      icon: <CheckCircle sx={{ fontSize: 26 }} />,
      loading: statsLoading,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {(Array.isArray(stats) ? stats : []).map((stat) => (
        <div
          key={stat.label}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl sm:rounded-2xl md:rounded-[2rem] p-4 sm:p-5 md:p-6 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20" />
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                {stat.label}
              </p>
              <div className="mt-3 text-2xl sm:text-3xl font-black text-white tracking-tighter">
                {stat.loading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  stat.value
                )}
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, i18n } = useTranslation("common");

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/auth/login?returnUrl=/dashboard/admin");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/dashboard/user");
      return;
    }

    if (searchParams.get("blocked") === "booking") {
      toast.info(t("booking.adminCannotBook"));

      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.delete("blocked");

      const nextUrl = nextParams.toString()
        ? `/dashboard/admin?${nextParams.toString()}`
        : "/dashboard/admin";

      router.replace(nextUrl);
    }
  }, [user, loading, router, searchParams, t]);

  if (loading) {
    return <CircularProgress className="m-auto block" />;
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="space-y-4 md:space-y-6" dir={i18n.dir()}>
      <div className="bg-white/5 backdrop-blur-2xl p-3 sm:p-6 md:p-10 rounded-xl sm:rounded-2xl md:rounded-[3rem] border border-white/10 relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-1 md:mb-2 tracking-tighter">
          {t("dashboard.admin.welcome.title")}{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
            {t("dashboard.admin.welcome.badge")}
          </span>
        </h1>
        <p className="text-slate-400 font-bold text-xs sm:text-base lg:text-lg">
          {t("dashboard.admin.welcome.subtitle", { name: user?.name })}
        </p>
      </div>

      <AdminStatsSection />

      <Suspense fallback={<CircularProgress className="m-auto block" />}>
        <AdminTabsContent user={user} />
      </Suspense>
    </div>
  );
}
function JumpToPagePagination({ totalPages, currentPage, onPageChange }) {
  const { i18n } = useTranslation("common");
  const [inputPage, setInputPage] = useState(currentPage);

  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  const handleJump = (e) => {
    e.preventDefault();
    const pageNum = parseInt(inputPage);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
    } else {
      setInputPage(currentPage);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
      <div className="flex items-center gap-2">
        <Button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          sx={{
            minWidth: 40,
            height: 40,
            borderRadius: "10px",
            color: "white",
          }}
        >
          {i18n?.language === "ar" ? "السابق" : "Prev"}
        </Button>
        <div className="flex gap-1">
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            let page;
            if (totalPages <= 5) page = i + 1;
            else if (currentPage <= 3) page = i + 1;
            else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
            else page = currentPage - 2 + i;

            return (
              <Button
                key={page}
                onClick={() => onPageChange(page)}
                sx={{
                  minWidth: 40,
                  height: 40,
                  borderRadius: "10px",
                  bgcolor:
                    currentPage === page ? "primary.main" : "transparent",
                  color: "white",
                  "&:hover": {
                    bgcolor:
                      currentPage === page
                        ? "primary.dark"
                        : "rgba(255,255,255,0.1)",
                  },
                }}
              >
                {page}
              </Button>
            );
          })}
        </div>
        <Button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          sx={{
            minWidth: 40,
            height: 40,
            borderRadius: "10px",
            color: "white",
          }}
        >
          {i18n?.language === "ar" ? "التالي" : "Next"}
        </Button>
      </div>

      <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />

      <form onSubmit={handleJump} className="flex items-center gap-2">
        <Typography
          sx={{ color: "slate.400", fontSize: "0.875rem", fontWeight: "bold" }}
        >
          {i18n?.language === "ar" ? "انتقال لصفحة:" : "Jump to:"}
        </Typography>
        <TextField
          size="small"
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          sx={{
            width: 60,
            "& .MuiInputBase-input": {
              color: "white",
              textAlign: "center",
              fontWeight: "black",
              py: 0.5,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.2)",
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          size="small"
          sx={{ borderRadius: "8px", fontWeight: "bold" }}
        >
          OK
        </Button>
        <Typography sx={{ color: "slate.400", fontSize: "0.875rem" }}>
          / {totalPages}
        </Typography>
      </form>
    </div>
  );
}

function ManageUsers() {
  const { t, i18n } = useTranslation("common");
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: usersData, isLoading } = useQuery({
    queryKey: ["allUsers", page],
    queryFn: () => userService.getAll({ page, limit }),
  });

  const [editingUser, setEditingUser] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => userService.update(id, data),
    onSuccess: () => {
      toast.success(
        t("dashboard.admin.users.updateSuccess", "تم تحديث المستخدم بنجاح"),
      );
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      setIsEditDialogOpen(false);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Error updating user"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => userService.delete(id),
    onSuccess: () => {
      toast.success(
        t("dashboard.admin.users.deleteSuccess", "تم إلغاء تفعيل المستخدم"),
      );
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Error deleting user"),
  });

  const handleToggleStatus = (user) => {
    if (!user?._id) return;
    updateMutation.mutate({
      id: user._id,
      data: { isActive: !user.isActive },
    });
  };

  const handleEditClick = (user) => {
    setEditingUser({ ...user });
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (!editingUser?._id) return;
    updateMutation.mutate({
      id: editingUser._id,
      data: {
        name: editingUser.name,
        email: editingUser.email,
        phoneNumber: editingUser.phoneNumber,
        role: editingUser.role,
      },
    });
  };

  if (isLoading) return <CircularProgress className="m-auto block" />;

  const users = usersData?.data?.users || [];
  const pagination = usersData?.data?.pagination || { totalPages: 1 };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white/5 p-6 rounded-[2rem] border border-white/10">
        <div>
          <h2 className="text-2xl font-black text-white">
            {t("dashboard.admin.tabs.users")}
          </h2>
          <p className="text-slate-400 font-bold">
            {t("dashboard.admin.users.total", "إجمالي المستخدمين المسجلين")}:{" "}
            {pagination.total || users.length}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white/5 rounded-[2rem] border border-white/10 shadow-2xl">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-6 font-black text-slate-500 uppercase text-xs tracking-widest">
                {t("dashboard.admin.users.name", "الاسم")}
              </th>
              <th className="p-6 font-black text-slate-500 uppercase text-xs tracking-widest">
                Email
              </th>
              <th className="p-6 font-black text-slate-500 uppercase text-xs tracking-widest">
                {t("dashboard.admin.users.role", "الدور")}
              </th>
              <th className="p-6 font-black text-slate-500 uppercase text-xs tracking-widest">
                {t("dashboard.admin.users.status", "الحالة")}
              </th>
              <th className="p-6 font-black text-slate-500 uppercase text-xs tracking-widest">
                {t("dashboard.admin.users.actions", "الإجراءات")}
              </th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(users) ? users : [])
              .filter((u) => u != null)
              .map((u, idx) => (
                <tr
                  key={u?._id || idx}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <Avatar
                        sx={{ bgcolor: "primary.main", fontWeight: "900" }}
                      >
                        {u.name?.charAt(0)}
                      </Avatar>
                      <span className="font-bold text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-6 text-slate-300 font-medium">{u.email}</td>
                  <td className="p-6">
                    <Chip
                      label={u.role}
                      size="small"
                      sx={{
                        fontWeight: "900",
                        bgcolor:
                          u.role === "admin"
                            ? "rgba(10, 35, 115,0.1)"
                            : "rgba(255,255,255,0.05)",
                        color: u.role === "admin" ? "primary.main" : "white",
                        border: "1px solid currentColor",
                      }}
                    />
                  </td>
                  <td className="p-6">
                    <Chip
                      label={u.isActive !== false ? "Active" : "Inactive"}
                      size="small"
                      sx={{
                        fontWeight: "900",
                        bgcolor:
                          u.isActive !== false
                            ? "rgba(34,197,94,0.1)"
                            : "rgba(220,38,38,0.1)",
                        color: u.isActive !== false ? "#4ade80" : "#f87171",
                      }}
                    />
                  </td>
                  <td className="p-6">
                    <div className="flex gap-2">
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(u)}
                        sx={{ color: "white", bgcolor: "white/5" }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color={u.isActive !== false ? "error" : "success"}
                        onClick={() => handleToggleStatus(u)}
                        sx={{
                          bgcolor:
                            u.isActive !== false
                              ? "rgba(220,38,38,0.1)"
                              : "rgba(34,197,94,0.1)",
                        }}
                      >
                        {u.isActive !== false ? <Close /> : <Check />}
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <JumpToPagePagination
        totalPages={pagination.totalPages}
        currentPage={page}
        onPageChange={setPage}
      />

      {/* Edit User Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: "#0f172a",
            backgroundImage: "none",
            borderRadius: "2rem",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "900", fontSize: "1.5rem" }}>
          {t("dashboard.admin.users.editTitle", "تعديل المستخدم")}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <TextField
              fullWidth
              label="Name"
              value={editingUser?.name || ""}
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
              InputLabelProps={{ style: { color: "#94a3b8" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                },
              }}
            />
            <TextField
              fullWidth
              label="Email"
              value={editingUser?.email || ""}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
              InputLabelProps={{ style: { color: "#94a3b8" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                },
              }}
            />
            <TextField
              fullWidth
              label={i18n.language === "ar" ? "رقم الهاتف" : "Phone Number"}
              value={editingUser?.phoneNumber || ""}
              onChange={(e) =>
                setEditingUser({ ...editingUser, phoneNumber: e.target.value })
              }
              InputLabelProps={{ style: { color: "#94a3b8" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                },
              }}
            />
            <FormControl
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                },
              }}
            >
              <InputLabel sx={{ color: "#94a3b8" }}>Role</InputLabel>
              <Select
                value={editingUser?.role || "user"}
                label="Role"
                onChange={(e) =>
                  setEditingUser({ ...editingUser, role: e.target.value })
                }
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setIsEditDialogOpen(false)}
            sx={{ color: "slate.400", fontWeight: "bold" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateUser}
            sx={{ borderRadius: "1rem", fontWeight: "900" }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function ManageBookings() {
  const { t, i18n } = useTranslation("common");
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ["allBookings", page],
    queryFn: () => bookingService.getAll({ page, limit }),
  });

  const [deleteId, setDeleteId] = useState(null);

  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const createReviewMutation = useMutation({
    mutationFn: reviewService.create,
    onSuccess: () => {
      toast.success(t("dashboard.user.reviews.success", "تم التقييم بنجاح!"));
      setReviewOpen(false);
      setComment("");
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ["allBookings"] });
      queryClient.invalidateQueries({ queryKey: ["recentReviews"] });
    },
    onError: (err) => {
      // Localize the "already reviewed" error or fallback to general error
      const msg = err.response?.data?.message;
      if (msg === "You have already reviewed this booking") {
        toast.error(
          t(
            "dashboard.user.reviews.alreadyReviewed",
            "لقد قمت بتقييم هذا الحجز مسبقاً",
          ),
        );
      } else {
        toast.error(t("dashboard.user.reviews.error", "حدث خطأ أثناء التقييم"));
      }
    },
  });

  const handleOpenReview = (booking) => {
    setSelectedBooking(booking);
    setReviewOpen(true);
  };

  const handleSubmitReview = () => {
    if (!selectedBooking) return;
    if (!comment.trim()) {
      toast.warning(
        t(
          "dashboard.user.reviews.emptyCommentError",
          "الرجاء كتابة تعليق مع التقييم",
        ),
      );
      return;
    }
    createReviewMutation.mutate({
      carId: selectedBooking.car._id,
      bookingId: selectedBooking._id,
      rating,
      comment,
    });
  };

  const approveMutation = useMutation({
    mutationFn: bookingService.approve,
    onSuccess: () => {
      toast.success(t("dashboard.admin.bookings.approveSuccess"));
      queryClient.invalidateQueries({ queryKey: ["allBookings"] });
    },
    onError: (err) =>
      toast.error(
        err.response?.data?.message ||
          t("dashboard.admin.bookings.approveError"),
      ),
  });

  const rejectMutation = useMutation({
    mutationFn: bookingService.reject,
    onSuccess: () => {
      toast.success(t("dashboard.admin.bookings.rejectSuccess"));
      queryClient.invalidateQueries({ queryKey: ["allBookings"] });
    },
    onError: (err) =>
      toast.error(
        err.response?.data?.message ||
          t("dashboard.admin.bookings.rejectError"),
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: bookingService.delete,
    onSuccess: () => {
      toast.success(t("dashboard.admin.bookings.deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: ["allBookings"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      setDeleteId(null);
    },
    onError: () => toast.error(t("dashboard.admin.bookings.deleteError")),
  });

  if (isLoading) return <CircularProgress className="m-auto block" />;

  const bookings = data?.data?.bookings || [];

  if (bookings.length === 0) {
    return (
      <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <EventNote sx={{ fontSize: 48, color: "rgba(255,255,255,0.2)" }} />
        </div>
        <p className="text-xl font-black text-slate-500">
          {t("dashboard.admin.bookings.empty")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="grid grid-cols-1 gap-8">
        {(Array.isArray(bookings) ? bookings : [])
          .filter((b) => b != null)
          .map((booking, idx) => (
            <div
              key={booking?._id || idx}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-3xl p-3 sm:p-8 lg:p-10 shadow-2xl hover:bg-white/10 transition-all duration-500 relative overflow-hidden group"
            >
              {/* Status Strip Mobile */}
              <div
                className={`absolute top-0 right-0 w-1 sm:hidden h-full ${
                  booking.status === "approved"
                    ? "bg-green-500"
                    : booking.status === "rejected"
                      ? "bg-red-500"
                      : "bg-primary"
                }`}
              />
              {/* Status Strip */}
              <div
                className={`absolute top-0 right-0 w-2 h-full ${
                  booking.status === "approved"
                    ? "bg-green-500"
                    : booking.status === "rejected"
                      ? "bg-red-500"
                      : "bg-primary"
                }`}
              />

              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                {/* Car Info Column */}
                <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-l border-white/5 pb-4 sm:pb-6 lg:pb-0 lg:pl-8">
                  <div className="flex items-center gap-2 sm:gap-5 mb-3 sm:mb-6">
                    <div className="hidden sm:flex bg-primary/10 p-2 sm:p-4 rounded-xl sm:rounded-2xl text-primary shadow-2xl border border-primary/20">
                      <DirectionsCar sx={{ fontSize: { xs: 20, sm: 32 } }} />
                    </div>
                    <div>
                      <h3 className="font-black text-base sm:text-2xl text-white tracking-tight">
                        {booking.car?.name || "سيارة غير محددة"}
                      </h3>
                      <p className="text-[9px] sm:text-sm text-slate-400 font-black uppercase tracking-widest mt-0.5 sm:mt-1">
                        إصدار {booking.car?.year || "2024"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5 sm:gap-3 bg-white/5 p-1.5 sm:p-3 rounded-lg sm:rounded-xl border border-white/5">
                      <EventNote
                        className="text-primary"
                        sx={{ fontSize: { xs: 12, sm: 20 } }}
                      />
                      <div className="flex flex-row sm:flex-col gap-2 sm:gap-0 font-bold">
                        <span className="text-[8px] sm:text-[10px] text-slate-500 uppercase">
                          {t("dashboard.admin.bookings.start")}
                        </span>
                        <span
                          className="text-[9px] sm:text-xs text-white"
                          suppressHydrationWarning
                        >
                          {booking.startDate
                            ? new Date(booking.startDate).toLocaleDateString(
                                i18n.language,
                              )
                            : "---"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-3 bg-white/5 p-1.5 sm:p-3 rounded-lg sm:rounded-xl border border-white/5">
                      <EventNote
                        className="text-primary"
                        sx={{ fontSize: { xs: 12, sm: 20 } }}
                      />
                      <div className="flex flex-row sm:flex-col gap-2 sm:gap-0 font-bold">
                        <span className="text-[8px] sm:text-[10px] text-slate-500 uppercase">
                          {t("dashboard.admin.bookings.end")}
                        </span>
                        <span
                          className="text-[9px] sm:text-xs text-white"
                          suppressHydrationWarning
                        >
                          {booking.endDate
                            ? new Date(booking.endDate).toLocaleDateString(
                                i18n.language,
                              )
                            : "---"}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs sm:text-sm pt-2 sm:pt-4 border-t border-white/5">
                      <span className="text-slate-500 font-bold text-[9px] sm:text-sm">
                        {booking.numberOfDays < 1 
                          ? `${Math.round(booking.numberOfDays * 24)} ${t("common.hours")}` 
                          : `${booking.numberOfDays} ${t("dashboard.admin.bookings.days")}`}
                      </span>
                      <span className="font-black text-primary text-base sm:text-2xl tracking-tighter">
                        {booking.totalPrice}{" "}
                        <span className="text-[8px] sm:text-xs font-bold text-slate-500">
                          {t("dashboard.user.bookings.sar")}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Client Info Column */}
                <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-l border-white/5 pb-4 sm:pb-6 lg:pb-0 lg:pl-8">
                  <h4 className="text-[7px] sm:text-[10px] font-black text-slate-500 uppercase mb-2 sm:mb-6 tracking-[0.3em]">
                    {t("dashboard.admin.bookings.clientData")}
                  </h4>
                  <div className="space-y-3 sm:space-y-6">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <Avatar
                        sx={{
                          bgcolor: "rgba(255,255,255,0.05)",
                          color: "var(--primary)",
                          width: { xs: 24, sm: 44 },
                          height: { xs: 24, sm: 44 },
                          fontSize: { xs: "0.6rem", sm: "1.1rem" },
                          fontWeight: "900",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        {booking.user?.name?.charAt(0)}
                      </Avatar>
                      <span className="font-black text-white text-xs sm:text-lg">
                        {booking.user?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-lg text-white/80 font-bold bg-white/5 p-1.5 sm:p-2.5 rounded-lg border border-white/5">
                      <Phone
                        className="text-primary"
                        sx={{ fontSize: { xs: 12, sm: 20 } }}
                      />
                      <span className="text-[9px] sm:text-base">
                        {booking.phoneNumber}
                      </span>
                      <IconButton
                        size="small"
                        component="a"
                        href={`https://wa.me/${booking.phoneNumber.replace(/\D/g, "").replace(/^00/, "").replace(/^0/, "966")}`}
                        target="_blank"
                        sx={{
                          color: "#22c55e",
                          bgcolor: "rgba(34, 197, 94, 0.1)",
                          "&:hover": { bgcolor: "rgba(34, 197, 94, 0.2)" },
                          border: "1px solid rgba(34, 197, 94, 0.2)",
                          ml: "auto",
                          width: { xs: 24, sm: 32 },
                          height: { xs: 24, sm: 32 },
                        }}
                      >
                        <WhatsApp sx={{ fontSize: { xs: 12, sm: 18 } }} />
                      </IconButton>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-lg text-white/80 font-bold bg-white/5 p-1.5 sm:p-2.5 rounded-lg border border-white/5">
                      <Speed
                        className="text-primary"
                        sx={{ fontSize: { xs: 12, sm: 20 } }}
                      />
                      <span className="text-[9px] sm:text-base">
                        {booking.kmPerDay} {t("booking.kmPerDay", "km/day")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Column */}
                <div className="lg:w-1/3 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-auto">
                    <Chip
                      label={
                        booking.status === "approved"
                          ? t("dashboard.admin.bookings.approved")
                          : booking.status === "rejected"
                            ? t("dashboard.admin.bookings.rejected")
                            : t("dashboard.admin.bookings.pending")
                      }
                      icon={
                        booking.status === "approved" ? (
                          <Check />
                        ) : booking.status === "rejected" ? (
                          <Close />
                        ) : (
                          <EventNote />
                        )
                      }
                      sx={{
                        fontWeight: "900",
                        borderRadius: "15px",
                        px: { xs: 1.5, md: 2 },
                        py: 2,
                        fontSize: { xs: "0.75rem", md: "0.85rem" },
                        bgcolor:
                          booking.status === "approved"
                            ? "rgba(22, 163, 74, 0.1)"
                            : booking.status === "rejected"
                              ? "rgba(220, 38, 38, 0.1)"
                              : "rgba(10, 35, 115, 0.1)",
                        color:
                          booking.status === "approved"
                            ? "#4ade80"
                            : booking.status === "rejected"
                              ? "#f87171"
                              : "#071A55",
                        border: "1px solid currentColor",
                        "& .MuiChip-icon": {
                          color: "inherit",
                          fontSize: { xs: "0.9rem", md: "1.1rem" },
                        },
                      }}
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteId(booking._id)}
                      sx={{
                        bgcolor: "rgba(220, 38, 38, 0.1)",
                        border: "1px solid rgba(220, 38, 38, 0.2)",
                        "&:hover": { bgcolor: "rgba(220, 38, 38, 0.2)" },
                        width: { xs: 28, sm: 40 },
                        height: { xs: 28, sm: 40 },
                      }}
                    >
                      <Delete sx={{ fontSize: { xs: 14, sm: 20 } }} />
                    </IconButton>
                  </div>

                  <div className="flex gap-4 mt-8 pb-6 mb-6 border-b border-white/5">
                    <a
                      href={booking.idCardImage}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-1.5 sm:py-3.5 bg-white/5 text-white rounded-lg sm:rounded-2xl text-[8px] sm:text-xs font-black hover:bg-white/10 transition-all border border-white/10 group/btn"
                    >
                      <DescIcon
                        sx={{ fontSize: { xs: 10, sm: 18 } }}
                        className="text-primary/70 group-hover/btn:text-primary transition-colors"
                      />
                      {t("dashboard.admin.bookings.id")}
                    </a>
                    <a
                      href={booking.licenseImage}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-1.5 sm:py-3.5 bg-white/5 text-white rounded-lg sm:rounded-2xl text-[8px] sm:text-xs font-black hover:bg-white/10 transition-all border border-white/10 group/btn"
                    >
                      <DescIcon
                        sx={{ fontSize: { xs: 10, sm: 18 } }}
                        className="text-primary/70 group-hover/btn:text-primary transition-colors"
                      />
                      {t("dashboard.admin.bookings.license")}
                    </a>
                  </div>

                  <div className="flex gap-3">
                    {booking.status === "pending" ? (
                      <>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => approveMutation.mutate(booking._id)}
                          disabled={approveMutation.isPending}
                          sx={{
                            borderRadius: "1.25rem",
                            fontWeight: "900",
                            bgcolor: "#16a34a",
                            "&:hover": { bgcolor: "#15803d" },
                            py: 1.5,
                            fontSize: "1rem",
                            boxShadow:
                              "0 15px 25px -5px rgba(22, 163, 74, 0.3)",
                          }}
                        >
                          {t("dashboard.admin.bookings.acceptButton")}
                        </Button>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => rejectMutation.mutate(booking._id)}
                          disabled={rejectMutation.isPending}
                          sx={{
                            borderRadius: "1.25rem",
                            fontWeight: "900",
                            bgcolor: "#dc2626",
                            "&:hover": { bgcolor: "#b91c1c" },
                            py: 1.5,
                            fontSize: "1rem",
                            boxShadow:
                              "0 15px 25px -5px rgba(220, 38, 38, 0.3)",
                          }}
                        >
                          {t("dashboard.admin.bookings.rejectButton")}
                        </Button>
                      </>
                    ) : (
                      <div className="w-full flex gap-3">
                        <div className="flex-1 text-center py-2.5 sm:py-3.5 bg-white/5 text-slate-500 rounded-xl sm:rounded-2xl text-[10px] sm:text-sm font-black border border-white/5 italic flex items-center justify-center">
                          {t("dashboard.admin.bookings.finalAction")}
                        </div>
                        {booking.status === "approved" &&
                          !booking.isReviewed && (
                            <Button
                              variant="contained"
                              onClick={() => handleOpenReview(booking)}
                              sx={{
                                borderRadius: "1.25rem",
                                fontWeight: "900",
                                bgcolor: "var(--primary)",
                                "&:hover": { bgcolor: "var(--primary-hover)" },
                                px: 3,
                                fontSize: "0.9rem",
                                boxShadow:
                                  "0 10px 20px -5px rgba(10, 35, 115, 0.3)",
                              }}
                            >
                              {t("dashboard.user.bookings.rateButton", "تقييم")}
                            </Button>
                          )}
                        {booking.status === "approved" &&
                          booking.isReviewed && (
                            <div className="flex-1 text-center py-2.5 sm:py-3.5 bg-green-500/10 text-green-500 rounded-xl sm:rounded-2xl text-[10px] sm:text-sm font-black border border-green-500/20 italic flex items-center justify-center">
                              {t(
                                "dashboard.user.bookings.rated",
                                "تم التقييم بنجاح",
                              )}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      <JumpToPagePagination
        totalPages={data?.data?.pagination?.totalPages || 1}
        currentPage={page}
        onPageChange={setPage}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        PaperProps={{
          sx: {
            borderRadius: "2.5rem",
            bgcolor: "#0f172a",
            backgroundImage:
              "radial-gradient(at 0% 0%, rgba(10, 35, 115, 0.1) 0px, transparent 50%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            p: 3,
          },
        }}
        dir={i18n.dir()}
      >
        <DialogTitle className="font-black text-3xl text-white text-center mb-2">
          {t("dashboard.admin.bookings.deleteDialog.title")}
        </DialogTitle>
        <DialogContent>
          <p className="text-slate-400 font-bold text-center text-lg leading-relaxed">
            {t("dashboard.admin.bookings.deleteDialog.message")}
          </p>
        </DialogContent>
        <DialogActions className="justify-center gap-4 pb-4">
          <Button
            onClick={() => setDeleteId(null)}
            sx={{
              fontWeight: "900",
              color: "rgba(255,255,255,0.4)",
              fontSize: "1.1rem",
            }}
          >
            {t("dashboard.user.profile.cancelButton")}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteMutation.mutate(deleteId)}
            autoFocus
            sx={{
              borderRadius: "1.25rem",
              fontWeight: "900",
              px: 5,
              py: 1.5,
              fontSize: "1.1rem",
              boxShadow: "0 10px 20px rgba(185, 28, 28, 0.3)",
            }}
          >
            {deleteMutation.isPending
              ? t("dashboard.user.reviews.posting")
              : t("dashboard.admin.bookings.deleteDialog.confirm")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Dialog */}
      <Dialog
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        dir={i18n.dir()}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: { xs: "2rem", md: "2.5rem" },
            padding: { xs: 1, md: 2 },
            bgcolor: "rgba(15, 23, 42, 0.98)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
            margin: { xs: 2, md: 4 },
          },
        }}
      >
        <DialogTitle className="font-black text-2xl md:text-3xl text-center mb-1 md:mb-2">
          {t("dashboard.user.reviews.dialogTitle", "تقييم السيارة")}
        </DialogTitle>
        <DialogContent className="flex flex-col items-center space-y-4 md:space-y-6 pt-4 md:pt-6">
          <Typography
            variant="body2"
            className="text-slate-400 font-bold text-center mb-2"
          >
            {t(
              "dashboard.user.reviews.dialogSubtitle",
              "كيف كانت تجربتك لسيارة",
            )}{" "}
            {selectedBooking?.car?.name}
          </Typography>

          <Rating
            name="simple-controlled"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            size="large"
            precision={1}
            dir={i18n.dir()}
            sx={{
              fontSize: { xs: "2.5rem", md: "3rem" },
              "& .MuiRating-iconFilled": { color: "#0A2373" },
              "& .MuiRating-iconEmpty": { color: "rgba(255,255,255,0.1)" },
            }}
          />

          <TextField
            placeholder={t(
              "dashboard.user.reviews.placeholder",
              "صِف لنا تجربتك...",
            )}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: { xs: 3, md: 4 },
                bgcolor: "rgba(255,255,255,0.03)",
                color: "white",
                fontSize: { xs: "0.85rem", md: "1rem" },
                "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
              },
            }}
          />
        </DialogContent>
        <DialogActions className="flex-col sm:flex-row justify-center gap-2 sm:gap-4 pb-8 pt-4 px-6">
          <Button
            onClick={() => setReviewOpen(false)}
            className="text-slate-500 font-black px-8"
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            {t("dashboard.user.reviews.cancel", "إلغاء")}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitReview}
            disabled={createReviewMutation.isPending}
            sx={{
              fontWeight: "black",
              borderRadius: "1.25rem",
              px: { xs: 4, md: 8 },
              py: 1.5,
              width: { xs: "100%", sm: "auto" },
              backgroundColor: "var(--primary)",
              "&:hover": { backgroundColor: "var(--primary-hover)" },
              boxShadow: "0 10px 20px -5px rgba(10, 35, 115, 0.3)",
            }}
          >
            {createReviewMutation.isPending
              ? t("dashboard.user.reviews.posting", "يتم التقييم...")
              : t("dashboard.user.reviews.postButton", "أضف التقييم")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function ManageCars() {
  const { t, i18n } = useTranslation("common");
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: carsData, isLoading } = useQuery({
    queryKey: ["allCars", page],
    queryFn: () => carService.getAll({ page, limit }),
  });

  const [deleteId, setDeleteId] = useState(null); // For Dialog

  const deleteMutation = useMutation({
    mutationFn: carService.delete,
    onSuccess: () => {
      toast.success(t("dashboard.admin.cars.deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: ["allCars"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      setDeleteId(null);
    },
    onError: () => {
      toast.error(t("dashboard.admin.cars.deleteError"));
      setDeleteId(null);
    },
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  if (isLoading) return <CircularProgress className="m-auto block" />;

  const cars = carsData?.data?.cars || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white/5 backdrop-blur-xl p-3 sm:p-8 rounded-xl sm:rounded-3xl border border-white/10 shadow-2xl gap-3 sm:gap-6">
        <div className="text-center md:text-right">
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
            {t("dashboard.admin.cars.title")}
          </h2>
          <p className="text-[8px] sm:text-sm text-slate-400 mt-0.5 sm:mt-2 font-bold uppercase tracking-widest">
            {t("dashboard.admin.cars.count", {
              count: carsData?.data?.pagination?.total || cars.length,
            })}
          </p>
        </div>

        <Button
          variant="contained"
          fullWidth={false}
          startIcon={<Add sx={{ ml: 1 }} />}
          onClick={() => setIsAddOpen(true)}
          sx={{
            backgroundColor: "var(--primary)",
            "&:hover": { backgroundColor: "var(--primary-hover)" },
            borderRadius: "0.75rem sm:1.25rem",
            fontWeight: "900",
            px: { xs: 2.5, md: 4 },
            py: { xs: 1, md: 1.5 },
            fontSize: { xs: "0.75rem", md: "1rem" },
            boxShadow: "0 10px 20px rgba(10, 35, 115, 0.2)",
            width: { xs: "100%", md: "auto" },
          }}
        >
          {t("dashboard.admin.cars.addButton")}
        </Button>
      </div>

      {cars.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
          <DirectionsCar
            sx={{ fontSize: 80, color: "rgba(255,255,255,0.1)", mb: 4 }}
          />
          <p className="text-xl font-black text-slate-500">
            {t("dashboard.admin.cars.emptyTitle")}
          </p>
          <Button
            variant="text"
            color="primary"
            onClick={() => setIsAddOpen(true)}
            sx={{ mt: 3, fontWeight: "900", fontSize: "1.1rem" }}
          >
            {t("dashboard.admin.cars.emptyAction")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {(Array.isArray(cars) ? cars : [])
            .filter((car) => car != null)
            .map((car, idx) => (
              <div
                key={car?._id || idx}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl hover:bg-white/10 transition-all duration-500 group relative"
              >
                <div className="relative h-48 w-full bg-slate-100">
                  {car.image || car.imageUrl ? (
                    <Image
                      src={car.image || car.imageUrl}
                      fill
                      alt={car.name}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      <DirectionsCar fontSize="large" />
                    </div>
                  )}
                  <div className="absolute top-1.5 sm:top-4 left-1.5 sm:left-4 z-20 flex flex-col gap-1">
                    <Chip
                      label={
                        car.pricePerDay +
                        " " +
                        t("dashboard.admin.cars.priceDay")
                      }
                      size="small"
                      sx={{
                        bgcolor: "rgba(0,0,0,0.6)",
                        backdropFilter: "blur(10px)",
                        color: "white",
                        fontWeight: "900",
                        fontSize: { xs: "0.6rem", sm: "0.75rem" },
                        height: { xs: 20, sm: 24 },
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                    <Chip
                      label={"#" + (car.order || 0)}
                      size="small"
                      sx={{
                        bgcolor: "var(--primary)",
                        color: "white",
                        fontWeight: "900",
                        fontSize: { xs: "0.6rem", sm: "0.75rem" },
                        height: { xs: 20, sm: 24 },
                        border: "1px solid rgba(255,255,255,0.1)",
                        boxShadow: "0 0 10px rgba(10, 35, 115,0.4)",
                      }}
                    />
                  </div>
                </div>

                {/* Car Details Info */}
                <div className="p-2 sm:p-5">
                  <div className="flex justify-between items-start mb-2 sm:mb-4">
                    <div>
                      <h4 className="text-sm sm:text-xl font-black text-white group-hover:text-primary transition-colors truncate max-w-[120px] sm:max-w-none">
                        {car.name}
                      </h4>
                    </div>
                    <div className="flex gap-1">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => setEditingCar(car)}
                        sx={{
                          bgcolor: "rgba(10, 35, 115, 0.1)",
                          width: { xs: 24, sm: 32 },
                          height: { xs: 24, sm: 32 },
                          "&:hover": { bgcolor: "rgba(10, 35, 115, 0.2)" },
                        }}
                      >
                        <Edit sx={{ fontSize: { xs: 12, sm: 16 } }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteId(car._id)}
                        sx={{
                          bgcolor: "rgba(220, 38, 38, 0.1)",
                          width: { xs: 24, sm: 32 },
                          height: { xs: 24, sm: 32 },
                          "&:hover": { bgcolor: "rgba(220, 38, 38, 0.2)" },
                        }}
                      >
                        <Delete sx={{ fontSize: { xs: 12, sm: 16 } }} />
                      </IconButton>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6 pt-5 border-t border-white/5">
                    <Button
                      fullWidth
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => setDeleteId(car._id)}
                      startIcon={<Delete />}
                      sx={{
                        borderRadius: "1.25rem",
                        fontWeight: "900",
                        py: 1.5,
                        bgcolor: "rgba(220, 38, 38, 0.1)",
                        color: "#ef4444",
                        border: "1px solid rgba(220, 38, 38, 0.2)",
                        "&:hover": {
                          bgcolor: "rgba(220, 38, 38, 0.2)",
                          border: "1px solid #ef4444",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      <span className="ml-1">
                        {t("dashboard.admin.cars.deleteButton")}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      <JumpToPagePagination
        totalPages={carsData?.data?.pagination?.totalPages || 1}
        currentPage={page}
        onPageChange={setPage}
      />

      <AddCarDialog open={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditCarDialog
        open={!!editingCar}
        car={editingCar}
        onClose={() => setEditingCar(null)}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        PaperProps={{
          sx: {
            borderRadius: "2.5rem",
            bgcolor: "var(--background)",
            backgroundImage:
              "radial-gradient(at 0% 0%, rgba(10, 35, 115, 0.1) 0px, transparent 50%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            p: 3,
          },
        }}
        dir={i18n.dir()}
      >
        <DialogTitle className="font-black text-3xl text-white text-center mb-2">
          {t("dashboard.admin.cars.deleteDialog.title")}
        </DialogTitle>
        <DialogContent>
          <p className="text-slate-400 font-bold text-center text-lg leading-relaxed">
            {t("dashboard.admin.cars.deleteDialog.message")}
          </p>
        </DialogContent>
        <DialogActions className="justify-center gap-4 pb-4">
          <Button
            onClick={() => setDeleteId(null)}
            sx={{
              fontWeight: "900",
              color: "rgba(255,255,255,0.4)",
              fontSize: "1.1rem",
            }}
          >
            {t("dashboard.admin.cars.deleteDialog.cancel")}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteMutation.mutate(deleteId)}
            autoFocus
            sx={{
              borderRadius: "1.25rem",
              fontWeight: "900",
              px: 5,
              py: 1.5,
              fontSize: "1.1rem",
              boxShadow: "0 10px 20px rgba(185, 28, 28, 0.3)",
            }}
          >
            {t("dashboard.admin.cars.deleteDialog.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function ManageReviews() {
  const { t, i18n } = useTranslation("common");
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 20;
  const { data, isLoading } = useQuery({
    queryKey: ["allReviewsAdmin", page],
    queryFn: () => reviewService.getAllAdmin({ page, limit }),
  });

  const [deleteId, setDeleteId] = useState(null);

  const deleteMutation = useMutation({
    mutationFn: reviewService.delete,
    onSuccess: () => {
      toast.success(t("dashboard.admin.reviews.deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: ["allReviewsAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["recentReviews"] }); // Sync home page
      setDeleteId(null);
    },
    onError: () => {
      toast.error(t("dashboard.admin.reviews.deleteError"));
      setDeleteId(null);
    },
  });

  if (isLoading) return <CircularProgress className="m-auto block" />;

  const reviews = data?.data?.reviews || [];

  if (reviews.length === 0) {
    return (
      <div className="text-center py-20 bg-midnight/30 backdrop-blur-xl rounded-[3rem] border border-dashed border-white/10">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <Star sx={{ fontSize: 48, color: "rgba(255,255,255,0.1)" }} />
        </div>
        <p className="text-xl font-bold text-slate-400">
          {t("dashboard.admin.reviews.empty")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {(Array.isArray(reviews) ? reviews : [])
          .filter((r) => r != null)
          .map((review, idx) => (
            <div
              key={review?._id || idx}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-[2.5rem] p-3 sm:p-8 md:p-10 shadow-2xl hover:bg-white/10 transition-all duration-500 group relative overflow-hidden"
            >
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex items-start justify-between mb-6 md:mb-8 relative z-10">
                <div className="flex items-center gap-4 sm:gap-5">
                  <Avatar
                    sx={{
                      width: { xs: 40, sm: 80 },
                      height: { xs: 40, sm: 80 },
                      border: "2px solid rgba(10, 35, 115,0.3)",
                      boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
                      fontSize: { xs: "1rem", sm: "2rem" },
                      fontWeight: "900",
                      bgcolor: "rgba(255,255,255,0.05)",
                    }}
                  >
                    {review.user?.name?.charAt(0)}
                  </Avatar>
                  <div className="text-center sm:text-right">
                    <h4 className="text-base sm:text-2xl font-black text-white mb-0.5 sm:mb-1">
                      {review.user?.name}
                    </h4>
                    <p className="text-[8px] sm:text-xs text-slate-500 font-black uppercase tracking-widest">
                      {review.car?.name}
                    </p>
                  </div>
                </div>
                <IconButton
                  onClick={() => setDeleteId(review._id)}
                  sx={{
                    bgcolor: "rgba(239, 68, 68, 0.1)",
                    color: "#ef4444",
                    "&:hover": { bgcolor: "rgba(239, 68, 68, 0.2)" },
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                  }}
                >
                  <Delete />
                </IconButton>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl md:rounded-[1.5rem] p-4 sm:p-6 mb-6 md:mb-8 relative z-10 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <DirectionsCar
                    className="text-primary"
                    sx={{ fontSize: 18 }}
                  />
                  <span className="text-xs md:text-sm font-black text-white uppercase tracking-tight">
                    {review.car?.name}
                  </span>
                </div>
                <Rating
                  value={review.rating}
                  readOnly
                  size="small"
                  sx={{
                    "& .MuiRating-iconFilled": { color: "var(--primary)" },
                  }}
                />
              </div>

              <p className="text-slate-400 leading-relaxed font-bold text-base md:text-lg italic relative z-10 border-r-2 border-primary/30 pr-4 line-clamp-4 md:line-clamp-none">
                &quot;{review.comment || t("dashboard.admin.reviews.noComment")}
                &quot;
              </p>

              <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center relative z-10">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
                  {new Date(review.createdAt).toLocaleDateString(i18n.language)}
                </span>
                <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-green-500 font-black uppercase tracking-wider">
                    {t("dashboard.admin.reviews.verified")}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>

      <JumpToPagePagination
        totalPages={data?.data?.pagination?.totalPages || 1}
        currentPage={page}
        onPageChange={setPage}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        PaperProps={{
          sx: {
            borderRadius: { xs: "2rem", md: "2.5rem" },
            bgcolor: "#0f172a",
            backgroundImage:
              "radial-gradient(at 0% 0%, rgba(10, 35, 115, 0.1) 0px, transparent 50%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            p: { xs: 2, md: 3 },
            margin: { xs: 2, md: 4 },
          },
        }}
        dir={i18n.dir()}
      >
        <DialogTitle className="font-black text-2xl md:text-3xl text-white text-center mb-1 md:mb-2">
          {t("dashboard.admin.reviews.deleteDialog.title")}
        </DialogTitle>
        <DialogContent>
          <p className="text-slate-400 font-bold text-center text-base md:text-lg leading-relaxed">
            {t("dashboard.admin.reviews.deleteDialog.message")}
          </p>
        </DialogContent>
        <DialogActions className="justify-center gap-4 pb-4">
          <Button
            onClick={() => setDeleteId(null)}
            sx={{
              fontWeight: "900",
              color: "rgba(255,255,255,0.4)",
              fontSize: "1.1rem",
            }}
          >
            {t("dashboard.user.profile.cancelButton")}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteMutation.mutate(deleteId)}
            autoFocus
            sx={{
              borderRadius: "1.25rem",
              fontWeight: "900",
              px: 5,
              py: 1.5,
              fontSize: "1.1rem",
              boxShadow: "0 10px 20px rgba(185, 28, 28, 0.3)",
            }}
          >
            {deleteMutation.isPending
              ? t("dashboard.user.reviews.posting")
              : t("dashboard.admin.reviews.deleteDialog.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function AddCarDialog({ open, onClose }) {
  const { t, i18n } = useTranslation("common");
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    year: new Date().getFullYear(),
    region: "riyadh",
    category: "regular",
    pricePerDay: "",
    driverPackage4Hours: "",
    driverPackage8Hours: "",
    driverPackage12Hours: "",
    priceWeekly: "",
    priceHalfMonth: "",
    priceMonthly: "",
    seats: "",
    fuelType: "",
    imageUrl: "",
    description: "",
    order: 0,
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "1.25rem",
      bgcolor: "rgba(255,255,255,0.03)",
      color: "white",
      fontWeight: "bold",
      "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
      "&.Mui-focused fieldset": { borderColor: "#0A2373" },
      transition: "all 0.3s ease",
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255,255,255,0.4)",
      fontWeight: "bold",
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#0A2373" },
  };

  const menuProps = {
    PaperProps: {
      sx: {
        bgcolor: "#0f172a",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "white",
        borderRadius: "1.25rem",
        marginTop: "8px",
        "& .MuiMenuItem-root": {
          fontSize: "1rem",
          fontWeight: "bold",
          py: 1.5,
          "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
          "&.Mui-selected": {
            bgcolor: "rgba(10, 35, 115, 0.2)",
            color: "#0A2373",
            "&:hover": { bgcolor: "rgba(10, 35, 115, 0.3)" },
          },
        },
      },
    },
  };

  // ... (Keep mutation logic same as before)
  const createMutation = useMutation({
    mutationFn: carService.create,
    onSuccess: () => {
      toast.success(t("dashboard.admin.addCar.success"));
      queryClient.invalidateQueries({ queryKey: ["allCars"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      onClose();
      setFormData({
        name: "",
        year: new Date().getFullYear(),
        region: "riyadh",
        category: "regular",
        pricePerDay: "",
        driverPackage4Hours: "",
        driverPackage8Hours: "",
        driverPackage12Hours: "",
        priceWeekly: "",
        priceHalfMonth: "",
        priceMonthly: "",
        seats: "",
        fuelType: "",
        imageUrl: "",
        description: "",
      });
      setFile(null);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || t("dashboard.admin.addCar.error"),
      );
    },
  });

  const handleSubmit = async () => {
    const isDriverCar = formData.category === "with_driver";
    const missingBaseFields =
      !formData.name ||
      !formData.seats ||
      !formData.fuelType ||
      !formData.description ||
      !file;
    const missingRegularPrices =
      !isDriverCar &&
      (!formData.pricePerDay ||
        !formData.priceWeekly ||
        !formData.priceHalfMonth ||
        !formData.priceMonthly);
    const missingDriverPackages =
      isDriverCar &&
      (!formData.driverPackage4Hours ||
        !formData.driverPackage8Hours ||
        !formData.driverPackage12Hours);

    if (missingBaseFields || missingRegularPrices || missingDriverPackages) {
      toast.warning(t("dashboard.admin.addCar.warningFill"));
      return;
    }

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      // Use native fetch to call Next.js API route instead of backend API
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      const result = await res.json();
      if (!res.ok || !result.url) throw new Error(result.error || "فشل الحصول على رابط الصورة");

      const payload = { ...formData, imageUrl: result.url };

      const parseIntSafe = (val) => (val ? parseInt(val, 10) : undefined);
      const parseFloatSafe = (val) => (val ? parseFloat(val) : undefined);

      payload.year = parseIntSafe(formData.year);
      payload.driverPackage4Hours = parseFloatSafe(formData.driverPackage4Hours);
      payload.driverPackage8Hours = parseFloatSafe(formData.driverPackage8Hours);
      payload.driverPackage12Hours = parseFloatSafe(formData.driverPackage12Hours);
      payload.pricePerDay = isDriverCar
        ? parseFloatSafe(formData.driverPackage4Hours)
        : parseFloatSafe(formData.pricePerDay);
      payload.priceWeekly = parseFloatSafe(formData.priceWeekly);
      payload.priceHalfMonth = parseFloatSafe(formData.priceHalfMonth);
      payload.priceMonthly = parseFloatSafe(formData.priceMonthly);
      payload.seats = parseIntSafe(formData.seats);
      payload.order = formData.order ? parseInt(formData.order, 10) : 0;

      // Clean up undefined values dynamically to prevent sending explicit empty fields
      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key],
      );

      createMutation.mutate(payload);
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        t("dashboard.admin.addCar.error");
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      dir={i18n.dir()}
      PaperProps={{
        sx: {
          borderRadius: "2.5rem",
          overflow: "hidden",
          bgcolor: "#020617",
          backgroundImage:
            "radial-gradient(at 0% 0%, rgba(10, 35, 115, 0.1) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(30, 27, 75, 0.2) 0px, transparent 50%)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)",
        },
      }}
    >
      <div className="bg-white/5 p-8 px-10 border-b border-white/5 flex justify-between items-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
            <div className="bg-primary/20 p-3 rounded-2xl text-primary shadow-2xl border border-primary/20">
              <DirectionsCar sx={{ fontSize: 24 }} />
            </div>
            {t("dashboard.admin.addCar.title")}
          </h2>
          <p className="text-sm text-slate-400 mr-14 mt-2 font-bold uppercase tracking-widest">
            {t("dashboard.admin.addCar.subtitle")}
          </p>
        </div>
        <IconButton
          onClick={onClose}
          size="small"
          className="text-slate-500 hover:text-white transition-colors relative z-10"
        >
          <Close />
        </IconButton>
      </div>

      <DialogContent className="p-10 custom-scrollbar">
        <div className="flex flex-col gap-8 pt-2">
          {/* Image Upload Area */}
          <div
            className={`border-2 border-dashed rounded-[2rem] p-8 transition-all cursor-pointer relative group overflow-hidden ${
              file
                ? "border-primary/50 bg-primary/5"
                : "border-white/10 hover:border-primary/30 hover:bg-white/5"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={(e) => setFile(e.target.files[0])}
            />

            {file ? (
              <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-midnight/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                  <div className="bg-primary px-6 py-2.5 rounded-full text-white font-black flex items-center gap-2 shadow-2xl">
                    <UploadFile /> {t("dashboard.admin.addCar.changeImage")}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-5 text-slate-400">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-primary mb-1 group-hover:scale-110 transition-transform duration-500 border border-white/5 shadow-2xl">
                  <UploadFile fontSize="large" />
                </div>
                <div className="text-center">
                  <span className="block font-black text-2xl text-white mb-2 tracking-tight">
                    {t("dashboard.admin.addCar.uploadImage")}
                  </span>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                    {t("dashboard.admin.addCar.uploadHint")}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 gap-6">
            <TextField
              label={t("dashboard.admin.addCar.nameLabel")}
              placeholder={t("dashboard.admin.addCar.namePlaceholder")}
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              sx={inputStyle}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormControl fullWidth sx={inputStyle}>
                <InputLabel>
                  {t("dashboard.admin.addCar.regionLabel")}
                </InputLabel>
                <Select
                  label={t("dashboard.admin.addCar.regionLabel")}
                  value={formData.region}
                  onChange={(e) =>
                    setFormData({ ...formData, region: e.target.value })
                  }
                  MenuProps={menuProps}
                >
                  <MenuItem value="riyadh">
                    {t("dashboard.admin.addCar.regions.riyadh")}
                  </MenuItem>
                  <MenuItem value="jeddah">
                    {t("dashboard.admin.addCar.regions.jeddah")}
                  </MenuItem>
                  <MenuItem value="eastern">
                    {t("dashboard.admin.addCar.regions.eastern")}
                  </MenuItem>
                </Select>
              </FormControl>

              <TextField
                label={t("dashboard.admin.addCar.yearLabel")}
                fullWidth
                type="number"
                variant="outlined"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                sx={inputStyle}
              />
            </div>

            <FormControl fullWidth sx={inputStyle}>
              <InputLabel>
                {t("dashboard.admin.addCar.categoryLabel")}
              </InputLabel>
              <Select
                label={t("dashboard.admin.addCar.categoryLabel")}
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                MenuProps={menuProps}
              >
                <MenuItem value="regular">
                  {t("dashboard.admin.addCar.categories.regular")}
                </MenuItem>
                <MenuItem value="with_driver">
                  {t("dashboard.admin.addCar.categories.with_driver")}
                </MenuItem>
                <MenuItem value="corporate">
                  {t("dashboard.admin.addCar.categories.corporate")}
                </MenuItem>
              </Select>
            </FormControl>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <TextField
                label={t("seats")}
                placeholder="5"
                fullWidth
                type="number"
                variant="outlined"
                value={formData.seats}
                onChange={(e) =>
                  setFormData({ ...formData, seats: e.target.value })
                }
                sx={inputStyle}
              />

              <TextField
                label={t("fuelType")}
                placeholder={t("carCard.specs.petrol")}
                fullWidth
                variant="outlined"
                value={formData.fuelType}
                onChange={(e) =>
                  setFormData({ ...formData, fuelType: e.target.value })
                }
                sx={inputStyle}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {formData.category === "with_driver" ? (
                <>
                  <TextField
                    label={t("booking.driverPackages.fourHours")}
                    placeholder="0.00"
                    fullWidth
                    type="number"
                    variant="outlined"
                    value={formData.driverPackage4Hours}
                    onChange={(e) =>
                      setFormData({ ...formData, driverPackage4Hours: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney className="text-primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputStyle}
                  />
                  <TextField
                    label={t("booking.driverPackages.eightHours")}
                    placeholder="0.00"
                    fullWidth
                    type="number"
                    variant="outlined"
                    value={formData.driverPackage8Hours}
                    onChange={(e) =>
                      setFormData({ ...formData, driverPackage8Hours: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney className="text-primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputStyle}
                  />
                  <TextField
                    label={t("booking.driverPackages.twelveHours")}
                    placeholder="0.00"
                    fullWidth
                    type="number"
                    variant="outlined"
                    value={formData.driverPackage12Hours}
                    onChange={(e) =>
                      setFormData({ ...formData, driverPackage12Hours: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney className="text-primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputStyle}
                  />
                </>
              ) : (
                <>
                  <TextField
                    label={t("dashboard.admin.addCar.priceLabel")}
                    placeholder="0.00"
                    fullWidth
                    type="number"
                    variant="outlined"
                    value={formData.pricePerDay}
                    onChange={(e) =>
                      setFormData({ ...formData, pricePerDay: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney className="text-primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputStyle}
                  />
                  <TextField
                    label={t("priceWeekly")}
                    placeholder="0.00"
                    fullWidth
                    type="number"
                    variant="outlined"
                    value={formData.priceWeekly}
                    onChange={(e) =>
                      setFormData({ ...formData, priceWeekly: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney className="text-primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputStyle}
                  />
                  <TextField
                    label={t("priceHalfMonth")}
                    placeholder="0.00"
                    fullWidth
                    type="number"
                    variant="outlined"
                    value={formData.priceHalfMonth}
                    onChange={(e) =>
                      setFormData({ ...formData, priceHalfMonth: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney className="text-primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputStyle}
                  />
                  <TextField
                    label={t("priceMonthly")}
                    placeholder="0.00"
                    fullWidth
                    type="number"
                    variant="outlined"
                    value={formData.priceMonthly}
                    onChange={(e) =>
                      setFormData({ ...formData, priceMonthly: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney className="text-primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputStyle}
                  />
                </>
              )}
            </div>

            <TextField
              label={t("dashboard.admin.addCar.descLabel")}
              placeholder={t("dashboard.admin.addCar.descPlaceholder")}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              sx={inputStyle}
            />

            <TextField
              label={t("dashboard.admin.addCar.orderLabel")}
              placeholder="0"
              fullWidth
              type="number"
              variant="outlined"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: e.target.value })
              }
              sx={inputStyle}
            />
          </div>
        </div>
      </DialogContent>

      <DialogActions className="p-8 bg-white/5 border-t border-white/5 flex gap-4">
        <Button
          onClick={onClose}
          variant="text"
          color="inherit"
          disabled={uploading}
          sx={{
            borderRadius: "1.25rem",
            px: 4,
            fontWeight: "900",
            color: "rgba(255,255,255,0.4)",
            fontSize: "1rem",
          }}
        >
          {t("dashboard.admin.addCar.cancel")}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={uploading || createMutation.isPending}
          fullWidth
          sx={{
            backgroundColor: "var(--primary)",
            "&:hover": { backgroundColor: "var(--primary-hover)" },
            borderRadius: "1.25rem",
            py: 2,
            fontWeight: "900",
            fontSize: "1.1rem",
            boxShadow: "0 15px 30px rgba(10, 35, 115, 0.3)",
          }}
        >
          {uploading ? (
            <div className="flex items-center gap-3">
              <CircularProgress size={20} color="inherit" />{" "}
              {t("dashboard.admin.addCar.uploading")}
            </div>
          ) : createMutation.isPending ? (
            t("dashboard.admin.addCar.saving")
          ) : (
            t("dashboard.admin.addCar.submit")
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function EditCarDialog({ open, car, onClose }) {
  const { t, i18n } = useTranslation("common");
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    year: new Date().getFullYear(),
    region: "riyadh",
    category: "regular",
    pricePerDay: "",
    driverPackage4Hours: "",
    driverPackage8Hours: "",
    driverPackage12Hours: "",
    priceWeekly: "",
    priceHalfMonth: "",
    priceMonthly: "",
    seats: "",
    fuelType: "",
    imageUrl: "",
    description: "",
    order: 0,
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (car) {
      setFormData({
        name: car.name || "",
        year: car.year || new Date().getFullYear(),
        region: car.region || "riyadh",
        category: car.category || "regular",
        pricePerDay: car.pricePerDay || "",
        driverPackage4Hours:
          car.driverPackage4Hours || (car.driverHourlyRate ? Number(car.driverHourlyRate) * 4 : ""),
        driverPackage8Hours:
          car.driverPackage8Hours || (car.driverHourlyRate ? Number(car.driverHourlyRate) * 8 : ""),
        driverPackage12Hours:
          car.driverPackage12Hours || (car.driverHourlyRate ? Number(car.driverHourlyRate) * 12 : ""),
        priceWeekly: car.priceWeekly || "",
        priceHalfMonth: car.priceHalfMonth || "",
        priceMonthly: car.priceMonthly || "",
        seats: car.seats || "",
        fuelType: car.fuelType || "",
        imageUrl: car.imageUrl || car.image || "",
        description: car.description || "",
        order: car.order || 0,
      });
    }
  }, [car]);

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "1.25rem",
      bgcolor: "rgba(255,255,255,0.03)",
      color: "white",
      fontWeight: "bold",
      "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
      "&.Mui-focused fieldset": { borderColor: "#0A2373" },
      transition: "all 0.3s ease",
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255,255,255,0.4)",
      fontWeight: "bold",
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#0A2373" },
  };

  const menuProps = {
    PaperProps: {
      sx: {
        bgcolor: "#0f172a",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "white",
        borderRadius: "1.25rem",
        marginTop: "8px",
        "& .MuiMenuItem-root": {
          fontSize: "1rem",
          fontWeight: "bold",
          py: 1.5,
          "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
          "&.Mui-selected": {
            bgcolor: "rgba(10, 35, 115, 0.2)",
            color: "#0A2373",
            "&:hover": { bgcolor: "rgba(10, 35, 115, 0.3)" },
          },
        },
      },
    },
  };

  const updateMutation = useMutation({
    mutationFn: (data) => carService.update(car._id, data),
    onSuccess: () => {
      toast.success(t("dashboard.admin.editCar.success"));
      queryClient.invalidateQueries({ queryKey: ["allCars"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      onClose();
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || t("dashboard.admin.editCar.error"),
      );
    },
  });

  const handleSubmit = async () => {
    const isDriverCar = formData.category === "with_driver";
    const missingBaseFields =
      !formData.name ||
      !formData.seats ||
      !formData.fuelType ||
      !formData.description;
    const missingRegularPrices =
      !isDriverCar &&
      (!formData.pricePerDay ||
        !formData.priceWeekly ||
        !formData.priceHalfMonth ||
        !formData.priceMonthly);
    const missingDriverPackages =
      isDriverCar &&
      (!formData.driverPackage4Hours ||
        !formData.driverPackage8Hours ||
        !formData.driverPackage12Hours);

    if (missingBaseFields || missingRegularPrices || missingDriverPackages) {
      toast.warning(t("dashboard.admin.editCar.warningFill"));
      return;
    }

    setUploading(true);
    try {
      let currentImageUrl = formData.imageUrl;

      if (file) {
        const uploadData = new FormData();
        uploadData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "فشل رفع الصورة");
        currentImageUrl = result.url;
      }

      const payload = { ...formData, imageUrl: currentImageUrl };

      const parseIntSafe = (val) => (val ? parseInt(val, 10) : undefined);
      const parseFloatSafe = (val) => (val ? parseFloat(val) : undefined);

      payload.year = parseIntSafe(formData.year);
      payload.driverPackage4Hours = parseFloatSafe(formData.driverPackage4Hours);
      payload.driverPackage8Hours = parseFloatSafe(formData.driverPackage8Hours);
      payload.driverPackage12Hours = parseFloatSafe(formData.driverPackage12Hours);
      payload.pricePerDay = isDriverCar
        ? parseFloatSafe(formData.driverPackage4Hours)
        : parseFloatSafe(formData.pricePerDay);
      payload.priceWeekly = parseFloatSafe(formData.priceWeekly);
      payload.priceHalfMonth = parseFloatSafe(formData.priceHalfMonth);
      payload.priceMonthly = parseFloatSafe(formData.priceMonthly);
      payload.seats = parseIntSafe(formData.seats);
      payload.order =
        formData.order !== undefined && formData.order !== ""
          ? parseInt(formData.order, 10)
          : 0;

      // Clean up undefined values dynamically to prevent sending explicit empty fields
      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key],
      );

      updateMutation.mutate(payload);
    } catch (error) {
      console.error(error);
      toast.error(error.message || t("dashboard.admin.editCar.error"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      dir={i18n.dir()}
      PaperProps={{
        sx: {
          borderRadius: "2.5rem",
          overflow: "hidden",
          bgcolor: "#020617",
          backgroundImage:
            "radial-gradient(at 0% 0%, rgba(10, 35, 115, 0.1) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(30, 27, 75, 0.2) 0px, transparent 50%)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)",
        },
      }}
    >
      <div className="bg-white/5 p-8 px-10 border-b border-white/5 flex justify-between items-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
            <div className="bg-primary/20 p-3 rounded-2xl text-primary shadow-2xl border border-primary/20">
              <Edit sx={{ fontSize: 24 }} />
            </div>
            {t("dashboard.admin.editCar.title")}
          </h2>
          <p className="text-sm text-slate-400 mr-14 mt-2 font-bold uppercase tracking-widest">
            {t("dashboard.admin.editCar.subtitle")}
          </p>
        </div>
        <IconButton
          onClick={onClose}
          size="small"
          className="text-slate-500 hover:text-white transition-colors relative z-10"
        >
          <Close />
        </IconButton>
      </div>

      <DialogContent className="p-10 custom-scrollbar">
        <div className="flex flex-col gap-8 pt-2">
          {/* Image Upload Area */}
          <div
            className={`border-2 border-dashed rounded-[2rem] p-8 transition-all cursor-pointer relative group overflow-hidden ${
              file || formData.imageUrl
                ? "border-primary/50 bg-primary/5"
                : "border-white/10 hover:border-primary/30 hover:bg-white/5"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={(e) => setFile(e.target.files[0])}
            />

            {file || formData.imageUrl ? (
              <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  src={file ? URL.createObjectURL(file) : formData.imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-midnight/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                  <div className="bg-primary px-6 py-2.5 rounded-full text-white font-black flex items-center gap-2 shadow-2xl">
                    <UploadFile /> {t("dashboard.admin.editCar.changeImage")}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-5 text-slate-400">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-primary mb-1 group-hover:scale-110 transition-transform duration-500 border border-white/5 shadow-2xl">
                  <UploadFile fontSize="large" />
                </div>
                <div className="text-center">
                  <span className="block font-black text-2xl text-white mb-2 tracking-tight">
                    {t("dashboard.admin.editCar.uploadImage")}
                  </span>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                    {t("dashboard.admin.editCar.uploadHint")}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 gap-6">
            <TextField
              label={t("dashboard.admin.editCar.nameLabel")}
              placeholder={t("dashboard.admin.editCar.namePlaceholder")}
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              sx={inputStyle}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormControl fullWidth sx={inputStyle}>
                <InputLabel>
                  {t("dashboard.admin.editCar.regionLabel")}
                </InputLabel>
                <Select
                  label={t("dashboard.admin.editCar.regionLabel")}
                  value={formData.region}
                  onChange={(e) =>
                    setFormData({ ...formData, region: e.target.value })
                  }
                  MenuProps={menuProps}
                >
                  <MenuItem value="riyadh">
                    {t("dashboard.admin.addCar.regions.riyadh")}
                  </MenuItem>
                  <MenuItem value="jeddah">
                    {t("dashboard.admin.addCar.regions.jeddah")}
                  </MenuItem>
                  <MenuItem value="eastern">
                    {t("dashboard.admin.addCar.regions.eastern")}
                  </MenuItem>
                </Select>
              </FormControl>

              <TextField
                label={t("dashboard.admin.editCar.yearLabel")}
                fullWidth
                type="number"
                variant="outlined"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                sx={inputStyle}
              />
            </div>

            <FormControl fullWidth sx={inputStyle}>
              <InputLabel>
                {t("dashboard.admin.editCar.categoryLabel")}
              </InputLabel>
              <Select
                label={t("dashboard.admin.editCar.categoryLabel")}
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                MenuProps={menuProps}
              >
                <MenuItem value="regular">
                  {t("dashboard.admin.addCar.categories.regular")}
                </MenuItem>
                <MenuItem value="with_driver">
                  {t("dashboard.admin.addCar.categories.with_driver")}
                </MenuItem>
                <MenuItem value="corporate">
                  {t("dashboard.admin.addCar.categories.corporate")}
                </MenuItem>
              </Select>
            </FormControl>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <TextField
                label={t("seats")}
                placeholder="5"
                fullWidth
                type="number"
                variant="outlined"
                value={formData.seats}
                onChange={(e) =>
                  setFormData({ ...formData, seats: e.target.value })
                }
                sx={inputStyle}
              />

              <TextField
                label={t("fuelType")}
                placeholder={t("carCard.specs.petrol")}
                fullWidth
                variant="outlined"
                value={formData.fuelType}
                onChange={(e) =>
                  setFormData({ ...formData, fuelType: e.target.value })
                }
                sx={inputStyle}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {formData.category === "with_driver" ? (
                <>
                  <TextField
                    label={t("booking.driverPackages.fourHours")}
                    placeholder="0.00"
                    fullWidth
                    type="number"
                    variant="outlined"
                    value={formData.driverPackage4Hours}
                    onChange={(e) =>
                      setFormData({ ...formData, driverPackage4Hours: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney className="text-primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputStyle}
                  />
                  <TextField
                    label={t("booking.driverPackages.eightHours")}
                    placeholder="0.00"
                    fullWidth
                    type="number"
                    variant="outlined"
                    value={formData.driverPackage8Hours}
                    onChange={(e) =>
                      setFormData({ ...formData, driverPackage8Hours: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney className="text-primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputStyle}
                  />
                  <TextField
                    label={t("booking.driverPackages.twelveHours")}
                    placeholder="0.00"
                    fullWidth
                    type="number"
                    variant="outlined"
                    value={formData.driverPackage12Hours}
                    onChange={(e) =>
                      setFormData({ ...formData, driverPackage12Hours: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney className="text-primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputStyle}
                  />
                </>
              ) : (
                <>
                  <TextField
                    label={t("dashboard.admin.editCar.priceLabel")}
                    placeholder="0.00"
                    fullWidth
                    type="number"
                    variant="outlined"
                    value={formData.pricePerDay}
                    onChange={(e) =>
                      setFormData({ ...formData, pricePerDay: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney className="text-primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputStyle}
                  />
                  <TextField
                    label={t("priceWeekly")}
                    placeholder="0.00"
                    fullWidth
                    type="number"
                    variant="outlined"
                    value={formData.priceWeekly}
                    onChange={(e) =>
                      setFormData({ ...formData, priceWeekly: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney className="text-primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputStyle}
                  />
                  <TextField
                    label={t("priceHalfMonth")}
                    placeholder="0.00"
                    fullWidth
                    type="number"
                    variant="outlined"
                    value={formData.priceHalfMonth}
                    onChange={(e) =>
                      setFormData({ ...formData, priceHalfMonth: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney className="text-primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputStyle}
                  />
                  <TextField
                    label={t("priceMonthly")}
                    placeholder="0.00"
                    fullWidth
                    type="number"
                    variant="outlined"
                    value={formData.priceMonthly}
                    onChange={(e) =>
                      setFormData({ ...formData, priceMonthly: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney className="text-primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputStyle}
                  />
                </>
              )}
            </div>

            <TextField
              label={t("dashboard.admin.editCar.descLabel")}
              placeholder={t("dashboard.admin.editCar.descPlaceholder")}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              sx={inputStyle}
            />

            <TextField
              label={t("dashboard.admin.editCar.orderLabel")}
              placeholder="0"
              fullWidth
              type="number"
              variant="outlined"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: e.target.value })
              }
              sx={inputStyle}
            />
          </div>
        </div>
      </DialogContent>

      <DialogActions className="p-8 bg-white/5 border-t border-white/5 flex gap-4">
        <Button
          onClick={onClose}
          variant="text"
          color="inherit"
          disabled={uploading}
          sx={{
            borderRadius: "1.25rem",
            px: 4,
            fontWeight: "900",
            color: "rgba(255,255,255,0.4)",
            fontSize: "1rem",
          }}
        >
          {t("dashboard.admin.editCar.cancel")}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={uploading || updateMutation.isPending}
          fullWidth
          sx={{
            backgroundColor: "var(--primary)",
            "&:hover": { backgroundColor: "var(--primary-hover)" },
            borderRadius: "1.25rem",
            py: 2,
            fontWeight: "900",
            fontSize: "1.1rem",
            boxShadow: "0 15px 30px rgba(10, 35, 115, 0.3)",
          }}
        >
          {uploading ? (
            <div className="flex items-center gap-3">
              <CircularProgress size={20} color="inherit" />{" "}
              {t("dashboard.admin.editCar.uploading")}
            </div>
          ) : updateMutation.isPending ? (
            t("dashboard.admin.editCar.saving")
          ) : (
            t("dashboard.admin.editCar.submit")
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ProfileSection({ user }) {
  const { t } = useTranslation("common");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.phoneNumber.trim()) {
      toast.warning(t("dashboard.user.profile.validationError"));
      return;
    }
    setLoading(true);
    try {
      // Create a payload without email
      const { email, ...updatePayload } = formData;
      await userService.updateProfile(updatePayload);
      toast.success(t("dashboard.user.profile.updateSuccess"));
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(
        error.response?.data?.message ||
          t("dashboard.user.profile.updateError"),
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "1.25rem",
      bgcolor: "rgba(255,255,255,0.03)",
      color: "white",
      "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
      "&.Mui-focused fieldset": { borderColor: "#0A2373" },
      transition: "all 0.3s ease",
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255,255,255,0.4)",
      fontWeight: "bold",
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#0A2373" },
    "& .MuiOutlinedInput-input": { fontWeight: "bold" },
  };

  return (
    <div className="max-w-4xl bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] border border-white/10 p-4 sm:p-6 md:p-10 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-2 h-full bg-primary/20" />
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 items-start mb-6 sm:mb-8 md:mb-10 pb-6 sm:pb-8 md:pb-10 border-b border-white/5">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary/10 rounded-xl sm:rounded-2xl md:rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl border border-primary/20">
          <Person
            sx={{
              fontSize: { xs: 36, sm: 44, md: 54 },
              color: "var(--primary)",
            }}
          />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-1 sm:mb-2 leading-tight">
            {t("dashboard.user.profile.title")}
          </h3>
          <p className="text-slate-400 font-bold text-sm sm:text-base md:text-lg">
            {t("dashboard.user.profile.subtitle")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-6 md:gap-x-10 gap-y-4 sm:gap-y-6 md:gap-y-8">
        <TextField
          label={t("dashboard.user.profile.name")}
          fullWidth
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={!isEditing}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person className="text-primary" />
              </InputAdornment>
            ),
          }}
          sx={inputStyle}
        />
        <TextField
          label={t("dashboard.user.profile.email")}
          fullWidth
          value={formData.email}
          disabled={true}
          variant="outlined"
          helperText={t("dashboard.user.profile.emailHelper")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email className="text-primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            ...inputStyle,
            "& .MuiFormHelperText-root": {
              color: "rgba(255,255,255,0.3)",
              fontWeight: "bold",
              textAlign: "right",
            },
          }}
        />
        <TextField
          label={t("dashboard.user.profile.phone")}
          fullWidth
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          disabled={!isEditing}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone className="text-primary" />
              </InputAdornment>
            ),
          }}
          sx={inputStyle}
        />
      </div>

      <div className="mt-6 sm:mt-8 md:mt-12 flex flex-col-reverse sm:flex-row flex-wrap justify-end gap-3 sm:gap-4 md:gap-6">
        {isEditing ? (
          <>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
              sx={{
                p: 2,
                px: 8,
                borderRadius: "1.25rem",
                fontWeight: "black",
                bgcolor: "var(--primary)",
                "&:hover": { bgcolor: "var(--primary-hover)" },
                boxShadow: "0 15px 25px -5px rgba(10, 35, 115, 0.3)",
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t("dashboard.user.profile.saveButton")
              )}
            </Button>
            <Button
              variant="text"
              onClick={() => setIsEditing(false)}
              sx={{
                borderRadius: "1.25rem",
                fontWeight: "black",
                color: "rgba(255,255,255,0.4)",
                "&:hover": { color: "white", bgcolor: "white/5" },
                px: 6,
              }}
            >
              {t("dashboard.user.profile.cancelButton")}
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            onClick={() => setIsEditing(true)}
            startIcon={<SettingsIcon fontSize="small" sx={{ ml: 1 }} />}
            sx={{
              p: 2,
              px: 8,
              borderRadius: "1.25rem",
              fontWeight: "black",
              bgcolor: "white/10",
              color: "white",
              "&:hover": { bgcolor: "white/20" },
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 20px 40px -10px rgba(0,0,0,0.4)",
            }}
          >
            {t("dashboard.user.profile.editButton")}
          </Button>
        )}
      </div>
    </div>
  );
}

function ChangePasswordSection() {
  const { t } = useTranslation("common");
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSubmit = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      toast.error(t("dashboard.security.errorFillAll"));
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(passwords.newPassword)) {
      toast.error(t("dashboard.security.errorWeakPassword"));
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success(t("dashboard.security.successMessage"));
      setPasswords({
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || t("dashboard.security.errorMessage"),
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "1.25rem",
      bgcolor: "rgba(255,255,255,0.03)",
      color: "white",
      "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
      "&.Mui-focused fieldset": { borderColor: "#0A2373" },
      transition: "all 0.3s ease",
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255,255,255,0.4)",
      fontWeight: "bold",
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#0A2373" },
  };

  return (
    <div className="max-w-4xl bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] border border-white/10 p-4 sm:p-6 md:p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-2 h-full bg-primary/20" />
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 items-start mb-6 sm:mb-8 md:mb-10 pb-6 sm:pb-8 md:pb-10 border-b border-white/5">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary/10 rounded-xl sm:rounded-2xl md:rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl border border-primary/20">
          <Lock
            sx={{
              fontSize: { xs: 36, sm: 44, md: 54 },
              color: "var(--primary)",
            }}
          />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-1 sm:mb-2 leading-tight">
            {t("dashboard.security.title")}
          </h3>
          <p className="text-slate-400 font-bold text-sm sm:text-base md:text-lg">
            {t("dashboard.security.subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-md flex flex-col gap-6 sm:gap-8 md:gap-12 mt-4 sm:mt-6">
        <TextField
          label={t("dashboard.security.currentPassword")}
          type={showCurrentPassword ? "text" : "password"}
          fullWidth
          variant="outlined"
          value={passwords.currentPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, currentPassword: e.target.value })
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock className="text-primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  edge="end"
                  sx={{
                    color: "white !important",
                    opacity: 0.7,
                    "&:hover": {
                      opacity: 1,
                      color: "var(--primary) !important",
                    },
                  }}
                >
                  {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={inputStyle}
        />
        <TextField
          label={t("dashboard.security.newPassword")}
          type={showNewPassword ? "text" : "password"}
          fullWidth
          variant="outlined"
          value={passwords.newPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, newPassword: e.target.value })
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock className="text-primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  edge="end"
                  sx={{
                    color: "white !important",
                    opacity: 0.7,
                    "&:hover": {
                      opacity: 1,
                      color: "var(--primary) !important",
                    },
                  }}
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={inputStyle}
        />

        <div className="mt-6 sm:mt-8 md:mt-12">
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              p: 2.5,
              borderRadius: "1.5rem",
              fontWeight: "black",
              bgcolor: "var(--primary)",
              "&:hover": { bgcolor: "var(--primary-hover)" },
              fontSize: "1.2rem",
              boxShadow: "0 20px 40px -10px rgba(10, 35, 115, 0.4)",
              letterSpacing: "-0.02em",
            }}
          >
            {loading ? (
              <CircularProgress size={28} color="inherit" />
            ) : (
              t("dashboard.security.updateButton")
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ManageNotifications() {
  const { t, i18n } = useTranslation("common");
  const queryClient = useQueryClient();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["adminNotifications"],
    queryFn: () => notificationService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: notificationService.delete,
    onSuccess: () => {
      toast.success(t("notifications.deleteSuccess", "تم حذف الإشعار بنجاح"));
      queryClient.invalidateQueries({ queryKey: ["adminNotifications"] });
      setDeleteDialog(false);
      setSelectedNotif(null);
    },
    onError: () => toast.error(t("common.error")),
  });

  const markAllReadMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      toast.success(
        t("notifications.markAllReadSuccess", "تم تحديد الكل كمقروء"),
      );
      queryClient.invalidateQueries({ queryKey: ["adminNotifications"] });
    },
    onError: () => toast.error(t("common.error")),
  });

  const getTimeAgo = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      const rtf = new Intl.RelativeTimeFormat(
        i18n.language === "ar" ? "ar" : "en",
        { numeric: "auto" },
      );
      if (diffInSeconds < 60) return rtf.format(-diffInSeconds, "second");
      if (diffInSeconds < 3600)
        return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
      if (diffInSeconds < 86400)
        return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
      if (diffInSeconds < 2592000)
        return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
      return rtf.format(-Math.floor(diffInSeconds / 2592000), "month");
    } catch (e) {
      return "";
    }
  };

  if (isLoading) return <CircularProgress className="m-auto block" />;

  const notifications = data?.data?.notifications || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-white">
          {t("dashboard.admin.tabs.notifications")}
        </h2>
        {notifications.length > 0 && (
          <Button
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: "1rem",
              borderColor: "rgba(255,255,255,0.1)",
              color: "white",
              "&:hover": {
                borderColor: "var(--primary)",
                bgcolor: "rgba(10, 35, 115,0.05)",
              },
            }}
          >
            {t("notifications.markAllRead", "تحديد الكل كمقروء")}
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
          <Notifications
            sx={{ fontSize: 64, color: "rgba(255,255,255,0.1)", mb: 2 }}
          />
          <p className="text-slate-500 font-bold">{t("notifications.empty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {(Array.isArray(notifications) ? notifications : [])
            .filter((n) => n !== null)
            .map((notif) => (
              <div
                key={notif._id}
                className={`p-6 rounded-3xl border transition-all flex justify-between items-center group ${
                  notif.isRead
                    ? "bg-white/5 border-white/5"
                    : "bg-primary/5 border-primary/20 shadow-[0_0_20px_rgba(10, 35, 115,0.1)]"
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      notif.type === "booking_new"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {notif.type === "booking_new" ? (
                      <InfoIcon />
                    ) : (
                      <Notifications />
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-lg">
                      {notif.title}
                    </h4>
                    <p className="text-slate-400 font-medium">
                      {notif.message}
                    </p>
                    <span className="text-xs text-slate-500 mt-2 block font-bold">
                      {getTimeAgo(notif.createdAt)}
                    </span>
                  </div>
                </div>
                <IconButton
                  onClick={() => {
                    setSelectedNotif(notif);
                    setDeleteDialog(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  sx={{
                    color: "#ef4444",
                    bgcolor: "rgba(239, 68, 68, 0.1)",
                    "&:hover": { bgcolor: "rgba(239, 68, 68, 0.2)" },
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </div>
            ))}
        </div>
      )}

      {/* Delete Notification Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: "2rem",
            bgcolor: "#0f172a",
            color: "white",
            p: 2,
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "900" }}>
          {t("notifications.deleteConfirmTitle", "حذف الإشعار")}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "slate.400", fontWeight: "bold" }}>
            {t(
              "notifications.deleteConfirmMessage",
              "هل أنت متأكد من حذف هذا الإشعار؟",
            )}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setDeleteDialog(false)}
            sx={{ color: "slate.400", fontWeight: "bold" }}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteMutation.mutate(selectedNotif?._id)}
            disabled={deleteMutation.isPending}
            sx={{ borderRadius: "1rem", fontWeight: "900", px: 4 }}
          >
            {deleteMutation.isPending
              ? t("common.deleting")
              : t("common.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function ManagePromos() {
  const { t, i18n } = useTranslation("common");
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const initialForm = {
    title: "",
    subtitle: "",
    imageUrl: "",
    linkUrl: "",
    layoutType: "image-right",
    isActive: true,
    priority: 0,
  };
  const [formData, setFormData] = useState(initialForm);

  const { data: promoData, isLoading } = useQuery({
    queryKey: ["allPromosAdmin"],
    queryFn: () => promoService.getAllAdmin(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => promoService.create(data),
    onSuccess: () => {
      toast.success(t("promos.messages.createSuccess", "تم إضافة العرض بنجاح"));
      queryClient.invalidateQueries({ queryKey: ["allPromosAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["activePromos"] });
      setIsFormOpen(false);
      setFormData(initialForm);
    },
    onError: (err) =>
      toast.error(
        err.response?.data?.message || err.message || "حدث خطأ أثناء الإضافة",
      ),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => promoService.update(id, data),
    onSuccess: () => {
      toast.success(t("promos.messages.updateSuccess", "تم تحديث العرض بنجاح"));
      queryClient.invalidateQueries({ queryKey: ["allPromosAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["activePromos"] });
      setIsFormOpen(false);
      setEditingPromo(null);
    },
    onError: (err) =>
      toast.error(
        err.response?.data?.message || err.message || "حدث خطأ أثناء التحديث",
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => promoService.delete(id),
    onSuccess: () => {
      toast.success(t("promos.messages.deleteSuccess", "تم حذف العرض بنجاح"));
      queryClient.invalidateQueries({ queryKey: ["allPromosAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["activePromos"] });
    },
    onError: (err) =>
      toast.error(
        err.response?.data?.message || err.message || "حدث خطأ أثناء الحذف",
      ),
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadLoading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      toast.success(t("promos.messages.uploadSuccess", "تم رفع الصورة بنجاح"));
    } catch (error) {
      toast.error(t("promos.messages.uploadError", "حدث خطأ أثناء رفع الصورة"));
    } finally {
      setUploadLoading(false);
    }
  };

  const handleOpenForm = (promo = null) => {
    if (promo) {
      setEditingPromo(promo);
      setFormData({ ...promo });
    } else {
      setEditingPromo(null);
      setFormData(initialForm);
    }
    setIsFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPromo) {
      updateMutation.mutate({ id: editingPromo._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) return <CircularProgress />;

  const promos = promoData?.data || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 p-6 rounded-[2rem] border border-white/10">
        <div className="text-right">
          <Typography className="text-xl sm:text-2xl font-black text-white mb-1">
            {t("promos.title", "إدارة العروض والبنرات")}
          </Typography>
          <Typography className="text-slate-400 font-bold text-sm sm:text-base">
            {t(
              "promos.subtitle",
              "تحكم في العروض الترويجية والبنرات الإعلانية",
            )}
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenForm()}
          sx={{
            borderRadius: "1.25rem",
            fontWeight: "900",
            px: { xs: 3, sm: 4 },
            py: 1.5,
            bgcolor: "primary.main",
            boxShadow: "0 10px 30px rgba(10, 35, 115,0.3)",
            "&:hover": {
              bgcolor: "primary.dark",
              transform: "translateY(-2px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          {t("promos.addNew", "إضافة عرض جديد")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
        {(Array.isArray(promos) ? promos : [])
          .filter((p) => p !== null)
          .map((promo) => (
            <div
              key={promo._id}
              className="group bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-5 flex flex-col gap-5 hover:bg-white/10 transition-all duration-500 overflow-hidden relative shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-1.5 h-full bg-primary/20" />

              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-inner">
                <Image
                  src={promo.imageUrl}
                  alt={promo.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {!promo.isActive && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                    <Chip
                      label={t("promos.status.inactive")}
                      size="small"
                      color="error"
                      sx={{ fontWeight: "900" }}
                    />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-4">
                <div className="flex justify-between items-start gap-3">
                  <Typography className="text-lg font-black text-white truncate leading-tight flex-1">
                    {promo.title}
                  </Typography>
                  <div className="flex gap-2 shrink-0">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenForm(promo)}
                      sx={{
                        color: "white",
                        bgcolor: "white/5",
                        "&:hover": { bgcolor: "primary.main", color: "white" },
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (window.confirm(t("promos.messages.deleteConfirm")))
                          deleteMutation.mutate(promo._id);
                      }}
                      sx={{
                        color: "#ef4444",
                        bgcolor: "rgba(239,68,68,0.1)",
                        "&:hover": { bgcolor: "#ef4444", color: "white" },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </div>
                </div>

                <Typography className="text-slate-400 text-sm font-bold line-clamp-2 leading-relaxed min-h-[40px]">
                  {promo.subtitle}
                </Typography>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5 mt-2">
                  <Chip
                    label={t(
                      `promos.layout.${promo.layoutType.replace(/-([a-z])/g, (g) => g[1].toUpperCase())}`,
                    )}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.05)",
                      color: "slate.300",
                      fontWeight: "900",
                      fontSize: "0.65rem",
                      textTransform: "uppercase",
                    }}
                  />
                  <Chip
                    label={`${t("promos.fields.priority")}: ${promo.priority}`}
                    size="small"
                    sx={{
                      bgcolor: "rgba(10, 35, 115,0.1)",
                      color: "primary.main",
                      fontWeight: "900",
                      fontSize: "0.65rem",
                    }}
                  />
                  {promo.isActive && (
                    <Chip
                      label={t("promos.status.active")}
                      size="small"
                      sx={{
                        bgcolor: "rgba(16,185,129,0.1)",
                        color: "#10b981",
                        fontWeight: "900",
                        fontSize: "0.65rem",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}

        {promos.length === 0 && (
          <Box className="col-span-full py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10 text-center">
            <Typography className="text-slate-400 font-black">
              {t("promos.messages.noData")}
            </Typography>
          </Box>
        )}
      </div>

      <Dialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#0f172a",
            borderRadius: "2.5rem",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
            p: { xs: 2, md: 4 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "900", fontSize: "1.5rem" }}>
          {editingPromo
            ? t("promos.edit", "تعديل العرض")
            : t("promos.addNew", "إضافة عرض جديد")}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4 bg-white/5 p-6 rounded-[2rem] border border-white/10 shadow-inner">
                <Typography className="text-slate-400 font-black mb-2 px-1 text-sm text-right">
                  {t("common.data", "البيانات الأساسية")}
                </Typography>
                <TextField
                  fullWidth
                  label={t("promos.fields.title", "العنوان")}
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  sx={formInputStyle}
                />
                <TextField
                  fullWidth
                  label={t("promos.fields.subtitle", "الوصف")}
                  required
                  multiline
                  rows={2}
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  sx={formInputStyle}
                />
                <TextField
                  fullWidth
                  label={t("promos.fields.linkUrl", "رابط التوجيه")}
                  value={formData.linkUrl}
                  placeholder="(اختياري) https://..."
                  onChange={(e) =>
                    setFormData({ ...formData, linkUrl: e.target.value })
                  }
                  sx={formInputStyle}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormControl fullWidth sx={formInputStyle}>
                    <InputLabel>
                      {t("promos.fields.layoutType", "نوع التنسيق")}
                    </InputLabel>
                    <Select
                      value={formData.layoutType}
                      label={t("promos.fields.layoutType", "نوع التنسيق")}
                      onChange={(e) =>
                        setFormData({ ...formData, layoutType: e.target.value })
                      }
                    >
                      <MenuItem value="image-right">
                        {t("promos.layout.imageRight", "صورة لليمين")}
                      </MenuItem>
                      <MenuItem value="image-left">
                        {t("promos.layout.imageLeft", "صورة لليسار")}
                      </MenuItem>
                      <MenuItem value="full-bg">
                        {t("promos.layout.fullBg", "خلفية كاملة")}
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    type="number"
                    label={t("promos.fields.priority", "الأولوية")}
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: parseInt(e.target.value) || 0,
                      })
                    }
                    sx={formInputStyle}
                  />
                </div>
                <FormControl fullWidth sx={formInputStyle}>
                  <InputLabel>
                    {t("promos.fields.isActive", "الحالة")}
                  </InputLabel>
                  <Select
                    value={formData.isActive}
                    label={t("promos.fields.isActive", "الحالة")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isActive:
                          e.target.value === "true" || e.target.value === true,
                      })
                    }
                  >
                    <MenuItem value={true}>
                      {t("promos.status.active", "نشط")}
                    </MenuItem>
                    <MenuItem value={false}>
                      {t("promos.status.inactive", "غير نشط")}
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
            </form>

            <div className="space-y-6 sticky top-0 self-start">
              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 text-center shadow-inner">
                <Typography className="text-slate-400 font-black mb-4 text-sm text-right px-1">
                  {t("promos.imageLabel", "صورة العرض / البانر")}
                </Typography>

                {formData.imageUrl && (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-2 border border-white/10 group cursor-pointer">
                    <Image
                      src={formData.imageUrl}
                      alt="uploaded preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Typography className="text-white font-bold text-sm tracking-wide">
                        {t("common.changeImage", "انقر لتغيير الصورة")}
                      </Typography>
                    </div>
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                )}

                {!formData.imageUrl && (
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    disabled={uploadLoading}
                    startIcon={
                      uploadLoading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <UploadFile sx={{ fontSize: "2rem !important" }} />
                      )
                    }
                    sx={{
                      borderRadius: "1.5rem",
                      py: 4,
                      borderColor: "rgba(255,255,255,0.1)",
                      color: "slate.400",
                      fontWeight: "900",
                      borderStyle: "dashed",
                      borderWidth: 2,
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "rgba(10, 35, 115,0.05)",
                        color: "primary.main",
                      },
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <span>
                      {uploadLoading
                        ? t("common.loading", "جاري الرفع...")
                        : t("promos.uploadImage", "الرجاء رفع صورة للعرض")}
                    </span>
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Button>
                )}
              </div>

              <div className="hidden lg:block space-y-4">
                <Typography className="text-center text-primary font-black uppercase tracking-widest text-xs">
                  {t("promos.preview", "معاينة العرض")}
                </Typography>
                <PromoPreviewCard data={formData} />
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions
          sx={{ p: 4, gap: 2, borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <Button
            onClick={() => setIsFormOpen(false)}
            sx={{
              color: "slate.400",
              fontWeight: "900",
              borderRadius: "1rem",
              px: 4,
            }}
          >
            {t("common.cancel", "إلغاء")}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              createMutation.isPending ||
              updateMutation.isPending ||
              uploadLoading
            }
            sx={{
              borderRadius: "1rem",
              fontWeight: "900",
              px: 6,
              py: 1.5,
              background:
                "linear-gradient(135deg, var(--primary) 0%, #0A2373 100%)",
              boxShadow: "0 10px 20px rgba(10, 35, 115,0.2)",
              "&:hover": { transform: "translateY(-2px)" },
              transition: "all 0.2s",
            }}
          >
            {uploadLoading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : editingPromo ? (
              t("common.save", "حفظ التعديلات")
            ) : (
              t("promos.addNew", "إضافة عرض جديد")
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function PromoPreviewCard({ data }) {
  const { t } = useTranslation("common");
  const { title, subtitle, imageUrl, layoutType } = data;

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-white/10 glass shadow-2xl min-h-[280px] flex items-center group ${
        layoutType === "full-bg" ? "p-8" : ""
      }`}
    >
      {layoutType === "full-bg" && imageUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={imageUrl}
            alt="preview"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#0f172a] via-[#0f172a]/80 to-transparent" />
        </div>
      )}
      <div
        className={`relative z-10 w-full flex flex-col md:flex-row items-center gap-6 ${layoutType === "image-left" ? "md:flex-row-reverse" : ""}`}
      >
        <div className="flex-1 text-right">
          <div className="inline-block px-3 py-1 bg-primary/20 rounded-full border border-primary/30 mb-4">
            <Typography
              sx={{
                color: "primary.main",
                fontWeight: "900",
                fontSize: "0.6rem",
              }}
            >
              {t("promos.limitedOffer")}
            </Typography>
          </div>
          <Typography className="text-xl md:text-2xl font-black text-white mb-2 leading-tight">
            {title || t("promos.fields.title")}
          </Typography>
          <Typography className="text-slate-400 font-bold text-sm leading-relaxed mb-6 line-clamp-3">
            {subtitle || t("promos.fields.subtitle")}
          </Typography>
          {data.linkUrl && (
            <Button
              variant="contained"
              size="small"
              sx={{ borderRadius: "0.75rem", fontWeight: "900", px: 4 }}
            >
              {t("booking.bookNow")}
            </Button>
          )}
        </div>
        {layoutType !== "full-bg" && (
          <div className="w-full md:w-1/2 aspect-video relative rounded-2xl overflow-hidden border border-white/10">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="preview"
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-white/5 flex items-center justify-center text-[10px] uppercase text-slate-500 font-black">
                No Image
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const formInputStyle = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    borderRadius: "1rem",
    bgcolor: "rgba(255,255,255,0.03)",
    "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
    "&.Mui-focused fieldset": { borderColor: "#0A2373" },
  },
  "& .MuiInputLabel-root": { color: "slate.400", fontWeight: "bold" },
};
