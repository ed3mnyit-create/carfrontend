"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/api";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function ResetPasswordForm() {
  const { t, i18n } = useTranslation("common");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(t("auth.passwordMismatch"));
      return;
    }
    if (!token) {
      toast.error(t("auth.tokenMissing")); // Or simplified generic error
      return;
    }

    setLoading(true);
    try {
      const data = await authService.resetPassword(token, password);
      if (data.success) {
        toast.success(t("auth.passwordChanged"));
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      const msg = error?.response?.data?.message || error?.message || t("auth.passwordChangeError");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500 font-bold mb-4">{t("auth.tokenMissing")}</p>
        <Link href="/auth/login">{t("auth.returnToLogin")}</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir={i18n.dir()}>
      <div>
        <TextField
          fullWidth
          label={t("auth.newPassword")}
          variant="outlined"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
                  className="text-slate-400"
                >
                  {showPassword ? (
                    <VisibilityOff className="text-white" />
                  ) : (
                    <Visibility className="text-white" />
                  )}
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
              "& input": { color: "white" },
            },
            "& .MuiInputLabel-root": {
              color: "rgba(255,255,255,0.5)",
              fontWeight: "bold",
            },
            "& .MuiInputLabel-root.Mui-focused": { color: "#f97316" },
          }}
        />
      </div>

      <div>
        <TextField
          fullWidth
          label={t("auth.confirmNewPassword")}
          variant="outlined"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock className="text-primary" />
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
              "& input": { color: "white" },
            },
            "& .MuiInputLabel-root": {
              color: "rgba(255,255,255,0.5)",
              fontWeight: "bold",
            },
            "& .MuiInputLabel-root.Mui-focused": { color: "#f97316" },
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
          <CircularProgress size={26} color="inherit" />
        ) : (
          t("auth.saveChanges")
        )}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  const { t } = useTranslation("common");
  return (
    <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
      <div className="p-8 md:p-12">
        <div className="text-center mb-10">
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
          <h1 className="text-3xl font-black text-white tracking-tight">
            {t("auth.resetTitle")}
          </h1>
          <p className="text-slate-400 mt-2 text-sm font-bold">
            {t("auth.resetSubtitle")}
          </p>
        </div>
        <Suspense
          fallback={
            <div className="text-center py-10">
              <CircularProgress color="primary" />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <Link
            href="/auth/login"
            className="text-slate-500 hover:text-slate-300 text-xs font-black uppercase tracking-widest transition-colors"
          >
            {t("auth.returnToLogin")}
          </Link>
        </div>
      </div>
    </div>
  );
}
