import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function MentionLegale() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
        <Link to="/" className="inline-flex items-center text-sm text-cyan-600 dark:text-cyan-400 hover:underline mb-6">
          <ArrowLeft size={16} className="mr-2" /> Retour à l'accueil
        </Link>
        
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
          AFRICARISQUE - MENTIONS LÉGALES
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Version 1.0 — Dernière mise à jour : [DATE]
        </p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 1 : ÉDITEUR DE LA PLATEFORME</h2>
            <p>La plateforme AfricaRisque est éditée par :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Dénomination sociale :</strong> La société SCORE</li>
              <li><strong>Forme juridique :</strong> SARL</li>
              <li><strong>RCCM :</strong> </li>
              <li><strong>IFU :</strong> </li>
              <li><strong>Adresse du siège social :</strong> </li>
              <li><strong>Téléphone :</strong> </li>
              <li><strong>Email :</strong> </li>
              <li><strong>Directeur de publication :</strong> </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 2 : HÉBERGEMENT</h2>
            <p>La plateforme AfricaRisque est hébergée par :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Nom de l’hébergeur :</strong> </li>
              <li><strong>Adresse :</strong> [ADRESSE]</li>
              <li><strong>Pays :</strong> </li>
              <li><strong>Site web :</strong> </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 3 : OBJET DE LA PLATEFORME</h2>
            <p>
              AfricaRisque constitue une infrastructure sécurisée de consultation et de validation d’informations économiques et professionnelles destinées aux institutions autorisées dans le cadre de leurs processus d’évaluation des risques.
            </p>
            <p className="mt-2">
              AfricaRisque ne constitue ni une agence de notation, ni un organisme de crédit, ni une autorité publique.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 4 : PROPRIÉTÉ INTELLECTUELLE</h2>
            <p>
              Les marques, logos, bases de données, interfaces, documents, méthodologies et contenus présents sur la plateforme sont protégés par les lois applicables à la propriété intellectuelle.
            </p>
            <p className="mt-2">
              Toute reproduction, extraction, diffusion ou exploitation non autorisée est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 5 : CONTACT</h2>
            <p>
              Toute demande relative à la plateforme peut être adressée à : contact@africarisque.com
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ARTICLE 6 : DROIT APPLICABLE</h2>
            <p>
              Les présentes mentions légales sont soumises au droit de la République du Bénin.
            </p>
            <p className="mt-1">
              Tout litige relève de la compétence des juridictions béninoises compétentes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}