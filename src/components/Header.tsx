import { Bell, MessageSquare, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Header = () => {
  const { user } = useAuth();
  const [notifications] = useState(2); // Mock notifications count
  
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white">
      <h1 className="text-2xl font-bold text-secondary">Dashboard</h1>
      
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="flex items-center bg-gray-50 rounded-full px-3 py-1.5">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Recherche"
              className="ml-2 bg-transparent border-none outline-none text-sm w-40"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative">
            <MessageSquare size={24} className="text-gray-600" />
          </button>
          
          <button className="relative">
            <Bell size={24} className="text-gray-600" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-danger text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm uppercase">
              {user?.role === 'admin' ? 'SUPER ADMIN' : user?.username}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;