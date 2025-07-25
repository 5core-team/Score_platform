import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Edit2, Trash2, Search, Filter, UserPlus } from 'lucide-react';

// Mock user data
const mockUsers = [
  { id: 1, name: 'Jean Dupont', email: 'jean@example.com', role: 'Conseiller financier', status: 'active', zone: 'Cotonou' },
  { id: 2, name: 'Marie Kossi', email: 'marie@example.com', role: 'Huissier', status: 'active', zone: 'Porto-Novo' },
  { id: 3, name: 'Paul Amoussou', email: 'paul@example.com', role: 'Conseiller financier', status: 'inactive', zone: 'Vodjè' },
  { id: 4, name: 'Sophie Agbodjan', email: 'sophie@example.com', role: 'Admin', status: 'active', zone: 'Cotonou' },
  { id: 5, name: 'Robert Koudoh', email: 'robert@example.com', role: 'Huissier', status: 'active', zone: 'Abomey-Calavi' },
  { id: 6, name: 'Mr Marvin', email: 'marvinphr@example.com', role: 'Super admin', status: 'active', zone: 'evreverywhere' },
  { id: 7, name: 'Soumaila Cissé', email: 'cissé@example.com', role: 'Huissier', status: 'active', zone: 'vèdoko' },
  { id: 8, name: 'Brad', email: 'brad@example.com', role: 'Conseiller financier', status: 'inactive', zone: 'Akpakpa' },
  { id: 9, name: 'Bonou Paul', email: 'paul@example.com', role: 'Conseiller financier', status: 'active', zone: 'Fidjrossè' },

];

const UsersPage = () => {
  const navigate = useNavigate();
  const [users] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <DashboardLayout>
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Gestion des utilisateurs</h1>
          <button onClick={() => navigate('/users/add')} className="btn btn-primary flex items-center gap-2">
            <UserPlus size={18} />
            <span>Ajouter utilisateur</span>
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="btn bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              <Filter size={18} />
              <span>Filtrer</span>
            </button>
            
            <select className="form-input bg-white border border-gray-200">
              <option value="">Tous les rôles</option>
              <option value="admin">Admin</option>
              <option value="financial">Conseiller financier</option>
              <option value="bailiff">Huissier</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.zone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit2 size={18} />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Affichage de {filteredUsers.length} sur {users.length} utilisateurs
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded text-sm">Précédent</button>
            <button className="px-3 py-1 bg-primary text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border rounded text-sm">Suivant</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;