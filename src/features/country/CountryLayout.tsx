import { LayoutDashboard, MapPin, Users, Settings } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

const navItems = [
  { label: 'Tableau de bord', path: '/country/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Zones géographiques', path: '/country/zones', icon: <MapPin size={18} /> },
  { label: 'Utilisateurs', path: '/country/users', icon: <Users size={18} /> },
  { label: 'Paramètres', path: '/country/settings', icon: <Settings size={18} /> },
];

export default function CountryLayout() {
  return <DashboardLayout navItems={navItems} pageTitle="Représentant Pays" />;
}
