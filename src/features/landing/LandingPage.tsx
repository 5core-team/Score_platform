import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Menu, X, TrendingUp, Mail, CreditCard, Globe, ChevronRight, Shield, CheckCircle, BarChart2, Users } from 'lucide-react';
import { useThemeContext } from '../../contexts/ThemeContext';

function Navbar() {
  const { theme, toggle } = useThemeContext();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-gray-900/95 shadow-sm backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="Afrika Risque" className="h-9 w-9 rounded-lg object-cover" />
            <div className="leading-none">
              <span className="font-bold text-cyan-500 text-base">AFRICA</span>
              <span className="font-bold text-coral-500 text-base text-[#FF5252] ml-1">RISQUE</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Fonctionnalités</a>
            <a href="#how" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Comment ça marche</a>
            <a href="#roles" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Rôles</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Connexion <ChevronRight size={14} />
            </Link>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-4 px-2 space-y-2">
            <a href="#features" className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">Fonctionnalités</a>
            <a href="#how" className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">Comment ça marche</a>
            <a href="#roles" className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">Rôles</a>
            <Link to="/login" className="block px-3 py-2 text-sm text-cyan-500 font-medium">Connexion</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-cyan-50/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      <div className="absolute top-32 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-red-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-xs font-semibold rounded-full mb-6 border border-cyan-200 dark:border-cyan-800">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
              Plateforme de gestion financière
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Restaurer la
              <span className="block text-cyan-500">Confiance</span>
              dans les Transactions
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
              Afrika Risque est la plateforme de référence pour le suivi de solvabilité, la validation sécurisée et la gestion des créances en Afrique Francophone.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5"
              >
                Commencer maintenant <ChevronRight size={18} />
              </Link>
              <a
                href="#how"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Comment ça marche
              </a>
            </div>
            <div className="mt-10 flex items-center gap-6">
              {[['5+', 'Pays actifs'], ['2K+', 'Dossiers traités'], ['99.8%', 'Disponibilité']].map(([val, label]) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{val}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tableau de Bord</p>
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">EN DIRECT</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Prêts en cours', val: '12,450,000 XOF', pct: 65 },
                    { label: 'Remboursements', val: '8,200,000 XOF', pct: 45 },
                    { label: 'Taux de recouvrement', val: '68.5%', pct: 68 },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{item.val}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">42</p>
                    <p className="text-xs text-gray-400">Pays</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-cyan-500">B+</p>
                    <p className="text-xs text-gray-400">Solvabilité</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-emerald-500">1.8x</p>
                    <p className="text-xs text-gray-400">Ratio</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-cyan-500 text-white rounded-xl px-4 py-2 shadow-lg text-sm font-medium">
                Validation sécurisée
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: <TrendingUp size={22} />,
    title: 'Suivi de Solvabilité',
    desc: 'Évaluez et suivez la solvabilité de vos clients en temps réel avec des indicateurs financiers précis.',
    color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20',
  },
  {
    icon: <Mail size={22} />,
    title: 'Validation par Lien Sécurisé',
    desc: 'Chaque consultation est validée via un lien email sécurisé garantissant la traçabilité légale.',
    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    icon: <CreditCard size={22} />,
    title: 'Suivi Créances & Remboursements',
    desc: 'Enregistrez et suivez tous les prêts, créances et remboursements avec un historique complet.',
    color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: <Globe size={22} />,
    title: 'Gestion Multi-niveaux',
    desc: 'Organisation hiérarchique par pays, zone et agence pour une gestion granulaire et scalable.',
    color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
  },
  {
    icon: <Shield size={22} />,
    title: 'Sécurité & Traçabilité',
    desc: 'Chiffrement de bout en bout et journaux d\'audit immuables pour une conformité totale.',
    color: 'text-red-500 bg-red-50 dark:bg-red-900/20',
  },
  {
    icon: <BarChart2 size={22} />,
    title: 'Rapports & Analyses',
    desc: 'Tableaux de bord analytiques avec indicateurs de performance pour chaque niveau hiérarchique.',
    color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
  },
];

function Features() {
  return (
    <section id="features" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-cyan-500 uppercase tracking-wider mb-3">Fonctionnalités</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            Tout ce dont vous avez besoin
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Une suite complète d'outils conçus pour les professionnels du secteur financier en Afrique.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div
              key={f.title}
              className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all hover:-translate-y-1 hover:shadow-md group"
            >
              <div className={`inline-flex p-3 rounded-xl ${f.color} mb-4`}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    num: '01',
    title: 'Créer les dossiers',
    desc: 'Les huissiers enregistrent les clients et créent les dossiers financiers avec toutes les informations nécessaires.',
    icon: <Users size={20} />,
  },
  {
    num: '02',
    title: 'Valider via lien sécurisé',
    desc: 'Le client reçoit un lien email sécurisé. La validation authentifie l\'accès au dossier de manière traçable.',
    icon: <Mail size={20} />,
  },
  {
    num: '03',
    title: 'Suivre l\'historique',
    desc: 'Consultez l\'historique complet des transactions, prêts et remboursements à tout moment.',
    icon: <BarChart2 size={20} />,
  },
];

function HowItWorks() {
  return (
    <section id="how" className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-cyan-500 uppercase tracking-wider mb-3">Processus</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Comment ça marche</h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Trois étapes simples pour une gestion financière sécurisée et efficace.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-cyan-200 via-cyan-400 to-cyan-200 dark:from-cyan-800 dark:via-cyan-600 dark:to-cyan-800" />
          {steps.map((step, i) => (
            <div key={step.num} className="relative text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-gray-900 border-2 border-cyan-400 text-cyan-500 mb-5 shadow-md mx-auto relative z-10">
                {step.icon}
              </div>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-cyan-500 text-white text-xs font-bold flex items-center justify-center z-20">
                {i + 1}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const roles = [
  {
    title: 'Administrateur',
    desc: 'Gestion globale des pays, représentants et configuration de la plateforme.',
    perms: ['Gérer les pays', 'Voir les statistiques globales', 'Gérer les abonnements'],
    color: 'border-t-cyan-500',
    badge: 'ADMIN',
    badgeColor: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  },
  {
    title: 'Représentant Pays',
    desc: 'Supervision des zones, gestion des utilisateurs front office, huissiers et conseillers.',
    perms: ['Créer des zones', 'Gérer le personnel', 'Bloquer / débloquer les utilisateurs'],
    color: 'border-t-blue-500',
    badge: 'PAYS',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    title: 'Front Office',
    desc: 'Création et gestion des huissiers et conseillers dans les zones assignées.',
    perms: ['Créer huissiers / conseillers', 'Assigner des zones', 'Gérer les accès'],
    color: 'border-t-emerald-500',
    badge: 'OFFICE',
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  {
    title: 'Huissier',
    desc: 'Enregistrement des clients, création de dossiers, consultation et saisie des transactions.',
    perms: ['Créer des clients', 'Consulter via code', 'Enregistrer prêts / remboursements'],
    color: 'border-t-amber-500',
    badge: 'HUISSIER',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  {
    title: 'Conseiller',
    desc: 'Consultation en lecture seule des dossiers clients validés par code de sécurité.',
    perms: ['Consulter les dossiers', 'Voir l\'historique', 'Mode lecture seule'],
    color: 'border-t-orange-500',
    badge: 'CONSEILLER',
    badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
];

function Roles() {
  return (
    <section id="roles" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-cyan-500 uppercase tracking-wider mb-3">Organisation</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Rôles & Accès</h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Une hiérarchie claire pour une gestion des droits optimale.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {roles.map(role => (
            <div key={role.title} className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 border-t-4 ${role.color} p-5 hover:shadow-md transition-shadow`}>
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-3 ${role.badgeColor}`}>
                {role.badge}
              </span>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{role.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{role.desc}</p>
              <ul className="space-y-1.5">
                {role.perms.map(p => (
                  <li key={p} className="flex items-start gap-1.5">
                    <CheckCircle size={13} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-600 dark:text-gray-300">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20 bg-gray-900 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-500/20 mb-6">
          <TrendingUp size={28} className="text-cyan-400" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Prêt à utiliser Afrika Risque ?
        </h2>
        <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
          Rejoignez les institutions financières africaines qui font confiance à notre plateforme pour gérer leurs créances.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/25 text-lg"
          >
            Commencer aujourd'hui <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.jpeg" alt="Afrika Risque" className="h-8 w-8 rounded-lg object-cover" />
              <div>
                <span className="font-bold text-cyan-400 text-sm">AFRICA</span>
                <span className="font-bold text-[#FF5252] text-sm ml-1">RISQUE</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              La plateforme de référence pour la gestion des créances et la vérification de solvabilité en Afrique Francophone.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Plateforme</h4>
            <ul className="space-y-2">
              {['Fonctionnalités', 'Comment ça marche', 'Sécurité', 'Documentation API'].map(l => (
                <li key={l}><a href="#" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Légal</h4>
            <ul className="space-y-2">
              {['Politique de confidentialité', 'Conditions d\'utilisation', 'Conformité', 'Mentions légales'].map(l => (
                <li key={l}><a href="#" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© 2024 Afrika Risque. Tous droits réservés.</p>
          <p className="text-xs text-gray-600">Protection des données — Sécurité renforcée</p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Roles />
      <CTA />
      <Footer />
    </div>
  );
}
