"use client";
import "../i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/context/AuthContext";

const ThemeModeContext = createContext({
  mode: "dark",
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeModeContext);

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
  const [mode, setMode] = useState("dark");
  
  useEffect(() => {
    // Delay mounted state to ensure i18n is ready
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedMode = localStorage.getItem("c4r_theme");
    if (savedMode === "light" || savedMode === "dark") {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.body.dataset.theme = mode;
    localStorage.setItem("c4r_theme", mode);
  }, [mode]);

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
  const toggleTheme = () => {
    setMode((current) => (current === "dark" ? "light" : "dark"));
  };
  
  const theme = useMemo(
    () =>
      createTheme({
        direction: "rtl",
        typography: {
          fontFamily: "var(--font-almarai)",
        },
        palette: {
          mode,
          primary: {
            main: "#f97316",
          },
          background: {
            default: mode === "dark" ? "#040c20" : "#f8fafc",
            paper: mode === "dark" ? "#061e42" : "#ffffff",
          },
          text: {
            primary: mode === "dark" ? "#f8fafc" : "#0f172a",
            secondary: mode === "dark" ? "#cbd5e1" : "#475569",
          },
        },
      }),
    [mode],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            {children}
            <ToastContainer
              position="bottom-right"
              rtl={true}
              theme={mode}
              pauseOnHover
              draggable
              closeOnClick
              limit={3}
              autoClose={4000}
            />
          </AuthProvider>
        </ThemeProvider>
      </ThemeModeContext.Provider>
    </QueryClientProvider>
  );
}
