import { useState, useEffect } from 'react';
import { Scale, Users, MapPin, User, TrendingUp, ChevronRight, RefreshCw } from 'lucide-react';
import { StatCard, Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';

// ── Types backend ────────────────────────────────────────────────────
interface SubzoneDetail {
  id: number;
  name: string;
  customer_count: number;
}

interface DashboardData {
  front_office: {
    id: number;
    name: string;
    zone: { id: number; name: string; country: string };
  };
  subzones: {
    total: number;
    detail: SubzoneDetail[];
  };
  staff: {
    huissiers: { total: number; active: number };
    financial_advisors: { total: number; active: number };
  };
  customers: { total: number };
  debts: {
    total: number;
    pending: number;
    done: number;
    overdue: number;
    total_amount: number;
    pending_amount: number;
  };
  repayments: { total: number };
  activity: { active_sessions: number; otps_last_24h: number };
}

export default function OfficeDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [selectedSubzone, setSelectedSubzone] = useState<SubzoneDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await Axios({ ...SummaryApi.front_office_dashboard });
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

  const fo = dashboard?.front_office;
  const staff = dashboard?.staff;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {fo?.name ?? 'Tableau de Bord'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Zone : <span className="font-medium text-gray-700 dark:text-gray-300">{fo?.zone.name}</span>
            <span className="mx-1.5 text-gray-300 dark:text-gray-600">·</span>
            {fo?.zone.country}
          </p>
        </div>
        <button onClick={fetchData} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-cyan-500 transition-colors">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Huissiers"
          value={staff?.huissiers.total ?? 0}
          icon={<Scale size={20} className="text-amber-500" />}
          iconBg="bg-amber-50 dark:bg-amber-900/20"
        />
        <StatCard
          title="Conseillers"
          value={staff?.financial_advisors.total ?? 0}
          icon={<Users size={20} className="text-orange-500" />}
          iconBg="bg-orange-50 dark:bg-orange-900/20"
        />
        <StatCard
          title="Clients"
          value={dashboard?.customers.total ?? 0}
          icon={<User size={20} className="text-red-500" />}
          iconBg="bg-red-50 dark:bg-red-900/20"
        />
        <StatCard
          title="Sous-zones"
          value={dashboard?.subzones.total ?? 0}
          icon={<MapPin size={20} className="text-cyan-500" />}
          iconBg="bg-cyan-50 dark:bg-cyan-900/20"
        />
      </div>

      {/* Stats dettes en ligne */}
      {dashboard && dashboard.debts.total > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Dettes totales', val: dashboard.debts.total, color: 'text-gray-900 dark:text-white' },
            { label: 'En attente', val: dashboard.debts.pending, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Soldées', val: dashboard.debts.done, color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'En retard', val: dashboard.debts.overdue, color: 'text-red-600 dark:text-red-400' },
          ].map(s => (
            <div key={s.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
              <p className={`text-xl font-bold mt-0.5 ${s.color}`}>{s.val}</p>
            </div>
          ))}
        </div>
      )}

      {/* Table sous-zones */}
      <Card padding={false}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-cyan-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Sous-zones</h3>
          </div>
          <span className="text-xs text-gray-400">{dashboard?.subzones.total ?? 0} sous-zones</span>
        </div>
        <Table
          columns={[
            {
              key: 'name', header: 'Sous-zone',
              render: s => <span className="font-medium text-gray-900 dark:text-white">{s.name}</span>
            },
            {
              key: 'customer_count', header: 'Clients',
              render: s => <Badge variant="neutral">{s.customer_count}</Badge>
            },
            {
              key: 'actions', header: '',
              render: s => (
                <button
                  onClick={() => setSelectedSubzone(s)}
                  className="flex items-center gap-1 text-xs text-cyan-500 font-medium hover:text-cyan-700"
                >
                  Détails <ChevronRight size={13} />
                </button>
              )
            },
          ]}
          data={dashboard?.subzones.detail ?? []}
          keyExtractor={s => String(s.id)}
          emptyMessage="Aucune sous-zone enregistrée"
        />
      </Card>

      {/* Modal sous-zone */}
      <Modal
        isOpen={!!selectedSubzone}
        onClose={() => setSelectedSubzone(null)}
        title={`Sous-zone — ${selectedSubzone?.name}`}
      >
        {selectedSubzone && (
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">Clients</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{selectedSubzone.customer_count}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}