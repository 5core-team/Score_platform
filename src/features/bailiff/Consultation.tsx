import { useState } from 'react';
import {
  Search, Mail, ShieldCheck, UserCog, ReceiptText,
  Landmark, ArrowDownUp, ChevronRight, X, Loader2,
  BadgeCheck, AlertCircle, Clock, MapPin, Phone, CreditCard
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';

// ── Types ──────────────────────────────────────────────────────────

interface SearchResult {
  uuid: string;
  full_name: string;
  npi: string;
  email: string;
  phone_number: string;
}

interface CustomerDetail {
  uuid: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  npi: string;
  phone_number: string;
  credit_score: number;
  zone_name: string;
  subzone_name: string;
  country_name: string;
  created_at: string;
  updated_at: string;
}

type Step = 'search' | 'otp' | 'actions' | 'edit';

// ── Step indicator ─────────────────────────────────────────────────

const steps = [
  { id: 'search', label: 'Recherche' },
  { id: 'otp',    label: 'Vérification' },
  { id: 'actions', label: 'Actions' },
];

function StepBar({ current }: { current: Step }) {
  const idx = steps.findIndex(s => s.id === current);
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={s.id} className="flex items-center">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
              ${active  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' :
                done    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                          'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold
                ${active ? 'bg-white/30' : done ? 'bg-emerald-500 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>
                {done ? '✓' : i + 1}
              </span>
              {s.label}
            </div>
            {i < steps.length - 1 && (
              <ChevronRight size={14} className={`mx-1 ${i < idx ? 'text-emerald-400' : 'text-gray-300 dark:text-gray-600'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Score badge ────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 700 ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' :
                score >= 500 ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' :
                               'text-red-500 bg-red-50 dark:bg-red-900/20';
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>
      <CreditCard size={11} /> {score}
    </span>
  );
}

// ── Main component ─────────────────────────────────────────────────

export default function Consultation() {
  const [step, setStep]                   = useState<Step>('search');
  const [npiInput, setNpiInput]           = useState('');
  const [searchResult, setSearchResult]   = useState<SearchResult | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError]     = useState('');

  const [otpLoading, setOtpLoading]   = useState(false);
  const [otpSent, setOtpSent]         = useState(false);
  const [otpSendError, setOtpSendError] = useState('');
  const [otpCode, setOtpCode]         = useState('');
  const [otpVerifyLoading, setOtpVerifyLoading] = useState(false);
  const [otpError, setOtpError]       = useState('');

  const [customer, setCustomer]         = useState<CustomerDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [editModal, setEditModal]       = useState(false);

  // ── Search ──────────────────────────────────────────────────────
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!npiInput.trim()) return;
    setSearchLoading(true);
    setSearchError('');
    setSearchResult(null);
    try {
      const res = await Axios({
        ...SummaryApi.search_customers,
        params: { npi: npiInput.trim() },
      });
      const results: SearchResult[] = res.data;
      if (!results.length) {
        setSearchError('Aucun client trouvé avec ce NPI.');
      } else {
        setSearchResult(results[0]);
        setOtpSent(false);
        setOtpSendError('');
        setOtpCode('');
        setOtpError('');
        setStep('otp');
      }
    } catch {
      setSearchError('Erreur lors de la recherche. Veuillez réessayer.');
    } finally {
      setSearchLoading(false);
    }
  };

  // ── Send OTP ────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!searchResult) return;
    setOtpLoading(true);
    setOtpSendError('');
    try {
      await Axios({
        ...SummaryApi.request_consultation_otp_to_customer_by_uuid,
        data: { customer_uuid: searchResult.uuid },
      });
      setOtpSent(true);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string }; status?: number } };
      if (axiosErr?.response?.status === 400) {
        setOtpSendError(axiosErr.response?.data?.detail || 'Impossible d\'envoyer le code. Délai non respecté.');
      } else {
        setOtpSendError('Erreur lors de l\'envoi du code.');
      }
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Verify OTP ──────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (!searchResult || !otpCode.trim()) return;
    setOtpVerifyLoading(true);
    setOtpError('');
    try {
      await Axios({
        ...SummaryApi.verify_otp_consultation_to_customer_by_uuid,
        data: { customer_uuid: searchResult.uuid, code: otpCode.trim() },
      });
      // Fetch full customer detail
      setDetailLoading(true);
      const res = await Axios({
        ...SummaryApi.get_customer,
        url: `/api/customers/customers/${searchResult.uuid}/`,
      });
      setCustomer(res.data);
      setStep('actions');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number } };
      if (axiosErr?.response?.status === 400) {
        setOtpError('Code invalide ou expiré. Veuillez réessayer.');
      } else {
        setOtpError('Erreur de vérification. Veuillez réessayer.');
      }
    } finally {
      setOtpVerifyLoading(false);
      setDetailLoading(false);
    }
  };

  // ── Reset ───────────────────────────────────────────────────────
  const handleReset = () => {
    setStep('search');
    setNpiInput('');
    setSearchResult(null);
    setSearchError('');
    setOtpSent(false);
    setOtpCode('');
    setOtpError('');
    setOtpSendError('');
    setCustomer(null);
    setEditModal(false);
  };

  // ── Action buttons config ───────────────────────────────────────
  const actions = [
    {
      icon: <ReceiptText size={20} />,
      label: 'Lister les dettes',
      description: 'Consulter l\'historique des dettes',
      color: 'from-violet-500 to-violet-600',
      shadow: 'shadow-violet-500/20',
      onClick: () => {},
      active: false,
      soon: true,
    },
    {
      icon: <Landmark size={20} />,
      label: 'Enregistrer une dette',
      description: 'Créer une nouvelle dette client',
      color: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-500/20',
      onClick: () => {},
      active: false,
      soon: true,
    },
    {
      icon: <ArrowDownUp size={20} />,
      label: 'Remboursement',
      description: 'Enregistrer un remboursement',
      color: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/20',
      onClick: () => {},
      active: false,
      soon: true,
    },
  ];

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Consultation Client</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Recherchez un client par NPI puis authentifiez-le pour accéder aux actions.
        </p>
      </div>

      <StepBar current={step} />

      {/* ── STEP 1 : Search ── */}
      {step === 'search' && (
        <Card className="max-w-lg">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100 dark:border-gray-700">
            <Search size={17} className="text-cyan-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Rechercher un client</span>
          </div>
          <form onSubmit={handleSearch} className="flex gap-3">
            <Input
              value={npiInput}
              onChange={e => { setNpiInput(e.target.value); setSearchError(''); }}
              placeholder="Numéro Personnel d'Identification (NPI)"
              className="flex-1"
            />
            <Button type="submit" loading={searchLoading} size="md">
              {!searchLoading && <Search size={15} />} Rechercher
            </Button>
          </form>
          {searchError && (
            <p className="mt-3 text-sm text-red-500 flex items-center gap-1.5">
              <AlertCircle size={14} /> {searchError}
            </p>
          )}
        </Card>
      )}

      {/* ── STEP 2 : OTP ── */}
      {step === 'otp' && searchResult && (
        <div className="space-y-4 max-w-lg">
          {/* Client preview */}
          <Card>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Client trouvé</p>
              <button onClick={handleReset} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={15} />
              </button>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {searchResult.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white">{searchResult.full_name}</p>
                <p className="text-xs text-gray-400 truncate">{searchResult.email}</p>
              </div>
              <span className="ml-auto text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-500">
                {searchResult.npi}
              </span>
            </div>
          </Card>

          {/* OTP send */}
          <Card>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100 dark:border-gray-700">
              <ShieldCheck size={17} className="text-cyan-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Authentification OTP</span>
            </div>

            {!otpSent ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Un code de vérification sera envoyé par mail à{' '}
                  <span className="font-medium text-gray-700 dark:text-gray-300">{searchResult.email}</span>.
                </p>
                {otpSendError && (
                  <p className="text-sm text-red-500 flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                    <AlertCircle size={13} /> {otpSendError}
                  </p>
                )}
                <Button onClick={handleSendOtp} loading={otpLoading} fullWidth>
                  {!otpLoading && <Mail size={15} />} Envoyer le code OTP
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg">
                  <BadgeCheck size={15} /> Code envoyé à <span className="font-medium">{searchResult.email}</span>
                </div>
                <Input
                  label="Code OTP"
                  value={otpCode}
                  onChange={e => { setOtpCode(e.target.value); setOtpError(''); }}
                  placeholder="• • • • • •"
                  maxLength={6}
                  error={otpError}
                  autoFocus
                />
                {detailLoading && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Loader2 size={14} className="animate-spin" /> Chargement du profil…
                  </div>
                )}
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setOtpSent(false)} fullWidth>
                    Renvoyer
                  </Button>
                  <Button onClick={handleVerifyOtp} loading={otpVerifyLoading} fullWidth>
                    Valider
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ── STEP 3 : Actions ── */}
      {step === 'actions' && customer && (
        <div className="space-y-5">
          {/* Customer profile card */}
          <Card>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/30">
                  {customer.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{customer.full_name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{customer.email}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <ScoreBadge score={customer.credit_score} />
                    <span className="text-xs text-gray-400 font-mono">{customer.npi}</span>
                  </div>
                </div>
              </div>
              <button onClick={handleReset} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                <X size={16} />
              </button>
            </div>

            {/* Details row */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-3">
              {[
                { icon: <Phone size={12} />, val: customer.phone_number || '—' },
                { icon: <MapPin size={12} />, val: [customer.zone_name, customer.subzone_name].filter(Boolean).join(' · ') || '—' },
                { icon: <Clock size={12} />, val: new Date(customer.created_at).toLocaleDateString('fr-FR') },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 min-w-0">
                  <span className="text-gray-400 shrink-0">{item.icon}</span>
                  <span className="truncate">{item.val}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions grid */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Actions disponibles</p>
            <div className="grid grid-cols-2 gap-3">
              {actions.map((action) => (
                <button
                  key={action.label}
                  onClick={action.active ? action.onClick : undefined}
                  disabled={!action.active}
                  className={`relative text-left p-4 rounded-xl border transition-all group
                    ${action.active
                      ? 'border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-700 hover:shadow-md cursor-pointer bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750'
                      : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 cursor-default opacity-70'
                    }`}
                >
                  {action.soon && (
                    <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider bg-gray-200 dark:bg-gray-700 text-gray-500 px-1.5 py-0.5 rounded-full">
                      Bientôt
                    </span>
                  )}
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${action.color} ${action.shadow} shadow-lg flex items-center justify-center text-white mb-3 transition-transform ${action.active ? 'group-hover:scale-110' : ''}`}>
                    {action.icon}
                  </div>
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 leading-tight">{action.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">{action.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}