import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  ogImage = 'https://africarisque.com/og-image.png',
  canonical,
}) => {
  const { pathname } = useLocation();

  const siteName = "AfricaRisque";
  const defaultCanonical = `https://africarisque.com${pathname}`;

  const seoKeywords = [
    // core
    "AfricaRisque",
    "plateforme de gestion des risques",
    "analyse de risque crédit",
    "évaluation de risque financier",
    "risque de non-remboursement",

    // Afrique / marché cible
    "risque financier Afrique de l’Ouest",
    "microfinance Afrique",
    "PME Afrique finance",

    // produits
    "logiciel d’évaluation de crédit",
    "plateforme d’analyse de risque",
    "gestion des risques financiers",
    "scoring crédit alternatif",

    // intent search
    "comment évaluer un client informel",
    "analyse de risque crédit PME",
    "réduction des impayés",
    "analyse financière emprunteur"
  ];

  const finalKeywords = Array.from(new Set([...seoKeywords, ...keywords])).join(', ');

  return (
    <Helmet>
      <title>{title}</title>

      <meta name="description" content={description} />
      <meta name="keywords" content={finalKeywords} />
      <link rel="canonical" href={canonical || defaultCanonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
