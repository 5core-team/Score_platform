import { useState, useEffect, useMemo } from 'react';
import { Plus, Pencil, Trash2, RefreshCw, Search, Users, Building2, Scale } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';

// ── Types backend ────────────────────────────────────────────────────
interface FrontOffice {
  id: number;
  zone: number;
  name: string;
  npi: string;
  phone: string;
  is_active: boolean;
}

interface Huissier {
  id: number;
  zone: number;
  subZone: number;
  npi: string;
  phone: string;
  picture: string | null;
  is_active: boolean;
}

interface FinancialAdvisor {
  id: number;
  zone: number;
  subZone: number;
  name: string;
  npi: string;
  phone: string;
  picture: string | null;
  is_active: boolean;
}

interface BackendZone {
  id: number;
  name: string;
  country_name: string;
}

type ActiveTab = 'front_office' | 'huissier' | 'advisor';

type FOForm = {
  email: string;
  username: string;
  zone: string;
  name: string;
  npi: string;
  phone: string;
};

const emptyFOForm: FOForm = { email: '', username: '', zone: '', name: '', npi: '', phone: '' };

// ── Composant ────────────────────────────────────────────────────────
export default function CountryUsers() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('front_office');
  const [search, setSearch] = useState('');

  // Données
  const [frontOffices, setFrontOffices] = useState<FrontOffice[]>([]);
  const [huissiers, setHuissiers] = useState<Huissier[]>([]);
  const [advisors, setAdvisors] = useState<FinancialAdvisor[]>([]);
  const [zones, setZones] = useState<BackendZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal création / édition FO
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FrontOffice | null>(null);
  const [form, setForm] = useState<FOForm>(emptyFOForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Modal suppression FO
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState<FrontOffice | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Chargement ────────────────────────────────────────────────────
  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [foRes, huissierRes, advisorRes, zonesRes] = await Promise.all([
        Axios({ ...SummaryApi.get_front_offices }),
        Axios({ ...SummaryApi.get_huissiers }),
        Axios({ ...SummaryApi.get_financial_advisors }),
        Axios({ ...SummaryApi.get_zones }),
      ]);
      setFrontOffices(foRes.data);
      setHuissiers(huissierRes.data);
      setAdvisors(advisorRes.data);
      setZones(zonesRes.data);
    } catch {
      setError('Impossible de charger les données.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // ── Recherche ─────────────────────────────────────────────────────
  const zoneName = (id: number) => zones.find(z => z.id === id)?.name ?? '—';

  const filteredFO = useMemo(() =>
    frontOffices.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search) ||
      u.npi.includes(search)
    ), [frontOffices, search]);

  const filteredHuissiers = useMemo(() =>
    huissiers.filter(u =>
      u.npi.includes(search) || u.phone.includes(search)
    ), [huissiers, search]);

  const filteredAdvisors = useMemo(() =>
    advisors.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search) ||
      u.npi.includes(search)
    ), [advisors, search]);

  // ── CRUD Front Office ─────────────────────────────────────────────
  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyFOForm, zone: zones[0] ? String(zones[0].id) : '' });
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (fo: FrontOffice) => {
    setEditing(fo);
    setForm({ email: '', username: '', zone: String(fo.zone), name: fo.name, npi: fo.npi, phone: fo.phone });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.zone) { setFormError('Nom et zone sont requis.'); return; }
    if (!editing && (!form.email || !form.username)) { setFormError('Email et nom d\'utilisateur sont requis.'); return; }
    setSaving(true);
    setFormError('');
    try {
      const payload = { ...form, zone: Number(form.zone) };
      if (editing) {
        const res = await Axios({
          ...SummaryApi.update_partial_front_office,
          url: SummaryApi.update_partial_front_office.url.replace('{id}', String(editing.id)),
          data: { name: form.name, phone: form.phone, npi: form.npi, zone: Number(form.zone) },
        });
        setFrontOffices(prev => prev.map(fo => fo.id === editing.id ? res.data : fo));
      } else {
        const res = await Axios({ ...SummaryApi.create_front_office, data: payload });
        setFrontOffices(prev => [...prev, res.data]);
      }
      setModalOpen(false);
    } catch (err: any) {
      setFormError(err.response?.data?.detail || 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  };

  const openDelete = (fo: FrontOffice) => { setDeleting(fo); setDeleteModal(true); };


  // ── Tabs config ───────────────────────────────────────────────────
  const tabs: { key: ActiveTab; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'front_office', label: 'Front Offices', icon: <Building2 size={15} />, count: frontOffices.length },
    { key: 'huissier',     label: 'Huissiers',     icon: <Scale size={15} />,     count: huissiers.length },
    { key: 'advisor',      label: 'Conseillers',   icon: <Users size={15} />,     count: advisors.length },
  ];

  // ── Rendu ─────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <p className="text-sm text-red-500">{error}</p>
      <button onClick={fetchAll} className="flex items-center gap-2 text-sm text-cyan-500 hover:underline">
        <RefreshCw size={14} /> Réessayer
      </button>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Utilisateurs</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {frontOffices.length + huissiers.length + advisors.length} utilisateurs au total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchAll} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-cyan-500 transition-colors">
            <RefreshCw size={16} />
          </button>
          {activeTab === 'front_office' && (
            <Button size="sm" onClick={openCreate}>
              <Plus size={16} /> Nouveau Front Office
            </Button>
          )}
        </div>
      </div>

      {/* Tabs + Searchbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Tabs */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => { setActiveTab(t.key); setSearch(''); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === t.key
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {t.icon}
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === t.key ? 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
              }`}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Searchbar */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Tables */}
      <Card padding={false}>

        {/* Front Offices */}
        {activeTab === 'front_office' && (
          <Table
            columns={[
              { key: 'name', header: 'Nom', render: u => <span className="font-medium text-gray-900 dark:text-white">{u.name}</span> },
              { key: 'zone', header: 'Zone', render: u => <span className="text-gray-500 dark:text-gray-400">{zoneName(u.zone)}</span> },
              { key: 'phone', header: 'Téléphone', render: u => <span className="text-gray-500 dark:text-gray-400 text-xs">{u.phone || '—'}</span> },
              { key: 'npi', header: 'NPI', render: u => <span className="text-gray-500 dark:text-gray-400 text-xs font-mono">{u.npi || '—'}</span> },
              { key: 'is_active', header: 'Statut', render: u => (
                <Badge variant={u.is_active ? 'success' : 'danger'}>{u.is_active ? 'Actif' : 'Inactif'}</Badge>
              )},
              { key: 'actions', header: '', render: u => (
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-cyan-600 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => openDelete(u)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              )},
            ]}
            data={filteredFO}
            keyExtractor={u => String(u.id)}
            emptyMessage="Aucun front office"
          />
        )}

        {/* Huissiers — lecture seule */}
        {activeTab === 'huissier' && (
          <Table
            columns={[
              { key: 'zone', header: 'Zone', render: u => <span className="text-gray-500 dark:text-gray-400">{zoneName(u.zone)}</span> },
              { key: 'phone', header: 'Téléphone', render: u => <span className="text-gray-500 dark:text-gray-400 text-xs">{u.phone || '—'}</span> },
              { key: 'npi', header: 'NPI', render: u => <span className="text-gray-500 dark:text-gray-400 text-xs font-mono">{u.npi || '—'}</span> },
              { key: 'is_active', header: 'Statut', render: u => (
                <Badge variant={u.is_active ? 'success' : 'danger'}>{u.is_active ? 'Actif' : 'Inactif'}</Badge>
              )},
            ]}
            data={filteredHuissiers}
            keyExtractor={u => String(u.id)}
            emptyMessage="Aucun huissier"
          />
        )}

        {/* Conseillers — lecture seule */}
        {activeTab === 'advisor' && (
          <Table
            columns={[
              { key: 'name', header: 'Nom', render: u => <span className="font-medium text-gray-900 dark:text-white">{u.name}</span> },
              { key: 'zone', header: 'Zone', render: u => <span className="text-gray-500 dark:text-gray-400">{zoneName(u.zone)}</span> },
              { key: 'phone', header: 'Téléphone', render: u => <span className="text-gray-500 dark:text-gray-400 text-xs">{u.phone || '—'}</span> },
              { key: 'npi', header: 'NPI', render: u => <span className="text-gray-500 dark:text-gray-400 text-xs font-mono">{u.npi || '—'}</span> },
              { key: 'is_active', header: 'Statut', render: u => (
                <Badge variant={u.is_active ? 'success' : 'danger'}>{u.is_active ? 'Actif' : 'Inactif'}</Badge>
              )},
            ]}
            data={filteredAdvisors}
            keyExtractor={u => String(u.id)}
            emptyMessage="Aucun conseiller"
          />
        )}
      </Card>

      {/* Modal création / édition FO */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier le Front Office' : 'Nouveau Front Office'}>
        <div className="space-y-4">
          {!editing && (
            <div className="grid grid-cols-2 gap-3">
              <Input label="Email *" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="fo@example.com" />
              <Input label="Nom d'utilisateur *" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="fo_cotonou" />
            </div>
          )}
          <Input label="Nom complet *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Prénom Nom" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Téléphone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+229..." />
            <Input label="NPI" value={form.npi} onChange={e => setForm(f => ({ ...f, npi: e.target.value }))} placeholder="Numéro NPI" />
          </div>
          <Select
            label="Zone *"
            value={form.zone}
            onChange={e => setForm(f => ({ ...f, zone: e.target.value }))}
            options={zones.map(z => ({ value: String(z.id), label: z.name }))}
            placeholder="Sélectionner une zone"
          />
          {formError && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{formError}</p>
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)} fullWidth>Annuler</Button>
            <Button onClick={handleSave} loading={saving} fullWidth>{editing ? 'Enregistrer' : 'Créer'}</Button>
          </div>
        </div>
      </Modal>

      {/* Modal suppression FO */}
      {/*<Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Supprimer le Front Office">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Voulez-vous vraiment supprimer <span className="font-semibold text-gray-900 dark:text-white">{deleting?.name}</span> ? Cette action est irréversible.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setDeleteModal(false)} fullWidth>Annuler</Button>
            <Button onClick={handleDelete} loading={deleteLoading} fullWidth className="bg-red-500 hover:bg-red-600">Supprimer</Button>
          </div>
        </div>
      </Modal>*/}
    </div>
  );
}