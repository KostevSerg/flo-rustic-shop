import { Helmet } from 'react-helmet-async';

interface CitySEOHelmetProps {
  cityName: string;
  citySlug: string;
  region?: string;
}

const getCityInPrepositional = (city: string): string => {
  const endings: Record<string, string> = {
    'Алейск': 'Алейске',
    'Ангарск': 'Ангарске',
    'Ачинск': 'Ачинске',
    'Барнаул': 'Барнауле',
    'Белгород': 'Белгороде',
    'Белово': 'Белово',
    'Белокуриха': 'Белокурихе',
    'Бийск': 'Бийске',
    'Бирюч': 'Бирюче',
    'Благовещенск': 'Благовещенске',
    'Боготол': 'Боготоле',
    'Бодайбо': 'Бодайбо',
    'Борисовка': 'Борисовке',
    'Бородино': 'Бородино',
    'Братск': 'Братске',
    'Валуйки': 'Валуйках',
    'Вилючинск': 'Вилючинске',
    'Волгоград': 'Волгограде',
    'Волоконовка': 'Волоконовке',
    'Воронеж': 'Воронеже',
    'Гальбштадт': 'Гальбштадте',
    'Гурьевск': 'Гурьевске',
    'Екатеринбург': 'Екатеринбурге',
    'Елизово': 'Елизово',
    'Енисейск': 'Енисейске',
    'Ермаковское': 'Ермаковском',
    'Железногорск': 'Железногорске',
    'Завитинск': 'Завитинске',
    'ЗАТО Циолковского': 'ЗАТО Циолковского',
    'Зеленогорск': 'Зеленогорске',
    'Зея': 'Зее',
    'Зима': 'Зиме',
    'Ивня': 'Ивне',
    'Иланский': 'Иланском',
    'Казань': 'Казани',
    'Камень-на-Оби': 'Камне-на-Оби',
    'Канск': 'Канске',
    'Кемерово': 'Кемерово',
    'Киселёвск': 'Киселёвске',
    'Короча': 'Короче',
    'Красноярск': 'Красноярске',
    'Куйтун': 'Куйтуне',
    'Кулунда': 'Кулунде',
    'Ленинск-Кузнецкий': 'Ленинске-Кузнецком',
    'Лесосибирск': 'Лесосибирске',
    'Мамонтово': 'Мамонтово',
    'Мариинск': 'Мариинске',
    'Междуреченск': 'Междуреченске',
    'Минусинск': 'Минусинске',
    'Москва': 'Москве',
    'Назарово': 'Назарово',
    'Нижний Новгород': 'Нижнем Новгороде',
    'Новокузнецк': 'Новокузнецке',
    'Новосибирск': 'Новосибирске',
    'Норильск': 'Норильске',
    'Омск': 'Омске',
    'Осинники': 'Осинниках',
    'Павловск': 'Павловске',
    'Пермь': 'Перми',
    'Петропавловск-Камчатский': 'Петропавловске-Камчатском',
    'Поспелиха': 'Поспелихе',
    'Прокопьевск': 'Прокопьевске',
    'Райчихинск': 'Райчихинске',
    'Ракитное': 'Ракитном',
    'Ребриха': 'Ребрихе',
    'Ростов-на-Дону': 'Ростове-на-Дону',
    'Рубцовск': 'Рубцовске',
    'Самара': 'Самаре',
    'Санкт-Петербург': 'Санкт-Петербурге',
    'Саянск': 'Саянске',
    'Свирск': 'Свирске',
    'Свободный': 'Свободном',
    'Славгород': 'Славгороде',
    'Слюдянка': 'Слюдянке',
    'Сосновоборск': 'Сосновоборске',
    'Строитель': 'Строителе',
    'Тайга': 'Тайге',
    'Тайшет': 'Тайшете',
    'Тальменка': 'Тальменке',
    'Тулун': 'Тулуне',
    'Ужур': 'Ужуре',
    'Усолье-Сибирское': 'Усолье-Сибирском',
    'Уфа': 'Уфе',
    'Уяр': 'Уяре',
    'Челябинск': 'Челябинске',
    'Черемхово': 'Черемхово',
    'Шарыпово': 'Шарыпово',
    'Шебекино': 'Шебекино',
    'Шелехово': 'Шелехово',
    'Шипуново': 'Шипуново',
    'Шуменское': 'Шуменском',
    'Юрга': 'Юрге',
    'Яровое': 'Яровом',
    'Яя': 'Яе'
  };
  
  return endings[city] || city + 'е';
};

