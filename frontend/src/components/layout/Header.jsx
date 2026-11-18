import React, { useState, useRef, useEffect } from "react";
import { Menu, LogOut, User, ChevronDown, Bell, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const Header = ({ onToggleSidebar }) => {
  const { admin, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-stone-200 bg-white px-4 sm:px-6 shadow-xs">
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-stone-900 focus:outline-none"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="font-semibold text-stone-900 uppercase tracking-wider">
            Beyond Interiors
          </span>
          <span className="text-stone-400">/</span>
          <span className="text-stone-500 font-medium">Administration Portal</span>
        </div>
      </div>

      {/* Right: Quick actions & Admin Profile Dropdown */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Offline Payments & Service Mode Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Offline Payments Mode</span>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-stone-50 transition-colors focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-xs uppercase shadow-xs">
              {admin?.name?.charAt(0) || "A"}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-stone-900 leading-tight">
                {admin?.name || "Administrator"}
              </span>
              <span className="text-[10px] text-amber-700 font-medium capitalize">
                {admin?.role || "Admin"}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-stone-500 hidden sm:block" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-stone-200 py-1.5 text-xs text-stone-700 z-50 animate-fadeIn">
              <div className="px-3.5 py-2.5 border-b border-stone-100">
                <p className="font-semibold text-stone-900">{admin?.name}</p>
                <p className="text-stone-500 text-[11px] truncate">{admin?.email}</p>
              </div>

              <div className="px-3 py-2 text-stone-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Super Admin Privileges</span>
              </div>

              <div className="border-t border-stone-100 my-1" />

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
