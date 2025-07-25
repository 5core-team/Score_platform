import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { UserPlus, User, Shield, Scale, MapPin, Plus, AlertTriangle, Copy, CheckCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface Zone {
  id: number;
  name: string;
  created_at?: string;
}

interface SuccessResponse {
  message: string;
  password: string;
}

const AddUserPage = () => {
  const [selectedAccountType, setSelectedAccountType] = useState('');
  const [zones, setZones] = useState<Zone[]>([]);
  const [showZoneForm, setShowZoneForm] = useState(false);
  const [zoneFormData, setZoneFormData] = useState({ name: '' });
  const [zoneError, setZoneError] = useState('');
  const [zoneSuccess, setZoneSuccess] = useState('');
  const [isSubmittingZone, setIsSubmittingZone] = useState(false);
  
  // États pour le succès de création d'utilisateur
  const [successData, setSuccessData] = useState<SuccessResponse | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const [formData, setFormData] = useState({
    // Champs pour huissier
    username: '',
    npi: '',
    phone: '',
    email: '',
    zone: '',
    
    // Champs pour autres types (en attente)
    accountType: '',
    phoneNumber: '',
    address: '',
    contact: '',
    guarantor: '',
    guarantorContact: '',
    country: '',
    name: '',
    firstName: '',
    password: '',
    confirmPassword: '',
    rememberPassword: false
  });

  // Charger les zones au démarrage
  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch('http://127.0.0.1:8000/country/get-zones/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setZones(data.zones);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des zones:', error);
    }
  };

  const handleZoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setZoneError('');
    setZoneSuccess('');
    setIsSubmittingZone(true);

    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setZoneError('Token d\'authentification manquant. Veuillez vous reconnecter.');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/country/add-zone/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(zoneFormData)
      });

      if (response.ok) {
        const newZone = await response.json();
        setZones(prev => [...prev, newZone]);
        setZoneFormData({ name: '' });
        setShowZoneForm(false);
        setZoneSuccess('Zone créée avec succès !');
        fetchZones();
      } else {
        const error = await response.json();
        setZoneError(error.message || 'Erreur lors de la création de la zone');
      }
    } catch (error) {
      setZoneError('Erreur de connexion au serveur');
    } finally {
      setIsSubmittingZone(false);
    }
  };

  const handleAccountTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedAccountType(value);
    setFormData(prev => ({
      ...prev,
      accountType: value
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleZoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setZoneFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const copyPassword = async () => {
    if (successData?.password) {
      try {
        await navigator.clipboard.writeText(successData.password);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Erreur lors de la copie:', err);
      }
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessData(null);
    setIsCopied(false);
    // Réinitialiser le formulaire
    setFormData(prev => ({
      ...prev,
      username: '',
      npi: '',
      phone: '',
      email: '',
      zone: ''
    }));
  };

  const handleSubmitHuissier = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const huissierData = {
      username: formData.username,
      npi: formData.npi,
      phone: formData.phone,
      email: formData.email,
      zone: formData.zone
    };

    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        alert('Token d\'authentification manquant. Veuillez vous reconnecter.');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/country/create-huissier/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(huissierData)
      });

      if (response.ok) {
        const responseData = await response.json();
        // Afficher le modal de succès avec les données de réponse
        setSuccessData(responseData);
        setShowSuccessModal(true);
      } else {
        const error = await response.json();
        
        if (response.status === 401) {
          alert('Token expiré ou invalide. Veuillez vous reconnecter.');
        } else if (response.status === 400) {
          const errorMsg = error.error || error.detail || JSON.stringify(error);
          alert(`Erreur de validation: ${errorMsg}`);
        } else {
          alert(`Erreur lors de la création: ${JSON.stringify(error)}`);
        }
      }
    } catch (error) {
      alert('Erreur de connexion au serveur');
    }
  };

  const handleSubmitFinancial = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ici vous pourrez ajouter l'appel API pour créer un conseiller financier
    // Pour l'instant, on simule une réponse de succès
    const mockResponse = {
      message: "créé avec succès.",
      password: "TempPass123!"
    };
    
    setSuccessData(mockResponse);
    setShowSuccessModal(true);
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'financial':
        return <User size={20} className="text-blue-600" />;
      case 'bailiff':
        return <Scale size={20} className="text-green-600" />;
      default:
        return <UserPlus size={20} className="text-gray-600" />;
    }
  };

  const renderSuccessModal = () => {
    if (!showSuccessModal || !successData) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle size={24} className="text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">Création réussie</h3>
            </div>
            <button
              onClick={closeSuccessModal}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          
          <p className="text-green-700 mb-4">{successData.message}</p>
          
          <div className="bg-gray-50 rounded-lg p-4 border">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe généré
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={successData.password}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm font-mono"
              />
              <button
                onClick={copyPassword}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isCopied
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200'
                }`}
              >
                {isCopied ? (
                  <>
                    <CheckCircle size={16} className="inline mr-1" />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy size={16} className="inline mr-1" />
                    Copier
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Sauvegardez ce mot de passe, il ne sera plus affiché.
            </p>
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              onClick={closeSuccessModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              OK
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderZoneManagement = () => (
    <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <MapPin size={24} className="text-blue-600" />
          <h2 className="text-lg font-semibold text-blue-800">Gestion des Zones</h2>
        </div>
        <button 
          onClick={() => setShowZoneForm(!showZoneForm)} 
          className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={16} />
          {showZoneForm ? 'Annuler' : 'Ajouter Zone'}
        </button>
      </div>

      <p className="text-blue-700 text-sm mb-4">
        Créez des zones avant de les attribuer aux huissiers.
      </p>

      {zoneError && (
        <div className="mb-4 text-red-600 bg-red-50 p-3 rounded-md flex items-center gap-2">
          <AlertTriangle size={18} />
          {zoneError}
        </div>
      )}

      {zoneSuccess && (
        <div className="mb-4 text-green-600 bg-green-50 p-3 rounded-md">
          {zoneSuccess}
        </div>
      )}

      {showZoneForm && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          className="mb-6 p-4 bg-white rounded-lg border"
        >
          <form onSubmit={handleZoneSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la Zone *
              </label>
              <input 
                type="text" 
                name="name"
                value={zoneFormData.name}
                onChange={handleZoneChange}
                className="form-input"
                placeholder="Ex: Zone Nord, Zone Sud, Cotonou Centre..."
                required 
              />
            </div>
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setShowZoneForm(false)} 
                className="btn btn-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700" 
                disabled={isSubmittingZone}
              >
                {isSubmittingZone ? 'Création...' : 'Créer'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Liste des zones existantes */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b">
          <h3 className="text-sm font-medium text-gray-700">Zones disponibles ({zones.length})</h3>
        </div>
        <div className="max-h-40 overflow-y-auto">
          {zones.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {zones.map((zone, index) => (
                <div key={index} className="px-4 py-3 flex justify-between items-center hover:bg-gray-50">
                  <span className="text-sm text-gray-900">{zone.name}</span>
                  <span className="text-xs text-gray-500">ID: {index + 1}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              <MapPin size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Aucune zone créée</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderHuissierForm = () => (
    <form onSubmit={handleSubmitHuissier} className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Scale size={20} className="text-green-600" />
          <h3 className="font-semibold text-green-800">Création d'un Huissier</h3>
        </div>
        <p className="text-green-700 text-sm">
          Remplissez les informations requises pour créer un compte huissier.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom d'utilisateur *
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-input"
            placeholder="Ex: smlcisse"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Numéro NPI *
          </label>
          <input
            type="text"
            name="npi"
            value={formData.npi}
            onChange={handleChange}
            className="form-input"
            placeholder="Ex: 52793354000"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
            placeholder="Ex: 0152793354"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder="Ex: smlcisse@gmail.com"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zone *
          </label>
          <div className="flex gap-2">
            <select
              name="zone"
              value={formData.zone}
              onChange={handleChange}
              className="form-input flex-1"
              required
            >
              <option value="">Sélectionner une zone</option>
              {zones.map((zone, index) => (
                <option key={index} value={zone.name}>
                  {zone.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowZoneForm(true)}
              className="btn btn-sm bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center gap-1"
              title="Créer une nouvelle zone"
            >
              <Plus size={16} />
              Zone
            </button>
          </div>
          {zones.length === 0 && (
            <p className="text-sm text-amber-600 mt-1">
              ⚠️ Aucune zone disponible. Créez d'abord une zone ci-dessus.
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <motion.button
          type="submit"
          className="btn btn-primary w-full md:w-auto px-8 py-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={zones.length === 0}
        >
          <Scale size={18} className="mr-2" />
          Créer le Huissier
        </motion.button>
      </div>
    </form>
  );

  const renderFinancialForm = () => (
    <form onSubmit={handleSubmitFinancial} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <User size={20} className="text-blue-600" />
          <h3 className="font-semibold text-blue-800">Création de Conseiller financier</h3>
        </div>
        <p className="text-blue-700 text-sm">
          Remplissez les informations requises pour créer un compte conseiller financier.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numéro NPI
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact
            </label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Personne garante
            </label>
            <input
              type="text"
              name="guarantor"
              value={formData.guarantor}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact garant
            </label>
            <input
              type="text"
              name="guarantorContact"
              value={formData.guarantorContact}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pays
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <motion.button
          type="submit"
          className="btn btn-secondary w-full md:w-auto px-8 py-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <User size={18} className="mr-2" />
          Créer le Conseiller financier
        </motion.button>
      </div>
    </form>
  );

  return (
    <DashboardLayout>
      <div className="card max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <UserPlus size={28} className="text-primary" />
          <h1 className="text-2xl font-bold text-secondary">Ajouter Compte</h1>
        </div>

        {/* Gestion des zones - visible uniquement quand on crée un huissier */}
        {(selectedAccountType === 'bailiff' || selectedAccountType === '') && renderZoneManagement()}

        {/* Sélection du type de compte */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de compte *
          </label>
          <select
            name="accountType"
            value={selectedAccountType}
            onChange={handleAccountTypeChange}
            className="form-input max-w-xs"
            required
          >
            <option value="">Sélectionner un type</option>
            <option value="financial">Conseiller financier</option>
            <option value="bailiff">Huissier</option>
          </select>
        </div>

        {/* Affichage conditionnel des formulaires */}
        {selectedAccountType === 'bailiff' && renderHuissierForm()}
        {selectedAccountType === 'financial' && renderFinancialForm()}
        
        {!selectedAccountType && (
          <div className="text-center py-12 text-gray-500">
            <UserPlus size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Sélectionnez un type de compte pour commencer</p>
          </div>
        )}
      </div>

      {/* Modal de succès */}
      {renderSuccessModal()}
    </DashboardLayout>
  );
};

export default AddUserPage;