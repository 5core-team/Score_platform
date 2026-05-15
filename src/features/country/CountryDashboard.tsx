import { useState, useEffect } from 'react';
import { Building2, Scale, Users, User, MapPin, TrendingUp, ChevronRight, RefreshCw, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';
import { StatCard, Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';

// Types backend
interface ZoneDetail {
  id: number;
  name: string;
  customer_count: number;
  front_office_count: number;
}

interface DashboardData {
  country: {
    id: number;
    name: string;
    iso_code: string;
    subscription: {
      is_active: boolean;
      expires_in: string;
    };
  };
  zones: {
    total: number;
    detail: ZoneDetail[];
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

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

export default function CountryDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [selectedZone, setSelectedZone] = useState<ZoneDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await Axios({ ...SummaryApi.country_representative_dashboard });
      setDashboard(res.data);
    } catch {
      setError('Impossible de charger les données.');
      setShowErrorModal(true);   // ← Affichage du modal
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

  const sub = dashboard?.country.subscription;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Tableau de Bord — {dashboard?.country.name}
            <span className="ml-2 text-sm font-mono text-gray-400">{dashboard?.country.iso_code}</span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Vue d'ensemble de votre pays</p>
        </div>
        <button onClick={fetchData} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-cyan-500 transition-colors">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Bandeau abonnement */}
      {sub && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${
          sub.is_active
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
        }`}>
          <ShieldCheck size={16} />
          <span>
            Abonnement <strong>{sub.is_active ? 'actif' : 'expiré'}</strong>
          </span>
          <span className="flex items-center gap-1 ml-auto text-xs opacity-70">
            <Clock size={12} />
            Expire le {formatDate(sub.expires_in)}
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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
          title="Zones"
          value={dashboard?.zones.total ?? 0}
          icon={<MapPin size={20} className="text-cyan-500" />}
          iconBg="bg-cyan-50 dark:bg-cyan-900/20"
        />
      </div>

      {/* Table zones */}
      <Card padding={false}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-cyan-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Zones géographiques</h3>
          </div>
          <span className="text-xs text-gray-400">{dashboard?.zones.total ?? 0} zones</span>
        </div>
        <Table
          columns={[
            {
              key: 'name', header: 'Zone',
              render: z => <span className="font-medium text-gray-900 dark:text-white">{z.name}</span>
            },
            {
              key: 'front_office_count', header: 'Front Offices',
              render: z => <Badge variant="info">{z.front_office_count}</Badge>
            },
            {
              key: 'customer_count', header: 'Clients',
              render: z => <Badge variant="neutral">{z.customer_count}</Badge>
            },
            {
              key: 'actions', header: '',
              render: z => (
                <button
                  onClick={() => setSelectedZone(z)}
                  className="flex items-center gap-1 text-xs text-cyan-500 font-medium hover:text-cyan-700"
                >
                  Détails <ChevronRight size={13} />
                </button>
              )
            },
          ]}
          data={dashboard?.zones.detail ?? []}
          keyExtractor={z => String(z.id)}
          emptyMessage="Aucune zone enregistrée"
        />
      </Card>

      {/* Modal zone */}
      <Modal
        isOpen={!!selectedZone}
        onClose={() => setSelectedZone(null)}
        title={`Zone — ${selectedZone?.name}`}
      >
        {selectedZone && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Front Offices', val: selectedZone.front_office_count },
              { label: 'Clients', val: selectedZone.customer_count },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{s.val}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Modal d'erreur */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Accès non activé"
      >
        <div className="text-center py-6">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle size={32} className="text-red-600 dark:text-red-500" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Votre abonnement n'est pas activé
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Veuillez contacter l'administrateur pour l'activation de votre abonnement.
          </p>

          <div className="flex flex-col gap-3">
            <button 
              onClick={fetchData}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              Réessayer
            </button>
            
            <button 
              onClick={() => setShowErrorModal(false)}
              className="w-full py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium"
            >
              Fermer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}