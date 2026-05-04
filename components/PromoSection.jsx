"use client";

import { useQuery } from "@tanstack/react-query";
import { promoService } from "@/services/api";
import Image from "next/image";
import { Button, CircularProgress } from "@mui/material";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const PromoSection = () => {
  const { t, i18n } = useTranslation("common");
  const { data: promoData, isLoading } = useQuery({
    queryKey: ["activePromos"],
    queryFn: () => promoService.getAllActive(),
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <CircularProgress />
      </div>
    );
  }

  const promos = promoData?.data || [];
  if (promos.length === 0) return null;

  return (
    <section className="py-12 sm:py-20 space-y-12 sm:space-y-24 overflow-hidden">
      {promos.map((promo) => (
        <div key={promo._id} className="container mx-auto px-4 sm:px-6">
          <div 
            className={`relative overflow-hidden rounded-[2.5rem] sm:rounded-[4rem] border border-white/10 glass shadow-2xl transition-all duration-1000 min-h-[450px] flex items-center group ${
              promo.layoutType === 'full-bg' ? 'p-8 sm:p-20' : ''
            }`}
          >
            {/* Immersive Background for full-bg */}
            {promo.layoutType === 'full-bg' && (
              <div className="absolute inset-0 z-0">
                <Image 
                  src={promo.imageUrl} 
                  alt={promo.title} 
                  fill 
                  className="object-cover opacity-30 group-hover:scale-110 transition-transform duration-[3000ms]" 
                />
                <div className="absolute inset-0 bg-linear-to-r from-[#0f172a] via-[#0f172a]/95 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-t from-[#0f172a] via-transparent to-transparent opacity-60" />
              </div>
            )}

            <div className={`relative z-10 w-full flex flex-col items-center gap-10 md:gap-16 sm:p-12 ${
              promo.layoutType === 'full-bg' ? 'sm:flex-row' : 
              promo.layoutType === 'image-left' ? 'sm:flex-row-reverse' : 'sm:flex-row'
            }`}>
              {/* Textual Identity Area */}
              <div className={`flex-1 space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 ${
                i18n.dir() === 'rtl' ? 'text-right' : 'text-left'
              }`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full border border-primary/30 backdrop-blur-md">
                   <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                   <span className="text-primary font-black text-xs sm:text-sm uppercase tracking-widest">
                     {t("promos.limitedOffer")}
                   </span>
                </div>
                
                <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tighter">
                  {promo.title}
                </h2>
                
                <p className="text-slate-400 font-bold text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-2xl bg-linear-to-r from-slate-400 to-slate-500 bg-clip-text text-transparent">
                  {promo.subtitle}
                </p>

                {promo.linkUrl && (
                  <div className="pt-4 flex flex-wrap gap-4">
                    <Button 
                      variant="contained" 
                      component={Link}
                      href={promo.linkUrl}
                      sx={{ 
                        borderRadius: '1.5rem', 
                        fontWeight: '900', 
                        px: { xs: 6, sm: 10 }, 
                        py: { xs: 1.5, sm: 2.5 }, 
                        fontSize: { xs: '1.1rem', sm: '1.4rem' },
                        boxShadow: '0 20px 40px -10px rgba(249, 115, 22, 0.4)',
                        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                        '&:hover': {
                          transform: 'translateY(-5px) scale(1.02)',
                          boxShadow: '0 30px 60px -12px rgba(249, 115, 22, 0.6)',
                        },
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                       {t("promos.exploreOffer")}
                    </Button>
                  </div>
                )}
              </div>

              {/* Visual Asset Area */}
              {promo.layoutType !== 'full-bg' && (
                <div className="w-full sm:w-1/2 aspect-video relative rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] group/img">
                  <Image 
                    src={promo.imageUrl} 
                    alt={promo.title} 
                    fill 
                    className="object-cover group-hover/img:scale-110 transition-transform duration-1000" 
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[2.5rem] sm:rounded-[3.5rem]" />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default PromoSection;
