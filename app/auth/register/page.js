"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function RegisterPage() {
  const { t, i18n } = useTranslation("common");
  const { register, user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Removed useEffect that caused duplicate toast
  // The AuthContext.register already handles redirect after successful registration

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error(t("auth.passwordMismatch"));
      return;
    }

    setLoading(true);
    await register(formData);
    setLoading(false);
  };

  return (
    <div className="bg-white/5 backdrop-blur-2xl rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
      <div className="p-5 sm:p-6 md:p-8 lg:p-12">
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <Link href="/" className="inline-block mb-6 relative group">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Image
              src="/images/logo.jpeg"
              alt="C4R Logo"
              width={120}
              height={60}
              priority
              className="object-contain relative z-10 rounded-lg logo-premium-glow"
              style={{
                filter: "brightness(1.2) contrast(1.1)",
                maxHeight: "60px",
                width: "auto",
              }}
            />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t("auth.registerTitle")}
          </h1>
          <p className="text-slate-400 mt-2 text-sm font-bold">
            {t("auth.registerSubtitle")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-5"
          dir={i18n.dir()}
        >
          <div>
            <TextField
              fullWidth
              label={t("auth.name")}
              variant="outlined"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person className="text-primary" />
                  </InputAdornment>
                ),
                className:
                  "rounded-2xl font-bold bg-white/5 text-white hover:bg-white/10 transition-all duration-300",
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                  "&.Mui-focused fieldset": { borderColor: "#f97316" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: "bold",
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#f97316" },
                "& .MuiInputBase-input": { color: "white" },
              }}
            />
          </div>

          <div>
            <TextField
              fullWidth
              label={t("auth.email")}
              variant="outlined"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email className="text-primary" />
                  </InputAdornment>
                ),
                className:
                  "rounded-2xl font-bold bg-white/5 text-white hover:bg-white/10 transition-all duration-300",
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                  "&.Mui-focused fieldset": { borderColor: "#f97316" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: "bold",
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#f97316" },
                "& .MuiInputBase-input": { color: "white" },
              }}
            />
          </div>

          <div>
            <TextField
              fullWidth
              label={t("auth.password")}
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="text-primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "white" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                className:
                  "rounded-2xl font-bold bg-white/5 text-white hover:bg-white/10 transition-all duration-300",
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                  "&.Mui-focused fieldset": { borderColor: "#f97316" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: "bold",
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#f97316" },
                "& .MuiInputBase-input": { color: "white" },
              }}
            />
          </div>

          <div>
            <TextField
              fullWidth
              label={t("auth.confirmPassword")}
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="text-primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "white" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                className:
                  "rounded-2xl font-bold bg-white/5 text-white hover:bg-white/10 transition-all duration-300",
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                  "&.Mui-focused fieldset": { borderColor: "#f97316" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: "bold",
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#f97316" },
                "& .MuiInputBase-input": { color: "white" },
              }}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            className="bg-primary hover:bg-primary-hover text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
            sx={{
              borderRadius: "16px",
              padding: "14px",
              fontSize: "1.1rem",
              textTransform: "none",
              backgroundColor: "var(--primary)",
              "&:hover": { backgroundColor: "var(--primary-hover)" },
            }}
          >
            {loading ? (
              <CircularProgress size={26} sx={{ color: "#3b82f6" }} />
            ) : (
              t("auth.registerButton")
            )}
          </Button>
        </form>

        <div className="mt-6 sm:mt-8 md:mt-10 text-center space-y-4 sm:space-y-6">
          <p className="text-slate-400 text-sm font-bold">
            {t("auth.hasAccount")}{" "}
            <Link
              href="/auth/login"
              className="text-primary hover:text-accent font-black transition-colors"
            >
              {t("auth.loginLink")}
            </Link>
          </p>

          <div className="pt-6 border-t border-white/5">
            <Link
              href="/"
              className="text-slate-500 hover:text-slate-300 text-xs font-black uppercase tracking-widest transition-colors"
            >
              {t("auth.backToHome")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
