"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { carService, bookingService } from "@/services/api";
import {
  CircularProgress,
  Container,
  TextField,
  Button,
  Grid,
  Divider,
  Dialog,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  CalendarMonth,
  Payments,
  CheckCircleOutline,
  CheckCircle,
  WhatsApp,
  UploadFile,
} from "@mui/icons-material";
import { MuiTelInput } from "mui-tel-input";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const addDaysToDate = (startDate, numberOfDays) => {
  if (!startDate) {
    return "";
  }

  const nextDate = new Date(startDate);
  nextDate.setDate(nextDate.getDate() + Number(numberOfDays || 1));
  return nextDate.toISOString().split("T")[0];
};

const getTieredPricing = (car, numberOfDays, t) => {
  const days = Number(numberOfDays || 1);
  const dailyRate = Number(car?.pricePerDay || 0);
  const weeklyRate = Number(car?.priceWeekly || dailyRate);
  const halfMonthRate = Number(car?.priceHalfMonth || dailyRate);
  const monthlyRate = Number(car?.priceMonthly || dailyRate);

  if (days >= 30) {
    return { label: t("priceMonthly"), rate: monthlyRate };
  }

  if (days >= 15) {
    return { label: t("priceHalfMonth"), rate: halfMonthRate };
  }

  if (days >= 7) {
    return { label: t("priceWeekly"), rate: weeklyRate };
  }

  return { label: t("booking.dailyPrice"), rate: dailyRate };
};

const getDayOptionLabel = (day, t) => {
  const tierLabel = getTieredPricing(null, day, t).label;
  return `${day} ${t("booking.days")} - ${tierLabel}`;
};

