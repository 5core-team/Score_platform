import { Home, BarChart2, FileText, Users, Settings, LogOut, Plus, Trash2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ScoreLogo from './ScoreLogo';
import { useState } from 'react';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>('accounts');

  const isActive = (path: string) => location.pathname === path;

  const toggleSubmenu = (menu: string) => {
    setExpandedSubmenu(expandedSubmenu === menu ? null : menu);
  };

  return (
    <div className="w-64 h-screen bg-background-dark fixed left-0 top-0 flex flex-col">
      {/* Zone du logo agrandie */}
      <div className="p-4 h-[180px] flex items-center justify-center">
        <ScoreLogo variant="vertical" size="large" className="mx-auto" />
      </div>

      <div className="mt-4 p-4">
        <div className="bg-primary rounded-lg p-4 text-white">
          <h2 className="text-sm opacity-80">Chiffre d'affaires</h2>
          <p className="text-xl font-bold mt-1">35 000 000 fcfa</p>
        </div>
      </div>

      <div className="mt-4 p-4">
        <div className="bg-accent rounded-lg p-4">
          <Link to="/licenses" className="flex items-center text-secondary font-semibold">
            <Home className="mr-2" size={18} />
            Licences vendues
          </Link>
        </div>
      </div>

      <nav className="mt-6 flex-1 px-4">
        <ul className="space-y-2">
          <li>
            <Link 
              to="/dashboard" 
              className={`sidebar-item ${isActive('/dashboard') ? 'active' : ''}`}
            >
              <BarChart2 size={20} />
              <span>Statistiques</span>
            </Link>
          </li>

          <li>
            <Link 
              to="/debt" 
              className={`sidebar-item ${isActive('/debt') ? 'active' : ''}`}
            >
              <FileText size={20} />
              <span>Les Clients</span>
            </Link>
          </li>

          <li>
            <div 
              className={`sidebar-item cursor-pointer ${expandedSubmenu === 'accounts' ? 'active' : ''}`}
              onClick={() => toggleSubmenu('accounts')}
            >
              <Users size={20} />
              <span>Comptes</span>
            </div>

            {expandedSubmenu === 'accounts' && (
              <ul className="pl-7 mt-2 space-y-2">
                <li>
                  <Link to="/users/country" className="text-white/80 hover:text-white text-sm py-2 px-3 block transition-colors">
                    Représentant pays
                  </Link>
                </li>
                <li>
                  <Link to="/FrontOffice" className="text-white/80 hover:text-white text-sm py-2 px-3 block transition-colors">
                    Front Office
                  </Link>
                </li>
                {/* <li>
                  <Link to="/users/bail" className="text-white/80 hover:text-white text-sm py-2 px-3 block transition-colors">
                    Assermentées
                  </Link>
                </li> */}
                <li>
                  <Link to="/users" className="text-white/80 hover:text-white text-sm py-2 px-3 block transition-colors">
                    Utilisateurs
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link 
              to="/settings" 
              className={`sidebar-item ${isActive('/settings') ? 'active' : ''}`}
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <ul className="space-y-2">
          <li>
            <Link 
              to="/users/add" 
              className={`sidebar-item ${isActive('/users/add') ? 'active' : ''}`}
            >
              <Plus size={20} />
              <span>Ajouter compte</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/users/delete" 
              className={`sidebar-item ${isActive('/users/delete') ? 'active' : ''}`}
            >
              <Trash2 size={20} />
              <span>Supprimer compte</span>
            </Link>
          </li>
          <li>
            <button 
              onClick={logout}
              className="sidebar-item w-full text-left"
            >
              <LogOut size={20} />
              <span>Log Out</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
