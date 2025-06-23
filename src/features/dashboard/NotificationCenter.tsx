import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppNotification } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BellOff,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  Target,
  Lightbulb,
} from "lucide-react";
import {
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/features/notifications/db";

interface NotificationCenterProps {
  className?: string;
}

const notificationIcons = {
  tip: Lightbulb,
  budget_alert: AlertTriangle,
  goal_reminder: Target,
};

const notificationColors = {
  tip: "bg-blue-100 text-blue-800",
  budget_alert: "bg-red-100 text-red-800",
  goal_reminder: "bg-green-100 text-green-800",
};

export function NotificationCenter({
  className = "",
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getUnreadNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications([]);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const formatRelativeTime = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Gerade eben";
    if (diffInHours < 24) return `vor ${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `vor ${diffInDays}d`;

    return date.toLocaleDateString("de-DE");
  };

  if (loading) {
    return (
      <div className={`${className} flex items-center gap-2`}>
        <Bell className="h-5 w-5 text-gray-400" />
        <span className="text-sm text-gray-500">Lade...</span>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className={`${className} flex items-center gap-2`}>
        <BellOff className="h-5 w-5 text-gray-400" />
        <span className="text-sm text-gray-500">
          Keine neuen Benachrichtigungen
        </span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {notifications.length > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
          >
            {notifications.length}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-96 z-50"
          >
            <Card className="shadow-lg border-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Benachrichtigungen ({notifications.length})
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="text-xs"
                    >
                      Alle als gelesen markieren
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsExpanded(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification, index) => {
                    const Icon = notificationIcons[notification.type];

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b last:border-b-0 p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              notificationColors[notification.type]
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-semibold text-gray-900 truncate">
                                {notification.title}
                              </h4>
                              <span className="text-xs text-gray-500 ml-2">
                                {formatRelativeTime(notification.created_at)}
                              </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-3">
                              {notification.message}
                            </p>

                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {notification.type === "tip"
                                  ? "Tipp"
                                  : notification.type === "budget_alert"
                                  ? "Budget-Alarm"
                                  : "Ziel-Erinnerung"}
                              </Badge>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleMarkAsRead(notification.id)
                                }
                                className="text-xs"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Gelesen
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
