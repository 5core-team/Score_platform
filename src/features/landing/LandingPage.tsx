import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Eye, Users, GitBranch, Lock, FileText,
  ArrowRight, ChevronDown, Menu, X, Phone, Mail,
  MapPin, CheckCircle, Building2
} from 'lucide-react';

const fontStyle = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Manrope', sans-serif; color: #1a1a2e; }
`;

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { label: 'Solution', href: '#solution' },
    { label: 'Gouvernance', href: '#gouvernance' },
    { label: 'Sécurité', href: '#securite' },
    { label: 'Fonctionnement', href: '#fonctionnement' },
  ];

  return (
    <>
      <style>{fontStyle}</style>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: '#ffffff',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : '0 1px 0 #e5e7eb',
        transition: 'box-shadow 0.4s ease',
      }}>
        
        <div style={{ 
          maxWidth: 1280, 
          margin: '0 auto', 
          padding: '0 24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          height: 80 
        }}>
          
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.jpeg" alt="AfricaRisque" style={{ height: 42, width: 42, borderRadius: 8, objectFit: 'cover' }} />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontWeight: 800, fontSize: 18, color: '#00C4D9', letterSpacing: '-0.02em' }}>Africa</span>
              <span style={{ fontWeight: 800, fontSize: 18, color: '#FF4A4A', letterSpacing: '-0.02em' }}>Risque</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div style={{ 
            display: 'none', 
            alignItems: 'center', 
            gap: 40,
          }} className="desktop-nav">
            {links.map(l => (
              <a 
                key={l.label} 
                href={l.href} 
                style={{
                  fontSize: 15, 
                  fontWeight: 600, 
                  color: '#1f2937',
                  textDecoration: 'none', 
                  letterSpacing: '0.01em',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = '#00C4D9'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = '#1f2937'}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA Desktop */}
          <a
            href="#contact"
            className="desktop-cta"
            style={{
              padding: '12px 28px',
              background: '#00C4D9',
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              borderRadius: 8,
              textDecoration: 'none',
              letterSpacing: '0.02em',
              display: 'none',
              cursor: 'pointer'
            }}
          >
            Contactez-nous
          </a>

          {/* Hamburger - Mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            className="mobile-menu-btn"
          >
            {menuOpen ? <X size={28} color="#1f2937" /> : <Menu size={28} color="#1f2937" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            position: 'fixed',
            top: 80,
            left: 0,
            right: 0,
            background: '#ffffff',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
            zIndex: 99
          }}>
            {links.map(l => (
              <a
                key={l.label}
                href={l.href}
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: '#1f2937',
                  textDecoration: 'none',
                  padding: '8px 0'
                }}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </a>
            ))}
            
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              style={{
                marginTop: 8,
                padding: '16px 24px',
                background: '#00C4D9',
                color: '#fff',
                textAlign: 'center',
                borderRadius: 8,
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: 16
              }}
            >
              Demander un accès
            </Link>
          </div>
        )}
      </nav>

      {/* Media Queries */}
      <style jsx>{`
        @media (min-width: 992px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-cta {
            display: inline-flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

/* ────────────────────────────────────────────────────────
HERO (style institutionnel type TransUnion)
──────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section style={{ position: 'relative', minHeight: '100vh', background: '#012A4A', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <img
        src="../../public/hero_image.jpeg"
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, #012A4A 45%, #051c3f88 70%, transparent)' }} />

      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '140px 32px 100px', width: '100%' }}>
        <div style={{ maxWidth: 720 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.18em', color: '#00C4D9', textTransform: 'uppercase', marginBottom: 24 }}>
            Plateforme sécurisé d’évaluation de risques
          </p>

          <h1 style={{ 
            fontFamily: "'Libre Baskerville', serif", 
            fontSize: 'clamp(2.8rem, 6vw, 4.8rem)', 
            fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 32 
          }}>
            Fait confiance même à l’informel.
          </h1>

          <p style={{ fontSize: 19, color: '#dbe0e7ff', lineHeight: 1.7, maxWidth: 560, marginBottom: 48 }}>
            AfricaRisque est une solution conçue pour faciliter l’accès aux informations crédibles du secteur informel, de manière à contribuer à une analyse qualitative de risques.
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '16px 36px', background: '#00C4D9', color: '#fff',
              fontSize: 15, fontWeight: 700, borderRadius: 8,
              textDecoration: 'none'
            }}>
              Commencer maintenant <ArrowRight size={18} />
            </Link>

            <a href="#fonctionnement" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '16px 36px', border: '1.5px solid rgba(255,255,255,0.3)', color: '#e2e8f0',
              fontSize: 15, fontWeight: 600, borderRadius: 8,
              textDecoration: 'none'
            }}>
              Découvrir le fonctionnement
            </a>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 60, marginTop: 100, flexWrap: 'wrap' }}>
          {[
            { n: '5+', label: 'Pays couverts' },
            { n: '38', label: 'Institutions partenaires' },
            { n: '124', label: 'Agents assermentés' },
            { n: '11 340', label: 'Dossiers enregistrés' },
          ].map(s => (
            <div key={s.label}>
              <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 42, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{s.n}</p>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Trust Band */
function TrustBand() {
  const logos = ['Banque Atlantique', 'Orabank', 'BCEAO', 'Coris Bank', 'NSIA Banque', 'BOA'];
  return (
    <section style={{ background: '#f8fafc', padding: '32px 32px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
        {logos.map(l => <span key={l} style={{ fontSize: 15, fontWeight: 700, color: '#64748b' }}>{l}</span>)}
      </div>
    </section>
  );
}

/* Solution */
function Solution() {
  return (
    <section id="solution" style={{ padding: '110px 32px', background: '#fff' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', color: '#00C4D9', textTransform: 'uppercase', marginBottom: 20 }}>Notre solution</p>
            <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 700, color: '#0f172a', lineHeight: 1.2, marginBottom: 28 }}>
              Plateforme sécurisée d’évaluation de risques
            </h2>
            <p style={{ fontSize: 17, color: '#475569', lineHeight: 1.85, marginBottom: 32 }}>
              AfricaRisque est une infrastructure sécurisée de consultation et d’évaluation du risque destinée aux institutions agréées.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                'Données vérifiées par des agents assermentés sur le terrain',
                'Accès strictement contrôlé et traçable',
                'Conforme aux régulations locales et internationales',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <CheckCircle size={20} style={{ color: '#00C4D9', flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontSize: 16, color: '#374151' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80" alt="" style={{ width: '100%', height: 520, objectFit: 'cover', borderRadius: 16 }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Features mises à jour */
const features = [
  { icon: Shield, title: "Évaluation du Risque", desc: "Analysez les profils et historiques afin d’aider les institutions dans leurs prises de décision.", color: '#00C4D9' },
  { icon: Eye, title: "Consultation Sécurisée", desc: "Les informations sensibles sont accessibles uniquement via des mécanismes d’autorisation et de validation encadrés impliquant les acteurs du secteur agrémentés et les clients.", color: '#FF4A4A' },
  { icon: Users, title: "Validation Multi-Acteurs", desc: "Aucune consultation sensible ne peut être effectuée individuellement sans contrôle et traçabilité.", color: '#f59e0b' },
  { icon: GitBranch, title: "Architecture Hiérarchique", desc: "Un seul représentant par pays, ce dernier gère les partenaires et utilisateurs via une structure centralisée et sécurisée.", color: '#10b981' },
  { icon: Lock, title: "Gestion des Accès", desc: "Les droits sont attribués selon les rôles, responsabilités et niveaux d’autorisation.", color: '#6366f1' },
  { icon: FileText, title: "Historique & Audit", desc: "Toutes les actions et consultations sont enregistrées afin d’assurer conformité et traçabilité.", color: '#8b5cf6' },
];

function Features() {
  return (
    <section style={{ padding: '110px 32px', background: '#f8fafc' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 80px' }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', color: '#00C4D9', textTransform: 'uppercase' }}>Fonctionnalités clés</p>
          <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 700, color: '#0f172a', marginTop: 16 }}>
            Une plateforme sécurisée pour la gouvernance des données du secteur informel
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 28 }}>
          {features.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.title} style={{
                background: '#fff', padding: '40px 32px', borderRadius: 16,
                border: '1px solid #e2e8f0', transition: 'all 0.3s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ width: 56, height: 56, background: f.color + '15', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
                  <Icon size={28} style={{ color: f.color }} />
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 12 }}>{f.title}</h3>
                <p style={{ color: '#475569', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Fonctionnement (workflow) */
const steps = [
  { n: '01', title: "Configuration par l’Administrateur Central", desc: "L’administrateur configure l’infrastructure globale et attribue les représentants nationaux." },
  { n: '02', title: "Représentant Unique par Pays", desc: "Un représentant unique est accrédité par pays pour coordonner les institutions partenaires." },
  { n: '03', title: "Intégration des Institutions Partenaires", desc: "Les banques et microfinances sont intégrées par les front-offices des représentants pays." },
  { n: '04', title: "Enregistrement & Validation des Dossiers", desc: "Les agents assermentés collectent et valident les informations sur le terrain." },
  { n: '05', title: "Consultation Tracée et Autorisée", desc: "Chaque consultation nécessite une autorisation préalable et laisse une trace immuable." },
  { n: '06', title: "Accès via Code Titulaire", desc: "Le titulaire du dossier délivre lui-même un code sécurisé au conseiller autorisé." },
];

function HowItWorks() {
  return (
    <section id="fonctionnement" style={{ 
      padding: '120px 32px', 
      background: '#ffffff' 
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        
        {/* En-tête */}
        <div style={{ textAlign: 'center', maxWidth: 820, margin: '0 auto 90px' }}>
          <p style={{ 
            fontSize: 13, fontWeight: 700, letterSpacing: '0.18em', 
            color: '#00C4D9', textTransform: 'uppercase', marginBottom: 16 
          }}>
            FONCTIONNEMENT
          </p>
          <h2 style={{ 
            fontFamily: "'Libre Baskerville', serif", 
            fontSize: 'clamp(2.5rem, 5vw, 3.6rem)', 
            fontWeight: 700, 
            color: '#0f172a', 
            lineHeight: 1.1, 
            marginBottom: 28 
          }}>
            Comment ça marche ?
          </h2>
          <p style={{ 
            fontSize: 18, 
            color: '#475569', 
            lineHeight: 1.75, 
            maxWidth: 680, 
            margin: '0 auto' 
          }}>
            Une chaîne claire et sécurisée de 6 étapes conçue pour garantir la confiance, la traçabilité et la conformité.
          </p>
        </div>

        {/* Timeline */}
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          {steps.map((step, index) => (
            <div key={step.n} style={{
              display: 'flex',
              gap: 32,
              marginBottom: index < steps.length - 1 ? 48 : 0,
              position: 'relative'
            }}>
              {/* Ligne verticale */}
              {index < steps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '27px',
                  top: '68px',
                  bottom: '-40px',
                  width: '3px',
                  background: '#e2e8f0',
                  zIndex: 0
                }} />
              )}

              {/* Numéro */}
              <div style={{
                flexShrink: 0,
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#00C4D9',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                fontWeight: 700,
                fontFamily: "'Libre Baskerville', serif",
                zIndex: 1,
                boxShadow: '0 10px 30px rgba(0, 196, 217, 0.25)'
              }}>
                {step.n}
              </div>

              {/* Contenu */}
              <div style={{ paddingTop: 8 }}>
                <h3 style={{ 
                  fontSize: 20, 
                  fontWeight: 700, 
                  color: '#0f172a', 
                  marginBottom: 12 
                }}>
                  {step.title}
                </h3>
                <p style={{ 
                  color: '#475569', 
                  lineHeight: 1.8, 
                  fontSize: 16.5 
                }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Vidéo explicative en bas */}
        <div style={{ marginTop: 100, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: '#00C4D9', fontWeight: 600, marginBottom: 20 }}>
            VIDÉO EXPLICATIVE
          </p>
          <div style={{ 
            maxWidth: 860, 
            margin: '0 auto', 
            borderRadius: 20, 
            overflow: 'hidden', 
            boxShadow: '0 25px 70px rgba(0,0,0,0.15)' 
          }}>
            <iframe 
              width="100%" 
              height="480" 
              src="https://www.youtube.com/embed/VOTRE_ID_VIDEO" 
              title="Comment fonctionne AfricaRisque"
              frameBorder="0" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Gouvernance, Sécurité, CTA avec formulaire complet, Footer... */


/* ────────────────────────────────────────────────────────
   GOVERNANCE — full-bleed photo section
──────────────────────────────────────────────────────── */
const roles = [
  { code: 'ADM', title: 'Administrateur Central', desc: "Supervise l’infrastructure globale et attribue les représentations nationales.", color: '#2629f0ff' },
  { code: 'REP', title: 'Représentant Pays', desc: "Coordonne les institutions partenaires et contrôle les accès au niveau national.", color: '#6366f1' },
  { code: 'FO', title: 'Institution Partenaire', desc: "Gère les utilisateurs opérationnels et les processus de validation.", color: '#10b981' },
  { code: 'AGT', title: 'Agent Assermenté', desc: "Responsable de l’enregistrement, de la validation et de la sécurisation des dossiers.", color: '#f59e0b' },
  { code: 'CSL', title: 'Conseiller Autorisé', desc: "Consultation encadrée des informations via un code d’accès sécurisé fourni par le titulaire concerné.", color: '#FF4A4A' },
];

function Governance() {
  return (
    <section id="gouvernance" style={{ background: '#f8fafc', padding: '96px 32px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', marginBottom: 72 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#00C4D9', textTransform: 'uppercase', marginBottom: 20 }}>Gouvernance & Contrôle des Accès</p>
            <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(2rem, 3.2vw, 2.8rem)', fontWeight: 700, color: '#0f172a', lineHeight: 1.25, marginBottom: 24 }}>
              Une chaîne de responsabilité claire à chaque niveau.
            </h2>
            <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.9 }}>
              Chaque acteur opère dans un périmètre défini, avec des droits strictement limités à ses responsabilités. Cette gouvernance à plusieurs niveaux est la garantie d'une plateforme fiable pour toutes les parties prenantes.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80"
            alt="Réunion institutionnelle"
            style={{ width: '100%', height: 360, objectFit: 'cover', borderRadius: 12 }}
          />
        </div>

        {/* Role cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {roles.map((role, i) => (
            <div key={role.code} style={{
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
              padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
            }}>
              <div style={{
                flexShrink: 0, width: 44, height: 44, borderRadius: 8,
                background: role.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '0.05em',
              }}>
                {role.code}
              </div>
              <div style={{ minWidth: 220, flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{role.title}</p>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{role.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function Security() {
  const pillars = [
    { icon: Shield, title: "Chiffrement de bout en bout", desc: "Données en transit et au repos protégées avec les standards les plus élevés." },
    { icon: FileText, title: "Traçabilité immuable", desc: "Chaque action est enregistrée dans un journal d'audit inviolable." },
    { icon: Lock, title: "Authentification renforcée", desc: "Double validation et protocoles stricts pour toutes les opérations sensibles." },
    { icon: Users, title: "Accès par code titulaire", desc: "Le titulaire du dossier contrôle lui-même l'accès aux conseillers autorisés." },
    { icon: Eye, title: "Zéro accès anonyme", desc: "Aucune consultation possible sans identification vérifiable et tracée." },
    { icon: CheckCircle, title: "Conformité réglementaire", desc: "Architecture conçue pour respecter les exigences locales et internationales." },
  ];

  return (
    <section id="securite" style={{ 
      background: '#012A4A', 
      padding: '120px 32px', 
      color: '#fff' 
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        
        {/* En-tête */}
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 80px' }}>
          <p style={{ 
            fontSize: 13, 
            fontWeight: 700, 
            letterSpacing: '0.2em', 
            color: '#00C4D9', 
            textTransform: 'uppercase', 
            marginBottom: 16 
          }}>
            SÉCURITÉ
          </p>
          <h2 style={{ 
            fontFamily: "'Libre Baskerville', serif", 
            fontSize: 'clamp(2.4rem, 4.8vw, 3.5rem)', 
            fontWeight: 700, 
            lineHeight: 1.15, 
            marginBottom: 24 
          }}>
            Une infrastructure pensée pour des données sensibles
          </h2>
          <p style={{ 
            fontSize: 18, 
            color: '#94a3b8', 
            lineHeight: 1.7 
          }}>
            AfricaRisque n’est pas un service grand public. Chaque mécanisme est conçu pour répondre aux exigences strictes des institutions financières et des régulateurs.
          </p>
        </div>

        {/* Features Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
          gap: 24 
        }}>
          {pillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16,
                padding: '40px 32px',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = 'rgba(0, 196, 217, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }}>
                
                <div style={{ 
                  width: 52, 
                  height: 52, 
                  background: 'rgba(0, 196, 217, 0.15)', 
                  borderRadius: 12, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: 24 
                }}>
                  <Icon size={28} style={{ color: '#00C4D9' }} />
                </div>

                <h3 style={{ 
                  fontSize: 19, 
                  fontWeight: 700, 
                  marginBottom: 12, 
                  color: '#fff' 
                }}>
                  {item.title}
                </h3>
                
                <p style={{ 
                  color: '#a5b4fc', 
                  lineHeight: 1.7, 
                  fontSize: 15.5 
                }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────
   TESTIMONIAL / QUOTE BREAK
──────────────────────────────────────────────────────── */
function Quote() {
  return (
    <section style={{ background: '#eff6ff', padding: '80px 32px', borderTop: '4px solid #00C4D9' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(1.3rem, 2.5vw, 2rem)', color: '#0f172a', lineHeight: 1.65, fontStyle: 'italic', marginBottom: 32 }}>
          "Dans un contexte où la grande majorité des actifs économiques évoluent hors du système formel, disposer d'un outil fiable pour évaluer le risque est devenu une nécessité stratégique pour tout établissement financier sérieux."
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80"
            alt=""
            style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Directeur Risque</p>
            <p style={{ fontSize: 13, color: '#64748b' }}>Institution financière partenaire, Bénin</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="contact" className="py-28 bg-white dark:bg-[#080f14] border-t border-gray-100 dark:border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <p style={{ fontSize: 13, fontWeight: 700, color: '#FF4A4A', textTransform: 'uppercase' }}>Accès sécurisé à la plateforme</p>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
              Prêt à rejoindre l'infrastructure ?
            </h2>
            <p className="mt-6 text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-md">
              Cette plateforme est exclusivement réservée aux institutions partenaires et aux utilisateurs habilités. Toutes les consultations sont tracées.
            </p>
            <div className="mt-8 flex items-start gap-3 p-4 border border-amber-200 dark:border-amber-500/20 rounded-xl bg-amber-50 dark:bg-amber-500/5">
              <Shield size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-[12px] text-amber-700 dark:text-amber-400 leading-relaxed">
                Nos équipes analyseront votre demande et vous recontacteront sous <strong>72 heures</strong> ouvrées.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div className="border border-gray-200 dark:border-white/10 rounded-2xl p-7 bg-gray-50 dark:bg-white/[0.02]">
            <h3 className="text-[15px] font-black text-gray-900 dark:text-white mb-1 tracking-tight">Accès sécurisé à la plateforme</h3>
            <p className="text-[12px] text-gray-400 mb-6">Remplissez le formulaire pour prendre contact avec nos équipes.</p>

            <div className="space-y-3">
              {[
                { label: "Nom de l'organisation", type: 'text', placeholder: 'Ex: Banque Atlantique' },
                { label: 'Email professionnel', type: 'email', placeholder: 'contact@organisation.com' },
                { label: 'Téléphone', type: 'tel', placeholder: '+229 XX XX XX XX' },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-[13px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-500 transition-colors"
                  />
                </div>
              ))}

              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5">
                  Type d'organisation
                </label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#080f14] text-[13px] text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors">
                  <option value="">Sélectionner…</option>
                  <option>Banque commerciale</option>
                  <option>Microfinance</option>
                  <option>Institution de crédit</option>
                  <option>Organisme de régulation</option>
                  <option>Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5">
                  Pays
                </label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#080f14] text-[13px] text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors">
                  <option value="">Sélectionner…</option>
                  <option>Bénin</option>
                  <option>Côte d'Ivoire</option>
                  <option>Sénégal</option>
                  <option>Mali</option>
                  <option>Burkina Faso</option>
                  <option>Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5">
                  Objet de la demande
                </label>
                <textarea
                  rows={3}
                  placeholder="Décrivez brièvement votre besoin…"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-[13px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-500 transition-colors resize-none"
                />
              </div>

              <button className="w-full py-4 bg-cyan-500 hover:bg-cyan-600 text-white text-[13px] font-black uppercase tracking-widest rounded-lg transition-colors duration-200">
                Prendre contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Export default function LandingPage() { ... } avec tous les composants dans l’ordre : Navbar → Hero → TrustBand → Solution → Features → HowItWorks → Governance → Security → Quote → CTA → Footer */

/* ────────────────────────────────────────────────────────
   FOOTER
──────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: '#030d1c', padding: '64px 32px 36px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 64, marginBottom: 56 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <img src="/logo.jpeg" alt="AfricaRisque" style={{ height: 32, width: 32, borderRadius: 6, objectFit: 'cover' }} />
              <div>
                <span style={{ fontWeight: 800, fontSize: 15, color: '#00C4D9' }}>Africa</span>
                <span style={{ fontWeight: 800, fontSize: 15, color: '#FF4A4A' }}>Risque</span>
              </div>
            </div>
            <p style={{ fontSize: 14, color: '#ffffff', lineHeight: 1.8, maxWidth: 300 }}>
              Plateforme institutionnelle de gouvernance et de partage sécurisé des données de risque.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
              {[
                { icon: MapPin, text: 'Cotonou, Bénin' },
                { icon: Mail, text: 'contact@africarisque.com' },
                { icon: Phone, text: '+229 XX XX XX XX' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={14} style={{ color: '#00C4D9' }} />
                  <span style={{ fontSize: 13, color: '#ffffff' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: '#e2e8f0', textTransform: 'uppercase', marginBottom: 24 }}>Plateforme</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Solution', 'Fonctionnement', 'Gouvernance', 'Sécurité', 'Documentation'].map(l => (
                <li key={l}><a href="#" style={{ fontSize: 14, color: '#ffffff', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = '#00C4D9'}
                  onMouseLeave={e => e.target.style.color = '#ffffff'}>{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: '#e2e8f0', textTransform: 'uppercase', marginBottom: 24 }}>Légal</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Politique de confidentialité', "Conditions d'utilisation", 'Conformité', 'Mentions légales'].map(l => (
                <li key={l}><a href="#" style={{ fontSize: 14, color: '#ffffff', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = '#00C4D9'}
                  onMouseLeave={e => e.target.style.color = '#ffffff'}>{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 13, color: '#ffffffff' }}>© 2026 AfricaRisque. Tous droits réservés.</p>
          <p style={{ fontSize: 11, color: '#ffffffff', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Accès contrôlé · Données protégées</p>
        </div>
      </div>
    </footer>
  );
}

/* ────────────────────────────────────────────────────────
   ROOT
──────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", color: '#1a1a2e' }}>
      <Navbar />
      <Hero />
      <TrustBand />
      <Solution />
      <Features />
      <Governance />
      <Security />
      <HowItWorks />
      <Quote />
      <CTA />
      <Footer />
    </div>
  );
}