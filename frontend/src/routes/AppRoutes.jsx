import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from '../components/layout/PublicLayout';
import AdminLayout from '../components/layout/AdminLayout';
import OperatorLayout from '../components/layout/OperatorLayout';
import UserLayout from '../components/layout/UserLayout';

// Protection HOC
import ProtectedRoute from './ProtectedRoute';
import ScrollToTop from '../components/common/ScrollToTop';

// Public Pages
import HomePage from '../pages/public/HomePage';
import AboutPage from '../pages/public/AboutPage';
import GalleryPage from '../pages/public/GalleryPage';
import FeedbackPage from '../pages/public/FeedbackPage';
import ContactPage from '../pages/public/ContactPage';
import SitemapPage from '../pages/public/SitemapPage';
import ProductsPage from '../pages/public/ProductsPage';
import ProductDetailPage from '../pages/public/ProductDetailPage';
import MarketsPage from '../pages/public/MarketsPage';
import OrderPickupTrackerPage from '../pages/public/OrderPickupTrackerPage';
import NotFoundPage from '../pages/public/NotFoundPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import UnauthorizedPage from '../pages/auth/UnauthorizedPage';

// Protected Dashboards
import AdminDashboard from '../pages/admin/AdminDashboard';
import FarmerDashboard from '../pages/farmer/FarmerDashboard';
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import CustomerProfilePage from '../pages/customer/CustomerProfilePage';
import CustomerOrdersPage from '../pages/customer/CustomerOrdersPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* 1. Public Catalog & Informational Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/markets" element={<MarketsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/tracking/:id" element={<OrderPickupTrackerPage />} />
          <Route path="/orders/track/:id" element={<OrderPickupTrackerPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/sitemap" element={<SitemapPage />} />
        </Route>

        {/* 2. Authentication & Access Restriction Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* 3. Protected Admin Portal (RBAC: admin only) */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* 4. Protected Farmer / Stall Master Portal (RBAC: farmer, operator, vendor) */}
        <Route element={<ProtectedRoute allowedRoles={['farmer', 'operator', 'vendor', 'admin']} />}>
          <Route element={<OperatorLayout />}>
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="/operator/dashboard" element={<FarmerDashboard />} />
          </Route>
        </Route>

        {/* 5. Protected Shopper / Customer Portal (RBAC: user or customer) */}
        <Route element={<ProtectedRoute allowedRoles={['user', 'customer']} />}>
          <Route element={<UserLayout />}>
            <Route path="/user/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/user/profile" element={<CustomerProfilePage />} />
            <Route path="/customer/profile" element={<CustomerProfilePage />} />
            <Route path="/user/history" element={<CustomerOrdersPage />} />
            <Route path="/customer/orders" element={<CustomerOrdersPage />} />
          </Route>
        </Route>

        {/* 6. Catch-all Fallback (404 Page) */}
        <Route element={<PublicLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
