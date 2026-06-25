import { useState, useEffect, useMemo } from 'react';
import { Plus, Pencil, Trash2, RefreshCw, Search, Scale, Users } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';

interface Huissier {
  id: number;
  zone: number;
  subZone: number;
  npi: string;
  phone: string;
  is_active: boolean;
}

interface FinancialAdvisor {
  id: number;
  zone: number;
  subZone: number;
  name: string;
  npi: string;
  phone: string;
  is_active: boolean;
}

type HuissierForm = { email: string; username: string; subZone: string; name: string; npi: string; phone: string };
type AdvisorForm  = { email: string; username: string; subZone: string; name: string; npi: string; phone: string };

interface BackendSubzone {
  id: number;
  name: string;
  zone_name: string;
  country_name: string;
}

type ActiveTab = 'huissier' | 'advisor';

const emptyHuissierForm: HuissierForm = { email: '', username: '', subZone: '', name: '', npi: '', phone: '' };
const emptyAdvisorForm: AdvisorForm   = { email: '', username: '', subZone: '', name: '', npi: '', phone: '' };

export default function OfficeUsers() {
  const [activeTab, setActiveTab]       = useState<ActiveTab>('huissier');
  const [search, setSearch]             = useState('');

  const [huissiers, setHuissiers]       = useState<Huissier[]>([]);
  const [advisors, setAdvisors]         = useState<FinancialAdvisor[]>([]);
  const [subzones, setSubzones]         = useState<BackendSubzone[]>([]);

  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  // Modal huissier
  const [hModal, setHModal]             = useState(false);
  const [editingH, setEditingH]         = useState<Huissier | null>(null);
  const [hForm, setHForm]               = useState<HuissierForm>(emptyHuissierForm);
  const [hSaving, setHSaving]           = useState(false);
  const [hError, setHError]             = useState('');

  // Modal advisor
  const [aModal, setAModal]             = useState(false);
  const [editingA, setEditingA]         = useState<FinancialAdvisor | null>(null);
  const [aForm, setAForm]               = useState<AdvisorForm>(emptyAdvisorForm);
  const [aSaving, setASaving]           = useState(false);
  const [aError, setAError]             = useState('');

  // Modal suppression
  const [deleteModal, setDeleteModal]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; type: ActiveTab; name: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError]   = useState('');

  // ── Chargement ────────────────────────────────────────────────────
  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [hRes, aRes, szRes] = await Promise.all([
        Axios({ ...SummaryApi.get_huissiers }),
        Axios({ ...SummaryApi.get_financial_advisors }),
        Axios({ ...SummaryApi.get_subzones }),
      ]);
      setHuissiers(hRes.data);
      setAdvisors(aRes.data);
      setSubzones(szRes.data);
    } catch {
      setError('Impossible de charger les données.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // ── Recherche ─────────────────────────────────────────────────────
  const subzoneName = (id: number) => subzones.find(s => s.id === id)?.name ?? '—';

  const filteredH = useMemo(() =>
    huissiers.filter(u =>
      u.npi.includes(search) || u.phone.includes(search)
    ), [huissiers, search]);

  const filteredA = useMemo(() =>
    advisors.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.npi.includes(search) ||
      u.phone.includes(search)
    ), [advisors, search]);

  // ── CRUD Huissier ─────────────────────────────────────────────────
  const openCreateH = () => {
    setEditingH(null);
    setHForm({ ...emptyHuissierForm, subZone: subzones[0] ? String(subzones[0].id) : '' });
    setHError('');
    setHModal(true);
  };

  const openEditH = (h: Huissier) => {
    setEditingH(h);
    setHForm({ email: '', username: '', subZone: String(h.subZone), name: '', npi: h.npi, phone: h.phone });
    setHError('');
    setHModal(true);
  };

  const handleSaveH = async () => {
    if (!hForm.subZone) { setHError('La sous-zone est requise.'); return; }
    if (!editingH && (!hForm.email || !hForm.username)) { setHError("Email et nom d'utilisateur sont requis."); return; }
    setHSaving(true); setHError('');
    try {
      if (editingH) {
        const data = { name: hForm.name, npi: hForm.npi, phone: hForm.phone, subZone: Number(hForm.subZone) };
        const res = await Axios({
          ...SummaryApi.update_partial_huissier,
          url: SummaryApi.update_partial_huissier.url.replace('{id}', String(editingH.id)),
          data,
        });
        setHuissiers(prev => prev.map(h => h.id === editingH.id ? res.data : h));
      } else {
        const data = {
          email: hForm.email,
          username: hForm.username,
          name: hForm.name,
          npi: hForm.npi,
          phone: hForm.phone,
          subZone: Number(hForm.subZone),
        };
        const res = await Axios({ ...SummaryApi.create_huissier, data });
        setHuissiers(prev => [...prev, res.data]);
      }
      setHModal(false);
    } catch (err: any) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        // Prend le premier message d'erreur du premier champ
        const firstKey = Object.keys(data)[0];
        const firstMsg = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];
        setHError(firstMsg || 'Une erreur est survenue.');
      } else {
        setHError('Une erreur est survenue.');
      }
    } finally {
      setHSaving(false);
    }
  };

  // ── CRUD Advisor ──────────────────────────────────────────────────
  const openCreateA = () => {
    setEditingA(null);
    setAForm({ ...emptyAdvisorForm, subZone: subzones[0] ? String(subzones[0].id) : '' });
    setAError('');
    setAModal(true);
  };

  const openEditA = (a: FinancialAdvisor) => {
    setEditingA(a);
    setAForm({ email: '', username: '', subZone: String(a.subZone), name: a.name, npi: a.npi, phone: a.phone });
    setAError('');
    setAModal(true);
  };

  const handleSaveA = async () => {
    if (!aForm.name || !aForm.subZone) { setAError('Nom et sous-zone sont requis.'); return; }
    if (!editingA && (!aForm.email || !aForm.username)) { setAError("Email et nom d'utilisateur sont requis."); return; }
    setASaving(true); setAError('');
    try {
      if (editingA) {
        const data = { name: aForm.name, npi: aForm.npi, phone: aForm.phone, subZone: Number(aForm.subZone) };
        const res = await Axios({
          ...SummaryApi.update_partial_financial_advisor,
          url: SummaryApi.update_partial_financial_advisor.url.replace('{id}', String(editingA.id)),
          data,
        });
        setAdvisors(prev => prev.map(a => a.id === editingA.id ? res.data : a));
      } else {
        const data = {
          email: aForm.email,
          username: aForm.username,
          name: aForm.name,
          npi: aForm.npi,
          phone: aForm.phone,
          subZone: Number(aForm.subZone),
        };
        const res = await Axios({ ...SummaryApi.create_financial_advisor, data });
        setAdvisors(prev => [...prev, res.data]);
      }
      setAModal(false);
    } catch (err: any) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const firstKey = Object.keys(data)[0];
        const firstMsg = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];
        setAError(firstMsg || 'Une erreur est survenue.');
      } else {
        setAError('Une erreur est survenue.');
      }
    } finally {
      setASaving(false);
    }
  };

  // ── Suppression ───────────────────────────────────────────────────
  const openDelete = (id: number, type: ActiveTab, name: string) => {
    setDeleteTarget({ id, type, name });
    setDeleteError('');
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      if (deleteTarget.type === 'huissier') {
        await Axios({
          ...SummaryApi.delete_huissier,
          url: SummaryApi.delete_huissier.url.replace('{id}', String(deleteTarget.id)),
        });
        setHuissiers(prev => prev.filter(h => h.id !== deleteTarget.id));
      } else {
        await Axios({
          ...SummaryApi.delete_financial_advisor,
          url: SummaryApi.delete_financial_advisor.url.replace('{id}', String(deleteTarget.id)),
        });
        setAdvisors(prev => prev.filter(a => a.id !== deleteTarget.id));
      }
      setDeleteModal(false);
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.detail) setDeleteError(String(data.detail));
      else if (data?.error) setDeleteError(String(data.error));
      else if (typeof data === 'object' && data && Object.keys(data).length > 0) {
        const firstVal = data[Object.keys(data)[0]];
        setDeleteError(Array.isArray(firstVal) ? firstVal[0] : String(firstVal));
      } else {
        setDeleteError('La suppression a échoué. Veuillez réessayer.');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

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

  const tabs = [
    { key: 'huissier' as ActiveTab, label: 'Huissiers',   icon: <Scale size={15} />, count: huissiers.length },
    { key: 'advisor'  as ActiveTab, label: 'Conseillers', icon: <Users size={15} />, count: advisors.length  },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Utilisateurs</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {huissiers.length + advisors.length} utilisateurs au total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchAll} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-cyan-500 transition-colors">
            <RefreshCw size={16} />
          </button>
          <Button size="sm" onClick={activeTab === 'huissier' ? openCreateH : openCreateA}>
            <Plus size={16} /> {activeTab === 'huissier' ? 'Nouvel huissier' : 'Nouveau conseiller'}
          </Button>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
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
              {t.icon} {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === t.key
                  ? 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
              }`}>{t.count}</span>
            </button>
          ))}
        </div>
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

      {/* Table */}
      <Card padding={false}>
        {activeTab === 'huissier' ? (
          <Table
            columns={[
              { key: 'subZone',   header: 'Sous-zone',  render: h => <span className="text-gray-500 dark:text-gray-400">{subzoneName(h.subZone)}</span> },
              { key: 'phone',     header: 'Téléphone',  render: h => <span className="text-gray-500 dark:text-gray-400 text-xs">{h.phone || '—'}</span> },
              { key: 'npi',       header: 'NPI',        render: h => <span className="text-gray-500 dark:text-gray-400 text-xs font-mono">{h.npi || '—'}</span> },
              { key: 'is_active', header: 'Statut',     render: h => <Badge variant={h.is_active ? 'success' : 'danger'}>{h.is_active ? 'Actif' : 'Inactif'}</Badge> },
              { key: 'actions',   header: '',           render: h => (
                <div className="flex items-center gap-1">
                  <button onClick={() => openEditH(h)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-cyan-600 transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => openDelete(h.id, 'huissier', `Huissier #${h.id}`)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                </div>
              )},
            ]}
            data={filteredH}
            keyExtractor={h => String(h.id)}
            emptyMessage="Aucun huissier"
          />
        ) : (
          <Table
            columns={[
              { key: 'name',      header: 'Nom',        render: a => <span className="font-medium text-gray-900 dark:text-white">{a.name}</span> },
              { key: 'subZone',   header: 'Sous-zone',  render: a => <span className="text-gray-500 dark:text-gray-400">{subzoneName(a.subZone)}</span> },
              { key: 'phone',     header: 'Téléphone',  render: a => <span className="text-gray-500 dark:text-gray-400 text-xs">{a.phone || '—'}</span> },
              { key: 'npi',       header: 'NPI',        render: a => <span className="text-gray-500 dark:text-gray-400 text-xs font-mono">{a.npi || '—'}</span> },
              { key: 'is_active', header: 'Statut',     render: a => <Badge variant={a.is_active ? 'success' : 'danger'}>{a.is_active ? 'Actif' : 'Inactif'}</Badge> },
              { key: 'actions',   header: '',           render: a => (
                <div className="flex items-center gap-1">
                  <button onClick={() => openEditA(a)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-cyan-600 transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => openDelete(a.id, 'advisor', a.name)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                </div>
              )},
            ]}
            data={filteredA}
            keyExtractor={a => String(a.id)}
            emptyMessage="Aucun conseiller"
          />
        )}
      </Card>

      {/* Modal Huissier */}
      <Modal isOpen={hModal} onClose={() => setHModal(false)} title={editingH ? "Modifier l'huissier" : 'Nouvel huissier'}>
        <div className="space-y-4">
          {!editingH && (
            <div className="grid grid-cols-2 gap-3">
              <Input label="Email *" type="email" value={hForm.email} onChange={e => setHForm(f => ({ ...f, email: e.target.value }))} placeholder="h@example.com" />
              <Input label="Nom d'utilisateur *" value={hForm.username} onChange={e => setHForm(f => ({ ...f, username: e.target.value }))} placeholder="huissier_01" />
            </div>
          )}
          <Input label="Nom complet *" value={hForm.name} onChange={e => setHForm(f => ({ ...f, name: e.target.value }))} placeholder="Prénom Nom" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Téléphone" value={hForm.phone} onChange={e => setHForm(f => ({ ...f, phone: e.target.value }))} placeholder="+229..." />
            <Input label="NPI" value={hForm.npi} onChange={e => setHForm(f => ({ ...f, npi: e.target.value }))} placeholder="Numéro NPI" />
          </div>
          <Select
            label="Sous-zone *"
            value={hForm.subZone}
            onChange={e => setHForm(f => ({ ...f, subZone: e.target.value }))}
            options={subzones.map(s => ({ value: String(s.id), label: `${s.name} (${s.zone_name})` }))}
            placeholder="Sélectionner une sous-zone"
          />
          {hError && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{hError}</p>}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setHModal(false)} fullWidth>Annuler</Button>
            <Button onClick={handleSaveH} loading={hSaving} fullWidth>{editingH ? 'Enregistrer' : 'Créer'}</Button>
          </div>
        </div>
      </Modal>

      {/* Modal Advisor */}
      <Modal isOpen={aModal} onClose={() => setAModal(false)} title={editingA ? 'Modifier le conseiller' : 'Nouveau conseiller'}>
        <div className="space-y-4">
          {!editingA && (
            <div className="grid grid-cols-2 gap-3">
              <Input label="Email *" type="email" value={aForm.email} onChange={e => setAForm(f => ({ ...f, email: e.target.value }))} placeholder="c@example.com" />
              <Input label="Nom d'utilisateur *" value={aForm.username} onChange={e => setAForm(f => ({ ...f, username: e.target.value }))} placeholder="conseiller_01" />
            </div>
          )}
          <Input label="Nom complet *" value={aForm.name} onChange={e => setAForm(f => ({ ...f, name: e.target.value }))} placeholder="Prénom Nom" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Téléphone" value={aForm.phone} onChange={e => setAForm(f => ({ ...f, phone: e.target.value }))} placeholder="+229..." />
            <Input label="NPI" value={aForm.npi} onChange={e => setAForm(f => ({ ...f, npi: e.target.value }))} placeholder="Numéro NPI" />
          </div>
          <Select
            label="Sous-zone *"
            value={aForm.subZone}
            onChange={e => setAForm(f => ({ ...f, subZone: e.target.value }))}
            options={subzones.map(s => ({ value: String(s.id), label: `${s.name} (${s.zone_name})` }))}
            placeholder="Sélectionner une sous-zone"
          />
          {aError && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{aError}</p>}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setAModal(false)} fullWidth>Annuler</Button>
            <Button onClick={handleSaveA} loading={aSaving} fullWidth>{editingA ? 'Enregistrer' : 'Créer'}</Button>
          </div>
        </div>
      </Modal>

      {/* Modal suppression */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Confirmer la suppression">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Voulez-vous vraiment supprimer <span className="font-semibold text-gray-900 dark:text-white">{deleteTarget?.name}</span> ? Cette action est irréversible.
          </p>
          {deleteError && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{deleteError}</p>
          )}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setDeleteModal(false)} fullWidth>Annuler</Button>
            <Button onClick={handleDelete} loading={deleteLoading} fullWidth className="bg-red-500 hover:bg-red-600">Supprimer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}