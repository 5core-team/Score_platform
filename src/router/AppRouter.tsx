import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import LandingPage from '../features/landing/LandingPage';
import LoginPage from '../features/auth/LoginPage';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';

import AdminLayout from '../features/admin/AdminLayout';
import AdminDashboard from '../features/admin/AdminDashboard';
import AdminCountries from '../features/admin/AdminCountries';

import CountryLayout from '../features/country/CountryLayout';
import CountryDashboard from '../features/country/CountryDashboard';
import CountryZones from '../features/country/CountryZones';
import CountryUsers from '../features/country/CountryUsers';

import OfficeLayout from '../features/office/OfficeLayout';
import OfficeDashboard from '../features/office/OfficeDashboard';
import OfficeUsers from '../features/office/OfficeUsers';

import BailiffLayout from '../features/bailiff/BailiffLayout';
import BailiffDashboard from '../features/bailiff/BailiffDashboard';
import NewCase from '../features/bailiff/NewCase';
import Consultation from '../features/bailiff/Consultation';

import AdvisorLayout from '../features/advisor/AdvisorLayout';
import AdvisorDashboard from '../features/advisor/AdvisorDashboard';
import AdvisorConsultation from '../features/advisor/AdvisorConsultation';

import { UnderDevelopment } from '../components/ui/UnderDevelopment';
import OfficeSubzones from '../features/office/OfficeSubzones';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage';
import AccountSetupPage from '../features/auth/AccountSetupPage';

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/account/setup" element={<AccountSetupPage />} />

          {/* ADMIN */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="countries" element={<AdminCountries />} />
              <Route path="subscriptions" element={<UnderDevelopment title="Abonnements" />} />
              <Route path="settings" element={<UnderDevelopment title="Paramètres" />} />
            </Route>
          </Route>

          {/* COUNTRY REPRESENTATIVE */}
          <Route element={<ProtectedRoute allowedRoles={['COUNTRY_REPRESENTATIVE']} />}>
            <Route path="/country" element={<CountryLayout />}>
              <Route index element={<Navigate to="/country/dashboard" replace />} />
              <Route path="dashboard" element={<CountryDashboard />} />
              <Route path="zones" element={<CountryZones />} />
              <Route path="users" element={<CountryUsers />} />
              <Route path="settings" element={<UnderDevelopment title="Paramètres" />} />
            </Route>
          </Route>

          {/* FRONT OFFICE */}
          <Route element={<ProtectedRoute allowedRoles={['FRONT_OFFICE']} />}>
            <Route path="/office" element={<OfficeLayout />}>
              <Route index element={<Navigate to="/office/dashboard" replace />} />
              <Route path="dashboard" element={<OfficeDashboard />} />
              <Route path="subzones" element={<OfficeSubzones />} />
              <Route path="users" element={<OfficeUsers />} />
            </Route>
          </Route>

          {/* BAILIFF */}
          <Route element={<ProtectedRoute allowedRoles={['BAILIFF']} />}>
            <Route path="/bailiff" element={<BailiffLayout />}>
              <Route index element={<Navigate to="/bailiff/dashboard" replace />} />
              <Route path="dashboard" element={<BailiffDashboard />} />
              <Route path="new-case" element={<NewCase />} />
              <Route path="consultation" element={<Consultation />} />
            </Route>
          </Route>

          {/* ADVISOR */}
          <Route element={<ProtectedRoute allowedRoles={['ADVISOR']} />}>
            <Route path="/advisor" element={<AdvisorLayout />}>
              <Route index element={<Navigate to="/advisor/dashboard" replace />} />
              <Route path="dashboard" element={<AdvisorDashboard />} />
              <Route path="consultation" element={<AdvisorConsultation />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
