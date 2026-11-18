import React from "react";
import { NavLink, Link } from "react-router";
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
} from "lucide-react";

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
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col bg-stone-900 text-stone-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Logo & Close Button */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-stone-800">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white font-bold text-sm shadow-md">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-sm font-bold tracking-wider text-white">
                BEYOND INTERIORS
              </span>
              <span className="text-[10px] tracking-widest text-amber-500 font-semibold uppercase">
                Admin Panel
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden text-stone-400 hover:text-white p-1 rounded-md"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-stone-800">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
            Core Modules
          </p>

          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-amber-600/20 text-amber-400 font-semibold border-l-3 border-amber-500"
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

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-stone-800 text-[11px] text-stone-400 text-center">
          <span>Beyond Interiors v1.0 • Offline Flow</span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
