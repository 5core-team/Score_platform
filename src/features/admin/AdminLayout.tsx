import { LayoutDashboard, Globe, Settings } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Helmet } from 'react-helmet-async';

const navItems = [
  { label: 'Tableau de bord', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Pays', path: '/admin/countries', icon: <Globe size={18} /> },
  { label: 'Profil', path: '/admin/settings', icon: <Settings size={18} /> },
];

export default function AdminLayout() {
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <DashboardLayout navItems={navItems} pageTitle="Administration" />
    </>
  );
}
