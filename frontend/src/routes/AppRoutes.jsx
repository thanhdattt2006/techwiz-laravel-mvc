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
import LiveTrackingPage from '../pages/public/LiveTrackingPage';
import NotFoundPage from '../pages/public/NotFoundPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import UnauthorizedPage from '../pages/auth/UnauthorizedPage';

// Protected Dashboards
import AdminDashboard from '../pages/admin/AdminDashboard';
import OperatorDashboard from '../pages/operator/OperatorDashboard';
import UserDashboard from '../pages/user/UserDashboard';
import MedicalProfilePage from '../pages/user/MedicalProfilePage';
import UserHistoryPage from '../pages/user/UserHistoryPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* 1. Public Catalog & Informational Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/markets" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/ambulances" element={<ProductsPage />} />
          <Route path="/ambulances/:id" element={<ProductDetailPage />} />
          <Route path="/tracking/:id" element={<LiveTrackingPage />} />
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

        {/* 4. Protected Operator / Dispatcher Portal (RBAC: operator only) */}
        <Route element={<ProtectedRoute allowedRoles={['operator']} />}>
          <Route element={<OperatorLayout />}>
            <Route path="/operator/dashboard" element={<OperatorDashboard />} />
          </Route>
        </Route>

        {/* 5. Protected Patient / User Portal (RBAC: user only) */}
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route element={<UserLayout />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/medical-profile" element={<MedicalProfilePage />} />
            <Route path="/user/history" element={<UserHistoryPage />} />
          </Route>
        </Route>

        {/* 6. Catch-all Fallback (Medical 404 Page) */}
        <Route element={<PublicLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
