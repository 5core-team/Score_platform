import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Datagouv() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
        <Link to="/" className="inline-flex items-center text-sm text-cyan-600 dark:text-cyan-400 hover:underline mb-6">
          <ArrowLeft size={16} className="mr-2" /> Retour à l'accueil
        </Link>
        
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
          CHARTE DE GOUVERNANCE DES DONNÉES AFRICARISQUE
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Version 1.0</p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">PRÉAMBULE</h2>
            <p>
              AfricaRisque met en œuvre un modèle de gouvernance fondé sur la sécurité, la traçabilité, la validation croisée et la limitation des privilèges.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 1 : PRINCIPES FONDAMENTAUX</h2>
            <p>La gouvernance des données repose sur :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Confidentialité ;</li>
              <li>Intégrité ;</li>
              <li>Disponibilité ;</li>
              <li>Traçabilité ;</li>
              <li>Responsabilité ;</li>
              <li>Validation croisée.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 2 : SÉPARATION DES POUVOIRS</h2>
            <p>Aucun acteur ne peut :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>enregistrer ;</li>
              <li>valider ;</li>
              <li>modifier ;</li>
              <li>approuver ;</li>
              <li>consulter intégralement ;</li>
            </ul>
            <p className="mt-2">un dossier sans intervention d’un autre niveau habilité.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 3 : NIVEAUX DE GOUVERNANCE</h2>
            <div className="space-y-4 mt-2">
              <div>
                <strong>Niveau 1 : Administrateur Central (ADM)</strong>
                <p className="mt-1 font-medium text-gray-700 dark:text-gray-300">Responsabilités :</p>
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  <li>gouvernance globale ;</li>
                  <li>gestion des représentations nationales ;</li>
                  <li>supervision des audits.</li>
                </ul>
              </div>

              <div>
                <strong>Niveau 2 : Représentant Pays (REP)</strong>
                <p className="mt-1 font-medium text-gray-700 dark:text-gray-300">Responsabilités :</p>
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  <li>supervision nationale ;</li>
                  <li>creation des front- offices ;</li>
                  <li>contrôle des institutions partenaires ;</li>
                  <li>suivi des habilitations.</li>
                </ul>
              </div>

              <div>
                <strong>Niveau 3 : Institution Partenaire</strong>
                <p className="mt-1 font-medium text-gray-700 dark:text-gray-300">Responsabilités :</p>
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  <li>gestion des opérations internes ;</li>
                  <li>contrôle des utilisateurs ;</li>
                  <li>validation institutionnelle.</li>
                </ul>
              </div>

              <div>
                <strong>Niveau 4 : Agent Assermenté (AGT)</strong>
                <p className="mt-1 font-medium text-gray-700 dark:text-gray-300">Responsabilités :</p>
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  <li>collecte des informations ;</li>
                  <li>vérification terrain ;</li>
                  <li>constitution des dossiers.</li>
                </ul>
              </div>

              <div>
                <strong>Niveau 5 : Conseiller Financier</strong>
                <p className="mt-1 font-medium text-gray-700 dark:text-gray-300">Responsabilités :</p>
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  <li>consultation encadrée ;</li>
                  <li>accompagnement des bénéficiaires ;</li>
                  <li>respect des règles de confidentialité.</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 4 : VALIDATION CROISÉE</h2>
            <p>Toute information enregistrée doit faire l’objet :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>d’une vérification ;</li>
              <li>d’une validation ;</li>
              <li>d’une traçabilité.</li>
            </ul>
            <p className="mt-2">
              Aucune donnée ne peut être considérée comme validée sans contrôle croisé conformément aux procédures internes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 5 : JOURNALISATION</h2>
            <p>Les actions suivantes sont enregistrées :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>création ;</li>
              <li>modification ;</li>
              <li>consultation ;</li>
              <li>validation ;</li>
              <li>export autorisé ;</li>
              <li>suppression.</li>
            </ul>
            <p className="mt-2">
              Les journaux d’audit sont conservés conformément aux politiques internes de sécurité.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 6 : GESTION DES INCIDENTS</h2>
            <p>Tout incident impliquant :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>accès non autorisé ;</li>
              <li>divulgation ;</li>
              <li>altération ;</li>
              <li>perte de données ;</li>
            </ul>
            <p className="mt-2">fait l’objet :</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>d’une déclaration ;</li>
              <li>d’une analyse ;</li>
              <li>d’une mesure corrective ;</li>
              <li>d’un rapport d’incident.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 7 : AUDIT</h2>
            <p>AfricaRisque peut réaliser des audits périodiques afin de vérifier :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>le respect des procédures ;</li>
              <li>la conformité réglementaire ;</li>
              <li>la sécurité des traitements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 8 : SANCTIONS</h2>
            <p>Toute violation de la présente charte peut entraîner :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>suspension d’accès ;</li>
              <li>retrait d’habilitation ;</li>
              <li>résiliation du partenariat ;</li>
              <li>poursuites civiles ou pénales.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 9 : ENGAGEMENT</h2>
            <p>
              Toute personne disposant d’un accès à AfricaRisque reconnaît avoir pris connaissance de la présente charte et s’engage à la respecter intégralement.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}