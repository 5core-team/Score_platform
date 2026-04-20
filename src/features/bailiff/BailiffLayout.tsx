import { LayoutDashboard, UserPlus, Search } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

const navItems = [
  { label: 'Tableau de bord', path: '/bailiff/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Nouveau dossier', path: '/bailiff/new-case', icon: <UserPlus size={18} /> },
  { label: 'Consultation', path: '/bailiff/consultation', icon: <Search size={18} /> },
];

export default function BailiffLayout() {
  return <DashboardLayout navItems={navItems} pageTitle="Huissier" />;
}
