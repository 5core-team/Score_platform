import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

interface SidebarProps {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ items, isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();

  const roleLabel: Record<string, string> = {
    ADMIN: 'Administrateur',
    COUNTRY_REPRESENTATIVE: 'Représentant Pays',
    FRONT_OFFICE: 'Front Office',
    BAILIFF: 'Huissier',
    ADVISOR: 'Conseiller',
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`
        fixed top-0 left-0 z-30 h-screen w-64 flex flex-col
        bg-gray-900 dark:bg-gray-950 border-r border-gray-800
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-800">
          <img src="/logo.jpeg" alt="Afrika Risque" className="h-9 w-9 rounded-lg object-cover" />
          <div>
            <p className="text-white font-bold text-sm leading-none">Afrika Risque</p>
            <p className="text-cyan-400 text-xs mt-0.5">{user ? roleLabel[user.role] : ''}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {items.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path.endsWith('/dashboard')}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }
              `}
            >
              <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-gray-800">
          <p className="text-xs text-gray-600">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-gray-700 truncate">{user?.email}</p>
        </div>
      </aside>
    </>
  );
}
