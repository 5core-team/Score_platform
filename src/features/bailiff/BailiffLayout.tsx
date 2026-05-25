import { LayoutDashboard, UserPlus, Search, Settings } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Helmet } from 'react-helmet-async';

const navItems = [
  { label: 'Tableau de bord', path: '/bailiff/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Nouveau dossier', path: '/bailiff/new-case', icon: <UserPlus size={18} /> },
  { label: 'Consultation', path: '/bailiff/consultation', icon: <Search size={18} /> },
  { label: 'Profil', path: '/bailiff/settings', icon: <Settings size={18} /> },
];

export default function BailiffLayout() {
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <DashboardLayout navItems={navItems} pageTitle="Huissier" />
    </>
  );
}