"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Badge, Lock } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import {
  buildNationalIdAccountEmail,
  isValidSaudiNationalId,
  normalizeNationalId,
} from "@/lib/saudiNationalId";

export default function LoginPage() {
  const { t, i18n } = useTranslation("common");
  const { login, user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isArabic = i18n.language?.startsWith("ar");
  const loginIdentifierLabel = t("auth.loginIdentifier", {
    defaultValue: isArabic ? "رقم الهوية أو البريد الإلكتروني" : "National ID or Email",
  });
  const loginIdentifierHelper = t("auth.loginIdentifierHelper", {
    defaultValue: isArabic
      ? "الحسابات الجديدة تدخل برقم الهوية، والحسابات القديمة يمكنها الدخول بالبريد الإلكتروني"
      : "New accounts use national ID. Existing accounts can still sign in with email",
  });

  const getSafeReturnUrl = (value) => {
    if (!value || typeof value !== "string") return "/";
    if (!value.startsWith("/") || value.startsWith("//")) return "/";
    return value;
  };

  useEffect(() => {
    if (user) {
      const params =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search)
          : null;
      const returnUrl = params?.get("returnUrl");
      router.push(getSafeReturnUrl(returnUrl));
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const identifier = formData.identifier.trim();
    const nationalId = normalizeNationalId(identifier);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    if (!isEmail && !isValidSaudiNationalId(nationalId)) {
      toast.error(
        t("auth.invalidLoginIdentifier", {
          defaultValue: isArabic
            ? "أدخل رقم هوية سعودي صحيح أو بريد إلكتروني صحيح"
            : "Enter a valid Saudi national ID or a valid email address",
        }),
      );
      return;
    }

    setLoading(true);
    await login({
      email: isEmail
        ? identifier.toLowerCase()
        : buildNationalIdAccountEmail(nationalId),
      nationalId: isEmail ? undefined : nationalId,
      saudiNationalId: isEmail ? undefined : nationalId,
      identityNumber: isEmail ? undefined : nationalId,
      password: formData.password,
    });
    setLoading(false);
  };

  return (
    <div className="bg-white/5 backdrop-blur-2xl rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
      <div className="p-6 sm:p-8 md:p-12">
        <div className="text-center mb-8 md:mb-10">
          <Link href="/" className="inline-block mb-4 md:mb-6 relative group">
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
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {t("auth.welcomeTitle")}
          </h1>
          <p className="text-slate-400 mt-2 text-[13px] md:text-sm font-bold">
            {t("auth.welcomeSubtitle")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-6"
          dir={i18n.dir()}
        >
          <div>
            <TextField
              fullWidth
              label={loginIdentifierLabel}
              variant="outlined"
              type="text"
              inputMode="email"
              autoComplete="username"
              value={formData.identifier}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  identifier: e.target.value,
                })
              }
              required
              helperText={loginIdentifierHelper}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Badge className="text-primary" />
                  </InputAdornment>
                ),
                className:
                  "rounded-2xl font-bold bg-white/5 text-white hover:bg-white/10 transition-all duration-300",
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                  "&.Mui-focused fieldset": {
                    borderColor: "#0A2373",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: "bold",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#0A2373",
                },
                "& .MuiInputBase-input": {
                  color: "white",
                },
                "& .MuiFormHelperText-root": {
                  color: "rgba(255,255,255,0.45)",
                  fontWeight: "bold",
                },
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
                  "&.Mui-focused fieldset": {
                    borderColor: "#0A2373",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: "bold",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#0A2373",
                },
                "& .MuiInputBase-input": {
                  color: "white",
                },
              }}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/auth/forgot-password"
              className="text-primary hover:text-accent font-bold transition-colors"
            >
              {t("auth.forgotPassword")}
            </Link>
          </div>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            className="bg-primary hover:bg-primary-hover text-white font-black py-3.5 md:py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
            sx={{
              borderRadius: "16px",
              padding: { xs: "12px", md: "14px" },
              fontSize: { xs: "1rem", md: "1.1rem" },
              textTransform: "none",
              backgroundColor: "var(--primary)",
              "&:hover": {
                backgroundColor: "var(--primary-hover)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={26} sx={{ color: "#3b82f6" }} />
            ) : (
              t("auth.loginButton")
            )}
          </Button>
        </form>

        <div className="mt-6 sm:mt-8 md:mt-10 text-center space-y-4 sm:space-y-6">
          <p className="text-slate-400 text-sm font-bold">
            {t("auth.noAccount")}{" "}
            <Link
              href="/auth/register"
              className="text-primary hover:text-accent font-black transition-colors"
            >
              {t("auth.createAccount")}
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
