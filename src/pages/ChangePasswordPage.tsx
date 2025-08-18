import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { getAccessToken, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Token d'accès non disponible. Veuillez vous reconnecter.");
      }

      await api.post('/score/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      setSuccess('Mot de passe changé avec succès. Vous allez être déconnecté.');
      
      setTimeout(() => {
        // Utilise la méthode logout du contexte pour une déconnexion propre
        logout();
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Erreur lors du changement de mot de passe:', err);
      
      if (err.response?.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 2000);
      } else if (err.response?.status === 400) {
        const errorMsg = err.response.data?.error || err.response.data?.detail || 'Ancien mot de passe incorrect';
        setError(errorMsg);
      } else {
        const errorMsg = err.response?.data?.message || err.message || 'Erreur lors du changement de mot de passe';
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold mb-4">Changer votre mot de passe</h2>
        
        <input
          type="password"
          placeholder="Ancien mot de passe"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          className="form-input w-full"
          required
        />
        
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className="form-input w-full"
          required
        />
        
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Changement...' : 'Changer le mot de passe'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;