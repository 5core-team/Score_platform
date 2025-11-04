import { useEffect, useState } from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Plus, Search, AlertTriangle, Loader, Calendar, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface CountryRepresentative {
  id: number;
  name: string;
  country_code: string;
  phone_code: string;
  email: string;
  status: 'active' | 'inactive';
  lastPayment?: string;
  subscription_status?: string;
  subscription_end_date?: string;
  days_remaining?: number;
}

const CountryRepresentativesPage = () => {
  const { getAccessToken } = useAuth();
  const [representatives, setRepresentatives] = useState<CountryRepresentative[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [currentRepresentative, setCurrentRepresentative] = useState<CountryRepresentative | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    country_code: '',
    phone_code: '',
    email: '',
  });
  const [subscriptionData, setSubscriptionData] = useState({
    name: '',
    plan: 'monthly', // Par défaut
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fonction pour calculer les jours restants
  const calculateDaysRemaining = (endDate: string): number => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays); // Retourner 0 si négatif
  };
  
  // Fonction pour recharger les représentants
  const refreshRepresentatives = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const token = await getAccessToken();
      
      if (!token) {
        throw new Error("Session expirée ou non connecté");
      }
      
      const { data } = await api.get('/score/countries/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const updatedRepresentatives = data.map((rep: CountryRepresentative) => {
        if (rep.subscription_end_date) {
          return {
            ...rep,
            days_remaining: calculateDaysRemaining(rep.subscription_end_date)
          };
        }
        return rep;
      });
      
      setRepresentatives(updatedRepresentatives);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail 
        || err.response?.data?.message 
        || err.response?.data?.error
        || err.message 
        || 'Impossible de charger les représentants';
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les représentants existants
  useEffect(() => {
    refreshRepresentatives();
  }, [getAccessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const token = await getAccessToken();

      if (!token) {
        setError('Vous n\'êtes pas connecté ou votre session a expiré.');
        setIsSubmitting(false);
        return;
      }

      const { data } = await api.post('/score/add-country/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setShowAddForm(false);
      setFormData({ name: '', country_code: '', phone_code: '', email: '' });
      setSuccess(`Le représentant pour ${data.name} a été ajouté avec succès ! 
      Mot de passe généré : ${data.password}`);

      await refreshRepresentatives();      
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail 
        || err.response?.data?.message 
        || err.response?.data?.error
        || err.message 
        || 'Une erreur inconnue est survenue';
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubscriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubscribing(true);

    try {
      const token = await getAccessToken();

      if (!token) {
        setError('Vous n\'êtes pas connecté ou votre session a expiré.');
        setIsSubscribing(false);
        return;
      }

      console.log('💳 Envoi des données d\'abonnement:', subscriptionData);
      const { data, status } = await api.post('/score/subscribe/', subscriptionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('📡 Réponse du serveur pour abonnement:', data);

      if (status === 201) {        
        setShowSubscribeModal(false);
        setCurrentRepresentative(null);
        setSuccess(`Abonnement ${subscriptionData.plan === 'monthly' ? 'mensuel' : 'annuel'} 
                    pour ${subscriptionData.name} souscrit avec succès!`);
        
        await refreshRepresentatives();
      } else {
        // Gérer les autres cas de succès si nécessaire
        setShowSubscribeModal(false);
        setCurrentRepresentative(null);
        setSuccess(`Abonnement ${subscriptionData.plan === 'monthly' ? 'mensuel' : 'annuel'} 
                    pour ${subscriptionData.name} traité avec succès!`);
        await refreshRepresentatives();
      }
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail 
        || err.response?.data?.message 
        || err.response?.data?.error
        || err.message 
        || 'Une erreur inconnue est survenue';
      
      setError(errorMessage);
    } finally {
      setIsSubscribing(false);
    }
  };

  const openSubscribeModal = (rep: CountryRepresentative) => {
    console.log('📝 Ouverture du modal d\'abonnement pour:', rep);
    setCurrentRepresentative(rep);
    setSubscriptionData({
      name: rep.name,
      plan: 'monthly',
    });
    setShowSubscribeModal(true);
  };

  const toggleStatus = async (id: number) => {
    setError('');
    setSuccess('');
    
    try {
      const token = await getAccessToken();
      if (!token) {
        setError('Vous n\'êtes pas connecté ou votre session a expiré.');
        return;
      }

      const currentRep = representatives.find(rep => rep.id === id);
      if (!currentRep) return;

      const newStatus = currentRep.status === 'active' ? 'inactive' : 'active';
      await api.put(`/score/update-country-status/${id}/`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRepresentatives(representatives.map(rep =>
        rep.id === id ? { ...rep, status: newStatus } : rep
      ));
      
      setSuccess(`Le statut du représentant pour ${currentRep.name} a été mis à jour avec succès!`);
      await refreshRepresentatives();
      
    } catch (err: any) {
      console.error("❌ Erreur lors de la modification du statut:", err);
      const errorMessage = err.response?.data?.detail 
        || err.response?.data?.message 
        || err.response?.data?.error
        || err.message 
        || 'Une erreur inconnue est survenue';
      
      setError(errorMessage);
    }
  };

  const filteredRepresentatives = representatives.filter(rep =>
    rep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rep.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour formater l'état de l'abonnement
  const formatSubscriptionStatus = (rep: CountryRepresentative) => {
    if (rep.days_remaining !== undefined && rep.days_remaining > 0) {
      return `${rep.days_remaining} jour${rep.days_remaining > 1 ? 's' : ''} restant${rep.days_remaining > 1 ? 's' : ''}`;
    }
    // Si il y a une date de fin mais 0 jours restants
    if (rep.subscription_end_date && rep.days_remaining === 0) {
      return 'Expiré';
    }
    
    if (!rep.lastPayment && !rep.subscription_end_date) {
      return 'Non abonné';
    }
    return rep.subscription_status || 'Actif';
  };

  // Fonction pour déterminer la couleur du badge d'abonnement
  const getSubscriptionBadgeColor = (rep: CountryRepresentative) => {
    if (rep.days_remaining !== undefined) {
      if (rep.days_remaining > 7) {
        return 'bg-green-100 text-green-800';
      } else if (rep.days_remaining > 0) {
        return 'bg-yellow-100 text-yellow-800';
      } else if (rep.subscription_end_date) {
        return 'bg-red-100 text-red-800';
      }
    }
    
    if (rep.lastPayment || rep.subscription_end_date) {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader className="animate-spin mr-2" size={24} />
          <span>Chargement des représentants...</span>
        </div>
      );
    }

    if (error && representatives.length === 0) {
      return (
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <AlertTriangle className="mx-auto mb-4 text-red-500" size={32} />
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => refreshRepresentatives()} 
            className="mt-4 btn btn-primary"
          >
            Rafraîchir la page
          </button>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        {filteredRepresentatives.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            {searchTerm ? 'Aucun représentant ne correspond à votre recherche' : 'Aucun représentant enregistré'}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Pays', 'Code', 'Indicatif', 'Email', 'Abonnement en cours', 'Statut', 'Actions'].map(header => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRepresentatives.map((rep) => (
                <tr key={rep.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{rep.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{rep.country_code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{rep.phone_code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{rep.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSubscriptionBadgeColor(rep)}`}>
                      {formatSubscriptionStatus(rep)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${rep.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {rep.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button 
                      onClick={() => openSubscribeModal(rep)}
                      className="btn btn-sm btn-primary flex items-center gap-1"
                    >
                      <Calendar size={14} />
                      <span>L'abonner</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Représentants pays</h1>
          <button 
            onClick={() => setShowAddForm(true)} 
            className="btn btn-primary flex items-center gap-2"
            disabled={isLoading}
          >
            <Plus size={18} />
            <span>Ajouter un représentant</span>
          </button>
        </div>

        {!isLoading && (
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un représentant..."
              className="form-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {error && (
          <div className="mb-6 text-red-600 bg-red-50 p-3 rounded-md flex items-center gap-2">
            <AlertTriangle size={18} />
            {error}
            <button onClick={() => setError('')} className="ml-auto text-gray-500 hover:text-gray-700">
              <span className="sr-only">Fermer</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 text-green-600 bg-green-50 p-3 rounded-md flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            {success}
            <button onClick={() => setSuccess('')} className="ml-auto text-gray-500 hover:text-gray-700">
              <span className="sr-only">Fermer</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}

        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-6 p-6 bg-gray-50 rounded-lg"
          >
            <h2 className="text-lg font-semibold mb-4">Ajouter un représentant</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du pays</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    className="form-input" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code pays</label>
                  <input 
                    type="text" 
                    maxLength={3} 
                    value={formData.country_code} 
                    onChange={(e) => setFormData({ ...formData, country_code: e.target.value.toUpperCase() })} 
                    className="form-input" 
                    required 
                    placeholder="Ex: BJ" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Indicatif téléphonique</label>
                  <input 
                    type="text" 
                    value={formData.phone_code} 
                    onChange={(e) => setFormData({ ...formData, phone_code: e.target.value })} 
                    className="form-input" 
                    required 
                    placeholder="Ex: +229" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                    className="form-input" 
                    required 
                  />
                </div>
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
                  {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {showSubscribeModal && currentRepresentative && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Souscrire à un abonnement</h3>
                <button 
                  onClick={() => setShowSubscribeModal(false)} 
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubscriptionSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                  <input 
                    type="text" 
                    value={subscriptionData.name} 
                    className="form-input bg-gray-50" 
                    disabled 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan d'abonnement</label>
                  <div className="flex mt-2 bg-gray-50 rounded-md p-2">
                    <div 
                      className={`flex-1 text-center py-2 px-4 rounded-md cursor-pointer transition ${
                        subscriptionData.plan === 'monthly' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-transparent text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setSubscriptionData({...subscriptionData, plan: 'monthly'})}
                    >
                      Mensuel
                    </div>
                    <div 
                      className={`flex-1 text-center py-2 px-4 rounded-md cursor-pointer transition ${
                        subscriptionData.plan === 'yearly' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-transparent text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setSubscriptionData({...subscriptionData, plan: 'yearly'})}
                    >
                      Annuel
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Plan:</span>
                    <span>{subscriptionData.plan === 'monthly' ? 'Mensuel' : 'Annuel'}</span>
                  </div>
                  <div className="flex items-center justify-between font-medium">
                    <span>Total:</span>
                    <span>{subscriptionData.plan === 'monthly' ? '20 000 FCFA/mois' : '200 000 FCFA/an'}</span>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowSubscribeModal(false)} 
                    className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={isSubscribing}
                  >
                    {isSubscribing ? 'Souscription en cours...' : 'Souscrire'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {renderContent()}
      </div>
    </DashboardLayout>
  );
};

export default CountryRepresentativesPage;