import { useState } from 'react';
import {
  Search, Mail, ShieldCheck, UserCog, ReceiptText,
  Landmark, ArrowDownUp, ChevronRight, X, Loader2,
  BadgeCheck, AlertCircle, Clock, MapPin, Phone, CreditCard,
  RefreshCw, Eye, EyeOff, Send, Plus, ArrowLeft, CheckCircle2,
  XCircle, HelpCircle, ToggleLeft, ToggleRight, Edit3, Calendar,
  DollarSign, Repeat2, Building2
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';
import { useAuth } from '../../contexts/AuthContext';

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

interface Repayment {
  uuid: string;
  amount: string;
  date: string;
  debt: number;
  validation_status: 'pending' | 'validated' | 'rejected';
}

interface Debt {
  uuid: string;
  id: number;
  amount: string;
  deadline_amount: string;
  periodicity: string;
  deadline: string;
  status: string;
  customer: number;
  customer_uuid: string;
  customer_name: string;
  creditor_uuid: string | null;
  creditor_name: string | null;
  verified: boolean;
  validation_status: 'pending' | 'validated' | 'rejected';
  is_monitored: boolean;
  created_at: string;
  updated_at: string;
  repayments: Repayment[];
}

type Step = 'search' | 'otp' | 'actions';
type ActionView = 'menu' | 'debts' | 'repayments' | 'create-debt' | 'create-repayment';
type Periodicity = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'biannual' | 'annual';

// ── Step indicator ─────────────────────────────────────────────────

const steps = [
  { id: 'search', label: 'Recherche' },
  { id: 'otp', label: 'Vérification' },
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
              ${active ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' :
                done ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
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

// ── Validation status badge ────────────────────────────────────────

function ValidationBadge({ status }: { status: string }) {
  if (status === 'validated') return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
      <CheckCircle2 size={10} /> Validé
    </span>
  );
  if (status === 'rejected') return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500">
      <XCircle size={10} /> Rejeté
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-500">
      <HelpCircle size={10} /> En attente
    </span>
  );
}

// ── Periodicity label ──────────────────────────────────────────────

const periodicityLabels: Record<string, string> = {
  daily: 'Quotidien', weekly: 'Hebdomadaire', monthly: 'Mensuel',
  quarterly: 'Trimestriel', biannual: 'Semestriel', annual: 'Annuel',
};

// ── Format currency ────────────────────────────────────────────────

function formatAmount(val: string) {
  const n = parseFloat(val);
  if (isNaN(n)) return val;
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(n);
}

// ── Edit Debt Modal ────────────────────────────────────────────────

interface EditDebtModalProps {
  debt: Debt;
  sessionToken: string;
  onClose: () => void;
  onSuccess: () => void;
}

function EditDebtModal({ debt, sessionToken, onClose, onSuccess }: EditDebtModalProps) {
  const [amount, setAmount] = useState(debt.amount);
  const [deadlineAmount, setDeadlineAmount] = useState(debt.deadline_amount);
  const [periodicity, setPeriodicity] = useState<Periodicity>(debt.periodicity as Periodicity);
  const [deadline, setDeadline] = useState(debt.deadline);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await Axios({
        // Correction ici : utiliser debt.uuid au lieu de debt.id
        url: `/api/customers/debts/${debt.uuid}/`, 
        method: 'patch',
        data: { 
          session_token: sessionToken, 
          amount, 
          deadline_amount: deadlineAmount, 
          periodicity, 
          deadline 
        },
      });
      onSuccess();
      onClose();
    } catch (err: any) {
       // Extraction du message d'erreur spécifique du backend
      const backendError = 
        err.response?.data?.detail || 
        err.response?.data?.error || 
        (typeof err.response?.data === 'string' ? err.response.data : null);

      if (typeof err.response?.data === 'object' && !backendError) {
        // Cas des erreurs de validation par champ (ex: { amount: ["Ce champ est obligatoire"] })
        const firstKey = Object.keys(err.response.data)[0];
        const firstError = err.response.data[firstKey];
        setError(`${firstKey}: ${Array.isArray(firstError) ? firstError[0] : firstError}`);
      } else {
        setError(backendError || 'Erreur lors de la mise à jour.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Modifier la dette">
      <div className="space-y-4 p-1">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Montant total" value={amount} onChange={e => setAmount(e.target.value)} type="number" />
          <Input label="Montant/échéance" value={deadlineAmount} onChange={e => setDeadlineAmount(e.target.value)} type="number" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Périodicité</label>
          <select
            value={periodicity}
            onChange={e => setPeriodicity(e.target.value as Periodicity)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm px-3 py-2 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {Object.entries(periodicityLabels).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <Input label="Date limite" value={deadline} onChange={e => setDeadline(e.target.value)} type="date" />
        {error && <p className="text-sm text-red-500 flex items-center gap-1.5"><AlertCircle size={13} /> {error}</p>}
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} fullWidth>Annuler</Button>
          <Button onClick={handleSubmit} loading={loading} fullWidth>Enregistrer</Button>
        </div>
      </div>
    </Modal>
  );
}

// ── Edit Repayment Modal ───────────────────────────────────────────

interface EditRepaymentModalProps {
  repayment: Repayment;
  sessionToken: string;
  onClose: () => void;
  onSuccess: () => void;
}

function EditRepaymentModal({ repayment, sessionToken, onClose, onSuccess }: EditRepaymentModalProps) {
  const [amount, setAmount] = useState(repayment.amount);
  const [date, setDate] = useState(repayment.date);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await Axios({
        url: `/api/customers/repayments/${repayment.uuid}/`,
        method: 'patch',
        data: { session_token: sessionToken, amount, date },
      });
      onSuccess();
      onClose();
    } catch {
      setError('Erreur lors de la mise à jour.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Modifier le remboursement">
      <div className="space-y-4 p-1">
        <Input label="Montant" value={amount} onChange={e => setAmount(e.target.value)} type="number" />
        <Input label="Date" value={date} onChange={e => setDate(e.target.value)} type="date" />
        {error && <p className="text-sm text-red-500 flex items-center gap-1.5"><AlertCircle size={13} /> {error}</p>}
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} fullWidth>Annuler</Button>
          <Button onClick={handleSubmit} loading={loading} fullWidth>Enregistrer</Button>
        </div>
      </div>
    </Modal>
  );
}

// ── Debts List View ────────────────────────────────────────────────

interface DebtsViewProps {
  customerUuid: string;
  sessionToken: string;
  isBailiff: boolean;
  onBack: () => void;
  onCreateRepayment: (debt: Debt) => void;
}

function DebtsView({ customerUuid, sessionToken, isBailiff, onBack, onCreateRepayment }: DebtsViewProps) {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDebt, setEditDebt] = useState<Debt | null>(null);
  const [actionLoading, setActionLoading] = useState<string>('');
  const [actionMsg, setActionMsg] = useState<{ id: string; msg: string; ok: boolean } | null>(null);

  const fetchDebts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await Axios({
        ...SummaryApi.get_customer_debts,
        params: { customer_uuid: customerUuid },
      });
      setDebts(res.data);
    } catch {
      setError('Erreur lors du chargement des dettes.');
    } finally {
      setLoading(false);
    }
  };

  useState(() => { fetchDebts(); });

  const handleToggleMonitoring = async (debt: Debt) => {
    setActionLoading(`toggle-${debt.uuid}`);
    setActionMsg(null);
    try {
      await Axios({
        url: `/api/customers/debts/${debt.id}/toggle-monitoring/`,
        method: 'post',
        data: { session_token: sessionToken },
      });
      setActionMsg({ id: debt.uuid, msg: debt.is_monitored ? 'Suivi désactivé' : 'Suivi activé', ok: true });
      fetchDebts();
    } catch {
      setActionMsg({ id: debt.uuid, msg: 'Erreur lors du changement de suivi', ok: false });
    } finally {
      setActionLoading('');
    }
  };

  // Change "r: Repayment" par "entity: Debt | Repayment"
  const handleSendValidation = async (entity: Debt | Repayment) => {
      setActionLoading(`send-${entity.uuid}`);
      setActionMsg(null);
      try {
        // On détermine l'endpoint dynamiquement selon si c'est une dette ou un remboursement
        // Une Debt a généralement un champ 'amount' (string) et 'periodicity'
        // Un Repayment a un champ 'date'
        const isRepayment = 'date' in entity;
        const endpoint = isRepayment ? 'repayments' : 'debts';

        await Axios({
          url: `/api/customers/${endpoint}/${entity.uuid}/send-validation/`,
          method: 'post',
          data: { session_token: sessionToken }, 
        });

        setActionMsg({ id: entity.uuid, msg: 'Lien de validation renvoyé', ok: true });
      } catch (error: any) {
        const errorMessage = error.response?.data?.detail || "Erreur lors de l'envoi";
        setActionMsg({ 
          id: entity.uuid, 
          msg: errorMessage, 
          ok: false 
        });
      } finally {
        setActionLoading('');
      }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Dettes du client</h3>
            <p className="text-xs text-gray-400">{debts.length} dette{debts.length !== 1 ? 's' : ''} trouvée{debts.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button onClick={fetchDebts} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors" title="Actualiser">
          <RefreshCw size={14} />
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={20} className="animate-spin text-cyan-500" />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
          <AlertCircle size={13} /> {error}
        </p>
      )}

      {!loading && !error && debts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
            <Landmark size={20} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Aucune dette enregistrée</p>
        </div>
      )}

      <div className="space-y-3">
        {debts.map(debt => (
          <Card key={debt.uuid} className="space-y-3">
            {/* Header row */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-900 dark:text-white">{formatAmount(debt.amount)}</span>
                  <ValidationBadge status={debt.validation_status} />
                  {debt.is_monitored && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600">
                      <Eye size={9} /> Suivi
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatAmount(debt.deadline_amount)} / {periodicityLabels[debt.periodicity] || debt.periodicity}
                  {' · '}Échéance : {new Date(debt.deadline).toLocaleDateString('fr-FR')}
                </p>
                {debt.creditor_name && (
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Building2 size={10} /> Créditeur : {debt.creditor_name}
                  </p>
                )}
              </div>
              <span className="text-[10px] font-mono bg-gray-100 dark:bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded shrink-0">
                #{debt.id}
              </span>
            </div>

            {/* Repayments summary */}
            {debt.repayments.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg px-3 py-2">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  {debt.repayments.length} remboursement{debt.repayments.length > 1 ? 's' : ''}
                </p>
                <div className="space-y-1">
                  {debt.repayments.slice(0, 3).map(r => (
                    <div key={r.uuid} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-300">{formatAmount(r.amount)}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">{new Date(r.date).toLocaleDateString('fr-FR')}</span>
                        <ValidationBadge status={r.validation_status} />
                      </div>
                    </div>
                  ))}
                  {debt.repayments.length > 3 && (
                    <p className="text-[10px] text-gray-400">+{debt.repayments.length - 3} autres…</p>
                  )}
                </div>
              </div>
            )}

            {/* Action feedback */}
            {actionMsg?.id === debt.uuid && (
              <p className={`text-xs flex items-center gap-1.5 px-2 py-1.5 rounded-lg ${actionMsg.ok
                ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                : 'text-red-500 bg-red-50 dark:bg-red-900/20'}`}>
                {actionMsg.ok ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
                {actionMsg.msg}
              </p>
            )}

            {/* Action buttons */}
            {isBailiff && (
              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setEditDebt(debt)}
                  className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:text-cyan-600 transition-colors"
                >
                  <Edit3 size={11} /> Modifier
                </button>
                <button
                  onClick={() => handleSendValidation(debt)}
                  disabled={actionLoading === `send-${debt.uuid}`}
                  className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 transition-colors disabled:opacity-50"
                >
                  {actionLoading === `send-${debt.uuid}`
                    ? <Loader2 size={11} className="animate-spin" />
                    : <Send size={11} />}
                  Renvoyer lien
                </button>
                {debt.validation_status === 'validated' && (
                  <button
                    onClick={() => handleToggleMonitoring(debt)}
                    disabled={actionLoading === `toggle-${debt.uuid}`}
                    className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50
                      ${debt.is_monitored
                        ? 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:text-cyan-600'}`}
                  >
                    {actionLoading === `toggle-${debt.uuid}`
                      ? <Loader2 size={11} className="animate-spin" />
                      : debt.is_monitored ? <ToggleRight size={11} /> : <ToggleLeft size={11} />}
                    {debt.is_monitored ? 'Désactiver suivi' : 'Activer suivi'}
                  </button>
                )}
                <button
                  onClick={() => onCreateRepayment(debt)}
                  className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors ml-auto"
                >
                  <Plus size={11} /> Remboursement
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {editDebt && (
        <EditDebtModal
          debt={editDebt}
          sessionToken={sessionToken}
          onClose={() => setEditDebt(null)}
          onSuccess={fetchDebts}
        />
      )}
    </div>
  );
}

// ── Repayments List View ───────────────────────────────────────────

interface RepaymentsViewProps {
  customerUuid: string;
  sessionToken: string;
  isBailiff: boolean;
  onBack: () => void;
}

function RepaymentsView({ customerUuid, sessionToken, isBailiff, onBack }: RepaymentsViewProps) {
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editRepayment, setEditRepayment] = useState<Repayment | null>(null);
  const [actionLoading, setActionLoading] = useState<string>('');
  const [actionMsg, setActionMsg] = useState<{ id: string; msg: string; ok: boolean } | null>(null);

  const fetchRepayments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await Axios({
        ...SummaryApi.get_customer_reimbursements,
        params: { customer_uuid: customerUuid },
      });
      setRepayments(res.data);
    } catch {
      setError('Erreur lors du chargement des remboursements.');
    } finally {
      setLoading(false);
    }
  };

  useState(() => { fetchRepayments(); });

  const handleSendValidation = async (r: Repayment) => {
    setActionLoading(`send-${r.uuid}`);
    setActionMsg(null);
    try {
      await Axios({
        url: `/api/customers/repayments/${r.uuid}/send-validation/`,
        method: 'post',
        data: { session_token: sessionToken },
      });
      setActionMsg({ id: r.uuid, msg: 'Lien de validation renvoyé', ok: true });
    } catch {
      setActionMsg({ id: r.uuid, msg: 'Erreur lors de l\'envoi', ok: false });
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Remboursements</h3>
            <p className="text-xs text-gray-400">{repayments.length} remboursement{repayments.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button onClick={fetchRepayments} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">
          <RefreshCw size={14} />
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={20} className="animate-spin text-cyan-500" />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
          <AlertCircle size={13} /> {error}
        </p>
      )}

      {!loading && !error && repayments.length === 0 && (
        <div className="text-center py-12">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
            <ArrowDownUp size={20} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Aucun remboursement enregistré</p>
        </div>
      )}

      <div className="space-y-3">
        {repayments.map(r => (
          <Card key={r.uuid}>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 dark:text-white">{formatAmount(r.amount)}</span>
                  <ValidationBadge status={r.validation_status} />
                </div>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <Calendar size={10} />
                  {new Date(r.date).toLocaleDateString('fr-FR')}
                  <span className="text-gray-300 dark:text-gray-600">·</span>
                  Dette #{r.debt}
                </p>
              </div>

              {isBailiff && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setEditRepayment(r)}
                    className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:text-cyan-600 transition-colors"
                    title="Modifier"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => handleSendValidation(r)}
                    disabled={actionLoading === `send-${r.uuid}`}
                    className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 transition-colors disabled:opacity-50"
                    title="Renvoyer lien de validation"
                  >
                    {actionLoading === `send-${r.uuid}`
                      ? <Loader2 size={13} className="animate-spin" />
                      : <Send size={13} />}
                  </button>
                </div>
              )}
            </div>

            {actionMsg?.id === r.uuid && (
              <p className={`mt-2 text-xs flex items-center gap-1.5 px-2 py-1.5 rounded-lg ${actionMsg.ok
                ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                : 'text-red-500 bg-red-50 dark:bg-red-900/20'}`}>
                {actionMsg.ok ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
                {actionMsg.msg}
              </p>
            )}
          </Card>
        ))}
      </div>

      {editRepayment && (
        <EditRepaymentModal
          repayment={editRepayment}
          sessionToken={sessionToken}
          onClose={() => setEditRepayment(null)}
          onSuccess={fetchRepayments}
        />
      )}
    </div>
  );
}

