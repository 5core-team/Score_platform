import { LayoutDashboard, Search, Settings } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

const navItems = [
  { label: 'Tableau de bord', path: '/advisor/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Consultation', path: '/advisor/consultation', icon: <Search size={18} /> },
  { label: 'Profil', path: '/advisor/settings', icon: <Settings size={18} /> },
];

export default function AdvisorLayout() {
  return <DashboardLayout navItems={navItems} pageTitle="Conseiller" />;
}
