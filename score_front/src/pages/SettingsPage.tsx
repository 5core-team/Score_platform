import { useState } from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Save, User, Lock, Bell, Shield, Globe, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { changePassword } = useAuth();
  
  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      setIsLoading(true);
      await changePassword(oldPassword, newPassword);
      setSuccess('Mot de passe modifié avec succès');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="card">
        <h1 className="text-xl font-bold mb-6">Paramètres</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 flex-shrink-0">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center px-4 py-3 w-full rounded-md ${
                  activeTab === 'profile'
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User size={20} className="mr-3" />
                <span>Profil</span>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center px-4 py-3 w-full rounded-md ${
                  activeTab === 'security'
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Lock size={20} className="mr-3" />
                <span>Sécurité</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center px-4 py-3 w-full rounded-md ${
                  activeTab === 'notifications'
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Bell size={20} className="mr-3" />
                <span>Notifications</span>
              </button>
              <button
                onClick={() => setActiveTab('permissions')}
                className={`flex items-center px-4 py-3 w-full rounded-md ${
                  activeTab === 'permissions'
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Shield size={20} className="mr-3" />
                <span>Permissions</span>
              </button>
              <button
                onClick={() => setActiveTab('zones')}
                className={`flex items-center px-4 py-3 w-full rounded-md ${
                  activeTab === 'zones'
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Globe size={20} className="mr-3" />
                <span>Zones</span>
              </button>
            </nav>
          </div>
          
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-medium mb-4">Informations du profil</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="form-input"
                      defaultValue="Super Admin"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-input"
                      defaultValue="admin@score.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="form-input"
                      defaultValue="+229 97123456"
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      Rôle
                    </label>
                    <input
                      type="text"
                      id="role"
                      className="form-input bg-gray-100"
                      defaultValue="Administrateur"
                      disabled
                    />
                  </div>
                  <button className="btn btn-primary flex items-center gap-2 mt-4">
                    <Save size={18} />
                    <span>Enregistrer les modifications</span>
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div>
                <h2 className="text-lg font-medium mb-4">Paramètres de sécurité</h2>
                <div className="space-y-4">
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
                        {success}
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mot de passe actuel
                      </label>
                      <div className="relative">
                        <input
                          type={showOldPassword ? 'text' : 'password'}
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="form-input pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showOldPassword ? (
                            <EyeOff className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nouveau mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="form-input pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmer le nouveau mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="form-input pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <motion.button
                      type="submit"
                      className="btn btn-primary flex items-center gap-2 mt-4"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Modification en cours...
                        </div>
                      ) : (
                        <>
                          <Save size={18} />
                          <span>Changer le mot de passe</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                  
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Authentification à deux facteurs</h3>
                    <div className="flex items-center">
                      <div className="toggle toggle-inactive">
                        <span className="toggle-slider"></span>
                      </div>
                      <span className="ml-3 text-sm">Désactivée</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-lg font-medium mb-4">Préférences de notification</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div>
                      <h3 className="text-sm font-medium">Nouvelles dettes</h3>
                      <p className="text-xs text-gray-500">Recevoir une notification lorsqu'une nouvelle dette est enregistrée</p>
                    </div>
                    <div className="toggle toggle-active">
                      <span className="toggle-slider"></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div>
                      <h3 className="text-sm font-medium">Alertes d'échéance</h3>
                      <p className="text-xs text-gray-500">Recevoir une notification lorsqu'une échéance approche</p>
                    </div>
                    <div className="toggle toggle-active">
                      <span className="toggle-slider"></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div>
                      <h3 className="text-sm font-medium">Remboursements</h3>
                      <p className="text-xs text-gray-500">Recevoir une notification lorsqu'une dette est remboursée</p>
                    </div>
                    <div className="toggle toggle-active">
                      <span className="toggle-slider"></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div>
                      <h3 className="text-sm font-medium">Rapports hebdomadaires</h3>
                      <p className="text-xs text-gray-500">Recevoir un résumé hebdomadaire des activités</p>
                    </div>
                    <div className="toggle toggle-inactive">
                      <span className="toggle-slider"></span>
                    </div>
                  </div>
                  
                  <button className="btn btn-primary flex items-center gap-2 mt-4">
                    <Save size={18} />
                    <span>Enregistrer les préférences</span>
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'permissions' && (
              <div>
                <h2 className="text-lg font-medium mb-4">Gestion des permissions</h2>
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-4">
                    <p className="text-sm text-yellow-700">
                      En tant qu'administrateur, vous avez accès à toutes les fonctionnalités. 
                      Cette section vous permet de gérer les permissions des autres utilisateurs.
                    </p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voir</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Créer</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modifier</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supprimer</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">Administrateur</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">✅</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">✅</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">✅</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">✅</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">Conseiller financier</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">✅</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">✅</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">✅</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">❌</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">Huissier</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">✅</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">❌</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">✅</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">❌</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <button className="btn btn-primary flex items-center gap-2 mt-4">
                    <Save size={18} />
                    <span>Enregistrer les permissions</span>
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'zones' && (
              <div>
                <h2 className="text-lg font-medium mb-4">Configuration des zones</h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
                    <p className="text-sm text-blue-700">
                      Cette section vous permet de gérer les zones géographiques et d'affecter des huissiers à ces zones.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Pays
                      </label>
                      <select id="country" className="form-input">
                        <option value="benin">Bénin</option>
                        <option value="congo">Congo</option>
                        <option value="cote_ivoire">Côte d'Ivoire</option>
                        <option value="gabon">Gabon</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                        Région
                      </label>
                      <select id="region" className="form-input">
                        <option value="littoral">Littoral</option>
                        <option value="atlantique">Atlantique</option>
                        <option value="oueme">Ouémé</option>
                        <option value="borgou">Borgou</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      Ville/Commune
                    </label>
                    <input
                      type="text"
                      id="city"
                      className="form-input"
                      placeholder="Nom de la ville ou commune"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="bailiff" className="block text-sm font-medium text-gray-700 mb-1">
                      Affecter un huissier
                    </label>
                    <select id="bailiff" className="form-input">
                      <option value="">Sélectionner un huissier</option>
                      <option value="1">Marie Kossi</option>
                      <option value="2">Robert Koudoh</option>
                      <option value="3">Sophie Agbodjan</option>
                    </select>
                  </div>
                  
                  <button className="btn btn-primary flex items-center gap-2 mt-4">
                    <Save size={18} />
                    <span>Enregistrer la configuration</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;