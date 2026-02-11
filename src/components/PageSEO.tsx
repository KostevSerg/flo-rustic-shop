import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noindex?: boolean;
}

const PageSEO = ({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  noindex = false,
}: SEOProps) => {
  const location = useLocation();
  const baseUrl = 'https://florustic.ru';
  
  const fullUrl = canonical || `${baseUrl}${location.pathname}`;
  const finalTitle = title || 'Доставка цветов — FloRustic | Свежие букеты роз, тюльпанов, пионов с доставкой за 2 часа по всей России';
  const finalDescription = description || 'Служба доставки цветов FloRustic. Свежие букеты с доставкой за 1.5 часа после оплаты. Розы, тюльпаны, пионы, хризантемы, композиции ручной работы. Работаем 24/7 без выходных.';
  const finalOgTitle = ogTitle || title || 'Доставка цветов — FloRustic';
  const finalOgDescription = ogDescription || description || 'Служба доставки цветов FloRustic. Свежие букеты с доставкой по всей России';
  const finalOgImage = ogImage || 'https://cdn.poehali.dev/files/a67d7855-c81c-456d-8393-2b2ec7bfd0bd.png';

  useEffect(() => {
    document.title = finalTitle;
  }, [finalTitle]);

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={fullUrl} />
      
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      <meta property="og:type" content="website" />
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="FloRustic" />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:image" content={finalOgImage} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDescription} />
      <meta name="twitter:image" content={finalOgImage} />
    </Helmet>
  );
};

export default PageSEO;