export default function BookingPage() {
  const { t, i18n } = useTranslation("common");
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const carId = params.id;

  const [dates, setDates] = useState({
    startDate: "",
    endDate: "",
  });
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [kmPerDay, setKmPerDay] = useState(300);
  const [idCardFile, setIdCardFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    if (!dates.startDate || !dates.endDate) {
      return;
    }

    const start = new Date(dates.startDate);
    const end = new Date(dates.endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0 && diffDays !== numberOfDays) {
      setNumberOfDays(diffDays);
    }
  }, [dates.startDate, dates.endDate, numberOfDays]);

  const handleStartDateChange = (e) => {
    const start = e.target.value;
    setDates(prev => ({
      ...prev,
      startDate: start,
      endDate: start && numberOfDays > 0 ? addDaysToDate(start, numberOfDays) : prev.endDate
    }));
  };

  const handleDaysChange = (e) => {
    const days = Number(e.target.value);
    setNumberOfDays(days);
    if (dates.startDate) {
      setDates(prev => ({
        ...prev,
        endDate: addDaysToDate(prev.startDate, days)
      }));
    }
  };


  // Redirect to login if NOT authenticated
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      toast.info(t("booking.loginRequired"));
      router.replace(`/auth/login?returnUrl=/booking/${carId}`);
    }
  }, [user, authLoading, router, carId, t]);

  const { data: carResponse, isLoading: carLoading } = useQuery({
    queryKey: ["car", carId],
    queryFn: () => carService.getOne(carId),
  });

  const car = carResponse?.data?.car || carResponse?.data || carResponse;

  const createBookingMutation = useMutation({
    mutationFn: (bookingData) => bookingService.create(bookingData),
    onSuccess: () => {
      setShowSuccessDialog(true);
    },
    onError: (error) => {
      console.error("Booking creation error:", error);
      
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.error || 
                          error?.message || 
                          t("booking.submitError");
      
      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-center'
      });
    }
  });

  const uploadToSecureAPI = async (file) => {
    const data = new FormData();
    data.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: data,
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || t("booking.uploadError"));
    return result.url;
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (user?.role === "admin") {
      toast.info(t("booking.adminCannotBook"));
      return;
    }

    // 1. Precise Validation
    if (!dates.startDate || !dates.endDate) {
      toast.error(t("booking.validation.dates"));
      return;
    }

    const start = new Date(dates.startDate);
    const end = new Date(dates.endDate);
    const todayStr = new Date().toISOString().split("T")[0];
    if (dates.startDate < todayStr) {
      toast.error(t("booking.validation.pastDate"));
      return;
    }

    if (numberOfDays < 1) {
      if (end < start) {
        toast.error(t("booking.validation.endDate"));
        return;
      }
    } else {
      if (end <= start) {
        toast.error(t("booking.validation.endDate"));
        return;
      }
    }

    // Phone Validation (WhatsApp)
    // Supports: 05xxxxxxxx, 9665xxxxxxxx, +9665xxxxxxxx, or any international format (min 8 digits)
    if (!phoneNumber || phoneNumber.replace(/\s/g, "").length < 9) {
      toast.error(t("booking.validation.invalidPhone"));
      return;
    }

    if (car?.category !== "with_driver") {
      if (!idCardFile || !licenseFile) {
        toast.error(t("booking.validation.documents"));
        return;
      }
    }

    setUploading(true);
    try {
      // 1. Upload Images Securely
      const [idCardUrl, licenseUrl] = await Promise.all([
        idCardFile ? uploadToSecureAPI(idCardFile) : Promise.resolve(""),
        licenseFile ? uploadToSecureAPI(licenseFile) : Promise.resolve(""),
      ]);

      // 2. Calculate Days
      const diffDays = Number(numberOfDays || 1);

      // 3. Prepare Data
      const bookingData = {
        carId,
        phoneNumber,
        kmPerDay,
        numberOfDays: diffDays,
        driverHours: (car?.category === "with_driver" && Number(numberOfDays || 1) < 1) ? Math.round(Number(numberOfDays || 1) * 24) : 0,
        startDate: dates.startDate,
        endDate: dates.endDate,
        idCardImageUrl: idCardUrl,
        licenseImageUrl: licenseUrl,
      };

      createBookingMutation.mutate(bookingData);
    } catch (error) {
      console.error(error);
      toast.error(t("booking.uploadGeneralError"));
    } finally {
      setUploading(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
    router.push("/dashboard/user");
  };

  if (authLoading || carLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress color="primary" />
      </div>
    );
  }

  if (!user) return null;

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-2xl font-black text-white mb-4">
          {t("carDetails.notFound")}
        </h2>
        <Link href="/cars" className="text-primary font-bold hover:text-primary-hover transition-colors">
          {t("booking.browseCars")}
        </Link>
      </div>
    );
  }

  const imageUrl =
    car?.image ||
    car?.images?.[0]?.url ||
    car?.images?.[0] ||
    "/images/car-home.png";
  const diffDays = Number(numberOfDays || 1);
  const tieredPricing = getTieredPricing(car, diffDays, t);
  let totalPrice = 0;
  const isHourlyWithDriver = car?.category === "with_driver" && diffDays < 1;
  const computedDriverHours = isHourlyWithDriver ? Math.round(diffDays * 24) : 0;

  if (isHourlyWithDriver) {
    // Hourly booking: price is strictly (hourly rate * hours)
    totalPrice = Math.round((car?.driverHourlyRate || 0) * computedDriverHours);
  } else {
    // Daily booking
    totalPrice = Math.round(tieredPricing.rate * diffDays);
  }
  const appliedTierLabel = t("booking.appliedTier");
  const datePlaceholder = t("booking.datePlaceholder");
  const datePlaceholderPosition =
    i18n.dir() === "rtl"
      ? { right: "3rem", textAlign: "right" }
      : { left: "1rem", textAlign: "left" };

  return (
    <div
      className="min-h-screen bg-[#020617] relative overflow-hidden pt-28 pb-24"
      dir={i18n.dir()}
    >
      {/* Background Decorative elements */}
      <div className="absolute top-0 right-0 w-[50%] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[500px] bg-accent/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 opacity-30" />

      <Breadcrumbs items={[{ label: t("booking.breadcrumb") }]} />
      <Container maxWidth="lg" className="pt-8 relative z-10">
        <h1 className="text-lg sm:text-xl md:text-2xl font-black text-white mb-4 sm:mb-6 tracking-tighter leading-tight">
          {t("booking.pageTitlePart1")}{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
            {t("booking.pageTitlePart2")}
          </span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-stretch">
          <div className="flex-1 min-w-0 order-2 lg:order-1">
            <div className="bg-white/5 backdrop-blur-2xl p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden group h-full">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20" />
              <form
                onSubmit={handleBooking}
                className="space-y-6 relative z-10"
              >
                <section>
                  <div className="flex items-center gap-2 mb-3 sm:mb-5 text-white">
                    <div className="p-1.5 sm:p-2 bg-primary/20 rounded-lg border border-primary/30">
                      <CalendarMonth
                        className="text-white"
                        sx={{ fontSize: { xs: 18, sm: 20 } }}
                      />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-black tracking-tight">
                      {t("booking.datesTitle")}
                    </h3>
                  </div>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <div className="relative">
                        {!dates.startDate && (
                          <span
                            className="pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 text-[0.85rem] font-bold text-white/35"
                            style={{
                              width: "calc(100% - 3rem)",
                              ...datePlaceholderPosition,
                            }}
                          >
                            {datePlaceholder}
                          </span>
                        )}
                        <TextField
                          label={t("booking.pickupDate")}
                          type="date"
                          fullWidth
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          value={dates.startDate}
                          onChange={handleStartDateChange}
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                              bgcolor: "rgba(255,255,255,0.03)",
                              color: "white",
                              "& fieldset": {
                                borderColor: "rgba(255,255,255,0.1)",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#f97316",
                              },
                              "& input[type='date']": {
                                color: dates.startDate ? "white" : "transparent",
                                WebkitTextFillColor: dates.startDate ? "white" : "transparent",
                                caretColor: "transparent",
                                paddingRight: "2.5rem",
                              },
                              "& input[type='date']::-webkit-datetime-edit": {
                                color: dates.startDate ? "white" : "transparent",
                                WebkitTextFillColor: dates.startDate ? "white" : "transparent",
                              },
                              "& input[type='date']::-webkit-calendar-picker-indicator": {
                                filter: "invert(1)",
                                opacity: 1,
                                cursor: "pointer",
                                position: "absolute",
                                right: "0.5rem",
                                left: "auto",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "rgba(255,255,255,0.4)",
                              fontWeight: "bold",
                              fontSize: "0.85rem",
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "#f97316",
                            },
                          }}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel
                          sx={{
                            color: "rgba(255,255,255,0.4)",
                            "&.Mui-focused": { color: "#f97316" },
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                          }}
                        >
                          {t("booking.totalDays")}
                        </InputLabel>
                        <Select
                          value={numberOfDays}
                          onChange={handleDaysChange}
                          label={t("booking.totalDays")}
                          sx={{
                            borderRadius: 3,
                            bgcolor: "rgba(255,255,255,0.03)",
                            color: "white",
                            "& fieldset": {
                              borderColor: "rgba(255,255,255,0.1)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#f97316",
                            },
                            "& .MuiSelect-icon": {
                              color: "rgba(255,255,255,0.4)",
                            },
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                bgcolor: "#0f172a",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "white",
                                borderRadius: "1rem",
                                "& .MuiMenuItem-root": {
                                  fontSize: "0.85rem",
                                  fontWeight: "bold",
                                  "&:hover": {
                                    bgcolor: "rgba(255,255,255,0.05)",
                                  },
                                  "&.Mui-selected": {
                                    bgcolor: "rgba(249, 115, 22, 0.2)",
                                    color: "#f97316",
                                    "&:hover": {
                                      bgcolor: "rgba(249, 115, 22, 0.3)",
                                    },
                                  },
                                },
                              },
                            },
                          }}
                        >
                          {car?.category === "with_driver" ? (
                            [
                              <MenuItem key={0.166667} value={0.166667}>4 ساعات</MenuItem>,
                              <MenuItem key={0.333333} value={0.333333}>8 ساعات</MenuItem>,
                              <MenuItem key={0.5} value={0.5}>12 ساعة</MenuItem>,
                              ...Array.from({ length: 30 }, (_, index) => index + 1).map(
                                (day) => (
                                  <MenuItem key={day} value={day}>
                                    {getDayOptionLabel(day, t)}
                                  </MenuItem>
                                ),
                              )
                            ]
                          ) : (
                            Array.from({ length: 30 }, (_, index) => index + 1).map(
                              (day) => (
                                <MenuItem key={day} value={day}>
                                  {getDayOptionLabel(day, t)}
                                </MenuItem>
                              ),
                            )
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div className="relative">
                        {!dates.endDate && (
                          <span
                            className="pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 text-[0.85rem] font-bold text-white/35"
                            style={{
                              width: "calc(100% - 3rem)",
                              ...datePlaceholderPosition,
                            }}
                          >
                            {datePlaceholder}
                          </span>
                        )}
                        <TextField
                          label={t("booking.dropoffDate")}
                          type="date"
                          fullWidth
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          value={dates.endDate}
                          onChange={(e) =>
                            setDates({ ...dates, endDate: e.target.value })
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                              bgcolor: "rgba(255,255,255,0.03)",
                              color: "white",
                              "& fieldset": {
                                borderColor: "rgba(255,255,255,0.1)",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#f97316",
                              },
                              "& input[type='date']": {
                                color: dates.endDate ? "white" : "transparent",
                                WebkitTextFillColor: dates.endDate ? "white" : "transparent",
                                caretColor: "transparent",
                                paddingRight: "2.5rem",
                              },
                              "& input[type='date']::-webkit-datetime-edit": {
                                color: dates.endDate ? "white" : "transparent",
                                WebkitTextFillColor: dates.endDate ? "white" : "transparent",
                              },
                              "& input[type='date']::-webkit-calendar-picker-indicator": {
                                filter: "invert(1)",
                                opacity: 1,
                                cursor: "pointer",
                                position: "absolute",
                                right: "0.5rem",
                                left: "auto",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "rgba(255,255,255,0.4)",
                              fontWeight: "bold",
                              fontSize: "0.85rem",
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "#f97316",
                            },
                          }}
                        />
                      </div>
                    </Grid>

                  </Grid>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-3 sm:mb-5 text-white">
                    <div className="p-1.5 sm:p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                      <WhatsApp
                        className="text-green-500"
                        sx={{ fontSize: { xs: 18, sm: 20 } }}
                      />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-black tracking-tight">
                      {t("booking.contactTitle")}
                    </h3>
                  </div>
                  <MuiTelInput
                    defaultCountry="SA"
                    label={t("booking.whatsappLabel")}
                    fullWidth
                    size="small"
                    value={phoneNumber}
                    onChange={(newPhone) => setPhoneNumber(newPhone)}
                    placeholder={t("booking.whatsappPlaceholder")}
                    helperText={t("booking.whatsappHelper")}
                    required
                    dir="ltr"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        bgcolor: "rgba(255,255,255,0.03)",
                        color: "white",
                        "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                        "&.Mui-focused fieldset": { borderColor: "#22c55e" },
                      },
                      "& .intl-tel-input": { width: "100%" },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255,255,255,0.4)",
                        fontWeight: "bold",
                        fontSize: "0.85rem",
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#22c55e" },
                      "& .MuiFormHelperText-root": {
                        textAlign: "right",
                        fontSize: "0.7rem",
                        color: "rgba(255,255,255,0.3)",
                        mt: 0.5,
                      },
                    }}
                  />
                </section>

                <FormControl fullWidth size="small">
                  <InputLabel
                    sx={{
                      color: "rgba(255,255,255,0.4)",
                      "&.Mui-focused": { color: "#f97316" },
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                    }}
                  >
                    {t("booking.kmPerDay")}
                  </InputLabel>
                  <Select
                    value={kmPerDay}
                    onChange={(e) => setKmPerDay(e.target.value)}
                    label={t("booking.kmPerDay")}
                    sx={{
                      borderRadius: 3,
                      bgcolor: "rgba(255,255,255,0.03)",
                      color: "white",
                      "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                      "&.Mui-focused fieldset": { borderColor: "#f97316" },
                      "& .MuiSelect-icon": { color: "rgba(255,255,255,0.4)" },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: "#0f172a",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "white",
                          borderRadius: "1rem",
                          "& .MuiMenuItem-root": {
                            fontSize: "0.85rem",
                            fontWeight: "bold",
                            "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                            "&.Mui-selected": {
                              bgcolor: "rgba(249, 115, 22, 0.2)",
                              color: "#f97316",
                              "&:hover": { bgcolor: "rgba(249, 115, 22, 0.3)" },
                            },
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value={300}>
                      {t("booking.kmOption", { km: 300 })}
                    </MenuItem>
                  </Select>
                </FormControl>

                {car?.category !== "with_driver" && (
                <section>
                  <div className="flex items-center gap-2 mb-3 sm:mb-5 text-white">
                    <div className="p-1.5 sm:p-2 bg-primary/20 rounded-lg border border-primary/30">
                      <UploadFile
                        className="text-primary"
                        sx={{ fontSize: { xs: 18, sm: 20 } }}
                      />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-black tracking-tight">
                      {t("booking.documentsTitle")}
                    </h3>
                  </div>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <div
                        className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center cursor-pointer relative transition-all duration-500 overflow-hidden group/upload ${
                          idCardFile
                            ? "border-green-500/50 bg-green-500/5 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer z-20"
                          onChange={(e) => setIdCardFile(e.target.files[0])}
                        />
                        <div className="relative z-10">
                          {idCardFile ? (
                            <CheckCircle className="mb-2 text-green-500 text-3xl block mx-auto animate-in zoom-in duration-500" />
                          ) : (
                            <UploadFile className="mb-2 text-primary text-3xl block mx-auto group-hover/upload:scale-110 transition-transform duration-500" />
                          )}
                          <p className="font-black text-white text-sm">
                            {t("booking.idCardLabel")}
                          </p>
                          <p
                            className={`text-[10px] mt-1 font-bold truncate px-2 ${idCardFile ? "text-green-400" : "text-slate-500"}`}
                          >
                            {idCardFile
                              ? idCardFile.name
                              : t("booking.uploadHint")}
                          </p>
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div
                        className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center cursor-pointer relative transition-all duration-500 overflow-hidden group/upload ${
                          licenseFile
                            ? "border-green-500/50 bg-green-500/5 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer z-20"
                          onChange={(e) => setLicenseFile(e.target.files[0])}
                        />
                        <div className="relative z-10">
                          {licenseFile ? (
                            <CheckCircle className="mb-2 text-green-500 text-3xl block mx-auto animate-in zoom-in duration-500" />
                          ) : (
                            <UploadFile className="mb-2 text-primary text-3xl block mx-auto group-hover/upload:scale-110 transition-transform duration-500" />
                          )}
                          <p className="font-black text-white text-sm">
                            {t("booking.licenseLabel")}
                          </p>
                          <p
                            className={`text-[10px] mt-1 font-bold truncate px-2 ${licenseFile ? "text-green-400" : "text-slate-500"}`}
                          >
                            {licenseFile
                              ? licenseFile.name
                              : t("booking.uploadHint")}
                          </p>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </section>
                )}

                <div className="bg-primary/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-primary/20 flex items-start gap-2 sm:gap-3">
                  <CheckCircleOutline
                    className="text-primary mt-1"
                    fontSize="small"
                  />
                  <div>
                    <p className="text-sm sm:text-base font-black text-white">
                      <Link href="/terms" className="hover:text-primary transition-colors underline decoration-white/20 underline-offset-4">
                        {t("booking.policyTitle")}
                      </Link>
                    </p>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-500 leading-relaxed">
                      {t("booking.policyText")}
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={uploading || createBookingMutation.isPending}
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: "black",
                    fontSize: "1rem",
                    backgroundColor: "var(--primary)",
                    "&:hover": { backgroundColor: "var(--primary-hover)" },
                    boxShadow: "0 10px 20px -5px rgba(249, 115, 22, 0.4)",
                  }}
                >
                  {uploading ? (
                    <div className="flex items-center gap-3">
                      <CircularProgress size={24} color="inherit" />{" "}
                      {t("booking.uploading")}
                    </div>
                  ) : createBookingMutation.isPending ? (
                    <div className="flex items-center gap-3">
                      <CircularProgress size={24} color="inherit" />{" "}
                      {t("booking.processing")}
                    </div>
                  ) : (
                    t("booking.submitButton")
                  )}
                </Button>
              </form>
            </div>
          </div>

          <div className="flex-1 min-w-0 order-1 lg:order-2">
            <div className="lg:sticky lg:top-[120px]">
              <div className="bg-white/5 backdrop-blur-3xl p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

                <div className="relative -mx-3 sm:-mx-4 md:-mx-6 -mt-3 sm:-mt-4 md:-mt-6 mb-3 sm:mb-4 overflow-hidden border-b border-white/10 bg-white/5 h-48 sm:h-56">
                  <Image
                    src={imageUrl}
                    alt={car?.name || t("booking.carImageAlt")}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-midnight/80 via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="mb-3 sm:mb-4 relative z-10">
                  <h2 className="text-lg sm:text-xl font-black text-white mb-1 tracking-tighter">
                    {car?.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="bg-primary px-2 py-0.5 rounded-full text-[9px] font-black text-white shadow-lg">
                      {t("booking.yearLabel", { year: car?.year })}
                    </span>
                    <span className="text-slate-500 font-bold text-[10px]">
                      {t("booking.modelLabel")}
                    </span>
                  </div>
                </div>

                <Divider
                  sx={{ mb: 4, borderColor: "rgba(255,255,255,0.05)" }}
                />

                <div className="space-y-2 sm:space-y-3 relative z-10">
                  {isHourlyWithDriver ? (
                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="text-slate-400 font-bold">
                        {t("booking.driverHourlyRate") || "التكلفة بالساعة"}:
                      </span>
                      <span className="font-black text-white">
                        {car?.driverHourlyRate || 0} {t("common.currency")}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-slate-400 font-bold">
                          {t("booking.dailyPrice")}:
                        </span>
                        <span className="font-black text-white">
                          {tieredPricing.rate} {t("common.currency")}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-slate-400 font-bold">
                          {appliedTierLabel}:
                        </span>
                        <span className="font-black text-white">
                          {tieredPricing.label}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-slate-400 font-bold">
                      {t("booking.duration")}:
                    </span>
                    <span className="font-black text-white">
                      {isHourlyWithDriver
                        ? `${computedDriverHours} ${t("common.hours")}`
                        : `${diffDays} ${t("booking.days")}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm font-black">
                    <span className="text-slate-400 font-bold">
                      {t("booking.vat")}:
                    </span>
                    <span className="text-green-400">
                      {t("booking.vatIncluded")}
                    </span>
                  </div>

                  <div className="pt-4 mt-1 border-t border-white/10 flex justify-between items-end">
                    <div>
                      <span className="text-slate-500 font-bold text-[10px] block mb-0.5">
                        {t("booking.total")}:
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-primary tracking-tighter">
                        {totalPrice}
                      </span>
                    </div>
                    <span className="text-sm sm:text-base font-black text-primary/60 pb-0.5">
                      {t("common.currency")}
                    </span>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-500/5 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 border border-green-500/10">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg sm:rounded-xl flex items-center justify-center shadow-inner text-green-500">
                    <Payments sx={{ fontSize: { xs: 16, sm: 20 } }} />
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-green-500 font-bold leading-relaxed">
                    {t("booking.paymentHint")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>



      <Dialog
        open={showSuccessDialog}
        onClose={handleCloseSuccess}
        PaperProps={{
          sx: {
            borderRadius: "2.5rem",
            padding: 3,
            textAlign: "center",
            maxWidth: 450,
            bgcolor: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
          },
        }}
      >
        <DialogContent className="flex flex-col items-center pt-8 pb-4">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
            <CheckCircle className="text-green-500" sx={{ fontSize: 48 }} />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">
            {t("booking.successTitle")}
          </h2>
          <p className="text-slate-400 text-center leading-relaxed font-bold">
            {t("booking.successMessagePart1")}{" "}
            <span className="text-primary font-black">
              {t("booking.successMessagePart2")}
            </span>
            . {t("booking.successMessagePart3")}
          </p>
        </DialogContent>
        <DialogActions className="justify-center pb-8 pt-4">
          <Button
            variant="contained"
            onClick={handleCloseSuccess}
            sx={{
              borderRadius: "1.25rem",
              px: 8,
              py: 2,
              fontWeight: "900",
              fontSize: "1rem",
              backgroundColor: "var(--primary)",
              "&:hover": { backgroundColor: "var(--primary-hover)" },
              boxShadow: "0 10px 20px rgba(249, 115, 22, 0.3)",
            }}
          >
            {t("booking.successButton")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
