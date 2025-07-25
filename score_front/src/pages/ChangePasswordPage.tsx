import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { getAccessToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = await getAccessToken();
      const response = await fetch('http://127.0.0.1:8000/score/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erreur lors du changement de mot de passe');
      }

      setSuccess('Mot de passe changé avec succès. Veuillez vous reconnecter.');
      setTimeout(() => {
        // Déconnecte l'utilisateur et redirige vers login
        localStorage.removeItem('scoreUser');
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
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