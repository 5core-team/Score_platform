import { LayoutDashboard, Globe, CreditCard, Settings } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

const navItems = [
  { label: 'Tableau de bord', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Pays', path: '/admin/countries', icon: <Globe size={18} /> },
  //{ label: 'Abonnements', path: '/admin/subscriptions', icon: <CreditCard size={18} /> },
  { label: 'Profil', path: '/admin/settings', icon: <Settings size={18} /> },
];

export default function AdminLayout() {
  return <DashboardLayout navItems={navItems} pageTitle="Administration" />;
}
