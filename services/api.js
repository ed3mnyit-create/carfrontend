import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://c4r-platform-backend.vercel.app/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "حدث خطأ غير متوقع";

      if (status === 401) {
        // dispatch logout action if needed or just reject
      } else if (status === 400) {
        toast.error(`خطأ في البيانات: ${message}`);
      } else if (status === 403) {
        toast.error(`غير مصرح لك: ${message}`);
      } else if (status === 500) {
        toast.error(`خطأ في الخادم: يرجى المحاولة لاحقاً.`);
      }
    } else {
      toast.error("تعذر الاتصال بالخادم. يرجى التحقق من الشبكة.");
    }
    return Promise.reject(error);
  },
);

// Auth Services
export const authService = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },
  resetPassword: async (token, newPassword) => {
    const response = await api.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  },
  changePassword: async (passwords) => {
    const response = await api.put("/auth/change-password", passwords);
    return response.data;
  },
  logout: async () => {
    const response = await api.get("/auth/logout");
    return response.data;
  },
};

// User Services
export const userService = {
  getAll: async (params) => {
    try {
      const response = await api.get("/users", { params });
      return response.data;
    } catch (error) {
      console.error("userService.getAll error:", error);
      throw error;
    }
  },
  getProfile: async () => {
    try {
      const response = await api.get("/users/profile");
      return response.data;
    } catch (error) {
      console.error("userService.getProfile error:", error);
      throw error;
    }
  },
  updateProfile: async (userData) => {
    try {
      const response = await api.put("/users/profile", userData);
      return response.data;
    } catch (error) {
      console.error("userService.updateProfile error:", error);
      throw error;
    }
  },
  // Admin only
  update: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error("userService.update error:", error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("userService.delete error:", error);
      throw error;
    }
  },
};

// Booking Services (for Dashboard)
export const bookingService = {
  create: async (bookingData) => {
    try {
      const response = await api.post("/bookings", bookingData);
      return response.data;
    } catch (error) {
      console.error("bookingService.create error:", error);
      throw error;
    }
  },
  getAll: async (params) => {
    try {
      const response = await api.get("/bookings", { params });
      return response.data;
    } catch (error) {
      console.error("bookingService.getAll error:", error);
      throw error;
    }
  },
  getOne: async (id) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      // If 404, we might want to return null for graceful UI handling
      if (error.response?.status === 404) return null;
      console.error("bookingService.getOne error:", error);
      throw error;
    }
  },
  approve: async (id) => {
    try {
      const response = await api.patch(`/bookings/${id}/approve`);
      return response.data;
    } catch (error) {
      console.error("bookingService.approve error:", error);
      throw error;
    }
  },
  reject: async (id) => {
    try {
      const response = await api.patch(`/bookings/${id}/reject`);
      return response.data;
    } catch (error) {
      console.error("bookingService.reject error:", error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error("bookingService.delete error:", error);
      throw error;
    }
  },
};

// Car Services (for Admin Dashboard)
const sanitizeCarParams = (params = {}) => {
  const allowedRegions = new Set(["riyadh", "jeddah", "eastern", "sharqiya"]);
  const allowedCategories = new Set(["regular", "with_driver", "corporate"]);

  return Object.entries(params).reduce((cleanParams, [key, value]) => {
    if (value === undefined || value === null || value === "") return cleanParams;
    if (key === "region" && !allowedRegions.has(value)) return cleanParams;
    if (key === "category" && !allowedCategories.has(value)) return cleanParams;

    cleanParams[key] = value;
    return cleanParams;
  }, {});
};

export const carService = {
  getAll: async (params) => {
    try {
      const response = await api.get("/cars", { params: sanitizeCarParams(params) });
      return response.data;
    } catch (error) {
      console.error("carService.getAll error:", error);
      throw error;
    }
  },
  getOne: async (id) => {
    try {
      const response = await api.get(`/cars/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return null;
      console.error("carService.getOne error:", error);
      throw error;
    }
  },
  create: async (carData) => {
    try {
      const response = await api.post("/cars", carData);
      return response.data;
    } catch (error) {
      console.error("carService.create error:", error);
      throw error;
    }
  },
  update: async (id, carData) => {
    try {
      const response = await api.put(`/cars/${id}`, carData);
      return response.data;
    } catch (error) {
      console.error("carService.update error:", error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/cars/${id}`);
      return response.data;
    } catch (error) {
      console.error("carService.delete error:", error);
      throw error;
    }
  },
};

// Review Services
export const reviewService = {
  create: async (reviewData) => {
    const response = await api.post("/reviews", reviewData);
    return response.data;
  },
  getAllCarReviews: async (carId) => {
    const response = await api.get(`/reviews/car/${carId}`);
    return response.data;
  },
  getUserReviews: async () => {
    const response = await api.get("/reviews/user");
    return response.data;
  },
  getRecent: async () => {
    const response = await api.get("/reviews/recent");
    return response.data;
  },
  // Admin only
  getAllAdmin: async (params) => {
    const response = await api.get("/reviews/admin/all", { params });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};

// Notification Services
export const notificationService = {
  getAll: async () => {
    const response = await api.get("/notifications");
    return response.data;
  },
  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await api.patch("/notifications/mark-all-read");
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};

// Category Services
export const categoryService = {
  getAll: async () => {
    const response = await api.get("/categories");
    return response.data;
  },
  getOne: async (slug) => {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/categories", data);
    return response.data;
  },
  update: async (slug, data) => {
    const response = await api.put(`/categories/${slug}`, data);
    return response.data;
  },
  delete: async (slug) => {
    const response = await api.delete(`/categories/${slug}`);
    return response.data;
  },
};

// Blog Services
export const blogService = {
  getAll: async (params) => {
    const response = await api.get("/blogs", { params });
    return response.data;
  },
  getOne: async (slug) => {
    const response = await api.get(`/blogs/${slug}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/blogs", data);
    return response.data;
  },
  update: async (slug, data) => {
    const response = await api.put(`/blogs/${slug}`, data);
    return response.data;
  },
  delete: async (slug) => {
    const response = await api.delete(`/blogs/${slug}`);
    return response.data;
  },
};

// Setting Services
export const settingService = {
  getAll: async () => {
    const response = await api.get("/settings");
    return response.data;
  },
  getOne: async (key) => {
    const response = await api.get(`/settings/${key}`);
    return response.data;
  },
  upsert: async (data) => {
    const response = await api.post("/settings", data);
    return response.data;
  },
};

// Promo Services
export const promoService = {
  getAllActive: async () => {
    const response = await api.get("/promos");
    return response.data;
  },
  getAllAdmin: async () => {
    const response = await api.get("/promos/admin");
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/promos", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/promos/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/promos/${id}`);
    return response.data;
  },
};

export default api;
