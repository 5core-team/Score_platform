import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CGU() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
        <Link to="/" className="inline-flex items-center text-sm text-cyan-600 dark:text-cyan-400 hover:underline mb-6">
          <ArrowLeft size={16} className="mr-2" /> Retour à l'accueil
        </Link>

        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
          CONDITIONS GÉNÉRALES D’UTILISATION AFRICARISQUE
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Version 1.0</p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 1 : OBJET</h2>
            <p>
              Les présentes Conditions Générales d’Utilisation (CGU) régissent l’accès et l’utilisation de la plateforme AfricaRisque.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 2 : UTILISATEURS AUTORISÉS</h2>
            <p>L’accès à la plateforme est strictly réservé aux profils habilités :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Administrateur Central (ADM)</li>
              <li>Représentant Pays (REP)</li>
              <li>Institution Partenaire</li>
              <li>Agent Assermenté</li>
              <li>Conseiller Autorisé</li>
            </ul>
            <p className="mt-2">Aucune inscription libre n’est autorisée.</p>
            <p className="mt-1">Tout compte est créé après vérification et validation administrative.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 3 : PRINCIPE DE CONSULTATION CONTRÔLÉE</h2>
            <p>
              Les informations accessibles sur AfricaRisque ne peuvent être consultées que dans le cadre d’une procédure autorisée et tracée.
            </p>
            <p className="mt-2">Toute consultation est associée à :</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>un utilisateur identifié ;</li>
              <li>une institution habilitée ;</li>
              <li>un motif de consultation ;</li>
              <li>une journalisation complète.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 4 : OBLIGATION DE CONFIDENTIALITÉ</h2>
            <p>
              Tout utilisateur est tenu au strict respect de la confidentialité des informations auxquelles il accède.
            </p>
            <p className="mt-2">
              Les informations obtenues via AfricaRisque ne peuvent être communiquées à des tiers non autorisés.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 5 : INTERDICTIONS</h2>
            <p>Il est interdit de :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>reproduire la base de données ;</li>
              <li>exporter massivement les données ;</li>
              <li>revendre les informations ;</li>
              <li>détourner les informations de leur finalité ;</li>
              <li>contourner les mécanismes de sécurité ;</li>
              <li>utiliser un compte tiers ;</li>
              <li>transmettre ses identifiants.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 6 : RESPONSABILITÉS</h2>
            <p>
              AfricaRisque fournit des informations vérifiées destinées à faciliter l’analyse des risques.
            </p>
            <p className="mt-2">
              Les décisions commerciales, financières, administratives ou contractuelles prises sur la base des informations consultées relèvent exclusivement de la responsabilité de l’institution utilisatrice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 7 : TRAÇABILITÉ</h2>
            <p>Toutes les opérations sont enregistrées :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>date ;</li>
              <li>heure ;</li>
              <li>utilisateur ;</li>
              <li>adresse IP ;</li>
              <li>institution ;</li>
              <li>action réalisée.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 8 : SUSPENSION</h2>
            <p>AfricaRisque peut suspendre immédiatement tout accès en cas :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>d’usage frauduleux ;</li>
              <li>de violation des présentes CGU ;</li>
              <li>de risque de sécurité ;</li>
              <li>de réquisition légale.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 9 : MODIFICATION</h2>
            <p>
              AfricaRisque peut modifier les présentes CGU afin de tenir compte des évolutions légales, réglementaires ou techniques.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 10 : DROIT APPLICABLE</h2>
            <p>Les présentes CGU sont régies par le droit béninois.</p>
          </section>
        </div>
      </div>
    </div>
  );
}