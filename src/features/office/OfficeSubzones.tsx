import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';

interface BackendSubzone {
  id: number;
  name: string;
  zone_name: string;
  country_name: string;
}

export default function OfficeSubzones() {
  const [subzones, setSubzones] = useState<BackendSubzone[]>([]);
  const [zoneName, setZoneName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal création / édition
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BackendSubzone | null>(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Modal suppression
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState<BackendSubzone | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [subzonesRes, dashRes] = await Promise.all([
        Axios({ ...SummaryApi.get_subzones }),
        Axios({ ...SummaryApi.front_office_dashboard }),
      ]);
      setSubzones(subzonesRes.data);
      setZoneName(dashRes.data.front_office.zone.name); // juste pour l'affichage
    } catch {
      setError('Impossible de charger les sous-zones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ── Création / Édition ──────────────────────────────────────────
  const openCreate = () => {
    setEditing(null);
    setName('');
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (s: BackendSubzone) => {
    setEditing(s);
    setName(s.name);
    setFormError('');
    setModalOpen(true);
  };
  
  const handleSave = async () => {
    if (!name.trim()) { setFormError('Le nom est requis.'); return; }
    setSaving(true);
    setFormError('');
    try {
      if (editing) {
        const res = await Axios({
          ...SummaryApi.update_partial_subzone,
          url: SummaryApi.update_partial_subzone.url.replace('{id}', String(editing.id)),
          data: { name: name.trim() },
        });
        setSubzones(prev => prev.map(s => s.id === editing.id ? res.data : s));
      } else {
        const res = await Axios({
          ...SummaryApi.create_subzone,
          data: { name: name.trim() }, // ← plus de zone: zoneId
        });
        setSubzones(prev => [...prev, res.data]);
      }
      setModalOpen(false);
    } catch (err: any) {
      const data = err?.response?.data;
      if (!data) {
        setFormError('Impossible de contacter le serveur.');
      } else if (data.detail) {
        setFormError(String(data.detail));
      } else if (data.error) {
        setFormError(String(data.error));
      } else if (data.non_field_errors) {
        const v = data.non_field_errors;
        setFormError(Array.isArray(v) ? v[0] : String(v));
      } else if (typeof data === 'object' && Object.keys(data).length > 0) {
        const firstVal = data[Object.keys(data)[0]];
        setFormError(Array.isArray(firstVal) ? firstVal[0] : String(firstVal));
      } else {
        setFormError('Une erreur est survenue.');
      }
    } finally {
      setSaving(false);
    }
  };

  // ── Suppression ─────────────────────────────────────────────────
  const openDelete = (s: BackendSubzone) => { setDeleting(s); setDeleteError(''); setDeleteModal(true); };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await Axios({
        ...SummaryApi.delete_subzone,
        url: SummaryApi.delete_subzone.url.replace('{id}', String(deleting.id)),
      });
      setSubzones(prev => prev.filter(s => s.id !== deleting.id));
      setDeleteModal(false);
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.detail) setDeleteError(String(data.detail));
      else if (data?.error) setDeleteError(String(data.error));
      else if (typeof data === 'object' && Object.keys(data).length > 0) {
        const firstVal = data[Object.keys(data)[0]];
        setDeleteError(Array.isArray(firstVal) ? firstVal[0] : String(firstVal));
      } else {
        setDeleteError('La suppression a échoué. Veuillez réessayer.');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Rendu ────────────────────────────────────────────────────────
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sous-zones</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subzones.length} sous-zone{subzones.length > 1 ? 's' : ''} · Zone {zoneName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-cyan-500 transition-colors"
          >
            <RefreshCw size={16} />
          </button>
          <Button size="sm" onClick={openCreate}>
            <Plus size={16} /> Nouvelle sous-zone
          </Button>
        </div>
      </div>

      <Card padding={false}>
        <Table
          columns={[
            {
              key: 'name', header: 'Sous-zone',
              render: s => <span className="font-medium text-gray-900 dark:text-white">{s.name}</span>
            },
            {
              key: 'zone_name', header: 'Zone',
              render: s => <span className="text-gray-500 dark:text-gray-400">{s.zone_name}</span>
            },
            {
              key: 'country_name', header: 'Pays',
              render: s => <span className="text-gray-500 dark:text-gray-400">{s.country_name}</span>
            },
            {
              key: 'actions', header: '',
              render: s => (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(s)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-cyan-600 transition-colors"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => openDelete(s)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )
            },
          ]}
          data={subzones}
          keyExtractor={s => String(s.id)}
          emptyMessage="Aucune sous-zone créée pour le moment"
        />
      </Card>

      {/* Modal création / édition */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier la sous-zone' : 'Créer une sous-zone'}
      >
        <div className="space-y-4">
          <Input
            label="Nom de la sous-zone"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="ex: Akpakpa"
            autoFocus
          />
          {formError && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{formError}</p>
          )}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)} fullWidth>Annuler</Button>
            <Button onClick={handleSave} loading={saving} fullWidth>
              {editing ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal suppression */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Supprimer la sous-zone"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Voulez-vous vraiment supprimer{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{deleting?.name}</span> ?
            Cette action est irréversible.
          </p>
          {deleteError && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{deleteError}</p>
          )}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setDeleteModal(false)} fullWidth>Annuler</Button>
            <Button onClick={handleDelete} loading={deleteLoading} fullWidth className="bg-red-500 hover:bg-red-600">
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
