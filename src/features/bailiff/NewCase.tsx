import { useState } from 'react';
import { UserPlus, CheckCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';

// ── Types backend ────────────────────────────────────────────────────
interface CreatedCustomer {
  uuid: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  npi: string;
  phone_number: string;
  credit_score: number;
  created_at: string;
}

interface FormState {
  first_name: string;
  last_name: string;
  email: string;
  npi: string;
  phone_number: string;
}

export default function NewCase() {
  const [form, setForm] = useState<FormState>({
    first_name: '',
    last_name: '',
    email: '',
    npi: '',
    phone_number: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<FormState>>({});
  const [createdCustomer, setCreatedCustomer] = useState<CreatedCustomer | null>(null);

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setFieldErrors(fe => ({ ...fe, [field]: '' }));
    setError('');
  };

  const validate = (): boolean => {
    const errors: Partial<FormState> = {};
    if (!form.first_name.trim()) errors.first_name = 'Champ requis';
    if (!form.last_name.trim()) errors.last_name = 'Champ requis';
    if (!form.email.trim()) errors.email = 'Champ requis';
    if (!form.npi.trim()) errors.npi = 'Champ requis';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    try {
      const res = await Axios({
        ...SummaryApi.create_customer,
        data: {
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: form.email.trim(),
          npi: form.npi.trim(),
          phone_number: form.phone_number.trim() || undefined,
        },
      });
      setCreatedCustomer(res.data);
    } catch (err: unknown) {
      // Gestion des erreurs de validation backend (400)
      const axiosErr = err as { response?: { data?: Record<string, string[]>; status?: number } };
      if (axiosErr?.response?.status === 400 && axiosErr.response.data) {
        const data = axiosErr.response.data;
        const backendErrors: Partial<FormState> = {};
        if (data.first_name) backendErrors.first_name = data.first_name[0];
        if (data.last_name) backendErrors.last_name = data.last_name[0];
        if (data.email) backendErrors.email = data.email[0];
        if (data.npi) backendErrors.npi = data.npi[0];
        if (data.phone_number) backendErrors.phone_number = data.phone_number[0];
        setFieldErrors(backendErrors);
        if (data.non_field_errors) setError(data.non_field_errors[0]);
      } else if (axiosErr?.response?.status === 403) {
        setError('Permission refusée. Seuls les huissiers peuvent créer des clients.');
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ first_name: '', last_name: '', email: '', npi: '', phone_number: '' });
    setFieldErrors({});
    setError('');
    setCreatedCustomer(null);
  };

  // ── Écran succès ─────────────────────────────────────────────────
  if (createdCustomer) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
              <CheckCircle size={32} className="text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Dossier créé avec succès</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Le client{' '}
              <span className="font-medium text-gray-800 dark:text-gray-200">{createdCustomer.full_name}</span>{' '}
              a été enregistré.
            </p>

            {/* Récap client */}
            <div className="text-left bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2 mb-5">
              {[
                { label: 'NPI', val: createdCustomer.npi },
                { label: 'Email', val: createdCustomer.email },
                { label: 'Téléphone', val: createdCustomer.phone_number || '—' },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{row.label}</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{row.val}</span>
                </div>
              ))}
            </div>

            <Button variant="secondary" fullWidth onClick={handleReset}>
              Nouveau dossier
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ── Formulaire ───────────────────────────────────────────────────
  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nouveau Dossier Client</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Enregistrer un nouveau client dans le système</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-700">
            <UserPlus size={18} className="text-cyan-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Informations du client</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Prénom *"
              value={form.first_name}
              onChange={set('first_name')}
              placeholder="Prénom"
              error={fieldErrors.first_name}
            />
            <Input
              label="Nom *"
              value={form.last_name}
              onChange={set('last_name')}
              placeholder="Nom"
              error={fieldErrors.last_name}
            />
          </div>

          <Input
            label="Adresse email *"
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="client@email.com"
            error={fieldErrors.email}
          />

          <Input
            label="NPI *"
            value={form.npi}
            onChange={set('npi')}
            placeholder="Numéro Personnel d'Identification"
            error={fieldErrors.npi}
          />

          <Input
            label="Téléphone"
            type="tel"
            value={form.phone_number}
            onChange={set('phone_number')}
            placeholder="+229 00 00 00 00"
            error={fieldErrors.phone_number}
          />

          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>
          )}

          <Button type="submit" fullWidth loading={loading} size="lg">
            Créer le dossier
          </Button>
        </form>
      </Card>
    </div>
  );
}