import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { customerAPI } from '../services/api';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


const DebtPage = () => {
  const navigate = useNavigate();
  const { getAccessToken } = useAuth();
  const [activeTab, setActiveTab] = useState('consult');
  const [step, setStep] = useState(1);
  
  const [consultFormData, setConsultFormData] = useState({
    npi: '',
    docNumber: ''
  });
  
  const [createFormData, setCreateFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    npi: '',
    phone_number: ''
  });
  
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fonction pour faire la consultation avec NPI et numéro de document
    const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = await getAccessToken(); // récupération du token via le contexte

      const response = await fetch('http://localhost:8000/country/consultation-request/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          npi: consultFormData.npi,
          document_number: consultFormData.docNumber
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la consultation');
      }

      setIsCodeSent(true);
      setStep(2);
      setSuccess('Un code de vérification a été envoyé par email au client.');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la vérification du client');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour valider le code de vérification
  const handleCodeVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = await getAccessToken(); // récupération du token via le contexte
      if (!token) {
        throw new Error('Authentification requise. Veuillez vous reconnecter.');
      }

      const response = await fetch(`http://localhost:8000/country/customer-data/?code=${encodeURIComponent(verificationCode)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Code incorrect ou expiré.');
      }

      const customerData = await response.json();
      // ✅ Naviguer avec les données du client dans l'état
      navigate('/infos-client', { state: { customer: customerData.customer } });


      // navigate(`/creditscore?debtor=${encodeURIComponent(`${customerData.first_name} ${customerData.last_name}`)}`);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour créer un nouveau client
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = await getAccessToken(); // récupération du token via le contexte
      if (!token) {
        throw new Error('Authentification requise. Veuillez vous reconnecter.');
      }
      // console.log('Données envoyées au backend :', createFormData);

      const response = await fetch('http://localhost:8000/customer/new/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(createFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de la création du client');
      }

      setSuccess('Client créé avec succès !');
      setCreateFormData({
        first_name: '',
        last_name: '',
        email: '',
        npi: '',
        phone_number: '',
      });
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };


  const resetConsultation = () => {
    setStep(1);
    setIsCodeSent(false);
    setVerificationCode('');
    setConsultFormData({
      npi: '',
      docNumber: ''
    });
    setError('');
    setSuccess('');
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-5xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
              <h1 className="text-3xl font-bold text-white text-center">
                Gestion des Clients - Huissier
              </h1>
              <p className="text-blue-100 text-center mt-2">
                Créer ou consulter un compte client
              </p>
            </div>
            
            <div className="flex bg-gray-50 border-b border-gray-200">
              <button
                onClick={() => {
                  setActiveTab('consult');
                  resetConsultation();
                }}
                className={`flex-1 py-4 px-6 font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'consult'
                    ? 'bg-white text-blue-600 border-b-2 border-blue-500 shadow-sm'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-white'
                }`}
              >
                🔍 Consulter un client
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`flex-1 py-4 px-6 font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'create'
                    ? 'bg-white text-green-600 border-b-2 border-green-500 shadow-sm'
                    : 'text-gray-600 hover:text-green-600 hover:bg-white'
                }`}
              >
                ➕ Créer un nouveau client
              </button>
            </div>

            <div className="p-8">
              {error && (
                <div className="mb-6 text-red-600 bg-red-50 p-4 rounded-lg flex items-center gap-2">
                  <AlertTriangle size={20} />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-6 text-green-600 bg-green-50 p-4 rounded-lg">
                  {success}
                </div>
              )}

              {activeTab === 'consult' && (
                <div>
                  {step === 1 ? (
                    <form onSubmit={handleConsultSubmit} className="max-w-2xl mx-auto space-y-6">
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Consultation client</h2>
                        <p className="text-gray-600 mt-2">Entrez le NPI et le numéro du document signé</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">NPI</label>
                        <input
                          type="text"
                          value={consultFormData.npi}
                          onChange={(e) => setConsultFormData({ ...consultFormData, npi: e.target.value })}
                          className="form-input"
                          placeholder="Entrez le NPI du client"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Numéro du document signé</label>
                        <input
                          type="text"
                          value={consultFormData.docNumber}
                          onChange={(e) => setConsultFormData({ ...consultFormData, docNumber: e.target.value })}
                          className="form-input"
                          placeholder="Entrez le numéro du document"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary w-full"
                      >
                        {isLoading ? 'Vérification...' : 'Consulter le client'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleCodeVerification} className="max-w-md mx-auto space-y-6">
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Code de vérification</h2>
                        <p className="text-gray-600 mt-2">Entrez le code reçu par email</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Code de vérification</label>
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className="form-input text-center text-2xl tracking-widest"
                          placeholder="Entrez le code"
                          required
                        />
                      </div>

                      <div className="flex gap-4">
                        <button
                          type="submit"
                          disabled={isLoading || !verificationCode.trim()}
                          className="btn btn-primary flex-1"
                        >
                          {isLoading ? 'Vérification...' : 'Valider'}
                        </button>
                        <button
                          type="button"
                          onClick={resetConsultation}
                          className="btn btn-secondary flex-1"
                        >
                          Retour
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {activeTab === 'create' && (
                <form onSubmit={handleCreateSubmit} className="max-w-2xl mx-auto space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Nouveau client</h2>
                    <p className="text-gray-600 mt-2">Créer un nouveau compte client</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                      <input
                        type="text"
                        value={createFormData.first_name}
                        onChange={(e) => setCreateFormData({ ...createFormData, first_name: e.target.value })}
                        className="form-input"
                        placeholder="Prénom du client"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                      <input
                        type="text"
                        value={createFormData.last_name}
                        onChange={(e) => setCreateFormData({ ...createFormData, last_name: e.target.value })}
                        className="form-input"
                        placeholder="Nom du client"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={createFormData.email}
                      onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                      className="form-input"
                      placeholder="email@exemple.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NPI</label>
                    <input
                      type="text"
                      value={createFormData.npi}
                      onChange={(e) => setCreateFormData({ ...createFormData, npi: e.target.value })}
                      className="form-input"
                      placeholder="Numéro NPI"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
                    <input
                      type="tel"
                      value={createFormData.phone_number}
                      onChange={(e) => setCreateFormData({ ...createFormData, phone_number: e.target.value })}
                      className="form-input"
                      placeholder="Numéro de téléphone"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary w-full"
                  >
                    {isLoading ? 'Création...' : 'Créer le client'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DebtPage;