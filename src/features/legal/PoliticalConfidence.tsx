import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PoliticalConfidence() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
        <Link to="/" className="inline-flex items-center text-sm text-cyan-600 dark:text-cyan-400 hover:underline mb-6">
          <ArrowLeft size={16} className="mr-2" /> Retour à l'accueil
        </Link>

        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
          POLITIQUE DE CONFIDENTIALITÉ ET DE PROTECTION DES DONNÉES PERSONNELLES AFRICARISQUE
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Version 1.0 — Date d’entrée en vigueur : [DATE]
        </p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">1. PRÉAMBULE</h2>
            <p>
              AfricaRisque accorde une importance fondamentale à la protection des données personnelles, à la sécurité des informations et au respect de la vie privée.
            </p>
            <p className="mt-2">
              La présente Politique de Confidentialité décrit les modalités selon lesquelles les données sont collectées, vérifiées, conservées, utilisées, sécurisées et communiquées dans le cadre de l’exploitation de la plateforme AfricaRisque.
            </p>
            <p className="mt-2">
              AfricaRisque applique les principes de légalité, de transparence, de sécurité, de confidentialité, de proportionnalité et de responsabilité conformément aux dispositions applicables de la République du Bénin.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">2. DÉFINITIONS</h2>
            <p>Aux fins de la présente politique :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Donnée personnelle :</strong> Toute information permettant d’identifier directement ou indirectement une personne physique.</li>
              <li><strong>Traitement :</strong> Toute opération portant sur des données personnelles, notamment la collecte, l’enregistrement, l’organisation, la conservation, la consultation, la modification, la communication ou la suppression.</li>
              <li><strong>Personne assermentée :</strong> Toute personnes aya</li>
              <li><strong>Personne concernée :</strong> Toute personne dont les données font l’objet d’un traitement au sein de la plateforme.</li>
              <li><strong>Utilisateur habilité :</strong> Toute personne disposant d’un accès autorisé à la plateforme conformément aux procédures d’AfricaRisque.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">3. IDENTITÉ DU RESPONSABLE DE TRAITEMENT</h2>
            <p>Responsable du traitement :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Nom de la société :</strong> </li>
              <li><strong>Adresse :</strong> </li>
              <li><strong>Téléphone :</strong> </li>
              <li><strong>Email :</strong> </li>
            </ul>
            <p className="mt-2">
              <strong>Contact Protection des Données :</strong> @africarisque.com
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">4. FINALITÉS DU TRAITEMENT</h2>
            <p>Les traitements réalisés par AfricaRisque ont pour finalités :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Faciliter l’accès à des informations informelles vérifiées dans le cadre de l’analyse des risques ;</li>
              <li>Renforcer la confiance entre les acteurs économiques ;</li>
              <li>Réduire les risques de fraude documentaire ;</li>
              <li>Favoriser l’inclusion financière ;</li>
              <li>Améliorer la qualité des processus d’évaluation ;</li>
              <li>Sécuriser les opérations réalisées par les institutions partenaires ;</li>
              <li>Garantir la traçabilité des consultations ;</li>
              <li>Assurer la conformité réglementaire de la plateforme.</li>
            </ul>
            <p className="mt-2">
              AfricaRisque ne prend aucune décision automatisée produisant des effets juridiques à l’égard des personnes concernées.
            </p>
            <p className="mt-1">
              Les décisions finales appartiennent exclusivement aux institutions utilisatrices.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">5. CATÉGORIES DE DONNÉES TRAITÉES</h2>
            <p>Selon les besoins opérationnels, AfricaRisque peut traiter :</p>
            <div className="space-y-3 mt-2">
              <div>
                <strong>A. Données d’identification</strong>
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  <li>Nom</li>
                  <li>Prénom</li>
                  <li>Sexe</li>
                  <li>Date de naissance</li>
                  <li>Photographie</li>
                  <li>Numéro d’identification</li>
                  <li>Références administratives</li>
                </ul>
              </div>
              <div>
                <strong>B. Données de contact</strong>
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  <li>Numéro de téléphone</li>
                  <li>Adresse</li>
                  <li>Localité</li>
                  <li>Informations professionnelles</li>
                </ul>
              </div>
              <div>
                <strong>C. Données économiques</strong>
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  <li>Activité exercée</li>
                  <li>Historique professionnel</li>
                  <li>Références économiques</li>
                  <li>Informations relatives aux activités déclarées</li>
                </ul>
              </div>
              <div>
                <strong>D. Données de validation</strong>
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  <li>Rapports d’enquête</li>
                  <li>Observations terrain</li>
                  <li>Documents justificatifs</li>
                  <li>Historique des validations</li>
                </ul>
              </div>
              <div>
                <strong>E. Données techniques</strong>
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  <li>Adresse IP</li>
                  <li>Identifiant utilisateur</li>
                  <li>Journaux de connexion</li>
                  <li>Horodatages</li>
                  <li>Historique des operations</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">6. ORIGINE DES DONNÉES</h2>
            <p>Les données peuvent provenir :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>de la personne concernée ;</li>
              <li>d’un agent assermenté ;</li>
              <li>d’une institution partenaire ;</li>
              <li>de documents justificatifs fournis ;</li>
              <li>de procédures de vérification terrain ;</li>
              <li>de validations croisées réalisées conformément aux procédures internes.</li>
            </ul>
            <p className="mt-2">AfricaRisque s’efforce de garantir l’exactitude des informations collectées.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">7. BASES LÉGALES DU TRAITEMENT</h2>
            <p>Les traitements réalisés reposent notamment sur :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>le consentement par mail lorsque celui-ci est requis ;</li>
              <li>l’exécution d’une relation contractuelle ;</li>
              <li>les obligations légales applicables ;</li>
              <li>l’intérêt légitime poursuivi par AfricaRisque et ses partenaires dans le respect des droits des personnes concernées.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">8. PRINCIPE DE CONSULTATION CONTRÔLÉE</h2>
            <p>AfricaRisque applique un principe de consultation encadrée. Les données ne sont pas librement accessibles.</p>
            <p className="mt-2">Toute consultation nécessite :</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>une authentification auprès d’unepersonne assermentée ou institutions financières;</li>
              <li>une habilitation préalable ;</li>
              <li>une justification professionnelle ;</li>
              <li>une traçabilité complète.</li>
            </ul>
            <p className="mt-2">Aucun accès public n’est autorisé.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">9. CATÉGORIES D’UTILISATEURS AUTORISÉS</h2>
            <p>Les accès sont limités aux catégories suivantes :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Administrateur Central (ADM)</li>
              <li>Représentant Pays (REP)</li>
              <li>Institution Partenaire (FO)</li>
              <li>Agent Assermenté (AGT)</li>
              <li>Conseiller Autorisé (CSL)</li>
            </ul>
            <p className="mt-2">Chaque profil dispose uniquement des droits strictement nécessaires à l’exercice de ses missions.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">10. PARTAGE DES DONNÉES</h2>
            <p>Les informations peuvent être communiquées exclusivement :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>aux institutions partenaires habilitées ;</li>
              <li>aux agents autorisés ;</li>
              <li>aux autorités légalement compétentes lorsque la loi l’exige ;</li>
              <li>aux prestataires techniques soumis à des obligations de confidentialité.</li>
            </ul>
            <p className="mt-2">
              AfricaRisque ne vend pas les données personnelles. AfricaRisque ne met pas à disposition de bases de données ouvertes au public.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">11. SÉCURITÉ DES DONNÉES</h2>
            <p>AfricaRisque met en œuvre des mesures techniques et organisationnelles adaptées.</p>
            <p className="mt-2">Ces mesures comprennent notamment :</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>authentification des utilisateurs ;</li>
              <li>contrôle des habilitations ;</li>
              <li>chiffrement des communications ;</li>
              <li>sauvegardes sécurisées ;</li>
              <li>validation croisée des opérations ;</li>
              <li>audit périodique des accès ;</li>
              <li>surveillance des incidents de sécurité.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">12. TRAÇABILITÉ</h2>
            <p>Toutes les opérations significatives sont enregistrées.</p>
            <p className="mt-2">Les journaux peuvent inclure :</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>identité de l’utilisateur ;</li>
              <li>date ;</li>
              <li>heure ;</li>
              <li>adresse IP ;</li>
              <li>action effectuée ;</li>
              <li>référence du dossier concerné.</li>
            </ul>
            <p className="mt-2">Cette traçabilité vise à garantir la sécurité, la conformité et la responsabilité des utilisateurs.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">13. CONSERVATION DES DONNÉES</h2>
            <p>Les données sont conservées pendant une durée proportionnée à leurs finalités.</p>
            <p className="mt-2">À l’expiration des durées applicables :</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>les données sont supprimées ;</li>
              <li>anonymisées ;</li>
              <li>ou archivées conformément aux obligations légales.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">14. DROITS DES PERSONNES CONCERNÉES</h2>
            <p>Sous réserve des limitations prévues par la loi, toute personne concernée peut demander :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>l’accès à ses données ;</li>
              <li>la rectification des informations inexactes ;</li>
              <li>la mise à jour des informations ;</li>
              <li>des explications sur les traitements réalisés ;</li>
              <li>l’exercice de ses droits reconnus par la réglementation applicable.</li>
            </ul>
            <p className="mt-2">
              Les demandes peuvent être adressées à : ......@africarisque.com
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">15. GESTION DES RÉCLAMATIONS</h2>
            <p>
              Toute personne estimant que ses droits n’ont pas été respectés peut adresser une réclamation écrite à AfricaRisque.
            </p>
            <p className="mt-1">AfricaRisque s’engage à examiner toute demande dans un délai raisonnable.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">16. TRANSFERTS INTERNATIONAUX</h2>
            <p>
              En cas de déploiement international de la plateforme, tout transfert de données fera l’objet des garanties appropriées prévues par la réglementation applicable.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">17. RESPONSABILITÉ DES UTILISATEURS</h2>
            <p>Tout utilisateur habilité s’engage à :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>respecter la confidentialité ;</li>
              <li>protéger ses identifiants ;</li>
              <li>signaler tout incident de sécurité ;</li>
              <li>utiliser les données uniquement dans le cadre autorisé.</li>
            </ul>
            <p className="mt-2">Toute violation peut entraîner :</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>suspension ;</li>
              <li>retrait d’habilitation ;</li>
              <li>résiliation contractuelle ;</li>
              <li>poursuites judiciaires.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">18. MODIFICATION DE LA POLITIQUE</h2>
            <p>AfricaRisque peut modifier la présente politique afin de tenir compte :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>des évolutions réglementaires ;</li>
              <li>des évolutions technologiques ;</li>
              <li>des besoins de sécurité ;</li>
              <li>des améliorations opérationnelles.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">19. DROIT APPLICABLE</h2>
            <p>La présente Politique de Confidentialité est régie par le droit de la République du Bénin.</p>
            <p className="mt-1">Tout différend relève de la compétence des juridictions béninoises compétentes.</p>
          </section>
        </div>
      </div>
    </div>
  );
  <Footer/>

}