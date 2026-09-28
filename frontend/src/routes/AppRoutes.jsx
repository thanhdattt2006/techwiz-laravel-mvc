import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from '../components/layout/PublicLayout';
import AdminLayout from '../components/layout/AdminLayout';
import OperatorLayout from '../components/layout/OperatorLayout';
import UserLayout from '../components/layout/UserLayout';

// Protection HOC & Shell Utilities
import ProtectedRoute from './ProtectedRoute';
import ScrollToTop from '../components/common/ScrollToTop';
import CartDrawer from '../components/common/CartDrawer';
import PageFallback from '../components/common/PageFallback';

// Code-split Public Pages (React.lazy)
const HomePage = lazy(() => import('../pages/public/HomePage'));
const AboutPage = lazy(() => import('../pages/public/AboutPage'));
const GalleryPage = lazy(() => import('../pages/public/GalleryPage'));
const FeedbackPage = lazy(() => import('../pages/public/FeedbackPage'));
const ContactPage = lazy(() => import('../pages/public/ContactPage'));
const SitemapPage = lazy(() => import('../pages/public/SitemapPage'));
const ProductsPage = lazy(() => import('../pages/public/ProductsPage'));
const ProductDetailPage = lazy(() => import('../pages/public/ProductDetailPage'));
const MarketsPage = lazy(() => import('../pages/public/MarketsPage'));
const OrderPickupTrackerPage = lazy(() => import('../pages/public/OrderPickupTrackerPage'));
const NotFoundPage = lazy(() => import('../pages/public/NotFoundPage'));

// Code-split Auth Pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const FarmerRegisterPage = lazy(() => import('../pages/auth/FarmerRegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const UnauthorizedPage = lazy(() => import('../pages/auth/UnauthorizedPage'));

// Code-split Protected Dashboards
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const FarmerDashboard = lazy(() => import('../pages/farmer/FarmerDashboard'));
const CustomerDashboard = lazy(() => import('../pages/customer/CustomerDashboard'));
const CustomerProfilePage = lazy(() => import('../pages/customer/CustomerProfilePage'));
const CustomerOrdersPage = lazy(() => import('../pages/customer/CustomerOrdersPage'));

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <CartDrawer />
      <Suspense fallback={<PageFallback />}>
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
          <Route path="/register-farmer" element={<FarmerRegisterPage />} />
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
      </Suspense>
    </BrowserRouter>
  );
}
