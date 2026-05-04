"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  Notifications, 
  NotificationsNone, 
  Close, 
  Delete,
  CheckCircle,
  Error,
  Info 
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { notificationService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

const NotificationDropdown = ({ isAdminSettings = false }) => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation("common");
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    setLoadError(false);
    try {
      const data = await notificationService.getAll();
      if (data.success) {
        setNotifications(data.data.notifications);
        setUnreadCount(data.data.unreadCount);
        setLoadError(false);
      }
    } catch (error) {
      setLoadError(true);
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchNotifications();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = async () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState && unreadCount > 0) {
      // Mark all as read when opening
      try {
        await notificationService.markAllAsRead();
        setUnreadCount(0);
        // Optimistically update local UI
        setNotifications(prev => prev.map(n => ({...n, isRead: true})));
      } catch (error) {
        console.error("Error marking notifications as read", error);
      }
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // prevent closing
    if (user?.role !== "admin") return;
    try {
      await notificationService.delete(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      queryClient.invalidateQueries({ queryKey: ["adminNotifications"] });
    } catch (error) {
      console.error("Error deleting notification", error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "booking_approved":
        return <CheckCircle className="text-green-500" fontSize="small" />;
      case "booking_rejected":
        return <Error className="text-red-500" fontSize="small" />;
      case "booking_new":
        return <Info className="text-blue-500" fontSize="small" />;
      default:
        return <Notifications className="text-gray-400" fontSize="small" />;
    }
  };

  const getTimeAgo = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      const rtf = new Intl.RelativeTimeFormat(i18n.language === 'ar' ? 'ar' : 'en', { numeric: 'auto' });
      
      if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second');
      if (diffInSeconds < 3600) return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
      if (diffInSeconds < 86400) return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
      if (diffInSeconds < 2592000) return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
      if (diffInSeconds < 31536000) return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
      return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleToggle}
        className="relative flex items-center justify-center text-primary hover:text-primary-hover transition-colors active:scale-95 min-h-[44px] min-w-[44px]"
        title={t("navbar.notification")}
      >
        {unreadCount > 0 ? (
          <>
            <Notifications />
            <span className="absolute top-[8px] right-[8px] flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </>
        ) : (
          <NotificationsNone />
        )}
      </button>

      {isOpen && (
        <div 
          className={`absolute ${i18n.dir() === 'rtl' ? 'left-0 sm:left-auto sm:right-[-60px]' : 'right-0 sm:right-auto sm:left-[-60px]'} top-full mt-2 w-80 sm:w-96 bg-gray-900 border border-white/10 rounded-xl shadow-2xl z-[100] transform transition-all duration-300 ease-out origin-top overflow-hidden`}
          dir={i18n.dir()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gray-800">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Notifications fontSize="small" className="text-primary" />
              {t("notifications.title")}
            </h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Close fontSize="small" />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-80 overflow-y-auto no-scrollbar custom-scrollbar bg-gray-900">
            {loading ? (
              <div className="p-6 text-center text-gray-400 text-sm">
                {t("notifications.loading")}
              </div>
            ) : loadError && notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-3 text-gray-400">
                <NotificationsNone style={{ fontSize: 40, opacity: 0.2 }} />
                <p className="text-sm">{t("common.error")}</p>
                <button
                  onClick={() => {
                    setLoading(true);
                    fetchNotifications();
                  }}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-primary-hover"
                >
                  {t("common.retry")}
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2 text-gray-400">
                <NotificationsNone style={{ fontSize: 40, opacity: 0.2 }} />
                <p className="text-sm">{t("notifications.empty")}</p>
              </div>
            ) : (
              <ul className="flex flex-col">
                {notifications.map((notif) => (
                  <li 
                    key={notif._id} 
                    className={`relative p-4 border-b border-white/5 flex gap-3 hover:bg-gray-800 transition-colors group ${!notif.isRead ? 'bg-gray-800/50' : ''}`}
                  >
                    {!notif.isRead && (
                      <span className="absolute top-1/2 -mt-1 left-2 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]"></span>
                    )}
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <strong className="text-sm text-gray-100 truncate block pr-6">
                          {notif.title}
                        </strong>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-gray-500 mt-2 block" suppressHydrationWarning>
                        {mounted && getTimeAgo(notif.createdAt)}
                      </span>
                    </div>
                    {/* Delete button (shows on hover - Admin only) */}
                    {user?.role === "admin" && (
                      <button 
                        onClick={(e) => handleDelete(e, notif._id)}
                        className="absolute top-4 rtl:left-4 ltr:right-4 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 transition-all active:scale-90"
                        title={t("notifications.delete")}
                      >
                        <Delete fontSize="small" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
