import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import ScoreLogo from '../components/ScoreLogo';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth(); // Utilisation du contexte
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await login(email, password); // utilise le contexte

      // Redirection basée sur le rôle
      const storedUser = localStorage.getItem('scoreUser');
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (user?.must_change_password) {
        navigate('/change-password');
        return;
      }

      if (user?.role === 'admin') {
        navigate('/dashboard');
      } else if (user?.role === 'financial_advisor') {
        navigate('/advisor');
      } else if (user?.role === 'bailiff') {
        navigate('/bailiff');
      } else {
        navigate('/dashboard'); // par défaut
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
      console.log(err.message);
      // console.log(err.response)
      
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-home-start to-home-end">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full p-8"
      >
        <div className="flex justify-center mb-8">
          <ScoreLogo />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User size={18} className="text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input pl-10"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock size={18} className="text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input pl-10 pr-10"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
            </button>
          </div>

          {error && (
            <div className="text-danger text-sm p-2 bg-danger/10 rounded">
              {error}
            </div>
          )}

          <motion.button
            type="submit"
            className="btn btn-secondary w-full"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </motion.button>

          <div className="text-center text-sm mt-4">
            <span className="text-gray-500">Pas encore de compte ? </span>
            {/* <Link to="/register" className="text-danger hover:underline">
              Inscrivez-vous maintenant
            </Link> */}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
