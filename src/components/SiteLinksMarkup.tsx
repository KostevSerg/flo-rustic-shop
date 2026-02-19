import { useEffect } from 'react';

const SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "SiteNavigationElement",
      "position": 1,
      "name": "Каталог букетов",
      "description": "Полный каталог свежих букетов и цветочных композиций",
      "url": "https://florustic.ru/catalog"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 2,
      "name": "О компании",
      "description": "Информация о FloRustic и нашей философии",
      "url": "https://florustic.ru/about"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 3,
      "name": "Доставка",
      "description": "Условия и стоимость доставки цветов",
      "url": "https://florustic.ru/delivery"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 4,
      "name": "Гарантии",
      "description": "Гарантии свежести и качества цветов",
      "url": "https://florustic.ru/guarantees"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 5,
      "name": "Отзывы",
      "description": "Отзывы клиентов о доставке цветов",
      "url": "https://florustic.ru/reviews"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 6,
      "name": "Контакты",
      "description": "Телефон, адрес, режим работы FloRustic",
      "url": "https://florustic.ru/contacts"
    }
  ]
});

const SiteLinksMarkup = () => {
  useEffect(() => {
    const scriptId = 'sitelinks-jsonld';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = SCHEMA;

    return () => {
      script?.remove();
    };
  }, []);

  return null;
};

export default SiteLinksMarkup;