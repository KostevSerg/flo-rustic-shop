import { Helmet } from 'react-helmet-async';

interface CitySEOHelmetProps {
  cityName: string;
  citySlug: string;
}

const CitySEOHelmet = ({ cityName, citySlug }: CitySEOHelmetProps) => {
  const pageTitle = `Доставка цветов в ${cityName} — FloRustic | Букеты с доставкой в ${cityName}`;
  const pageDescription = `Доставка свежих цветов и букетов в ${cityName}. Большой выбор композиций для любого случая. Быстрая доставка по городу ${cityName}. Заказать букет онлайн с доставкой на дом. Свежие цветы, доступные цены.`;
  const pageUrl = `https://florustic.ru/city/${citySlug}`;
  const keywords = `доставка цветов ${cityName}, букеты ${cityName}, цветы ${cityName}, купить букет ${cityName}, заказать цветы ${cityName}, florustic ${cityName}, доставка цветов россия`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={pageUrl} />
      
      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content="FloRustic" />
      <meta property="og:locale" content="ru_RU" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": pageUrl,
          "name": `FloRustic — Доставка цветов в ${cityName}`,
          "description": pageDescription,
          "url": pageUrl,
          "areaServed": {
            "@type": "City",
            "name": cityName
          },
          "priceRange": "$$",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "127"
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": cityName,
            "addressCountry": "RU"
          },
          "priceRange": "₽₽"
        })}
      </script>
    </Helmet>
  );
};

export default CitySEOHelmet;
