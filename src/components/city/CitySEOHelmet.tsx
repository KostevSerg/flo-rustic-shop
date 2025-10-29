import { Helmet } from 'react-helmet-async';

interface CitySEOHelmetProps {
  cityName: string;
  citySlug: string;
}

const CitySEOHelmet = ({ cityName, citySlug }: CitySEOHelmetProps) => {
  const pageTitle = `Купить цветы в ${cityName} с доставкой — FloRustic | Букеты ${cityName}`;
  const pageDescription = `Купить цветы в ${cityName} с доставкой за 2 часа. Свежие букеты, розы, тюльпаны, композиции ручной работы. Более 500 букетов в каталоге FloRustic. Заказ онлайн 24/7!`;
  const pageUrl = `https://florustic.ru/city/${citySlug}`;
  const keywords = `доставка цветов ${cityName}, букеты ${cityName}, цветы ${cityName}, купить букет ${cityName}, заказать цветы ${cityName}, florustic ${cityName}, цветы с доставкой ${cityName}`;

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
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Главная",
              "item": "https://florustic.ru/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": `Доставка цветов в ${cityName}`,
              "item": pageUrl
            }
          ]
        })}
      </script>
      
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
          "priceRange": "₽₽",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": cityName,
            "addressCountry": "RU"
          },
          "openingHours": "Mo-Su 09:00-21:00",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": `Доставка цветов в ${cityName}`,
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": `Букеты с доставкой в ${cityName}`
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": `Композиции из стабилизированного мха в ${cityName}`
                }
              }
            ]
          }
        })}
      </script>
      
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Как быстро можно доставить букет?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Стандартная доставка занимает 2-4 часа с момента оформления заказа. Также доступна срочная доставка за 1 час с доплатой."
              }
            },
            {
              "@type": "Question",
              "name": "Можно ли доставить букет анонимно?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Да, мы можем организовать анонимную доставку. Просто укажите это при оформлении заказа, и курьер передаст букет без упоминания отправителя."
              }
            },
            {
              "@type": "Question",
              "name": "Какие способы оплаты вы принимаете?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Мы принимаем оплату банковскими картами (Visa, MasterCard, МИР), наличными курьеру при получении, а также безналичный расчет для юридических лиц."
              }
            },
            {
              "@type": "Question",
              "name": "Что делать, если букет не понравился?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Если вы не удовлетворены качеством букета, свяжитесь с нашей службой поддержки в течение 24 часов. Мы либо заменим букет бесплатно, либо вернем полную стоимость заказа."
              }
            }
          ]
        })}
      </script>
    </Helmet>
  );
};

export default CitySEOHelmet;