import React from "react";
import { NavLink, Link, useNavigate } from "react-router";
import {
  LayoutDashboard,
  FolderTree,
  Package,
  Boxes,
  Users,
  ShoppingBag,
  CreditCard,
  Wrench,
  CalendarCheck,
  Image as ImageIcon,
  X,
  Compass,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const navigationItems = [
  { name: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Categories", to: "/admin/categories", icon: FolderTree },
  { name: "Products", to: "/admin/products", icon: Package },
  { name: "Inventory", to: "/admin/inventory", icon: Boxes },
  { name: "Customers", to: "/admin/customers", icon: Users },
  { name: "Orders", to: "/admin/orders", icon: ShoppingBag },
  { name: "Offline Payments", to: "/admin/payments", icon: CreditCard },
  { name: "Installations", to: "/admin/installations", icon: Wrench },
  { name: "Site Visits", to: "/admin/site-visits", icon: CalendarCheck },
  { name: "Homepage & Banners", to: "/admin/banners", icon: ImageIcon },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (onClose) onClose();
    await logout();
    navigate("/login", { replace: true });
  };

  const currentUser = user || admin;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-stone-900/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col bg-black text-stone-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Brand Logo & Close Button */}
        <div className="flex h-16 items-center justify-between px-6 shrink-0 border-b border-stone-800">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-bold text-sm tracking-wide text-white block">
                BEYOND INTERIORS
              </span>
              <span
                className="text-[9px] uppercase tracking-widest font-bold block"
                style={{ color: "var(--color-secondary)" }}
              >
                Admin Portal
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden text-stone-400 hover:text-white p-1 rounded-md cursor-pointer"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-stone-800">

          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={() => {
                  if (window.innerWidth < 1024 && onClose) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${isActive
                    ? "bg-secondary/20 text-secondary font-semibold border-l-3 border-secondary"
                    : "text-stone-300 hover:bg-stone-800 hover:text-white"
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* User Info & Dedicated Logout Button in Sidebar Bottom */}
        <div className="p-3 space-y-2 shrink-0">
          <div className="flex items-center gap-2.5 px-2.5 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-xs uppercase shrink-0">
              {currentUser?.name ? currentUser.name.charAt(0) : "A"}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-white truncate">
                {currentUser?.name || "Administrator"}
              </span>
              <span className="text-[10px] text-secondary font-mono uppercase tracking-wider truncate">
                {currentUser?.email || "admin@beyondinteriors.com"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white hover:text-white bg-accent hover:bg-accent border border-accent hover:border-accent transition-all cursor-pointer shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
