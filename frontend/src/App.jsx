import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import CategoryList from "./pages/admin/CategoryList.jsx";
import ProductList from "./pages/admin/ProductList.jsx";
import ProductForm from "./pages/admin/ProductForm.jsx";
import InventoryList from "./pages/admin/InventoryList.jsx";
import CustomerList from "./pages/admin/CustomerList.jsx";
import CustomerDetail from "./pages/admin/CustomerDetail.jsx";
import OrderList from "./pages/admin/OrderList.jsx";
import OrderDetail from "./pages/admin/OrderDetail.jsx";
import InstallationList from "./pages/admin/InstallationList.jsx";
import ProfessionalList from "./pages/admin/ProfessionalList.jsx";
import SiteVisitList from "./pages/admin/SiteVisitList.jsx";
import BannerList from "./pages/admin/BannerList.jsx";
import FeaturedProducts from "./pages/admin/FeaturedProducts.jsx";

// Helper placeholder for upcoming modules
const ModulePlaceholder = ({ title }) => (
  <div className="bg-white rounded-xl border border-stone-200 p-8 text-center space-y-3">
    <h2 className="text-lg font-bold font-serif text-stone-900">{title}</h2>
    <p className="text-xs text-stone-500">
      This module is being built in the upcoming milestone step.
    </p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Admin Login Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Portal with Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/categories" element={<CategoryList />} />
              <Route path="/admin/products" element={<ProductList />} />
              <Route path="/admin/products/new" element={<ProductForm />} />
              <Route path="/admin/products/edit/:id" element={<ProductForm />} />
              <Route path="/admin/inventory" element={<InventoryList />} />
              <Route path="/admin/customers" element={<CustomerList />} />
              <Route path="/admin/customers/:id" element={<CustomerDetail />} />
              <Route path="/admin/orders" element={<OrderList />} />
              <Route path="/admin/orders/:id" element={<OrderDetail />} />
              <Route path="/admin/payments" element={<OrderList />} />
              <Route path="/admin/installations" element={<InstallationList />} />
              <Route path="/admin/professionals" element={<ProfessionalList />} />
              <Route path="/admin/site-visits" element={<SiteVisitList />} />
              <Route path="/admin/banners" element={<BannerList />} />
              <Route path="/admin/featured" element={<FeaturedProducts />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
