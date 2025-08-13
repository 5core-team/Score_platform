import { useState } from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { MapPin, Search, Plus, Edit2 } from 'lucide-react';
import MapComponent from '../components/dashboard/MapComponent';

// Mock zone data
const mockZones = [
  { id: 1, name: 'Cotonou', bailiff: 'Marie Kossi', debtCount: 45, recoveryRate: 78 },
  { id: 2, name: 'Porto-Novo', bailiff: 'Robert Koudoh', debtCount: 32, recoveryRate: 65 },
  { id: 3, name: 'Parakou', bailiff: 'Non assigné', debtCount: 28, recoveryRate: 0 },
  { id: 4, name: 'Abomey-Calavi', bailiff: 'Sophie Agbodjan', debtCount: 51, recoveryRate: 82 },
  { id: 5, name: 'Bohicon', bailiff: 'Non assigné', debtCount: 19, recoveryRate: 0 },
];

const ZonePage = () => {
  const [zones] = useState(mockZones);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredZones = zones.filter(zone => 
    zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.bailiff.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">Gestion des zones</h1>
            <button className="btn btn-primary flex items-center gap-2">
              <Plus size={18} />
              <span>Ajouter zone</span>
            </button>
          </div>
          
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher une zone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          
          <div className="overflow-y-auto max-h-[500px]">
            {filteredZones.map((zone) => (
              <div key={zone.id} className="border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="bg-gray-100 p-2 rounded-full mr-4">
                      <MapPin size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{zone.name}</h3>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Huissier: </span>
                        <span className={zone.bailiff === 'Non assigné' ? 'text-yellow-500' : ''}>
                          {zone.bailiff}
                        </span>
                      </p>
                      <div className="mt-2 flex gap-4">
                        <p className="text-sm">
                          <span className="font-medium">Dettes: </span>
                          {zone.debtCount}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Taux de recouvrement: </span>
                          <span className={
                            zone.recoveryRate > 70 ? 'text-green-600' : 
                            zone.recoveryRate > 40 ? 'text-yellow-600' : 
                            'text-red-600'
                          }>
                            {zone.recoveryRate}%
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-900">
                    <Edit2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-bold mb-6">Carte des zones</h2>
          <div className="h-[500px]">
            <MapComponent />
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Cliquez sur une zone de la carte pour voir les détails ou affecter un huissier.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ZonePage;