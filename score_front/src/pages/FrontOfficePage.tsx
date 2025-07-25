import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Plus, Search, AlertTriangle, Clipboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface FrontOffice {
  id: number;
  front_office_name: string;
  username: string;
  npi: string;
  phone: string;
  email: string;
  localisation: string;
  status: 'active' | 'inactive';
}

const FrontOfficePage = () => {
  const { getAccessToken } = useAuth();
  const [frontOffices, setFrontOffices] = useState<FrontOffice[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    front_office_name: '',
    username: '',
    npi: '',
    phone: '',
    email: '',
    localisation: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopyPassword = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Réinitialise après 2 secondes
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setGeneratedPassword('');
    setIsSubmitting(true);

    try {
      const token = await getAccessToken();

      if (!token) {
        setError('Vous n\'êtes pas connecté ou votre session a expiré.');
        return;
      }

      const response = await fetch('http://localhost:8000/country/create-front-office/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création du front office');
      }

      setShowAddForm(false);
      setFormData({
        front_office_name: '',
        username: '',
        npi: '',
        phone: '',
        email: '',
        localisation: '',
      });

      setSuccess(data.message || 'Front office créé avec succès');
      setGeneratedPassword(data.password || '');

    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredOffices = frontOffices.filter(office =>
    office.front_office_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    office.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Gestion des Front Offices</h1>
          <button 
            onClick={() => setShowAddForm(true)} 
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Ajouter un Front Office</span>
          </button>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un front office..."
            className="form-input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && (
          <div className="mb-6 text-red-600 bg-red-50 p-3 rounded-md flex items-center gap-2">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 p-3 rounded-md">
            <p className="text-green-700 font-medium">{success}</p>
            {generatedPassword && (
              <div className="mt-2 flex items-center gap-2">
                <span className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                  {generatedPassword}
                </span>
                <button
                  onClick={handleCopyPassword}
                  className="btn btn-sm btn-outline flex items-center gap-1"
                >
                  <Clipboard size={16} />
                  {copied ? 'Copié ✅' : 'Copier'}
                </button>
              </div>
            )}
          </div>
        )}

        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-6 p-6 bg-gray-50 rounded-lg"
          >
            <h2 className="text-lg font-semibold mb-4">Ajouter un Front Office</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['front_office_name', 'username', 'npi', 'phone', 'email', 'localisation'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field === 'front_office_name' ? 'Nom du Front Office' :
                        field === 'username' ? "Nom d'utilisateur" :
                        field === 'npi' ? 'NPI' :
                        field === 'phone' ? 'Téléphone' :
                        field === 'email' ? 'Email' :
                        'Localisation'}
                    </label>
                    <input
                      type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                      value={(formData as any)[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)} 
                  className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Création en cours...' : 'Créer'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Nom', 'Utilisateur', 'NPI', 'Téléphone', 'Email', 'Localisation', 'Statut'].map(header => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOffices.map((office) => (
                <tr key={office.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{office.front_office_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{office.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{office.npi}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{office.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{office.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{office.localisation}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      office.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {office.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FrontOfficePage;
