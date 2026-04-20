import { useState, useEffect } from 'react';
import { Globe, Users, Building2, Scale, UserCheck, User, TrendingUp, ChevronRight, RefreshCw } from 'lucide-react';
import { StatCard, Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';

// Types backend
interface DashboardData {
  countries: {
    total: number;
    active: number;
    expired: number;
    detail: {
      id: number;
      name: string;
      iso_code: string;
      front_office_count: number;
      customer_count: number;
    }[];
  };
  staff: {
    front_offices: { total: number; active: number };
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

interface BackendCountry {
  id: number;
  name: string;
  iso_code: string;
  phone_code: string | null;
  licence_status: boolean;
  has_valid_subscription: boolean;
}

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [countries, setCountries] = useState<BackendCountry[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<BackendCountry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [dashRes, countriesRes] = await Promise.all([
        Axios({ ...SummaryApi.super_admin_dashboard }),
        Axios({ ...SummaryApi.get_countries }),
      ]);
      setDashboard(dashRes.data);
      setCountries(countriesRes.data);
    } catch (err: any) {
      setError('Impossible de charger les données.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Stats pays du dashboard pour le modal
  const getDashboardCountryStats = (countryId: number) =>
    dashboard?.countries.detail.find(c => c.id === countryId);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tableau de Bord Global</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Vue d'ensemble de la plateforme Afrika Risque</p>
        </div>
        <button onClick={fetchData} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-cyan-500 transition-colors">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Pays"
          value={dashboard?.countries.total ?? 0}
          icon={<Globe size={20} className="text-cyan-500" />}
          iconBg="bg-cyan-50 dark:bg-cyan-900/20"
        />
        <StatCard
          title="Front Offices"
          value={dashboard?.staff.front_offices.total ?? 0}
          icon={<Building2 size={20} className="text-emerald-500" />}
          iconBg="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <StatCard
          title="Huissiers"
          value={dashboard?.staff.huissiers.total ?? 0}
          icon={<Scale size={20} className="text-amber-500" />}
          iconBg="bg-amber-50 dark:bg-amber-900/20"
        />
        <StatCard
          title="Conseillers"
          value={dashboard?.staff.financial_advisors.total ?? 0}
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
          title="Dettes"
          value={dashboard?.debts.total ?? 0}
          icon={<UserCheck size={20} className="text-purple-500" />}
          iconBg="bg-purple-50 dark:bg-purple-900/20"
        />
      </div>

      {/* Table pays */}
      <Card padding={false}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-cyan-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Pays enregistrés</h3>
          </div>
          <span className="text-xs text-gray-400">{countries.length} pays</span>
        </div>
        <Table
          columns={[
            {
              key: 'name', header: 'Pays',
              render: c => (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-500">{c.iso_code}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{c.name}</span>
                </div>
              )
            },
            {
              key: 'phone_code', header: 'Indicatif',
              render: c => <span className="text-gray-500">{c.phone_code ?? '—'}</span>
            },
            {
              key: 'licence_status', header: 'Licence Statut',
              render: c => (
                <Badge variant={c.licence_status ? 'success' : 'neutral'}>
                  {c.licence_status ? 'Actif' : 'Inactif'}
                </Badge>
              )
            },
            {
              key: 'has_valid_subscription', header: 'Abonnement',
              render: c => (
                <Badge variant={c.has_valid_subscription ? 'success' : 'warning'}>
                  {c.has_valid_subscription ? 'Valide' : 'Expiré'}
                </Badge>
              )
            },
            {
              key: 'actions', header: '',
              render: c => (
                <button
                  onClick={() => setSelectedCountry(c)}
                  className="flex items-center gap-1 text-xs text-cyan-500 hover:text-cyan-700 font-medium"
                >
                  Voir détails <ChevronRight size={13} />
                </button>
              )
            },
          ]}
          data={countries}
          keyExtractor={c => String(c.id)}
        />
      </Card>

      {/* Modal détail pays */}
      <Modal
        isOpen={!!selectedCountry}
        onClose={() => setSelectedCountry(null)}
        title={`Statistiques — ${selectedCountry?.name}`}
      >
        {selectedCountry && (() => {
          const detail = getDashboardCountryStats(selectedCountry.id);
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={selectedCountry.licence_status ? 'success' : 'neutral'}>
                  {selectedCountry.licence_status ? 'Actif' : 'Inactif'}
                </Badge>
                <Badge variant={selectedCountry.has_valid_subscription ? 'success' : 'warning'}>
                  {selectedCountry.has_valid_subscription ? 'Abonnement valide' : 'Abonnement expiré'}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Front Offices', val: detail?.front_office_count ?? '—' },
                  { label: 'Clients', val: detail?.customer_count ?? '—' },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{item.val}</p>
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700 space-y-1">
                <p>Code ISO : <span className="font-mono">{selectedCountry.iso_code}</span></p>
                <p>Indicatif : {selectedCountry.phone_code ?? '—'}</p>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
