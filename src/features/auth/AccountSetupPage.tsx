import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, Sun, Moon, CheckCircle, XCircle, Loader } from 'lucide-react';
import { useThemeContext } from '../../contexts/ThemeContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import Axios from '../../utils/Axios';
import SummaryApi, { baseURL } from '../../common/SummaryApi';
import axios from 'axios';
type Step = 'verifying' | 'ready' | 'invalid' | 'success';

export default function AccountSetupPage() {
  const { theme, toggle } = useThemeContext();
  const [searchParams] = useSearchParams();

  const uid   = searchParams.get('uid')   ?? '';
  const token = searchParams.get('token') ?? '';

  const [step, setStep]           = useState<Step>('verifying');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [showPwd, setShowPwd]     = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  // ── Vérification au montage ──────────────────────────────────────
    useEffect(() => {
      if (!uid || !token) { setStep('invalid'); return; }

      const verify = async () => {
        try {
          // axios brut — pas d'intercepteur, pas de Bearer token
          await axios.get(`${baseURL}${SummaryApi.verify_credentials.url}`, {
            params: { uid, token },
          });
          setStep('ready');
        } catch (err: any) {
          console.error('verify-credentials error:', err.response?.status, err.response?.data);
          setStep('invalid');
        }
      };

      verify();
    }, [uid, token]);
    
  // ── Soumission du mot de passe ───────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
    if (password.length < 8)  { setError('Le mot de passe doit contenir au moins 8 caractères.'); return; }
    setError('');
    setLoading(true);
    try {
      await Axios({
        ...SummaryApi.password_setup,
        data: { uid, token, password },
      });
      setStep('success');
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.detail || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">

      {/* Panneau gauche */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-cyan-900" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-red-400/5 rounded-full blur-3xl" />
        <div className="relative text-center px-12">
          <img src="/logo.jpeg" alt="Afrika Risque" className="h-24 w-24 rounded-2xl mx-auto mb-6 shadow-2xl" />
          <h2 className="text-3xl font-extrabold text-white mb-3">Afrika Risque</h2>
          <p className="text-gray-400 text-base leading-relaxed max-w-sm">
            Bienvenue. Définissez votre mot de passe pour accéder à votre espace de travail.
          </p>
        </div>
      </div>

      {/* Panneau droit */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
        <div className="w-full max-w-md mx-auto">

          {/* Top bar */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2 lg:hidden">
              <img src="/logo.jpeg" alt="Afrika Risque" className="h-8 w-8 rounded-lg" />
              <span className="font-bold text-cyan-500">Afrika Risque</span>
            </div>
            <div className="ml-auto">
              <button
                onClick={toggle}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>

          {/* ── Vérification en cours ── */}
          {step === 'verifying' && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mx-auto">
                <Loader size={26} className="text-cyan-500 animate-spin" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Vérification en cours…</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Validation de votre lien d'activation.</p>
            </div>
          )}

          {/* ── Lien invalide ── */}
          {step === 'invalid' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
                <XCircle size={32} className="text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Lien invalide</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Ce lien d'activation est invalide ou a expiré (valable 24h).
                  Contactez votre administrateur pour obtenir un nouveau lien.
                </p>
              </div>
              <Link to="/login">
                <Button variant="secondary" fullWidth>Retour à la connexion</Button>
              </Link>
            </div>
          )}

          {/* ── Formulaire ── */}
          {step === 'ready' && (
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
                Définir votre mot de passe
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                Choisissez un mot de passe sécurisé pour activer votre compte.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    label="Nouveau mot de passe"
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    leftIcon={<Lock size={16} />}
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(s => !s)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirmer le mot de passe"
                    type={showConf ? 'text' : 'password'}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    leftIcon={<Lock size={16} />}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConf(s => !s)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showConf ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Indicateur de force */}
                {password && <PasswordStrength password={password} />}

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg px-4 py-2.5">
                    {error}
                  </div>
                )}

                <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
                  Activer mon compte
                </Button>
              </form>
            </div>
          )}

          {/* ── Succès ── */}
          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
                <CheckCircle size={32} className="text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
                  Compte activé !
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Votre mot de passe a été défini avec succès. Vous pouvez maintenant vous connecter.
                </p>
              </div>
              <Link to="/login">
                <Button fullWidth size="lg">Se connecter</Button>
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ── Indicateur de force ──────────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8 caractères minimum', ok: password.length >= 8 },
    { label: 'Une majuscule',         ok: /[A-Z]/.test(password) },
    { label: 'Un chiffre',            ok: /\d/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ['bg-red-400', 'bg-amber-400', 'bg-emerald-400'];
  const labels = ['Faible', 'Moyen', 'Fort'];

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full transition-colors ${i < score ? colors[score - 1] : 'bg-gray-200 dark:bg-gray-700'}`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${score === 3 ? 'text-emerald-500' : score === 2 ? 'text-amber-500' : 'text-red-400'}`}>
        {labels[score - 1] ?? 'Trop faible'}
      </p>
      <div className="space-y-1">
        {checks.map(c => (
          <p key={c.label} className={`text-xs flex items-center gap-1.5 ${c.ok ? 'text-emerald-500' : 'text-gray-400'}`}>
            <span>{c.ok ? '✓' : '○'}</span> {c.label}
          </p>
        ))}
      </div>
    </div>
  );
}
