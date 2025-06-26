import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { AppNotification } from "@/lib/types";
import { getUnreadNotifications } from "@/features/notifications/db";

export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: any = null;

    const initializeNotifications = async () => {
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // Load initial notifications
        const data = await getUnreadNotifications();
        setNotifications(data);

        // Set up realtime subscription
        channel = supabase
          .channel("notifications")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "notifications",
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              const newNotification = payload.new as AppNotification;
              if (!newNotification.is_read) {
                setNotifications((prev) => [newNotification, ...prev]);

                // Show browser notification if permission granted
                if (
                  "Notification" in window &&
                  Notification.permission === "granted"
                ) {
                  new Notification(newNotification.title, {
                    body: newNotification.message,
                    icon: "/favicon.ico",
                  });
                }
              }
            }
          )
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "notifications",
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              const updatedNotification = payload.new as AppNotification;
              if (updatedNotification.is_read) {
                setNotifications((prev) =>
                  prev.filter((n) => n.id !== updatedNotification.id)
                );
              }
            }
          )
          .subscribe();

        // Request notification permission
        if ("Notification" in window && Notification.permission === "default") {
          Notification.requestPermission();
        }
      } catch (error) {
        console.error("Error initializing notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeNotifications();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications([]);
  };

  return {
    notifications,
    loading,
    unreadCount: notifications.length,
    markAsRead,
    markAllAsRead,
  };
}
