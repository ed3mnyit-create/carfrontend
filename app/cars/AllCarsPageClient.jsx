"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { carService } from "@/services/api";
import CarCard from "@/components/cards/CarCard";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { 
  CircularProgress, 
  Container, 
  Button, 
  Box, 
  Typography, 
  Slider, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  IconButton,
  Collapse,
  Badge
} from "@mui/material";
import { DirectionsCar, FilterList, Close, SearchOff, RestartAlt } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

export default function AllCarsPageClient() {
  const { t, i18n } = useTranslation("common");
  const [page, setPage] = useState(1);
  const [allCars, setAllCars] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const limit = 9;

  // Filter States
  const [filters, setFilters] = useState({
    region: "",
    category: "",
    minPrice: 0,
    maxPrice: 15000,
  });

  const [tempPrice, setTempPrice] = useState([0, 15000]);

  // Query Key includes filters to refetch on change
  const {
    data: carsData,
    isLoading,
    isRefetching,
    error,
  } = useQuery({
    queryKey: ["allCars", page, filters.region, filters.category, filters.minPrice, filters.maxPrice],
    queryFn: () => carService.getAll({ 
      page, 
      limit, 
      region: filters.region || undefined,
      category: filters.category || undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice
    }),
    placeholderData: (previousData) => previousData,
  });

  // Handle data appending and filter resets
  useEffect(() => {
    if (!carsData?.data?.cars) return;

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;

      if (page === 1) {
        // Reset list on new filter/page 1
        setAllCars(carsData.data.cars);
        return;
      }

      // Append on next pages
      setAllCars((prev) => {
        const newData = carsData.data.cars.filter(
          (newCar) => !prev.some((oldCar) => oldCar._id === newCar._id)
        );
        return [...prev, ...newData];
      });
    });

    return () => {
      cancelled = true;
    };
  }, [carsData, page]);

  // Reset page to 1 when filters change
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
    setAllCars([]); // Clear immediately for visual feedback
  };

  const resetFilters = () => {
    setFilters({ region: "", category: "", minPrice: 0, maxPrice: 15000 });
    setTempPrice([0, 15000]);
    setPage(1);
    setAllCars([]);
  };

  const hasMore = carsData?.data?.pagination?.totalPages > page;
  const activeFiltersCount = Object.values(filters).filter(v => v !== "" && v !== 0 && v !== 15000).length;

  if (isLoading && page === 1 && allCars.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 bg-[#020617]">
        <CircularProgress size={60} thickness={5} sx={{ color: 'var(--primary)' }} />
        <Typography className="mt-6 text-white/40 font-black animate-pulse uppercase tracking-[0.2em]">
          {t("carsPage.loadingFleet", "Loading Fleet...")}
        </Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] pt-28 pb-20 overflow-hidden relative" dir={i18n.dir()}>
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 opacity-30" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -z-10 opacity-30" />

      <Breadcrumbs items={[{ label: t("carsPage.breadcrumb") }]} />
      
      <Container maxWidth="xl" className="pt-12 relative z-10">
        {/* Header Section */}
        <section className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-2 rounded-full mb-6 border border-primary/20 shadow-[0_0_30px_rgba(249,115,22,0.15)]"
          >
            <DirectionsCar fontSize="small" />
            <span className="font-black text-xs uppercase tracking-widest">
              {t("carsPage.badge")}
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tighter"
          >
            {t("carsPage.titlePart1")}{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient-x">
              {t("carsPage.titlePart2")}
            </span>{" "}
            {t("carsPage.titlePart3")}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto font-bold text-lg md:text-xl leading-relaxed"
          >
            {t("carsPage.subtitle")}
          </motion.p>
        </section>

        {/* Filter Toggle & Summary */}
        <section className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <Button
                variant="contained"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                startIcon={<Badge badgeContent={activeFiltersCount} color="error"><FilterList /></Badge>}
                sx={{
                  borderRadius: "1.25rem",
                  fontWeight: "900",
                  px: 4,
                  py: 1.5,
                  bgcolor: isFilterOpen ? "primary.main" : "rgba(255,255,255,0.05)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.1)",
                  "&:hover": { bgcolor: "primary.dark" },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              >
                {t("cars.filter")}
              </Button>
              {activeFiltersCount > 0 && (
                <IconButton onClick={resetFilters} sx={{ color: 'white/40', bgcolor: 'white/5', "&:hover": { color: 'white', bgcolor: 'white/10' } }}>
                  <RestartAlt />
                </IconButton>
              )}
          </div>
          
          <Typography className="text-slate-500 font-black text-sm uppercase tracking-widest">
             {t("common.totalResults", "Total Results:")} <span className="text-white ml-2">{carsData?.data?.pagination?.total || allCars.length}</span>
          </Typography>
        </section>

        {/* Filter Panel (Glassmorphic) */}
        <Collapse in={isFilterOpen}>
          <Box className="mb-12 p-8 rounded-[2.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Region Filter */}
              <FormControl fullWidth variant="outlined" sx={filterInputStyle}>
                <InputLabel>{t("dashboard.admin.addCar.regionLabel")}</InputLabel>
                <Select
                  value={filters.region}
                  label={t("dashboard.admin.addCar.regionLabel")}
                  onChange={(e) => handleFilterChange({ region: e.target.value })}
                >
                  <MenuItem value="">{t("common.all", "All")}</MenuItem>
                  <MenuItem value="riyadh">{t("regions.riyadh")}</MenuItem>
                  <MenuItem value="jeddah">{t("regions.jeddah")}</MenuItem>
                  <MenuItem value="eastern">{t("regions.eastern")}</MenuItem>
                </Select>
              </FormControl>

              {/* Category Filter */}
              <FormControl fullWidth variant="outlined" sx={filterInputStyle}>
                <InputLabel>{t("dashboard.admin.addCar.categoryLabel")}</InputLabel>
                <Select
                  value={filters.category}
                  label={t("dashboard.admin.addCar.categoryLabel")}
                  onChange={(e) => handleFilterChange({ category: e.target.value })}
                >
                  <MenuItem value="">{t("common.all", "All")}</MenuItem>
                  <MenuItem value="regular">{t("carCard.categories.regular")}</MenuItem>
                  <MenuItem value="with_driver">{t("carCard.categories.with_driver")}</MenuItem>
                  <MenuItem value="corporate">{t("carCard.categories.corporate")}</MenuItem>
                </Select>
              </FormControl>

              {/* Price Range Filter */}
              <div className="lg:col-span-2 px-4">
                <div className="flex justify-between items-center mb-4">
                  <Typography className="text-white/60 font-black text-xs uppercase tracking-widest">{t("common.priceRange", "Price Range")}</Typography>
                  <Typography className="text-primary font-black">{tempPrice[0]} - {tempPrice[1]} <span className="text-xs">{t("common.currency")}</span></Typography>
                </div>
                <Slider
                  value={tempPrice}
                  onChange={(_, newValue) => setTempPrice(newValue)}
                  onChangeCommitted={(_, newValue) => handleFilterChange({ minPrice: newValue[0], maxPrice: newValue[1] })}
                  valueLabelDisplay="auto"
                  min={0}
                  max={15000}
                  step={50}
                  sx={{
                    color: "primary.main",
                    "& .MuiSlider-thumb": {
                      width: 20,
                      height: 20,
                      backgroundColor: "#fff",
                      border: "2px solid currentColor",
                      "&:hover": { boxShadow: "0 0 0 8px rgba(249, 115, 22, 0.16)" },
                    },
                    "& .MuiSlider-track": { height: 6 },
                    "& .MuiSlider-rail": { height: 6, opacity: 0.2, bgcolor: 'white' },
                  }}
                />
              </div>
            </div>
          </Box>
        </Collapse>

        {/* Cars Grid */}
        <section className="relative min-h-[400px]">
          {isRefetching && page === 1 && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-20 rounded-[3rem] flex items-center justify-center">
               <CircularProgress color="primary" />
            </div>
          )}

          {allCars.length === 0 && !isLoading ? (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="text-center py-32 bg-white/5 backdrop-blur-xl rounded-[4rem] border border-dashed border-white/10"
            >
              <SearchOff sx={{ fontSize: 80, color: 'white/5', mb: 3 }} />
              <Typography className="text-white font-black text-2xl mb-2">
                {t("carsPage.empty")}
              </Typography>
              <Typography className="text-slate-500 font-bold max-w-sm mx-auto">
                {i18n.language === "ar" ? "جرب تغيير خيارات التصفية للبحث عن خيارات أخرى" : "Try changing the filters to find more options"}
              </Typography>
              <Button onClick={resetFilters} className="mt-8 text-primary font-black">{i18n.language === "ar" ? "إعادة ضبط التصفية" : "Reset Filters"}</Button>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
                {allCars.map((car, index) => (
                  <motion.div
                    key={car._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CarCard car={car} />
                  </motion.div>
                ))}
              </div>
              
              {hasMore && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="mt-20 flex justify-center"
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={isRefetching}
                    sx={{
                      borderRadius: "2rem",
                      fontWeight: "900",
                      px: 8,
                      py: 2.5,
                      fontSize: "1.1rem",
                      bgcolor: "primary.main",
                      "&:hover": { 
                        bgcolor: "primary.dark",
                        transform: "translateY(-5px)",
                        boxShadow: "0 25px 50px -12px rgba(249, 115, 22, 0.5)"
                      },
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "0 20px 40px rgba(249, 115, 22, 0.2)",
                    }}
                  >
                    {isRefetching ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      i18n.language === "ar" ? "تحميل المزيد من السيارات" : "Load More Cars"
                    )}
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </section>
      </Container>

      <style jsx global>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
    </div>
  );
}

const filterInputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "1.25rem",
    color: "white",
    bgcolor: "rgba(255,255,255,0.03)",
    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
    "&.Mui-focused fieldset": { borderColor: "primary.main" },
  },
  "& .MuiInputLabel-root": { color: "slate.400", fontWeight: "900", fontSize: "0.85rem", textTransform: 'uppercase', tracking: '0.1em' },
  "& .MuiSvgIcon-root": { color: "slate.400" },
};
