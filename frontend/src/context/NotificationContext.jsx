import React, { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext();

const STORAGE_KEY = "beyond_notifications_v1";

const DEFAULT_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Technician Rajesh Sharma Assigned",
    message: "Specialist Rajesh Sharma (+91 98201 44552) is confirmed for your Furniture Assembly on Nov 26, 10:00 AM.",
    type: "installation",
    link: "/track?type=installation&id=BI-INS-774120",
    read: false,
    timestamp: "10 mins ago",
  },
  {
    id: "notif-2",
    title: "Order Registered: BI-ORD-882103",
    message: "Your bespoke furniture order has entered atelier fabrication & packing inspection.",
    type: "order",
    link: "/track?type=order&id=BI-ORD-882103",
    read: false,
    timestamp: "1 hour ago",
  },
  {
    id: "notif-3",
    title: "Complimentary Site Survey Available",
    message: "Unlock precision room measurements before placing your bespoke wallpaper & flooring order.",
    type: "promo",
    link: "/services",
    read: true,
    timestamp: "Yesterday",
  },
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = ({ title, message, type = "info", link = "" }) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      link,
      read: false,
      timestamp: "Just now",
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
