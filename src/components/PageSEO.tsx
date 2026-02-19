import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noindex?: boolean;
}

const setMetaTag = (attr: string, attrValue: string, content: string) => {
  let element = document.querySelector(`meta[${attr}="${attrValue}"]`) as HTMLMetaElement | null;
  if (element) {
    element.setAttribute('content', content);
  } else {
    element = document.createElement('meta');
    element.setAttribute(attr, attrValue);
    element.setAttribute('content', content);
    document.head.appendChild(element);
  }
};

const setCanonical = (href: string) => {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (link) {
    link.href = href;
  } else {
    link = document.createElement('link');
    link.rel = 'canonical';
    link.href = href;
    document.head.appendChild(link);
  }
};

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

    setMetaTag('name', 'description', finalDescription);
    setCanonical(fullUrl);

    if (noindex) {
      setMetaTag('name', 'robots', 'noindex, nofollow');
    } else {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta && robotsMeta.getAttribute('content') === 'noindex, nofollow') {
        robotsMeta.setAttribute('content', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
      }
    }

    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:title', finalOgTitle);
    setMetaTag('property', 'og:description', finalOgDescription);
    setMetaTag('property', 'og:url', fullUrl);
    setMetaTag('property', 'og:site_name', 'FloRustic');
    setMetaTag('property', 'og:locale', 'ru_RU');
    setMetaTag('property', 'og:image', finalOgImage);

    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', finalOgTitle);
    setMetaTag('name', 'twitter:description', finalOgDescription);
    setMetaTag('name', 'twitter:image', finalOgImage);
  }, [finalTitle, finalDescription, fullUrl, finalOgTitle, finalOgDescription, finalOgImage, noindex]);

  return null;
};

export default PageSEO;