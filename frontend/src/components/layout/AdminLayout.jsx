import React, { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-stone-50 overflow-hidden text-stone-900 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header Bar */}
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-stone-100/60">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
