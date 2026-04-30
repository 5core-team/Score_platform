import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';

type Status = 'loading' | 'success' | 'error' | 'invalid';

export default function ValidateDebt() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('invalid');
      return;
    }
    const run = async () => {
      try {
        await Axios({
          ...SummaryApi.validate_debt_by_unique_link,
          params: { token },
        });
        setStatus('success');
      } catch (err: unknown) {
        const axiosErr = err as { response?: { data?: { detail?: string; error?: string }; status?: number } };
        const msg =
          axiosErr?.response?.data?.detail ||
          axiosErr?.response?.data?.error ||
          'Le lien est invalide ou a expiré.';
        setErrorMessage(msg);
        setStatus('error');
      }
    };
    run();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Card */}
      <div className="w-full max-w-md">
        {/* Logo / brand strip */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 text-sm font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">
            <ShieldCheck size={16} />
            AfricaRisque
          </span>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-black/40 overflow-hidden">
          {/* Top accent bar */}
          <div className={`h-1.5 w-full ${status === 'success' ? 'bg-gradient-to-r from-emerald-400 to-teal-500' :
            status === 'loading' ? 'bg-gradient-to-r from-cyan-400 to-cyan-600 animate-pulse' :
              'bg-gradient-to-r from-red-400 to-rose-500'}`}
          />

          <div className="px-8 py-10 text-center">
            {/* Loading */}
            {status === 'loading' && (
              <>
                <div className="w-16 h-16 rounded-full bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center mx-auto mb-6">
                  <Loader2 size={28} className="animate-spin text-cyan-500" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Validation en cours…
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Nous traitons votre demande, veuillez patienter.
                </p>
              </>
            )}

            {/* Success */}
            {status === 'success' && (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-6 ring-4 ring-emerald-100 dark:ring-emerald-900/30">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Dette validée avec succès
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Vous avez confirmé cette dette. L'huissier en charge a été notifié automatiquement.
                </p>
                <div className="mt-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl px-4 py-3 text-left">
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                    ✓ &nbsp;Votre accord a été enregistré. Vous pouvez fermer cette page.
                  </p>
                </div>
              </>
            )}

            {/* Error */}
            {status === 'error' && (
              <>
                <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-6 ring-4 ring-red-100 dark:ring-red-900/30">
                  <XCircle size={32} className="text-red-500" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Lien invalide ou expiré
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {errorMessage}
                </p>
                <div className="mt-6 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-3 text-left">
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                    Si vous pensez qu'il s'agit d'une erreur, contactez l'huissier qui vous a envoyé ce lien.
                  </p>
                </div>
              </>
            )}

            {/* No token */}
            {status === 'invalid' && (
              <>
                <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mx-auto mb-6 ring-4 ring-amber-100 dark:ring-amber-900/30">
                  <AlertTriangle size={32} className="text-amber-500" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Lien incomplet
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Ce lien ne contient pas de jeton de validation. Vérifiez que vous avez copié l'intégralité du lien reçu par email.
                </p>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-xs text-gray-400">
              AfricaRisque · Plateforme de gestion du risque de crédit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
