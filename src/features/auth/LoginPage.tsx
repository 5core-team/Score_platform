import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeContext } from '../../contexts/ThemeContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { Role } from '../../types';

// Axios et SummaryApi supprimés — login géré dans AuthContext

const ROLE_PATHS: Record<Role, string> = {
  ADMIN: '/admin/dashboard',
  COUNTRY_REPRESENTATIVE: '/country/dashboard',
  FRONT_OFFICE: '/office/dashboard',
  BAILIFF: '/bailiff/dashboard',
  ADVISOR: '/advisor/dashboard',
};

export default function LoginPage() {
  const { login } = useAuth();
  const { theme, toggle } = useThemeContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      const role = localStorage.getItem('afrikarisque-role') as Role | null;
      navigate(role ? ROLE_PATHS[role] : '/login');
    } else {
      //setError(result.error || 'Erreur de connexion');
      setError(result.error || 'Erreur de connexion.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-cyan-900" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-red-400/5 rounded-full blur-3xl" />
        <div className="relative text-center px-12">
          <img src="/logo.jpeg" alt="Afrika Risque" className="h-24 w-24 rounded-2xl mx-auto mb-6 shadow-2xl" />
          <h2 className="text-3xl font-extrabold text-white mb-3">Afrika Risque</h2>
          <p className="text-gray-400 text-base leading-relaxed max-w-sm">
            La plateforme de confiance pour la gestion des créances et la vérification de solvabilité en Afrique.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[['42', 'Pays'], ['2K+', 'Dossiers'], ['99.8%', 'Uptime']].map(([v, l]) => (
              <div key={l} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xl font-bold text-cyan-400">{v}</p>
                <p className="text-xs text-gray-400 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2 lg:hidden">
              <img src="/logo.jpeg" alt="Afrika Risque" className="h-8 w-8 rounded-lg" />
              <span className="font-bold text-cyan-500">Afrika Risque</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={toggle}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-cyan-500 transition-colors">
                ← Retour
              </Link>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">Connexion</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Accédez à votre espace de travail</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Input
              label="Adresse email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@afrikarisque.com"
              leftIcon={<Mail size={16} />}
              required
              autoComplete="email"
            />
            <div>
              <div className="relative">
                <Input
                  label="Mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  leftIcon={<Lock size={16} />}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-cyan-500 hover:text-cyan-700 hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg px-4 py-2.5">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
              Se connecter
            </Button>
          </form>

        </div>
      </div>
    </div>
  );
}
