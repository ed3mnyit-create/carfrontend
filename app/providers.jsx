"use client";
import "../i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/context/AuthContext";

export default function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              // Don't retry for 404 errors - they won't fix themselves
              if (error?.response?.status === 404) return false;
              // Retry other errors up to 2 times
              return failureCount < 2;
            },
            refetchOnWindowFocus: false, // Prevent excessive re-fetching
            staleTime: 5 * 60 * 1000, // 5 minutes default stale time
          },
        },
      }),
  );
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Delay mounted state to ensure i18n is ready
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // HYDRATION STABILIZATION: Use consistent defaults during SSR and hydration
  // This prevents "removeChild" DOM errors caused by server/client mismatch
  // Default to "ar" (Arabic) on server, switch to detected language on client
  const serverLang = "ar";
  const clientLang = i18n?.language || serverLang;
  const currentLang = mounted ? clientLang : serverLang;
  const dir = (currentLang === "ar" || !currentLang) ? "rtl" : "ltr";

  // Don't update DOM until mounted to prevent hydration mismatch
  useEffect(() => {
    if (mounted && typeof document !== 'undefined') {
      document.dir = dir;
      document.documentElement.lang = currentLang;
    }
  }, [dir, currentLang, mounted]);

  // Use stable theme direction during SSR, switch after mount
  const stableDir = "rtl"; // Always use RTL during SSR to match server render
  
  const theme = useMemo(
    () =>
      createTheme({
        direction: "rtl",
        typography: {
          fontFamily: "var(--font-almarai)",
        },
        palette: {
          mode: "dark",
          primary: {
            main: "#f97316",
          },
        },
      }),
    [],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          {children}
          <ToastContainer
            position="bottom-right"
            rtl={true}
            theme="dark"
            pauseOnHover
            draggable
            closeOnClick
            limit={3}
            autoClose={4000}
          />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
