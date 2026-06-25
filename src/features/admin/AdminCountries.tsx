import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, RefreshCw, CalendarClock, RotateCcw } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';

// Types backend
interface BackendCountry {
  id: number;
  name: string;
  iso_code: string;
  phone_code: string | null;
  licence_status: boolean;
  has_valid_subscription: boolean;
}

interface Subscription {
  country: string;
  is_active: boolean;
  is_blocked: boolean;
  starts_at: string;
  expires_in: string;
  created_at: string;
}

type FormData = {
  name: string;
  iso_code: string;
  phone_code: string;
  email: string;
  username: string;
};

const emptyForm: FormData = { name: '', iso_code: '', phone_code: '', email: '', username: '' };

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

export default function AdminCountries() {
  const [countries, setCountries] = useState<BackendCountry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal création / édition
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BackendCountry | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Modal abonnement
  const [subModal, setSubModal] = useState(false);
  const [subCountry, setSubCountry] = useState<BackendCountry | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subLoading, setSubLoading] = useState(false);
  const [subAction, setSubAction] = useState(false);

  // Modal suppression
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState<BackendCountry | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Erreur modal abonnement
  const [subError, setSubError] = useState('');

  const fetchCountries = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await Axios({ ...SummaryApi.get_countries });
      setCountries(res.data);
    } catch {
      setError('Impossible de charger les pays.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCountries(); }, []);

  // ── Création / Édition ──────────────────────────────────────────────
  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (c: BackendCountry) => {
    setEditing(c);
    setForm({ name: c.name, iso_code: c.iso_code, phone_code: c.phone_code ?? '', email: '', username: '' });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.iso_code) { 
      setFormError('Nom et code ISO sont requis.'); 
      return; 
    }
    
    setSaving(true);
    setFormError('');

    try {
      if (editing) {
        const res = await Axios({
          ...SummaryApi.update_country,
          url: SummaryApi.update_country.url.replace('{id}', String(editing.id)),
          data: form,
        });
        setCountries(prev => prev.map(c => c.id === editing.id ? res.data : c));
      } else {
        const res = await Axios({ ...SummaryApi.create_country, data: form });
        setCountries(prev => [...prev, res.data]);
      }
      setModalOpen(false);
    } catch (err: any) {
      // --- LOGIQUE D'AFFICHAGE DES ERREURS DU BACKEND ---
      const responseData = err.response?.data;
      
      if (responseData) {
        // Si le backend renvoie un objet d'erreurs par champ (ex: { phone_code: ["..."] })
        if (typeof responseData === 'object' && !responseData.detail) {
          const errorMessages = Object.entries(responseData)
            .map(([field, messages]) => {
              const msg = Array.isArray(messages) ? messages.join(', ') : messages;
              return `${field} : ${msg}`;
            })
            .join(' | ');
          setFormError(errorMessages);
        } 
        // Si le backend renvoie un message "detail" direct
        else {
          setFormError(responseData.detail || "Une erreur est survenue.");
        }
      } else {
        setFormError("Impossible de contacter le serveur.");
      }
      
      // On garde le log en console pour le debug technique
      console.error("Détail de l'erreur API:", responseData);
      
    } finally {
      setSaving(false);
    }
  };

  // ── Suppression ─────────────────────────────────────────────────────
  const openDelete = (c: BackendCountry) => { setDeleting(c); setDeleteError(''); setDeleteModal(true); };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await Axios({
        ...SummaryApi.delete_country,
        url: SummaryApi.delete_country.url.replace('{id}', String(deleting.id)),
      });
      setCountries(prev => prev.filter(c => c.id !== deleting.id));
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

  // ── Abonnement ──────────────────────────────────────────────────────
  const openSubscription = async (c: BackendCountry) => {
    setSubCountry(c);
    setSubscription(null);
    setSubError('');
    setSubModal(true);
    setSubLoading(true);
    try {
      const res = await Axios({
        ...SummaryApi.get_country_subscription,
        url: SummaryApi.get_country_subscription.url.replace('{country_id}', String(c.id)),
      });
      setSubscription(res.data);
    } catch {
      setSubscription(null);
    } finally {
      setSubLoading(false);
    }
  };

  const handleCreateSub = async () => {
    if (!subCountry) return;
    setSubAction(true);
    try {
      await Axios({
        ...SummaryApi.create_country_subscription,
        url: SummaryApi.create_country_subscription.url.replace('{country_id}', String(subCountry.id)),
      });
      await openSubscription(subCountry);
      // Rafraîchir le statut dans la liste
      setCountries(prev => prev.map(c => c.id === subCountry.id ? { ...c, has_valid_subscription: true } : c));
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.detail) setSubError(String(data.detail));
      else if (data?.error) setSubError(String(data.error));
      else setSubError("La création de l'abonnement a échoué.");
    } finally { setSubAction(false); }
  };

  const handleRenewSub = async () => {
    if (!subCountry) return;
    setSubAction(true);
    setSubError('');
    try {
      await Axios({
        ...SummaryApi.renew_country_subscription,
        url: SummaryApi.renew_country_subscription.url.replace('{country_id}', String(subCountry.id)),
      });
      await openSubscription(subCountry);
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.detail) setSubError(String(data.detail));
      else if (data?.error) setSubError(String(data.error));
      else setSubError('Le renouvellement a échoué.');
    } finally { setSubAction(false); }
  };

  // ── Rendu ───────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <p className="text-sm text-red-500">{error}</p>
      <button onClick={fetchCountries} className="flex items-center gap-2 text-sm text-cyan-500 hover:underline">
        <RefreshCw size={14} /> Réessayer
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pays</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{countries.length} pays enregistrés</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchCountries} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-cyan-500 transition-colors">
            <RefreshCw size={16} />
          </button>
          <Button onClick={openCreate} size="sm">
            <Plus size={16} /> Nouveau pays
          </Button>
        </div>
      </div>

      <Card padding={false}>
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
              key: 'licence_status', header: 'Statut',
              render: c => (
                <Badge variant={c.licence_status ? 'success' : 'neutral'}>
                  {c.licence_status ? 'Actif' : 'Inactif'}
                </Badge>
              )
            },
            {
              key: 'has_valid_subscription', header: 'Abonnement',
              render: c => (
                <button onClick={() => openSubscription(c)} className="flex items-center gap-1 group">
                  <Badge variant={c.has_valid_subscription ? 'success' : 'warning'}>
                    {c.has_valid_subscription ? 'Valide' : 'Expiré'}
                  </Badge>
                  <CalendarClock size={13} className="text-gray-300 group-hover:text-cyan-500 transition-colors" />
                </button>
              )
            },
            {
              key: 'actions', header: '',
              render: c => (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(c)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-cyan-600 transition-colors"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => openDelete(c)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )
            },
          ]}
          data={countries}
          keyExtractor={c => String(c.id)}
        />
      </Card>

      {/* ── Modal création / édition ── */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier le pays' : 'Nouveau pays'}>
        <div className="space-y-4">
          <Input label="Nom du pays *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="ex: Sénégal" />
          <Input label="Code ISO *" value={form.iso_code} onChange={e => setForm(f => ({ ...f, iso_code: e.target.value }))} placeholder="ex: SN" />
          <Input label="Indicatif & téléphone" value={form.phone_code} onChange={e => setForm(f => ({ ...f, phone_code: e.target.value }))} placeholder="ex: +221" maxLength={10}/>
          <Input label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="pays@afrikarisque.com" />
          <Input label="Nom d'utilisateur" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="ex: senegal_rep" />

          {formError && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{formError}</p>
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)} fullWidth>Annuler</Button>
            <Button onClick={handleSave} loading={saving} fullWidth>{editing ? 'Enregistrer' : 'Créer'}</Button>
          </div>
        </div>
      </Modal>

      {/* ── Modal suppression ── */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Supprimer le pays">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Voulez-vous vraiment supprimer <span className="font-semibold text-gray-900 dark:text-white">{deleting?.name}</span> ? Cette action est irréversible.
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

      {/* ── Modal abonnement ── */}
      <Modal isOpen={subModal} onClose={() => setSubModal(false)} title={`Abonnement — ${subCountry?.name}`}>
        <div className="space-y-4">
          {subLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : subscription ? (
            <>
              <div className="flex items-center gap-2">
                <Badge variant={subscription.is_active ? 'success' : 'warning'}>
                  {subscription.is_active ? 'Actif' : 'Inactif'}
                </Badge>
                {subscription.is_blocked && <Badge variant="danger">Bloqué</Badge>}
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Début', val: formatDate(subscription.starts_at) },
                  { label: 'Expiration', val: formatDate(subscription.expires_in) },
                  { label: 'Créé le', val: formatDate(subscription.created_at) },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3 flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{item.val}</span>
                  </div>
                ))}
              </div>
              <Button onClick={handleRenewSub} loading={subAction} fullWidth>
                <RotateCcw size={15} /> Renouveler l'abonnement
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500 dark:text-gray-400">Aucun abonnement actif pour ce pays.</p>
              {subError && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{subError}</p>
              )}
              <Button onClick={handleCreateSub} loading={subAction} fullWidth>
                <Plus size={15} /> Créer l'abonnement
              </Button>
            </>
          )}
          {subError && subscription && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{subError}</p>
          )}
        </div>
      </Modal>
    </div>
  );
}