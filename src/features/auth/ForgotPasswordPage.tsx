import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, KeyRound, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { useThemeContext } from '../../contexts/ThemeContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Sun, Moon } from 'lucide-react';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';

type Step = 'email' | 'code' | 'password' | 'success';

export default function ForgotPasswordPage() {
  const { theme, toggle } = useThemeContext();

  const [step, setStep]             = useState<Step>('email');
  const [email, setEmail]           = useState('');
  const [code, setCode]             = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [showPwd, setShowPwd]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [resendCooldown, setResendCooldown] = useState(false);

  // ── Étape 1 : envoi du code ──────────────────────────────────────
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError('');
    setLoading(true);
    try {
      await Axios({ ...SummaryApi.reset_code, data: { email } });
      setStep('code');
      startCooldown();
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 429) {
        setError('Trop de tentatives. Attendez 90 secondes avant de réessayer.');
      } else {
        setError(err.response?.data?.detail || 'Impossible d\'envoyer le code.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Étape 2 : vérification du code ──────────────────────────────
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    setError('');
    setLoading(true);
    try {
      const res = await Axios({ ...SummaryApi.verify_code, data: { email, code } });
      setResetToken(res.data.reset_token);
      setStep('password');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Code invalide ou expiré.');
    } finally {
      setLoading(false);
    }
  };

  // ── Étape 3 : nouveau mot de passe ──────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirm) return;
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
    if (password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return; }
    setError('');
    setLoading(true);
    try {
      await Axios({ ...SummaryApi.reset_password, data: { token: resetToken, password } });
      setStep('success');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Token invalide ou expiré.');
    } finally {
      setLoading(false);
    }
  };

  // ── Renvoi du code (cooldown 90s) ────────────────────────────────
  const startCooldown = () => {
    setResendCooldown(true);
    setTimeout(() => setResendCooldown(false), 90_000);
  };

  const handleResend = async () => {
    if (resendCooldown) return;
    setError('');
    setLoading(true);
    try {
      await Axios({ ...SummaryApi.reset_code, data: { email } });
      startCooldown();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Impossible de renvoyer le code.');
    } finally {
      setLoading(false);
    }
  };

  // ── Indicateur d'étapes ──────────────────────────────────────────
  const steps = [
    { key: 'email',    label: 'Email' },
    { key: 'code',     label: 'Code' },
    { key: 'password', label: 'Nouveau mot de passe' },
  ];
  const stepIndex = { email: 0, code: 1, password: 2, success: 3 }[step];

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
            Récupérez l'accès à votre espace de travail en quelques étapes simples.
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
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={toggle}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <Link to="/login" className="text-sm text-gray-500 dark:text-gray-400 hover:text-cyan-500 transition-colors flex items-center gap-1">
                <ArrowLeft size={14} /> Connexion
              </Link>
            </div>
          </div>

          {/* Stepper — masqué sur success */}
          {step !== 'success' && (
            <div className="flex items-center gap-2 mb-8">
              {steps.map((s, i) => (
                <div key={s.key} className="flex items-center gap-2 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors shrink-0 ${
                    i < stepIndex
                      ? 'bg-cyan-500 text-white'
                      : i === stepIndex
                        ? 'bg-cyan-500 text-white ring-4 ring-cyan-500/20'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}>
                    {i < stepIndex ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs hidden sm:block ${i === stepIndex ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-px ${i < stepIndex ? 'bg-cyan-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Étape 1 : Email ── */}
          {step === 'email' && (
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">Mot de passe oublié</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                Entrez votre adresse email pour recevoir un code de réinitialisation.
              </p>
              <form onSubmit={handleSendCode} className="space-y-4">
                <Input
                  label="Adresse email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@afrikarisque.com"
                  leftIcon={<Mail size={16} />}
                  required
                  autoFocus
                />
                {error && <ErrorBox message={error} />}
                <Button type="submit" fullWidth size="lg" loading={loading}>
                  Envoyer le code
                </Button>
              </form>
            </div>
          )}

          {/* ── Étape 2 : Code OTP ── */}
          {step === 'code' && (
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">Vérification</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                Un code à 6 chiffres a été envoyé à <span className="font-medium text-gray-700 dark:text-gray-300">{email}</span>.
              </p>
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <Input
                  label="Code OTP"
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  leftIcon={<KeyRound size={16} />}
                  required
                  autoFocus
                />
                {error && <ErrorBox message={error} />}
                <Button type="submit" fullWidth size="lg" loading={loading} disabled={code.length !== 6}>
                  Vérifier le code
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown || loading}
                    className={`text-sm transition-colors ${
                      resendCooldown
                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        : 'text-cyan-500 hover:text-cyan-700 hover:underline'
                    }`}
                  >
                    {resendCooldown ? 'Renvoyer le code (90s)' : 'Renvoyer le code'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── Étape 3 : Nouveau mot de passe ── */}
          {step === 'password' && (
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">Nouveau mot de passe</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                Choisissez un mot de passe sécurisé d'au moins 8 caractères.
              </p>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="relative">
                  <Input
                    label="Nouveau mot de passe"
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    leftIcon={<Lock size={16} />}
                    required
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
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    leftIcon={<Lock size={16} />}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(s => !s)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Indicateur de force */}
                {password && (
                  <PasswordStrength password={password} />
                )}

                {error && <ErrorBox message={error} />}
                <Button type="submit" fullWidth size="lg" loading={loading}>
                  Réinitialiser le mot de passe
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
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Mot de passe réinitialisé</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter.
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

// ── Sous-composants ──────────────────────────────────────────────────
function ErrorBox({ message }: { message: string }) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg px-4 py-2.5">
      {message}
    </div>
  );
}

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
          <div key={i} className={`flex-1 h-1.5 rounded-full transition-colors ${i < score ? colors[score - 1] : 'bg-gray-200 dark:bg-gray-700'}`} />
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
