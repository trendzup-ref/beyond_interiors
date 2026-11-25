import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import {
  Bell,
  CheckCircle,
  Truck,
  Wrench,
  Info,
  Sparkles,
  X,
  ExternalLink,
} from "lucide-react";
import { useNotifications } from "../../context/NotificationContext.jsx";

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "installation":
        return <Wrench className="w-3.5 h-3.5 text-amber-700" />;
      case "order":
        return <Truck className="w-3.5 h-3.5 text-[#A73D4D]" />;
      case "promo":
        return <Sparkles className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Info className="w-3.5 h-3.5 text-stone-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        aria-label="Open notifications"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#A73D4D] text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Flyout Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-sm text-stone-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#A73D4D]/10 text-[#A73D4D] font-bold">
                  {unreadCount} NEW
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] text-stone-500 hover:text-stone-900 font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                <Bell className="w-6 h-6 mx-auto mb-2 text-stone-300" />
                <p>No new notifications at this time.</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`p-3.5 sm:p-4 transition-colors flex gap-3 text-xs cursor-pointer ${
                    item.read ? "bg-white hover:bg-stone-50" : "bg-amber-50/40 hover:bg-amber-50/70"
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-white border border-stone-200 shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-semibold text-stone-900 line-clamp-1">{item.title}</h4>
                      <span className="text-[10px] font-mono text-stone-400 shrink-0">
                        {item.timestamp}
                      </span>
                    </div>

                    <p className="text-stone-600 line-clamp-2 leading-relaxed text-[11px]">
                      {item.message}
                    </p>

                    {item.link && (
                      <Link
                        to={item.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#A73D4D] hover:underline pt-0.5"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-[11px]">
            <Link
              to="/track"
              onClick={() => setIsOpen(false)}
              className="text-stone-600 hover:text-stone-900 font-medium"
            >
              Order & Installation Tracker &rarr;
            </Link>
            <button
              onClick={clearNotifications}
              className="text-stone-400 hover:text-rose-600"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
