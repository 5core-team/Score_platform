import { useState, useEffect } from 'react';
import { User, TrendingUp, Eye, MapPin, RefreshCw, MessageSquare } from 'lucide-react';
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
  conseiller: {
    id: number;
    email: string;
    username: string;
    zone: string;
    subzone: string;
  };
  stats: {
    total_consultations: number;
    taux_de_reponse: number;
  };
  dernieres_consultations: Consultation[];
}

export default function AdvisorDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await Axios({ ...SummaryApi.conseiller_dashboard });
      setDashboard(res.data);
    } catch {
      setError('Impossible de charger les données.');
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

  const conseiller = dashboard?.conseiller;
  const stats = dashboard?.stats;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tableau de Bord</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Zone : <span className="font-medium text-gray-700 dark:text-gray-300">{conseiller?.zone}</span>
            {conseiller?.subzone && (
              <>
                <span className="mx-1.5 text-gray-300 dark:text-gray-600">·</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{conseiller.subzone}</span>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Consultations"
          value={stats?.total_consultations ?? 0}
          icon={<TrendingUp size={20} className="text-cyan-500" />}
          iconBg="bg-cyan-50 dark:bg-cyan-900/20"
        />
        <StatCard
          title="Taux de réponse"
          value={`${stats?.taux_de_reponse ?? 0}%`}
          icon={<MessageSquare size={20} className="text-emerald-500" />}
          iconBg="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <StatCard
          title="Sous-zone"
          value={conseiller?.subzone ?? '—'}
          icon={<MapPin size={20} className="text-red-500" />}
          iconBg="bg-red-50 dark:bg-red-900/20"
        />
      </div>

      {/* Dernières consultations */}
      {dashboard && dashboard.dernieres_consultations.length > 0 ? (
        <Card padding={false}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Eye size={18} className="text-cyan-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Dernières consultations</h3>
            </div>
            <span className="text-xs text-gray-400">{dashboard.dernieres_consultations.length} entrée(s)</span>
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
            data={dashboard.dernieres_consultations}
            keyExtractor={(c: Consultation) => String(c.id)}
            emptyMessage="Aucune consultation récente"
          />
        </Card>
      ) : (
        /* Mode lecture seule — info card quand pas de consultations */
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Eye size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Mode lecture seule</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            En tant que conseiller, vous avez accès en lecture seule aux dossiers clients.
            Utilisez la page <span className="font-medium text-cyan-500">Consultation</span> pour
            rechercher un client via son npi et saisir le code de validation.
          </p>
        </Card>
      )}

    </div>
  );
}