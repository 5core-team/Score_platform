import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Eye, Users, Lock, FileText,
  ArrowRight, Menu, X, Phone, Mail,
  MapPin, CheckCircle, AlertCircle
} from 'lucide-react';
import SEO from '../../../SEO.tsx';

/* ─── GLOBAL STYLES ─── */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

  :root {
    --navy: #04111e;
    --navy-mid: #0a2035;
    --navy-soft: #0d2942;
    --slate: #1e3a4f;
    --cyan: #00b4c8;
    --cyan-dim: #008fa0;
    --cyan-faint: rgba(0,180,200,0.10);
    --white: #ffffff;
    --off-white: #f3f5f7;
    --muted: #8fa4b5;
    --text-body: #2e4558;
    --text-dark: #061623;
    --border: #dce4ea;
    --border-dark: rgba(255,255,255,0.09);
    --red-accent: #c73030;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'IBM Plex Sans', sans-serif; color: var(--text-dark); -webkit-font-smoothing: antialiased; background: var(--white); }
  a { text-decoration: none; color: inherit; }

  .serif { font-family: 'Libre Baskerville', serif; }
  .mono { font-family: 'IBM Plex Mono', monospace; }

  .label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px; font-weight: 500; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--cyan);
  }

  .nav-link {
    font-size: 13px; font-weight: 500; color: #3d5468;
    letter-spacing: 0.02em; transition: color .2s;
    font-family: 'IBM Plex Sans', sans-serif;
  }
  .nav-link:hover { color: var(--cyan-dim); }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 26px; background: var(--cyan); color: #fff;
    font-size: 13px; font-weight: 600; border-radius: 3px;
    border: none; cursor: pointer; transition: background .2s, transform .15s;
    font-family: 'IBM Plex Sans', sans-serif; letter-spacing: 0.04em;
  }
  .btn-primary:hover { background: var(--cyan-dim); transform: translateY(-1px); }

  .btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 26px; border: 1.5px solid rgba(255,255,255,0.22); color: rgba(255,255,255,0.85);
    font-size: 13px; font-weight: 500; border-radius: 3px;
    background: transparent; cursor: pointer; transition: border-color .2s, color .2s;
    font-family: 'IBM Plex Sans', sans-serif; letter-spacing: 0.04em;
  }
  .btn-outline:hover { border-color: rgba(255,255,255,0.5); color: #fff; }

  .divider-line {
    width: 32px; height: 2px; background: var(--cyan); display: block; margin-bottom: 20px;
  }

  /* Role rows */
  .role-row {
    display: flex; align-items: center; gap: 20px;
    padding: 18px 22px; background: #fff; border: 1px solid var(--border);
    border-left: 3px solid transparent; transition: border-left-color .2s, box-shadow .2s;
  }
  .role-row:hover { border-left-color: var(--cyan); box-shadow: 0 2px 14px rgba(0,0,0,0.05); }

  /* Security cards */
  .sec-card {
    background: rgba(255,255,255,0.04); border: 1px solid var(--border-dark);
    padding: 32px 26px; transition: border-color .25s;
    border-top: 2px solid transparent;
  }
  .sec-card:hover { border-top-color: var(--cyan); border-color: rgba(0,180,200,0.2); }

  /* Feature items */
  .feat-item {
    padding: 28px 0; border-bottom: 1px solid var(--border);
    display: grid; grid-template-columns: 40px 1fr; gap: 20px; align-items: start;
    transition: background .2s;
  }
  .feat-item:last-child { border-bottom: none; }

  input, select, textarea {
    width: 100%; padding: 11px 14px; border-radius: 2px;
    border: 1px solid #cdd6de; background: #fff;
    font-size: 13.5px; color: #1f2937; font-family: 'IBM Plex Sans', sans-serif;
    transition: border-color .2s; outline: none;
  }
  input:focus, select:focus, textarea:focus { border-color: var(--cyan); }
  input::placeholder, textarea::placeholder { color: #9ca3af; }

  /* Step connector */
  .step-connector { position: absolute; left: 19px; top: 44px; bottom: 0; width: 1px; background: #d0dae2; }

  @media (min-width: 992px) {
    .desktop-nav { display: flex !important; }
    .desktop-cta { display: inline-flex !important; }
    .mobile-btn { display: none !important; }
    .hero-inner { grid-template-columns: 1fr 1fr !important; }
    .sol-grid { grid-template-columns: 5fr 4fr !important; }
    .gov-grid { grid-template-columns: 4fr 5fr !important; }
    .cta-grid { grid-template-columns: 1fr 1fr !important; }
    .foot-grid { grid-template-columns: 2fr 1fr 1fr !important; }
    .feat-cols { columns: 2 !important; column-gap: 0 !important; }
    .sec-grid { grid-template-columns: repeat(3, 1fr) !important; }
    .stat-row { gap: 56px !important; }
  }

  @media (max-width: 640px) {
    .hero-pad { padding: 110px 20px 64px !important; }
    .stat-num { font-size: 30px !important; }
  }
`;

/* ─── NAVBAR ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const links = [
    { label: 'Solution', href: '#solution' },
    { label: 'Gouvernance', href: '#gouvernance' },
    { label: 'Sécurité', href: '#securite' },
    { label: 'Fonctionnement', href: '#fonctionnement' },
  ];

  return (
    <>
      <style>{G}</style>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? '#fff' : '#fff',
        borderBottom: '1px solid #e4ecf1',
        boxShadow: scrolled ? '0 1px 12px rgba(4,17,30,0.08)' : 'none',
        transition: 'box-shadow .3s',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

          {/* Logo */}
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img 
              src="/logo.jpeg" 
              alt="AfricaRisque Logo" 
              style={{ height: 32, width: 'auto', objectFit: 'contain', borderRadius: 4 }} 
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <span style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 700, fontSize: 15, color: 'var(--navy)', letterSpacing: '-0.01em', lineHeight: 1.1 }}>Africa<span style={{ color: 'var(--red-accent)' }}>Risque</span></span>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="desktop-nav" style={{ display: 'none', alignItems: 'center', gap: 40 }}>
            {links.map(l => <a key={l.label} href={l.href} className="nav-link">{l.label}</a>)}
          </div>

          <a href="#contact" className="desktop-cta btn-primary" style={{ display: 'none', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Contacter
          </a>

          <button className="mobile-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, background: 'none', border: 'none', cursor: 'pointer' }}>
            {menuOpen ? <X size={22} color="#1f2937" /> : <Menu size={22} color="#1f2937" />}
          </button>
        </div>

        {menuOpen && (
          <div style={{ position: 'fixed', top: 68, left: 0, right: 0, bottom: 0, background: '#fff', padding: '36px 28px', display: 'flex', flexDirection: 'column', gap: 24, zIndex: 99 }}>
            {links.map(l => (
              <a key={l.label} href={l.href} style={{ fontSize: 17, fontWeight: 600, color: '#1f2937', borderBottom: '1px solid #eef2f5', paddingBottom: 18 }} onClick={() => setMenuOpen(false)}>{l.label}</a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)} style={{ marginTop: 8, padding: '15px 24px', background: 'var(--cyan)', color: '#fff', textAlign: 'center', borderRadius: 3, fontWeight: 600, fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Contacter
            </a>
          </div>
        )}
      </nav>
    </>
  );
}

/* ─── HERO ─── */
function Hero() {
  return (
    <section style={{ position: 'relative', minHeight: '100vh', background: 'var(--navy)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      {/* Photo */}
      <img
        src="/hero_section_image.jpeg"
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }}
      />
      {/* Structured overlays */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, #04111e 44%, rgba(4,17,30,0.72) 68%, rgba(4,17,30,0.38) 100%)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 180, background: 'linear-gradient(to top, #04111e, transparent)' }} />
      {/* Vertical rule — decorative */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: 'rgba(255,255,255,0.03)', display: 'none' }} />

      <div className="hero-pad" style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '148px 32px 96px', width: '100%' }}>

        {/* Access notice */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,180,200,0.1)', border: '1px solid rgba(0,180,200,0.2)', borderRadius: 2, padding: '6px 14px', marginBottom: 36 }}>
          <Lock size={11} style={{ color: 'var(--cyan)' }} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: 'var(--cyan)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Plateforme sécurisé d’évaluation de risques</span>
        </div>

        <div style={{ maxWidth: 640 }}>
          <h1 style={{
            fontFamily: "'Libre Baskerville', serif",
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: 700, color: '#fff', lineHeight: 1.14, marginBottom: 30,
            letterSpacing: '-0.01em'
          }}>
            Fait confiance<br />même à l'informel.
          </h1>


          <p style={{ fontSize: 16, color: 'rgba(200,215,225,0.88)', lineHeight: 1.85, maxWidth: 500, marginBottom: 44, fontWeight: 300 }}>
            AfricaRisque est une solution conçue pour faciliter l'accès aux informations crédibles du secteur informel, de manière à contribuer à une analyse qualitative de risques.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/login" className="btn-primary">
              Commencer maintenant <ArrowRight size={14} />
            </Link>
                  
            <a href="#fonctionnement" className="btn-outline">
              Découvrir le fonctionnement
            </a>
          </div>
        </div>

        {/* Stats — ruled */}
        <div style={{ marginTop: 88, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="stat-row" style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
            {[
              { n: '5+', label: 'Pays couverts' },
              { n: '38', label: 'Institutions partenaires' },
              { n: '124', label: 'Agents assermentés' },
              { n: '2 000+', label: 'Dossiers enregistrés' },
            ].map((s, i) => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span className="stat-num" style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 36, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{s.n}</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── TRUST BAND ─── */
const TRUST_LOGOS = [
  { name: 'Banque Atlantique', img: '/banque-atlantique.png' },
  { name: 'Orabank',           img: '/orabank.jpg' },
  { name: 'BCEAO',             img: '/bceao.png' },
  { name: 'Coris Bank',        img: '/coris_bank.png' },
  { name: 'NSIA Banque',       img: '/nsia.png' },
  { name: 'BOA',               img: '/boa.png' },
  { name: 'Ecobank',           img: '/ecobank.png' },
  { name: 'UBA',               img: '/uba.png' },
];

const trustBandCSS = `
  .tb-track {
    display: flex;
    align-items: center;
    animation: tb-scroll 18s linear infinite;
    white-space: nowrap;
  }
  .tb-track:hover { animation-play-state: paused; }
  @keyframes tb-scroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .tb-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.18em;
    color: #9aacb8;
    text-transform: uppercase;
    white-space: nowrap;
    flex-shrink: 0;
    padding: 0 32px;
  }
  @media (max-width: 640px) {
    .tb-label { display: none; }
  }
`;

function TrustBand() {
  const items = [...TRUST_LOGOS, ...TRUST_LOGOS];

  return (
    <div style={{ background: '#ffffff', borderBottom: '1px solid #dce4ea', padding: '18px 0', overflow: 'hidden' }}>
      <style>{trustBandCSS}</style>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>

        {/* Label fixe à gauche — caché sur mobile via CSS */}
        <span className="tb-label">Institutions partenaires</span>

        {/* Zone de défilement */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 80,
            background: 'linear-gradient(to right, #f0f4f7, transparent)',
            zIndex: 2, pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: 80,
            background: 'linear-gradient(to left, #f0f4f7, transparent)',
            zIndex: 2, pointerEvents: 'none',
          }} />

          <div className="tb-track">
            {items.map((logo, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 36px', flexShrink: 0 }}>
                <img
                  src={logo.img}
                  alt={logo.name}
                  style={{ height: 22, width: 'auto', objectFit: 'contain', opacity: 1 }}
                  onError={e => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                    const fallback = img.nextSibling as HTMLElement | null;
                    if (fallback) fallback.style.display = 'inline';
                  }}
                />
                <span style={{ display: 'none', fontSize: 12, fontWeight: 600, color: '#5a7282', letterSpacing: '0.04em' }}>
                  {logo.name}
                </span>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#c5d3dc', display: 'inline-block', flexShrink: 0, marginLeft: 12 }} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SOLUTION ─── */
function Solution() {
  return (
    <section id="solution" style={{ padding: '100px 32px', background: '#fff' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="sol-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 72, alignItems: 'center' }}>
          <div>
            <span className="label" style={{ display: 'block', marginBottom: 16 }}>Notre solution</span>
            <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.18, marginBottom: 24 }}>
              Infrastructure sécurisée d'évaluation du risque
            </h2>
            <p style={{ fontSize: 15.5, color: 'var(--text-body)', lineHeight: 1.88, marginBottom: 36, maxWidth: 480, fontWeight: 300 }}>
              AfricaRisque est une infrastructure de consultation destinée aux institutions agréées. Elle offre un accès contrôlé à des données vérifiées du secteur informel, dans le cadre d'une gouvernance rigoureuse et traçable.
            </p>

            {[
              'Données vérifiées par des agents assermentés sur le terrain',
              'Accès strictement contrôlé, authentifié et traçable',
              'Conforme aux exigences réglementaires locales et internationales',
              'Architecture multi-niveaux avec validation croisée obligatoire',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: '1.5px solid var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan)' }} />
                </div>
                <span style={{ fontSize: 14.5, color: '#374151', lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80"
              alt=""
              style={{ width: '100%', height: 520, objectFit: 'cover', display: 'block' }}
            />
            {/* Credential badge */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'var(--navy)', padding: '18px 24px',
              display: 'flex', alignItems: 'center', gap: 16
            }}>
              {/*<Shield size={20} style={{ color: 'var(--cyan)', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', letterSpacing: '0.02em' }}>Données protégées · Chiffrement de bout en bout</p>
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: 'var(--muted)', marginTop: 3, letterSpacing: '0.1em' }}>Accès réservé aux utilisateurs habilités</p>
              </div>
              */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FEATURES ─── */
const features = [
  { num: '01', title: "Évaluation du Risque", desc: "Analysez les profils et historiques afin d'aider les institutions dans leurs prises de décision." },
  { num: '02', title: "Consultation Sécurisée", desc: "Les informations sensibles sont accessibles uniquement via des mécanismes d'autorisation et de validation encadrés impliquant les acteurs du secteur agrémentés et les clients." },
  { num: '03', title: "Validation Multi-Acteurs", desc: "Aucune consultation sensible ne peut être effectuée individuellement sans contrôle et traçabilité." },
  { num: '04', title: "Architecture Hiérarchique", desc: "Un seul représentant par pays, ce dernier gère les partenaires et utilisateurs via une structure centralisée et sécurisée." },
  { num: '05', title: "Gestion des Accès", desc: "Les droits sont attribués selon les rôles, responsabilités et niveaux d'autorisation." },
  { num: '06', title: "Historique & Audit", desc: "Toutes les actions et consultations sont enregistrées afin d'assurer conformité et traçabilité." },
];

function Features() {
  return (
    <section style={{ padding: '96px 32px', background: 'var(--off-white)', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 56, marginBottom: 0 }}>
          <div style={{ maxWidth: 540 }}>
            <span className="label" style={{ display: 'block', marginBottom: 16 }}>Fonctionnalités clés</span>
            <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.18 }}>
              Une plateforme sécurisée pour la gouvernance des données du secteur informel
            </h2>
          </div>

          {/* Editorial feature list — two-column on desktop */}
          <div className="feat-cols" style={{ columns: 1, columnGap: 64 }}>
            {features.map((f) => (
              <div key={f.num} className="feat-item" style={{ breakInside: 'avoid' }}>
                <div>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: 'var(--cyan)', fontWeight: 500 }}>{f.num}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--navy)', marginBottom: 8, letterSpacing: '-0.01em' }}>{f.title}</h3>
                  <p style={{ fontSize: 13.5, color: '#4b5f6e', lineHeight: 1.72, fontWeight: 300 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── GOVERNANCE ─── */
const roles = [
  { code: 'ADM', title: 'Administrateur Central', desc: "Supervise l'infrastructure globale et attribue les représentations nationales.", accent: '#1a3c6e' },
  { code: 'REP', title: 'Représentant Pays', desc: "Coordonne les institutions partenaires et contrôle les accès au niveau national.", accent: '#2d5282' },
  { code: 'FO', title: 'Institution Partenaire', desc: "Gère les utilisateurs opérationnels et les processus internes de validation.", accent: '#055f5f' },
  { code: 'AGT', title: 'Agent Assermenté', desc: "Responsable de l'enregistrement, de la validation et de la sécurisation des dossiers.", accent: '#78450e' },
  { code: 'CSL', title: 'Conseiller Autorisé', desc: "Consultation encadrée des informations via un code d'accès sécurisé fourni par le titulaire concerné.", accent: '#7b1d1d' },
];

function Governance() {
  return (
    <section id="gouvernance" style={{ background: '#fff', padding: '100px 32px', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        <div className="gov-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 72, alignItems: 'start', marginBottom: 64 }}>

          <div style={{ order: 2 }}>
            <span className="label" style={{ display: 'block', marginBottom: 16 }}>Gouvernance & Contrôle des Accès</span>
            <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.18, marginBottom: 22 }}>
              Une chaîne de responsabilité claire à chaque niveau.
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-body)', lineHeight: 1.88, maxWidth: 440, fontWeight: 300 }}>
              Chaque acteur opère dans un périmètre défini, avec des droits strictement limités à ses responsabilités. Cette gouvernance à plusieurs niveaux est la garantie d'une plateforme fiable pour toutes les parties prenantes institutionnelles.
            </p>
          </div>

          <div style={{ position: 'relative', order: 1 }}>
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900&q=80"
              alt="Réunion institutionnelle"
              style={{ width: '100%', height: 400, objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '14px 20px', background: 'rgba(4,17,30,0.75)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan)', flexShrink: 0 }} />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: 'var(--cyan)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Structure de gouvernance multi-niveaux</span>
            </div>
          </div>
        </div>

        {/* Role table */}
        <div style={{ border: '1px solid var(--border)' }}>
          {roles.map((role, i) => (
            <div key={role.code} className="role-row" style={{ borderBottom: i < roles.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ flexShrink: 0, width: 44, height: 44, background: role.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.06em', fontFamily: "'IBM Plex Mono', monospace" }}>
                {role.code}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy)', marginBottom: 3, letterSpacing: '-0.01em' }}>{role.title}</p>
                <p style={{ fontSize: 13, color: '#5a7282', lineHeight: 1.55 }}>{role.desc}</p>
              </div>
              <div style={{ flexShrink: 0 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: role.accent, opacity: 0.5 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SECURITY ─── */
function Security() {
  const pillars = [
    { icon: Shield, title: "Chiffrement de bout en bout", desc: "Données en transit et au repos protégées avec les standards cryptographiques les plus élevés de l'industrie." },
    { icon: FileText, title: "Traçabilité immuable", desc: "Chaque action est enregistrée dans un journal d'audit inviolable et opposable aux tiers." },
    { icon: Lock, title: "Authentification renforcée", desc: "Double validation et protocoles stricts pour l'ensemble des opérations sensibles." },
    { icon: Users, title: "Accès par code titulaire", desc: "Le titulaire du dossier contrôle lui-même l'accès accordé aux conseillers autorisés." },
    { icon: Eye, title: "Zéro accès anonyme", desc: "Aucune consultation n'est possible sans identification vérifiable, enregistrée et tracée." },
    { icon: CheckCircle, title: "Conformité réglementaire", desc: "Architecture pensée pour respecter les exigences locales, régionales et internationales." },
  ];

  return (
    <section id="securite" style={{ background: 'var(--navy)', padding: '100px 32px', color: '#fff' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 64, marginBottom: 72, alignItems: 'end' }}>
          <div>
            <span className="label" style={{ display: 'block', marginBottom: 16 }}>Sécurité</span>
            <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, lineHeight: 1.14, marginBottom: 22, maxWidth: 560 }}>
              Une infrastructure pensée pour des données sensibles.
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(200,215,225,0.78)', lineHeight: 1.88, maxWidth: 480, fontWeight: 300 }}>
              AfricaRisque n'est pas un service grand public. Chaque mécanisme est conçu pour répondre aux exigences strictes des institutions financières et des régulateurs.
            </p>
          </div>
        </div>

        <div className="sec-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1, background: 'rgba(255,255,255,0.05)' }}>
          {pillars.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="sec-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                  <Icon size={18} style={{ color: 'var(--cyan)' }} />
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{item.title}</h3>
                </div>
                <p style={{ color: 'rgba(160,185,200,0.82)', lineHeight: 1.75, fontSize: 13.5, fontWeight: 300 }}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── HOW IT WORKS ─── */
const steps = [
  { n: '01', title: "Configuration de l'infrastructure globale", desc: "L'administrateur central configure les paramètres de l'infrastructure et accrédite les représentants nationaux." },
  { n: '02', title: "Attribution d'un représentant unique par pays", desc: "Un représentant unique est accrédité par pays pour coordonner les institutions partenaires et contrôler les accès nationaux." },
  { n: '03', title: "Intégration des institutions partenaires", desc: "Les banques et microfinances sont intégrées par les front-offices des représentants pays via des processus encadrés." },
  { n: '04', title: "Enregistrement & validation des dossiers", desc: "Les agents assermentés collectent et valident les informations sur le terrain avec signature d'engagement." },
  { n: '05', title: "Consultation tracée et autorisée", desc: "Chaque consultation requiert une autorisation préalable et génère une trace immuable dans le système d'audit." },
  { n: '06', title: "Accès via code sécurisé du titulaire", desc: "Le titulaire du dossier délivre lui-même un code d'accès sécurisé au conseiller autorisé — sans ce code, aucun accès n'est possible." },
];

function HowItWorks() {
  return (
    <section id="fonctionnement" style={{ padding: '100px 32px', background: 'var(--off-white)', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        <div style={{ maxWidth: 680, marginBottom: 72 }}>
          <span className="label" style={{ display: 'block', marginBottom: 16 }}>Fonctionnement</span>
          <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.14, marginBottom: 20 }}>
            Comment fonctionne la plateforme ?
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-body)', lineHeight: 1.88, fontWeight: 300 }}>
            Une chaîne de 6 étapes, contrôlée et traçable, conçue pour garantir la confiance, la conformité et la sécurité à chaque niveau d'intervention.
          </p>
        </div>

        {/* Steps — editorial list */}
        <div style={{ maxWidth: 740, position: 'relative' }}>
          {steps.map((step, i) => (
            <div key={step.n} style={{ display: 'flex', gap: 28, position: 'relative', paddingBottom: i < steps.length - 1 ? 44 : 0 }}>
              {i < steps.length - 1 && (
                <div className="step-connector" />
              )}
              <div style={{ flexShrink: 0, width: 40, height: 40, background: i === 0 ? 'var(--navy)' : '#fff', border: `1.5px solid ${i === 0 ? 'var(--navy)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 500, color: i === 0 ? 'var(--cyan)' : 'var(--muted)' }}>{step.n}</span>
              </div>
              <div style={{ paddingTop: 8 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)', marginBottom: 8, letterSpacing: '-0.01em' }}>{step.title}</h3>
                <p style={{ color: '#4b5f6e', lineHeight: 1.78, fontSize: 14, fontWeight: 300 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Video section */}
        <div style={{ marginTop: 88 }}>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 64 }}>
            <span className="label" style={{ display: 'block', marginBottom: 16 }}>Vidéo explicative</span>
            <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 700, color: 'var(--navy)', marginBottom: 32 }}>
              Comprendre la plateforme en quelques minutes
            </h3>
            <div style={{ maxWidth: 860, borderRadius: 0, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 16px 48px rgba(4,17,30,0.10)' }}>
              <iframe
                width="100%"
                height="460"
                src="https://www.youtube.com/embed/VOTRE_ID_VIDEO"
                title="Comment fonctionne AfricaRisque"
                frameBorder="0"
                allowFullScreen
                style={{ display: 'block' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── QUOTE ─── */
function Quote() {
  return (
    <section style={{ background: 'var(--navy-mid)', padding: '72px 32px' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          <div style={{ width: 2, background: 'var(--cyan)', alignSelf: 'stretch', flexShrink: 0, minHeight: 100 }} />
          <div>
            <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', color: 'rgba(240,248,252,0.9)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: 28 }}>
              "Dans un contexte où la grande majorité des actifs économiques évoluent hors du système formel, disposer d'un outil fiable pour évaluer le risque est devenu une nécessité stratégique pour tout établissement financier sérieux."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80" alt="" style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: '50%', border: '2px solid rgba(0,180,200,0.3)' }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Directeur Risque</p>
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: 'var(--muted)', marginTop: 3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Institution financière partenaire, Bénin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ─── */
function Contact() {
  return (
    <section id="contact" style={{ padding: '100px 32px', background: '#fff', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="cta-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 72, alignItems: 'start' }}>

          {/* Left */}
          <div>
            <span className="label" style={{ display: 'block', marginBottom: 16, color: 'var(--red-accent)' }}>Accès sécurisé à la plateforme</span>
            <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.18, marginBottom: 24 }}>
              Prendre contact avec nos équipes
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-body)', lineHeight: 1.88, maxWidth: 400, marginBottom: 36, fontWeight: 300 }}>
              Cette plateforme est exclusivement réservée aux institutions partenaires et aux utilisateurs habilités. Toutes les consultations sont tracées et soumises aux mécanismes de contrôle et d'autorisation définis par l'infrastructure. Pour avoir plus d'informations vous pouvez nous contacter en remplissant le formulaire suivant, nos équipes se chargeront de vous contacter sous 72H.
            </p>

            {/* Info panel */}
            <div style={{ border: '1px solid #f0c060', borderLeft: '3px solid #d97706', background: '#fffcf3', padding: '18px 20px', maxWidth: 420 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <AlertCircle size={15} style={{ color: '#b45309', flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 13, color: '#7c4e0e', lineHeight: 1.68 }}>
                  Nos équipes analyseront votre demande et vous recontacteront sous <strong>72 heures ouvrées</strong>. Seules les institutions agréées seront considérées.
                </p>
              </div>
            </div>

            {/* Contact details */}
            <div style={{ marginTop: 36, paddingTop: 36, borderTop: '1px solid var(--border)' }}>
              {[
                { icon: MapPin, text: 'Cotonou, Bénin' },
                { icon: Mail, text: 'contact@africarisque.com' },
                { icon: Phone, text: '+229 XX XX XX XX' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <Icon size={13} style={{ color: 'var(--cyan)' }} />
                  <span style={{ fontSize: 13.5, color: 'var(--text-body)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div style={{ background: 'var(--off-white)', border: '1px solid var(--border)', padding: '40px 36px' }}>
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', marginBottom: 6, fontFamily: "'Libre Baskerville', serif" }}>Formulaire de contact institutionnel</h3>
              <p style={{ fontSize: 12.5, color: '#7a96a8', fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.06em' }}>Remplissez les champs ci-dessous</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: "Nom de l'organisation", type: 'text', placeholder: 'Ex: Banque Atlantique' },
                { label: 'Nom & fonction du responsable', type: 'text', placeholder: 'Ex: Jean Martin, DGA' },
                { label: 'Email professionnel', type: 'email', placeholder: 'contact@organisation.com' },
                { label: 'Téléphone', type: 'tel', placeholder: '+229 XX XX XX XX' },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5a7282', marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace" }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} />
                </div>
              ))}

              {[
                { label: "Type d'organisation", opts: ['Banque commerciale', 'Microfinance', 'Institution de crédit', 'Organisme de régulation', 'Autre'] },
                { label: 'Pays', opts: ['Bénin', "Côte d'Ivoire", 'Sénégal', 'Mali', 'Burkina Faso', 'Autre'] },
              ].map(s => (
                <div key={s.label}>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5a7282', marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace" }}>{s.label}</label>
                  <select><option value="">Sélectionner…</option>{s.opts.map(o => <option key={o}>{o}</option>)}</select>
                </div>
              ))}

              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5a7282', marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace" }}>Objet de la demande</label>
                <input type="text" placeholder="Ex: Demande d'accès partenaire institutionnel" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5a7282', marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace" }}>Message / besoin</label>
                <textarea rows={4} placeholder="Décrivez brièvement votre besoin et le contexte de votre institution…" style={{ resize: 'none' }} />
              </div>

              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4, borderRadius: 2 }}>
                Prendre contact <ArrowRight size={14} />
              </button>

              <p style={{ fontSize: 11, color: '#9aacb8', textAlign: 'center', lineHeight: 1.6, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.06em' }}>
                Accès exclusivement réservé aux institutions agréées
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer style={{ background: 'var(--navy)', padding: '64px 32px 32px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="foot-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 48, marginBottom: 52 }}>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 6, height: 28, background: 'var(--cyan)', borderRadius: 1 }} />
              <span style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 700, fontSize: 15, color: '#fff' }}>Africa<span style={{ color: 'var(--red-accent)' }}>Risque</span></span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.85, maxWidth: 280, marginBottom: 28, fontWeight: 300 }}>
              Plateforme institutionnelle de gouvernance et de partage sécurisé des données de risque.
            </p>
            {[
              { icon: MapPin, text: 'Cotonou, Bénin' },
              { icon: Mail, text: 'contact@africarisque.com' },
              { icon: Phone, text: '+229 XX XX XX XX' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <Icon size={12} style={{ color: 'var(--cyan)' }} />
                <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>{text}</span>
              </div>
            ))}
          </div>

          <div>
            <h4 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, fontWeight: 500, letterSpacing: '0.16em', color: '#c8d6df', textTransform: 'uppercase', marginBottom: 20 }}>Plateforme</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Solution', 'Fonctionnement', 'Gouvernance', 'Sécurité', 'Documentation'].map(l => (
                <li key={l}>
                  <a href="#" style={{ fontSize: 13, color: 'var(--muted)', transition: 'color .2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
                    onMouseLeave={e => e.target.style.color = 'var(--muted)'}>{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, fontWeight: 500, letterSpacing: '0.16em', color: '#c8d6df', textTransform: 'uppercase', marginBottom: 20 }}>Légal</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Politique de confidentialité', "Conditions d'utilisation", 'Conformité', 'Mentions légales'].map(l => (
                <li key={l}>
                  <a href="#" style={{ fontSize: 13, color: 'var(--muted)', transition: 'color .2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
                    onMouseLeave={e => e.target.style.color = 'var(--muted)'}>{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 11.5, color: '#3d5468', fontFamily: "'IBM Plex Sans', sans-serif" }}>© 2026 AfricaRisque. Tous droits réservés.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Lock size={10} style={{ color: '#3d5468' }} />
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, color: '#3d5468', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Accès contrôlé · Données protégées</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── ROOT ─── */
export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: 'var(--text-dark)' }}>
      <SEO
        title="AfricaRisque • Plateforme sécurisé d’évaluation de risques"
        description="AfricaRisque est une plateforme d’évaluation du risque financier pour PME, microfinance et secteur informel en Afrique de l’Ouest. Analyse de crédit, scoring alternatif et gestion des risques financiers."
        keywords={[
          "plateforme de gestion des risques",
          "analyse de risque crédit Afrique",
          "évaluation risque financier PME",
          "microfinance Afrique de l’Ouest",
          "risque de non-remboursement",
          "gestion des risques financiers",
          "scoring crédit alternatif",
          "analyse crédit secteur informel",
          "évaluation emprunteur informel",
          "solution analyse risque Afrique"
        ]}
      />
      <Navbar />
      <Hero />
      <TrustBand />
      <Solution />
      <Features />
      <Governance />
      <Security />
      <HowItWorks />
      <Quote />
      <Contact />
      <Footer />
    </div>
  );
}