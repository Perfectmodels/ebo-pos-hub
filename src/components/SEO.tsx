import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: object;
}

export default function SEO({
  title = "Ebo'o Gest - Gestion Multi-Activités PME",
  description = "Solution de gestion complète pour restaurants, snacks, bars, cafés et commerces au Gabon. Gérez vos ventes, stock, personnel et rapports en un seul endroit.",
  keywords = "gestion PME, restaurant, snack, bar, café, point de vente, stock, personnel, rapports, Gabon, Libreville, Port-Gentil, Afrique, Ebo'o Gest, logiciel gestion, POS, caisse enregistreuse, FCFA, franc CFA",
  canonical = "https://ebo-gest.com",
  ogTitle,
  ogDescription,
  ogImage = "https://ebo-gest.com/logo-ebo-gest.png",
  ogType = "website",
  twitterCard = "summary_large_image",
  structuredData
}: SEOProps) {
  const fullTitle = title.includes("Ebo'o Gest") ? title : `${title} | Ebo'o Gest`;
  
  return (
    <Helmet>
      {/* Meta tags de base */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Ebo'o Gest" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph */}
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Ebo'o Gest" />
      <meta property="og:locale" content="fr_GA" />
      <meta property="og:country-name" content="Gabon" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@ebo_gest" />
      <meta name="twitter:creator" content="@ebo_gest" />
      
      {/* Données structurées */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
