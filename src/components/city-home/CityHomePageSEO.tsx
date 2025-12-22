import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import API_ENDPOINTS from '@/config/api';

interface CityHomePageSEOProps {
  cityName: string;
  cityInPrepositional: string;
  citySlug: string;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

const CityHomePageSEO = ({ cityName, cityInPrepositional, citySlug }: CityHomePageSEOProps) => {
  const [reviewStats, setReviewStats] = useState<ReviewStats>({ averageRating: 0, totalReviews: 0 });

  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.reviews);
        const data = await response.json();
        const approvedReviews = (data.reviews || []).filter((r: any) => r.status === 'approved');
        
        if (approvedReviews.length > 0) {
          const avgRating = approvedReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / approvedReviews.length;
          setReviewStats({
            averageRating: Math.round(avgRating * 10) / 10,
            totalReviews: approvedReviews.length
          });
        }
      } catch (error) {
        console.error('Failed to fetch review stats:', error);
      }
    };

    fetchReviewStats();
  }, []);
  const pageTitle = `Доставка цветов ${cityName} — FloRustic | Купить розы, тюльпаны, пионы с доставкой в ${cityInPrepositional}`;
  const pageDescription = `Заказать свежие цветы с доставкой в ${cityName} от FloRustic. Букеты роз, тюльпанов, пионов, хризантем за 2 часа. Композиции ручной работы. Круглосуточный заказ онлайн в ${cityInPrepositional}!`;
  const keywords = `доставка цветов ${cityName}, букеты ${cityName}, цветы ${cityName}, заказать букет ${cityName}, купить цветы ${cityName}, florustic ${cityName}, розы ${cityName}, тюльпаны ${cityName}`;
  const canonicalUrl = `https://florustic.ru/${citySlug}`;

  return (
    <Helmet prioritizeSeoTags defer={false}>
      <html lang="ru" />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="FloRustic" />
      
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
              "name": `Доставка цветов в ${cityInPrepositional}`,
              "item": canonicalUrl
            }
          ]
        })}
      </script>
      
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": canonicalUrl,
          "name": `FloRustic — Доставка цветов в ${cityInPrepositional}`,
          "description": pageDescription,
          "url": canonicalUrl,
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
          ...(reviewStats.totalReviews > 0 && {
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": reviewStats.averageRating.toString(),
              "bestRating": "5",
              "worstRating": "1",
              "reviewCount": reviewStats.totalReviews.toString()
            }
          }),
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": `Доставка цветов в ${cityInPrepositional}`,
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": `Букеты с доставкой в ${cityInPrepositional}`
                }
              }
            ]
          }
        })}
      </script>
    </Helmet>
  );
};

export default CityHomePageSEO;