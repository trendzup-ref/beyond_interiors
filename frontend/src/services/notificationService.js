/**
 * Notification Service
 * Manages customer lifecycle notifications (orders, installations, payments).
 * Synchronized with NotificationContext and localStorage.
 */

const STORAGE_KEY = "beyond_notifications_v1";

const DEFAULT_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Technician Rajesh Sharma Assigned",
    message: "Specialist Rajesh Sharma (+91 98201 44552) is confirmed for your Furniture & Chandelier Assembly on Dec 01, 11:00 AM.",
    type: "installation",
    link: "/account?tab=installations&id=BI-INS-882103",
    read: false,
    timestamp: "10 mins ago",
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: "notif-2",
    title: "Order Fabrication Active: BI-ORD-882103",
    message: "Your bespoke furniture order has entered atelier fabrication & safety packing inspection.",
    type: "order",
    link: "/account?tab=orders&id=BI-ORD-882103",
    read: false,
    timestamp: "1 hour ago",
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: "notif-3",
    title: "Installation Completed: BI-INS-774120",
    message: "Your acoustic wall panels installation has been signed off. You can now leave a verified review.",
    type: "installation",
    link: "/account?tab=reviews&booking=BI-INS-774120",
    read: true,
    timestamp: "2 days ago",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

const loadNotifications = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
      return DEFAULT_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
};

const saveNotifications = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    // Dispatch custom event so React contexts listening update immediately across components
    window.dispatchEvent(new Event("beyond_notifications_updated"));
  } catch (e) {
    console.error("Failed to save notifications", e);
  }
};

export const notificationService = {
  /**
   * Get all notifications
   */
  async getNotifications() {
    return loadNotifications();
  },

  /**
   * Create a new notification
   */
  async createNotification({ title, message, type = "order", link = "" }) {
    const list = loadNotifications();
    const newNotif = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title,
      message,
      type,
      link,
      read: false,
      timestamp: "Just now",
      createdAt: new Date().toISOString(),
    };

    const updated = [newNotif, ...list];
    saveNotifications(updated);
    return newNotif;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(id) {
    const list = loadNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveNotifications(updated);
    return updated;
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    const list = loadNotifications();
    const updated = list.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
    return updated;
  },

  /**
   * Clear all notifications
   */
  async clearAll() {
    saveNotifications([]);
    return [];
  },
};

export default notificationService;
