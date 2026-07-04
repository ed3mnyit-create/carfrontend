"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authService } from "@/services/api";
import {
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Email, ArrowForward } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function ForgotPasswordPage() {
  const { t, i18n } = useTranslation("common");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authService.forgotPassword(email);
      if (data.success) {
        if (data.data?.resetToken) {
          toast.info(
            "تم العثور على رمز الاستعادة (بيئة تجريبية). جارٍ تحويلك...",
          );
          router.push(`/auth/reset-password?token=${data.data.resetToken}`);
        } else {
          toast.success(data.message || t("auth.resetLinkSent"));
        }
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      const msg = error?.response?.data?.message || error?.message || t("auth.resetLinkError");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
      <div className="p-8 md:p-12">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6 relative group">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Image
              src="/images/c4r-logo-official.png"
              alt="C4R Logo"
              width={120}
              height={60}
              priority
              className="object-contain relative z-10 logo-premium-glow"
              style={{
                maxHeight: "60px",
                width: "auto",
              }}
            />
          </Link>
          <h1 className="text-3xl font-black text-white tracking-tight">
            {t("auth.forgotTitle")}
          </h1>
          <p className="text-slate-400 mt-2 text-sm font-bold">
            {t("auth.forgotSubtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" dir={i18n.dir()}>
          <div>
            <TextField
              fullWidth
              label={t("auth.email")}
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                  "&.Mui-focused fieldset": { borderColor: "#0A2373" },
                  "& input": { color: "white" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: "bold",
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#0A2373" },
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
              t("auth.sendResetLink")
            )}
          </Button>
        </form>

        <div className="mt-10 text-center space-y-6">
          <Link
            href="/auth/login"
            className="text-primary hover:text-accent font-black text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowForward
              fontSize="small"
              className={`transform ${i18n.dir() === "rtl" ? "rotate-180" : ""}`}
            />
            {t("auth.returnToLogin")}
          </Link>

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
