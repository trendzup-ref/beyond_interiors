import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import CustomerHome from "./pages/customer/CustomerHome.jsx";
import CustomerAccount from "./pages/customer/CustomerAccount.jsx";
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
import ShippingPolicy from "./pages/customer/ShippingPolicy.jsx";
import ReturnPolicy from "./pages/customer/ReturnPolicy.jsx";
import PrivacyPolicy from "./pages/customer/PrivacyPolicy.jsx";
import TermsPage from "./pages/customer/TermsPage.jsx";
import ProductListing from "./pages/customer/ProductListing.jsx";
import ProductDetail from "./pages/customer/ProductDetail.jsx";
import CartPage from "./pages/customer/CartPage.jsx";
import WishlistPage from "./pages/customer/WishlistPage.jsx";
import InstallationServices from "./pages/customer/InstallationServices.jsx";
import OrderTracking from "./pages/customer/OrderTracking.jsx";
import SupportPage from "./pages/customer/SupportPage.jsx";
import { CartWishlistProvider } from "./context/CartWishlistContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import CartDrawer from "./components/cart/CartDrawer.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <CartWishlistProvider>
            <CartDrawer />
            <Routes>
              {/* Public Common Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<Navigate to="/login" replace />} />
              <Route path="/register" element={<Register />} />

              {/* Customer Storefront & Catalog */}
              <Route path="/" element={<CustomerHome />} />
              <Route path="/products" element={<ProductListing />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/product/:id" element={<Navigate to="/products/:id" replace />} />

              {/* Shopping Cart & Wishlist Pages */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/shopping-bag" element={<Navigate to="/cart" replace />} />
              <Route path="/wishlist" element={<WishlistPage />} />

              {/* Installation Services Browsing & Booking */}
              <Route path="/services" element={<InstallationServices />} />
              <Route path="/installation" element={<Navigate to="/services" replace />} />
              <Route path="/installations" element={<Navigate to="/services" replace />} />

              {/* Live Order & Installation Tracking */}
              <Route path="/track" element={<OrderTracking />} />
              <Route path="/tracking" element={<Navigate to="/track" replace />} />
              <Route path="/my-orders" element={<OrderTracking />} />

              {/* Concierge Help, Tickets & Support */}
              <Route path="/support" element={<SupportPage />} />
              <Route path="/help" element={<Navigate to="/support" replace />} />
              <Route path="/contact" element={<Navigate to="/support" replace />} />

              {/* Store Policies */}
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/shipping" element={<Navigate to="/shipping-policy" replace />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
              <Route path="/returns" element={<Navigate to="/return-policy" replace />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/terms-and-conditions" element={<Navigate to="/terms" replace />} />

              {/* Customer Protected Routes (Allowed role: 'customer' only) */}
              <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
                <Route path="/account" element={<CustomerAccount />} />
              </Route>

          {/* Admin Protected Portal (Allowed role: 'admin' only) */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
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

          {/* Fallback to Customer Homepage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </CartWishlistProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
