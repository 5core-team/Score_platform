import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import UsersPage from './pages/UsersPage';
import DebtPage from './pages/DebtPage';
import ZonePage from './pages/ZonePage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import AddUserPage from './pages/AddUserPage';
import HomePage from './pages/HomePage';
import CountryRepresentativesPage from './pages/CountryRepresentativesPage';
import FrontOfficePage from './pages/FrontOfficePage';
import InfosClientPage from './pages/InfosClientPage';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard\" replace />} />
      {/* <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard\" replace />} /> */}
      
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
      <Route path="/users/add" element={<ProtectedRoute><AddUserPage /></ProtectedRoute>} />
      <Route path="/users/country" element={<ProtectedRoute><CountryRepresentativesPage /></ProtectedRoute>} />
      <Route path="/frontoffice" element={<ProtectedRoute><FrontOfficePage /></ProtectedRoute>} />
      <Route path="/debt" element={<ProtectedRoute><DebtPage /></ProtectedRoute>} />
      <Route path="/zones" element={<ProtectedRoute><ZonePage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/infos-client" element={<InfosClientPage />} />
      
      <Route path="*" element={<Navigate to="/\" replace />} />
    </Routes>
  );
}

export default App;