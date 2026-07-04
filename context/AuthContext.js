"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { authService, userService } from "@/services/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const AuthContext = createContext();

const getSafeReturnUrl = (value) => {
  if (!value || typeof value !== "string") return "/";
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
};

export const AuthProvider = ({ children }) => {
  const { t } = useTranslation("common");
  // HYDRATION FIX: Always start with null to match the server render.
  // localStorage is read inside useEffect to avoid server/client mismatch.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const clearClientSession = () => {
    Cookies.remove("token");
    if (typeof window !== "undefined") {
      localStorage.removeItem("c4r_user");
    }
    setUser(null);
  };

  const clearServerSession = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Session clear failed:", error);
    }
  };

  const syncServerSession = async () => {
    try {
      await fetch("/api/auth/session", {
        method: "POST",
      });
    } catch (error) {
      console.error("Session sync failed:", error);
    }
  };

  // Load user from cache first (instant), then verify with server
  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === "undefined") return;

      // Step 1: Instantly restore cached user for fast UI
      const cachedUser = localStorage.getItem("c4r_user");
      if (cachedUser) {
        try {
          const parsedUser = JSON.parse(cachedUser);
          if (parsedUser && typeof parsedUser === 'object' && parsedUser._id && parsedUser.role) {
            setUser(parsedUser);
          } else {
            localStorage.removeItem("c4r_user");
          }
        } catch (e) {
          localStorage.removeItem("c4r_user");
        }
      }

      // Step 2: Verify token with server
      const token = Cookies.get("token");

      if (token) {
        try {
          const profile = await userService.getProfile();
          if (profile.success) {
            setUser(profile.data);
            localStorage.setItem("c4r_user", JSON.stringify(profile.data));
          } else {
            // Token might be invalid
            clearClientSession();
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          if (error.response?.status === 401 || error.response?.status === 403) {
            clearClientSession();
          }
        }
      } else {
        // No token, ensure local state is clear
        clearClientSession();
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials, options = {}) => {
    try {
      const loginPayload = credentials.email
        ? { email: credentials.email, password: credentials.password }
        : {
            nationalId: credentials.nationalId,
            saudiNationalId: credentials.saudiNationalId,
            identityNumber: credentials.identityNumber,
            password: credentials.password,
          };

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginPayload),
      });
      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        const { user } = data.data;
        setUser(user);
        localStorage.setItem("c4r_user", JSON.stringify(user));
        toast.success(t("feedback.auth.loginSuccess"));

        // Handle redirection
        const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
        const returnUrl = searchParams ? searchParams.get("returnUrl") : null;
        const targetUrl = getSafeReturnUrl(options.redirectTo || returnUrl);

        if (typeof window !== "undefined") {
          window.location.assign(targetUrl);
        } else {
          router.push(targetUrl);
        }
        return true;
      } else {
        toast.error(data?.message || t("feedback.auth.loginError"));
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      const msg = error?.response?.data?.message || error?.message || t("feedback.common.error");
      toast.error(msg);
      return false;
    }
  };

  const register = async (userData, options = {}) => {
    try {
      const data = await authService.register(userData);
      if (data && data.success) {
        toast.success(t("feedback.auth.signupSuccess"));

        if (options.autoLogin) {
          const profileRedirect = options.redirectTo || "/dashboard/user?tab=profile";
          const didLogin = await login(
            {
              email: userData.email,
              nationalId: userData.nationalId,
              saudiNationalId: userData.saudiNationalId,
              identityNumber: userData.identityNumber,
              password: userData.password,
            },
            { redirectTo: profileRedirect },
          );

          if (didLogin) return true;

          router.push(
            `/auth/login?returnUrl=${encodeURIComponent(profileRedirect)}`,
          );
          return true;
        }

        router.push(options.redirectTo || "/auth/login");
        return true;
      } else {
        toast.error(data?.message || t("feedback.common.error"));
        return false;
      }
    } catch (error) {
      console.error("Register error:", error);
      const msg = error?.response?.data?.message || error?.message || t("feedback.common.error");
      toast.error(msg);
      return false;
    }
  };

  const logout = async () => {
    try {
      await clearServerSession();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearClientSession();
      router.push("/");
      toast.success(t("feedback.auth.logoutSuccess"));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