const CitySEOHelmet = ({ cityName, citySlug, region }: CitySEOHelmetProps) => {
  // Не рендерим, пока citySlug пустой — иначе будет неправильный canonical
  if (!citySlug || !cityName) {
    return null;
  }

  const cityPrepositional = getCityInPrepositional(cityName);
  const regionPart = region ? `, ${region}` : '';
  const pageTitle = `Доставка цветов ${cityName}${regionPart} — FloRustic | Купить розы, тюльпаны, пионы с доставкой в ${cityPrepositional}`;
  const pageDescription = `Заказать свежие цветы с доставкой в ${cityName}${regionPart} от FloRustic. Букеты роз, тюльпанов, пионов, хризантем за 2 часа. Композиции ручной работы, стабилизированный мох. Круглосуточный заказ онлайн в ${cityPrepositional}!`;
  const pageUrl = `https://florustic.ru/city/${citySlug}`;
  const keywords = `доставка цветов ${cityName}, купить розы ${cityName}, букет роз ${cityName}, тюльпаны ${cityName}, пионы ${cityName}, хризантемы ${cityName}, орхидеи ${cityName}, цветы с доставкой ${cityName}, заказать букет ${cityName}, флорист ${cityName}`;

  return (
    <Helmet prioritizeSeoTags>
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
              "name": `Доставка цветов в ${cityPrepositional}`,
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
          "name": `FloRustic — Доставка цветов в ${cityPrepositional}`,
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
            "name": `Доставка цветов в ${cityPrepositional}`,
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": `Букеты с доставкой в ${cityPrepositional}`
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": `Композиции из стабилизированного мха в ${cityPrepositional}`
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
              "name": `Сколько стоит букет роз в ${cityPrepositional}?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Цена букета роз зависит от количества и сорта: букет из 25 роз от 2500₽, из 51 розы от 4500₽, из 101 розы от 8500₽."
              }
            },
            {
              "@type": "Question",
              "name": "Можно ли купить тюльпаны круглый год?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Тюльпаны доступны круглый год, но пик сезона — с февраля по май. В этот период самый большой выбор сортов и расцветок."
              }
            },
            {
              "@type": "Question",
              "name": `Как быстро можно доставить букет из пионов в ${cityPrepositional}?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Стандартная доставка букета из пионов занимает 2-4 часа с момента заказа. Пионы — сезонные цветы (май-июль)."
              }
            },
            {
              "@type": "Question",
              "name": "Можно ли заказать букет из орхидей с доставкой?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Да, орхидеи доступны круглый год. Можно заказать как срезанные орхидеи в букете, так и живые орхидеи в горшках."
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
      
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": `Цветы с доставкой в ${cityPrepositional}`,
          "itemListElement": [
            {
              "@type": "Product",
              "position": 1,
              "name": `Букет роз в ${cityPrepositional}`,
              "description": `Купить букет роз в ${cityPrepositional} с доставкой за 2 часа`,
              "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "RUB",
                "lowPrice": "2500",
                "highPrice": "8500"
              }
            },
            {
              "@type": "Product",
              "position": 2,
              "name": `Букет тюльпанов в ${cityPrepositional}`,
              "description": `Купить свежие тюльпаны в ${cityPrepositional} с доставкой`,
              "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "RUB",
                "lowPrice": "1500",
                "highPrice": "5000"
              }
            },
            {
              "@type": "Product",
              "position": 3,
              "name": `Букет пионов в ${cityPrepositional}`,
              "description": `Купить пионы в ${cityPrepositional} — сезонные цветы с доставкой`,
              "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "RUB",
                "lowPrice": "3000",
                "highPrice": "7000"
              }
            },
            {
              "@type": "Product",
              "position": 4,
              "name": `Орхидеи в ${cityPrepositional}`,
              "description": `Купить орхидеи в горшках и срезке в ${cityPrepositional}`,
              "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "RUB",
                "lowPrice": "2000",
                "highPrice": "6000"
              }
            }
          ]
        })}
      </script>
    </Helmet>
  );
};

export default CitySEOHelmet;