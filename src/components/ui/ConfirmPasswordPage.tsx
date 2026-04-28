import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, ShieldX, Loader2, ArrowRight } from 'lucide-react';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';

type Status = 'loading' | 'success' | 'error' | 'missing';

export default function ConfirmPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('loading');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('missing');
      return;
    }

    const confirm = async () => {
      try {
        await Axios({
          ...SummaryApi.confirm_password,
          params: { token },
        });
        setStatus('success');
      } catch {
        setStatus('error');
      }
    };

    confirm();
  }, []);

  // Countdown redirect on success
  useEffect(() => {
    if (status !== 'success') return;
    if (countdown === 0) {
      navigate('/login');
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [status, countdown, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">

      {/* Background subtle grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-sm">

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/60 dark:shadow-black/40 overflow-hidden">

          {/* Top accent bar */}
          <div className={`h-1 w-full ${status === 'success' ? 'bg-gradient-to-r from-emerald-400 to-cyan-500' : status === 'error' || status === 'missing' ? 'bg-gradient-to-r from-red-400 to-rose-500' : 'bg-gradient-to-r from-cyan-400 to-cyan-600 animate-pulse'}`} />

          <div className="px-8 py-10 flex flex-col items-center text-center gap-6">

            {/* Icon */}
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center
              ${status === 'loading' ? 'bg-cyan-50 dark:bg-cyan-900/20' : ''}
              ${status === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}
              ${status === 'error' || status === 'missing' ? 'bg-red-50 dark:bg-red-900/20' : ''}
            `}>
              {status === 'loading' && (
                <Loader2 size={36} className="text-cyan-500 animate-spin" />
              )}
              {status === 'success' && (
                <ShieldCheck size={36} className="text-emerald-500" />
              )}
              {(status === 'error' || status === 'missing') && (
                <ShieldX size={36} className="text-red-500" />
              )}
            </div>

            {/* Text */}
            {status === 'loading' && (
              <>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Vérification en cours</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Confirmation de votre nouveau mot de passe…
                  </p>
                </div>
              </>
            )}

            {status === 'success' && (
              <>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Mot de passe activé</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Votre nouveau mot de passe est désormais actif. Vous pouvez vous connecter dès maintenant.
                  </p>
                </div>

                {/* Countdown */}
                <div className="w-full">
                  {/* Progress bar */}
                  <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full transition-all duration-1000"
                      style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Redirection dans <span className="font-semibold text-gray-600 dark:text-gray-300">{countdown}s</span>
                  </p>
                </div>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-sm font-semibold transition-all shadow-md shadow-emerald-200 dark:shadow-emerald-900/30"
                >
                  Se connecter maintenant <ArrowRight size={15} />
                </button>
              </>
            )}

            {status === 'error' && (
              <>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Lien invalide ou expiré</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Ce lien de confirmation n'est plus valide. Faites une nouvelle demande de changement de mot de passe depuis votre profil.
                  </p>
                </div>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold transition-colors"
                >
                  Retour à la connexion <ArrowRight size={15} />
                </button>
              </>
            )}

            {status === 'missing' && (
              <>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Token manquant</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Aucun token trouvé dans l'URL. Utilisez le lien reçu par email pour confirmer votre mot de passe.
                  </p>
                </div>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold transition-colors"
                >
                  Retour à la connexion <ArrowRight size={15} />
                </button>
              </>
            )}

          </div>
        </div>

        {/* Brand */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-5">
          AfricaRisque · Sécurité du compte
        </p>
      </div>
    </div>
  );
}