// ── Create Debt View ───────────────────────────────────────────────

interface CreateDebtViewProps {
  customerUuid: string;
  sessionToken: string;
  onBack: () => void;
  onSuccess: () => void;
}

function CreateDebtView({ customerUuid, sessionToken, onBack, onSuccess }: CreateDebtViewProps) {
  const [amount, setAmount] = useState('');
  const [deadlineAmount, setDeadlineAmount] = useState('');
  const [periodicity, setPeriodicity] = useState<Periodicity>('monthly');
  const [deadline, setDeadline] = useState('');
  const [creditorNpi, setCreditorNpi] = useState('');
  const [creditorResult, setCreditorResult] = useState<SearchResult | null>(null);
  const [creditorSearchLoading, setCreditorSearchLoading] = useState(false);
  const [creditorSearchError, setCreditorSearchError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCreditorSearch = async () => {
    if (!creditorNpi.trim()) return;
    setCreditorSearchLoading(true);
    setCreditorSearchError('');
    setCreditorResult(null);
    try {
      const res = await Axios({
        ...SummaryApi.search_customers,
        params: { npi: creditorNpi.trim() },
      });
      const results: SearchResult[] = res.data;
      if (!results.length) {
        setCreditorSearchError('Aucun créditeur trouvé.');
      } else {
        setCreditorResult(results[0]);
      }
    } catch {
      setCreditorSearchError('Erreur lors de la recherche.');
    } finally {
      setCreditorSearchLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!amount || !deadlineAmount || !deadline) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await Axios({
        ...SummaryApi.create_customer_debt,
        data: {
          session_token: sessionToken,
          customer_uuid_field: customerUuid,
          creditor_uuid_field: creditorResult?.uuid || null,
          amount,
          deadline_amount: deadlineAmount,
          periodicity,
          deadline,
          status: 'pending',
        },
      });
      setSuccess(true);
      setTimeout(() => onSuccess(), 1500);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setError(axiosErr?.response?.data?.detail || 'Erreur lors de la création de la dette.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={28} className="text-emerald-500" />
        </div>
        <p className="font-semibold text-gray-900 dark:text-white">Dette créée avec succès</p>
        <p className="text-sm text-gray-400 mt-1">Le lien de validation a été envoyé au client.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Enregistrer une dette</h3>
          <p className="text-xs text-gray-400">Le lien de validation sera envoyé automatiquement</p>
        </div>
      </div>

      {/* Creditor search */}
      <Card>
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100 dark:border-gray-700">
          <Building2 size={15} className="text-cyan-500" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Créditeur</span>
          <span className="text-xs text-gray-400">(*)</span>
        </div>

        {creditorResult ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {creditorResult.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm text-gray-900 dark:text-white">{creditorResult.full_name}</p>
              <p className="text-xs text-gray-400">{creditorResult.npi}</p>
            </div>
            <button
              onClick={() => { setCreditorResult(null); setCreditorNpi(''); }}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              value={creditorNpi}
              onChange={e => { setCreditorNpi(e.target.value); setCreditorSearchError(''); }}
              placeholder="NPI du créditeur"
              className="flex-1"
            />
            <Button variant="secondary" onClick={handleCreditorSearch} loading={creditorSearchLoading} size="md">
              <Search size={14} />
            </Button>
          </div>
        )}
        {creditorSearchError && (
          <p className="mt-2 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} /> {creditorSearchError}</p>
        )}
      </Card>

      {/* Debt fields */}
      <Card>
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100 dark:border-gray-700">
          <Landmark size={15} className="text-amber-500" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Détails de la dette</span>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Montant total *"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="150000.00"
              type="number"
            />
            <Input
              label="Montant / échéance *"
              value={deadlineAmount}
              onChange={e => setDeadlineAmount(e.target.value)}
              placeholder="12500.00"
              type="number"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Périodicité *</label>
            <select
              value={periodicity}
              onChange={e => setPeriodicity(e.target.value as Periodicity)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm px-3 py-2 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {Object.entries(periodicityLabels).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <Input
            label="Date limite *"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            type="date"
          />
        </div>
      </Card>

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
          <AlertCircle size={13} /> {error}
        </p>
      )}

      <Button onClick={handleSubmit} loading={loading} fullWidth>
        {!loading && <Landmark size={15} />} Enregistrer la dette
      </Button>
    </div>
  );
}

// ── Create Repayment View ──────────────────────────────────────────

interface CreateRepaymentViewProps {
  customerUuid: string;
  sessionToken: string;
  preselectedDebt?: Debt | null;
  onBack: () => void;
  onSuccess: () => void;
}

function CreateRepaymentView({ customerUuid, sessionToken, preselectedDebt, onBack, onSuccess }: CreateRepaymentViewProps) {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [debtsLoading, setDebtsLoading] = useState(!preselectedDebt);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(preselectedDebt || null);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useState(() => {
    if (!preselectedDebt) {
      Axios({ ...SummaryApi.get_customer_debts, params: { customer_uuid: customerUuid } })
        .then(res => setDebts(res.data))
        .finally(() => setDebtsLoading(false));
    }
  });

  const handleSubmit = async () => {
    if (!selectedDebt || !amount || !date) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await Axios({
        ...SummaryApi.create_customer_reimbursement,
        data: {
          session_token: sessionToken,
          debt_uuid: selectedDebt.uuid,
          amount,
          date,
        },
      });
      setSuccess(true);
      setTimeout(() => onSuccess(), 1500);
    } catch (err: any) {
      // 1. On cherche d'abord le message précis du backend
      const backendError = 
        err.response?.data?.detail || 
        err.response?.data?.error || 
        (typeof err.response?.data === 'string' ? err.response.data : null);

      // 2. Si c'est une erreur de validation (objet avec plusieurs champs)
      if (typeof err.response?.data === 'object' && !backendError) {
        // Récupère le premier message d'erreur trouvé dans l'objet (ex: { amount: ["Trop élevé"] })
        const firstKey = Object.keys(err.response.data)[0];
        const firstError = err.response.data[firstKey];
        setError(`${firstKey}: ${Array.isArray(firstError) ? firstError[0] : firstError}`);
      } else {
        // 3. Sinon on affiche le detail ou le message générique
        setError(backendError || 'Erreur lors de la création du remboursement.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={28} className="text-emerald-500" />
        </div>
        <p className="font-semibold text-gray-900 dark:text-white">Remboursement enregistré</p>
        <p className="text-sm text-gray-400 mt-1">Le lien de validation a été envoyé au client.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Enregistrer un remboursement</h3>
          <p className="text-xs text-gray-400">Le lien de validation sera envoyé automatiquement</p>
        </div>
      </div>

      {/* Debt selection */}
      {!preselectedDebt && (
        <Card>
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
            <Landmark size={15} className="text-amber-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Sélectionner la dette</span>
          </div>
          {debtsLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
              <Loader2 size={14} className="animate-spin" /> Chargement des dettes…
            </div>
          ) : debts.length === 0 ? (
            <p className="text-sm text-gray-400 py-2">Aucune dette disponible.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {debts.map(d => (
                <button
                  key={d.uuid}
                  onClick={() => setSelectedDebt(d)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all ${selectedDebt?.uuid === d.uuid
                    ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-900/20'
                    : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{formatAmount(d.amount)}</span>
                    <ValidationBadge status={d.validation_status} />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatAmount(d.deadline_amount)} / {periodicityLabels[d.periodicity]}
                    {' · '}{new Date(d.deadline).toLocaleDateString('fr-FR')}
                  </p>
                </button>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Selected debt preview (if preselected) */}
      {preselectedDebt && (
        <Card>
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
            <Landmark size={15} className="text-amber-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Dette sélectionnée</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-900 dark:text-white">{formatAmount(preselectedDebt.amount)}</span>
            <ValidationBadge status={preselectedDebt.validation_status} />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {formatAmount(preselectedDebt.deadline_amount)} / {periodicityLabels[preselectedDebt.periodicity]}
            {' · '}Échéance {new Date(preselectedDebt.deadline).toLocaleDateString('fr-FR')}
          </p>
        </Card>
      )}

      {/* Amount & date */}
      <Card>
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100 dark:border-gray-700">
          <DollarSign size={15} className="text-emerald-500" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Détails du versement</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Montant *"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="5000.00"
            type="number"
          />
          <Input
            label="Date *"
            value={date}
            onChange={e => setDate(e.target.value)}
            type="date"
          />
        </div>
      </Card>

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
          <AlertCircle size={13} /> {error}
        </p>
      )}

      <Button
        onClick={handleSubmit}
        loading={loading}
        disabled={!selectedDebt}
        fullWidth
      >
        {!loading && <ArrowDownUp size={15} />} Enregistrer le remboursement
      </Button>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────

export default function Consultation() {
  const { user } = useAuth();
  const isBailiff = user?.role === 'BAILIFF';

  const [step, setStep] = useState<Step>('search');
  const [npiInput, setNpiInput] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpSendError, setOtpSendError] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpVerifyLoading, setOtpVerifyLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState('');

  const [actionView, setActionView] = useState<ActionView>('menu');
  const [preselectedDebt, setPreselectedDebt] = useState<Debt | null>(null);

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
      const verifyRes = await Axios({
        ...SummaryApi.verify_otp_consultation_to_customer_by_uuid,
        data: { customer_uuid: searchResult.uuid, code: otpCode.trim() },
      });
      // Capture session_token from verify-otp response
      const token = verifyRes.data?.session_token || '';
      setSessionToken(token);

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
    setSessionToken('');
    setActionView('menu');
    setPreselectedDebt(null);
  };

  const handleBackToMenu = () => {
    setActionView('menu');
    setPreselectedDebt(null);
  };

  // ── Actions menu config ─────────────────────────────────────────
  const actions = [
    {
      icon: <ReceiptText size={20} />,
      label: 'Lister les dettes',
      description: 'Consulter l\'historique des dettes',
      color: 'from-red-500 to-violet-600',
      shadow: 'shadow-violet-500/20',
      onClick: () => setActionView('debts'),
      active: true,
    },
    {
      icon: <Repeat2 size={20} />,
      label: 'Lister les remboursements',
      description: 'Consulter l\'historique des remboursements',
      color: 'from-violet-500 to-cyan-600',
      shadow: 'shadow-violet-500/20',
      onClick: () => setActionView('repayments'),
      active: true,
    },
    {
      icon: <Landmark size={20} />,
      label: 'Enregistrer une dette',
      description: 'Créer une nouvelle dette client',
      color: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-500/20',
      onClick: () => setActionView('create-debt'),
      active: isBailiff,
      restricted: !isBailiff,
    },
    {
      icon: <ArrowDownUp size={20} />,
      label: 'Remboursement',
      description: 'Enregistrer un remboursement',
      color: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/20',
      onClick: () => setActionView('create-repayment'),
      active: isBailiff,
      restricted: !isBailiff,
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
          {/* Customer profile card — always visible */}
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

          {/* ── Action menu ── */}
          {actionView === 'menu' && (
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
                        : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 cursor-default opacity-60'
                      }`}
                  >
                    {action.restricted && (
                      <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider bg-gray-200 dark:bg-gray-700 text-gray-500 px-1.5 py-0.5 rounded-full">
                        Huissier
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
          )}

          {/* ── Debts list ── */}
          {actionView === 'debts' && (
            <DebtsView
              customerUuid={customer.uuid}
              sessionToken={sessionToken}
              isBailiff={isBailiff}
              onBack={handleBackToMenu}
              onCreateRepayment={(debt) => {
                setPreselectedDebt(debt);
                setActionView('create-repayment');
              }}
            />
          )}

          {/* ── Repayments list ── */}
          {actionView === 'repayments' && (
            <RepaymentsView
              customerUuid={customer.uuid}
              sessionToken={sessionToken}
              isBailiff={isBailiff}
              onBack={handleBackToMenu}
            />
          )}

          {/* ── Create debt ── */}
          {actionView === 'create-debt' && isBailiff && (
            <CreateDebtView
              customerUuid={customer.uuid}
              sessionToken={sessionToken}
              onBack={handleBackToMenu}
              onSuccess={() => { handleBackToMenu(); setActionView('debts'); }}
            />
          )}

          {/* ── Create repayment ── */}
          {actionView === 'create-repayment' && isBailiff && (
            <CreateRepaymentView
              customerUuid={customer.uuid}
              sessionToken={sessionToken}
              preselectedDebt={preselectedDebt}
              onBack={preselectedDebt ? () => setActionView('debts') : handleBackToMenu}
              onSuccess={() => { setPreselectedDebt(null); setActionView('repayments'); }}
            />
          )}
        </div>
      )}
    </div>
  );
}