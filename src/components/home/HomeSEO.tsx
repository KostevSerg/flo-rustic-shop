import { Helmet } from 'react-helmet-async';
import SiteLinksMarkup from '@/components/SiteLinksMarkup';

interface HomeSEOProps {
  isHomePage: boolean;
  selectedCity: string;
}

const HomeSEO = ({ isHomePage, selectedCity }: HomeSEOProps) => {
  const pageTitle = selectedCity 
    ? `Доставка цветов в ${selectedCity} — FloRustic | Свежие букеты с доставкой`
    : 'FloRustic — Доставка свежих цветов и букетов по всей России';
  
  const pageDescription = selectedCity
    ? `Служба доставки цветов в ${selectedCity}. Свежие цветы в ${selectedCity} — доставка в течение 1.5 часов после оплаты. Розы, тюльпаны, композиции ручной работы. Более 500 букетов. Заказ онлайн 24/7!`
    : 'Служба доставки цветов по России — более 200 городов. Свежие букеты ручной работы. Доставка в течение 1.5 часов после оплаты. Заказ онлайн 24/7!';

  const keywords = selectedCity
    ? `доставка цветов ${selectedCity}, букеты ${selectedCity}, цветы ${selectedCity}, заказать букет ${selectedCity}, купить цветы ${selectedCity}, florustic ${selectedCity}, доставка цветов россия`
    : 'доставка цветов россия, букеты с доставкой, цветы онлайн, заказать букет россия, купить цветы с доставкой, florustic, интернет магазин цветов';

  const canonicalUrl = 'https://florustic.ru/';

  if (!isHomePage) return null;

  return (
    <>
      <Helmet defer={false}>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={canonicalUrl} />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="FloRustic" />
        <meta property="og:locale" content="ru_RU" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FloristShop",
            "name": "FloRustic",
            "description": pageDescription,
            "url": canonicalUrl,
            "telephone": "+7-xxx-xxx-xxxx",
            "priceRange": "₽₽",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": selectedCity || "Россия",
              "addressCountry": "RU"
            },
            "openingHours": "Mo-Su 09:00-21:00",
            "areaServed": ["Москва", "Санкт-Петербург", "Казань", "Екатеринбург", "Новосибирск", "Россия"]
          })}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "FloRustic",
            "description": pageDescription,
            "url": "https://florustic.ru",
            "logo": "https://florustic.ru/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Service",
              "availableLanguage": "Russian"
            }
          })}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "FloRustic",
            "url": "https://florustic.ru",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://florustic.ru/catalog?search={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>
      <SiteLinksMarkup />
    </>
  );
};

export default HomeSEO;
