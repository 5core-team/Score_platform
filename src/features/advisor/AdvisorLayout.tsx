import { LayoutDashboard, Search, Settings } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Helmet } from 'react-helmet-async';

const navItems = [
  { label: 'Tableau de bord', path: '/advisor/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Consultation', path: '/advisor/consultation', icon: <Search size={18} /> },
  { label: 'Profil', path: '/advisor/settings', icon: <Settings size={18} /> },
];

export default function AdvisorLayout() {
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <DashboardLayout navItems={navItems} pageTitle="Conseiller" />
    </>
  );
}
