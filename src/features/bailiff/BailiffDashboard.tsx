import { useState, useEffect } from 'react';
import { User, TrendingDown, TrendingUp, MessageSquare, MapPin, RefreshCw, Clock } from 'lucide-react';
import { StatCard, Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';

// ── Types backend ────────────────────────────────────────────────────
interface Consultation {
  id: number;
  client_name?: string;
  client_email?: string;
  date?: string;
  status?: string;
  [key: string]: unknown;
}

interface DashboardData {
  huissier: {
    id: number;
    email: string;
    username: string;
    zone: string;
    subzone: string;
  };
  stats: {
    dossiers_crees: number;
    taux_de_reponse: number;
    total_consultations: number;
    dettes_suivies: {
      total: number;
      pending: number;
      done: number;
      overdue: number;
      total_amount: number;
    };
    remboursements_suivis: {
      total: number;
    };
  };
  dernieres_consultations: Consultation[];
}

export default function BailiffDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await Axios({ ...SummaryApi.huissier_dashboard });
      setDashboard(res.data);
    } catch (err: any) {
      // 1. On cherche le message détaillé renvoyé par l'API
      const backendError = 
        err.response?.data?.detail || 
        err.response?.data?.error || 
        (typeof err.response?.data === 'string' ? err.response.data : null);

      // 2. On affiche soit le message précis, soit un message de secours
      setError(backendError || 'Impossible de charger les données du tableau de bord.');
      
      // Optionnel : on log l'erreur complète en console pour le dev
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <p className="text-sm text-red-500">{error}</p>
      <button onClick={fetchData} className="flex items-center gap-2 text-sm text-cyan-500 hover:underline">
        <RefreshCw size={14} /> Réessayer
      </button>
    </div>
  );

  const huissier = dashboard?.huissier;
  const stats = dashboard?.stats;
  const dettes = stats?.dettes_suivies;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tableau de Bord</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestion de vos dossiers clients
            {huissier?.zone && (
              <>
                <span className="mx-1.5 text-gray-300 dark:text-gray-600">·</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{huissier.zone}</span>
              </>
            )}
            {huissier?.subzone && (
              <>
                <span className="mx-1.5 text-gray-300 dark:text-gray-600">·</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{huissier.subzone}</span>
              </>
            )}
          </p>
        </div>
        <button
          onClick={fetchData}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-cyan-500 transition-colors"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Dossiers créés"
          value={stats?.dossiers_crees ?? 0}
          icon={<User size={20} className="text-cyan-500" />}
          iconBg="bg-cyan-50 dark:bg-cyan-900/20"
        />
        <StatCard
          title="Consultations"
          value={stats?.total_consultations ?? 0}
          icon={<MessageSquare size={20} className="text-orange-500" />}
          iconBg="bg-orange-50 dark:bg-orange-900/20"
        />
        <StatCard
          title="Remboursements"
          value={stats?.remboursements_suivis?.total ?? 0}
          icon={<TrendingUp size={20} className="text-emerald-500" />}
          iconBg="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <StatCard
          title="Taux de réponse"
          value={`${stats?.taux_de_reponse ?? 0}%`}
          icon={<MapPin size={20} className="text-red-500" />}
          iconBg="bg-red-50 dark:bg-red-900/20"
        />
      </div>

      {/* Stats dettes */}
      {dettes && dettes.total > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Dettes suivies', val: dettes.total, color: 'text-gray-900 dark:text-white' },
            { label: 'En attente', val: dettes.pending, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Soldées', val: dettes.done, color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'En retard', val: dettes.overdue, color: 'text-red-600 dark:text-red-400' },
          ].map(s => (
            <div key={s.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
              <p className={`text-xl font-bold mt-0.5 ${s.color}`}>{s.val}</p>
            </div>
          ))}
        </div>
      )}

      {/* Montant total dettes si > 0 */}
      {dettes && dettes.total_amount > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 inline-flex items-center gap-3">
          <TrendingDown size={18} className="text-red-500" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Montant total suivi</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {Number(dettes.total_amount).toLocaleString('fr-FR')} XOF
            </p>
          </div>
        </div>
      )}

      {/* Dernières consultations */}
      <Card padding={false}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-cyan-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Dernières consultations</h3>
          </div>
          <span className="text-xs text-gray-400">
            {dashboard?.dernieres_consultations.length ?? 0} entrée(s)
          </span>
        </div>
        <Table
          columns={[
            {
              key: 'client_name',
              header: 'Client',
              render: (c: Consultation) => (
                <span className="font-medium text-gray-900 dark:text-white">
                  {c.client_name ?? c.client_email ?? `#${c.id}`}
                </span>
              ),
            },
            {
              key: 'date',
              header: 'Date',
              render: (c: Consultation) => (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {c.date ? new Date(c.date).toLocaleDateString('fr-FR') : '—'}
                </span>
              ),
            },
            {
              key: 'status',
              header: 'Statut',
              render: (c: Consultation) => (
                <Badge variant={c.status === 'done' ? 'success' : 'neutral'}>
                  {c.status ?? '—'}
                </Badge>
              ),
            },
          ]}
          data={dashboard?.dernieres_consultations ?? []}
          keyExtractor={(c: Consultation) => String(c.id)}
          emptyMessage="Aucune consultation récente"
        />
      </Card>

    </div>
  );
}