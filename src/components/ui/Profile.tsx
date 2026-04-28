import { useState, useEffect, useRef } from 'react';
import {
  User, Mail, Lock, Camera, Check, X, Eye, EyeOff,
  RefreshCw, Pencil, ShieldCheck, AlertCircle
} from 'lucide-react';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';

// ── Types ────────────────────────────────────────────────────────────
interface ProfileData {
  role: string;
  email: string;
  username: string;
  password_changed: boolean;
  photo: string | null;
  is_active: boolean;
}

// ── Small helpers ────────────────────────────────────────────────────
function Avatar({ photo, username, size = 96 }: { photo: string | null; username: string; size?: number }) {
  const initials = username
    .split(/[_\s-]/)
    .map(w => w[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');

  if (photo) {
    return (
      <img
        src={photo}
        alt={username}
        style={{ width: size, height: size }}
        className="rounded-2xl object-cover ring-2 ring-cyan-500/30"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center text-white font-bold text-2xl select-none"
    >
      {initials || <User size={32} />}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    admin:                  { label: 'Admin',               cls: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
    huissier:               { label: 'Huissier',            cls: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' },
    advisor:                { label: 'Conseiller',          cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
    country_representative: { label: 'Représentant Pays',  cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    front_office:           { label: 'Front Office',        cls: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  };
  const { label, cls } = map[role.toLowerCase()] ?? { label: role, cls: 'bg-gray-100 text-gray-600' };
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>{label}</span>;
}

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-300
      ${type === 'success'
        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800'
        : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800'
      }`}>
      {type === 'success' ? <Check size={15} /> : <AlertCircle size={15} />}
      {message}
    </div>
  );
}

// ── Section card ─────────────────────────────────────────────────────
function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/60 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <span className="text-cyan-500">{icon}</span>
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────
export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Username edit
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);

  // Password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSent, setPasswordSent] = useState(false);

  // Photo
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoLoading, setPhotoLoading] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await Axios({ ...SummaryApi.get_profile });
      setProfile(res.data);
      setNewUsername(res.data.username);
    } catch {
      showToast('Impossible de charger le profil.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  // ── Handlers ──────────────────────────────────────────────────────

  const handleUsernameSubmit = async () => {
    if (!newUsername.trim() || newUsername === profile?.username) {
      setEditingUsername(false);
      return;
    }
    setUsernameLoading(true);
    try {
      const res = await Axios({ ...SummaryApi.update_username, data: { username: newUsername } });
      setProfile(prev => prev ? { ...prev, username: res.data.username } : prev);
      showToast("Nom d'utilisateur mis à jour.", 'success');
      setEditingUsername(false);
    } catch {
      showToast("Erreur lors de la mise à jour.", 'error');
    } finally {
      setUsernameLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      showToast('Les mots de passe ne correspondent pas.', 'error');
      return;
    }
    setPasswordLoading(true);
    try {
      await Axios({ ...SummaryApi.change_password, data: { new_password: newPassword, confirm_password: confirmPassword } });
      setPasswordSent(true);
      setNewPassword('');
      setConfirmPassword('');
      showToast('Email de confirmation envoyé.', 'success');
    } catch {
      showToast('Erreur lors du changement de mot de passe.', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoLoading(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const res = await Axios({ ...SummaryApi.upload_photo, data: formData, headers: { 'Content-Type': 'multipart/form-data' } });
      setProfile(prev => prev ? { ...prev, photo: res.data.photo } : prev);
      showToast('Photo mise à jour.', 'success');
    } catch {
      showToast('Erreur lors du téléchargement.', 'error');
    } finally {
      setPhotoLoading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  // ── Loading ────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!profile) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <p className="text-sm text-red-500">Impossible de charger le profil.</p>
      <button onClick={fetchProfile} className="flex items-center gap-2 text-sm text-cyan-500 hover:underline">
        <RefreshCw size={14} /> Réessayer
      </button>
    </div>
  );

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const passwordMismatch = newPassword && confirmPassword && newPassword !== confirmPassword;

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mon Profil</h2>
        <button onClick={fetchProfile} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-cyan-500 transition-colors">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Identity card */}
      <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/60 p-5 flex items-center gap-5">
        {/* Avatar + upload */}
        <div className="relative shrink-0">
          <Avatar photo={profile.photo} username={profile.username} size={80} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={photoLoading}
            className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center shadow-md transition-colors disabled:opacity-60"
          >
            {photoLoading
              ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Camera size={13} />
            }
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-900 dark:text-white text-lg truncate">{profile.username}</span>
            <RoleBadge role={profile.role} />
            {profile.is_active && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Actif
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">{profile.email}</p>
        </div>
      </div>

      {/* Username */}
      <Section title="Nom d'utilisateur" icon={<User size={16} />}>
        {editingUsername ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleUsernameSubmit(); if (e.key === 'Escape') setEditingUsername(false); }}
              autoFocus
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={handleUsernameSubmit}
              disabled={usernameLoading}
              className="w-9 h-9 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center transition-colors disabled:opacity-60"
            >
              {usernameLoading
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Check size={15} />
              }
            </button>
            <button
              onClick={() => { setEditingUsername(false); setNewUsername(profile.username); }}
              className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 flex items-center justify-center transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900 dark:text-white">{profile.username}</span>
            <button
              onClick={() => setEditingUsername(true)}
              className="flex items-center gap-1.5 text-xs text-cyan-500 hover:text-cyan-600 font-medium transition-colors"
            >
              <Pencil size={13} /> Modifier
            </button>
          </div>
        )}
      </Section>

      {/* Email (read-only) */}
      <Section title="Adresse email" icon={<Mail size={16} />}>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-900 dark:text-white flex-1">{profile.email}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">Non modifiable</span>
        </div>
      </Section>

      {/* Password */}
      <Section title="Mot de passe" icon={<Lock size={16} />}>
        {passwordSent ? (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck size={18} className="text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Email de confirmation envoyé</p>
              <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                Votre ancien mot de passe reste actif jusqu'à confirmation via le lien reçu par email.
              </p>
              <button
                onClick={() => setPasswordSent(false)}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline mt-2 font-medium"
              >
                Modifier à nouveau
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* New password */}
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Nouveau mot de passe</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 pr-10 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm */}
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Confirmer le mot de passe</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2 pr-10 rounded-xl border bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 placeholder-gray-400
                    ${passwordMismatch
                      ? 'border-red-400 focus:ring-red-400'
                      : passwordsMatch
                        ? 'border-emerald-400 focus:ring-emerald-400'
                        : 'border-gray-200 dark:border-gray-600 focus:ring-cyan-500'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {passwordMismatch && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={11} /> Les mots de passe ne correspondent pas.
                </p>
              )}
            </div>

            <button
              onClick={handlePasswordSubmit}
              disabled={passwordLoading || !newPassword || !confirmPassword || !!passwordMismatch}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {passwordLoading
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Envoi en cours…</>
                : <><Lock size={14} /> Changer le mot de passe</>
              }
            </button>
          </div>
        )}
      </Section>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}