import { LayoutDashboard, Users, MapPin } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

const navItems = [
  { label: 'Tableau de bord', path: '/office/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Sous-Zones', path: '/office/subzones', icon: <MapPin size={18} /> },
  { label: 'Utilisateurs', path: '/office/users', icon: <Users size={18} /> },
];

export default function OfficeLayout() {
  return <DashboardLayout navItems={navItems} pageTitle="Front Office" />;
}
