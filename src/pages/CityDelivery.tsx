import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useCity } from '@/contexts/CityContext';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import API_ENDPOINTS from '@/config/api';
import { useCitySEO } from '@/hooks/useCitySEO';

interface Settlement {
  id: number;
  name: string;
  delivery_price: number;
}

interface City {
  id: number;
  name: string;
  region: string;
}

const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/ё/g, 'e')
    .replace(/ /g, '-')
    .replace(/а/g, 'a').replace(/б/g, 'b').replace(/в/g, 'v').replace(/г/g, 'g')
    .replace(/д/g, 'd').replace(/е/g, 'e').replace(/ж/g, 'zh').replace(/з/g, 'z')
    .replace(/и/g, 'i').replace(/й/g, 'j').replace(/к/g, 'k').replace(/л/g, 'l')
    .replace(/м/g, 'm').replace(/н/g, 'n').replace(/о/g, 'o').replace(/п/g, 'p')
    .replace(/р/g, 'r').replace(/с/g, 's').replace(/т/g, 't').replace(/у/g, 'u')
    .replace(/ф/g, 'f').replace(/х/g, 'h').replace(/ц/g, 'c').replace(/ч/g, 'ch')
    .replace(/ш/g, 'sh').replace(/щ/g, 'sch').replace(/ъ/g, '').replace(/ы/g, 'y')
    .replace(/ь/g, '').replace(/э/g, 'e').replace(/ю/g, 'yu').replace(/я/g, 'ya');
};

const CityDelivery = () => {
  const { citySlug } = useParams<{ citySlug: string }>();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { setCityFromSlug } = useCity();
  
  const [city, setCity] = useState<City | null>(null);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [content, setContent] = useState({ 
    title: 'Доставка', 
    htmlContent: '',
    metaDescription: 'Служба доставки цветов FloRustic по России. Свежие цветы — доставка в течение 1.5 часов после оплаты. Доставим букеты из роз, хризантем, альстромерий, пионов, лилий, гербер и т.д. Работаем 24/7 без выходных. Контроль качества. Фото букета перед доставкой!',
    metaKeywords: 'доставка цветов, условия доставки, доставка букетов'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!citySlug) return;
      
      setLoading(true);
      setError('');
      
      try {
        const citiesResponse = await fetch(API_ENDPOINTS.cities);
        const citiesData = await citiesResponse.json();
        
        const allCities: City[] = [];
        Object.values(citiesData.cities || {}).forEach((regionCities: any) => {
          allCities.push(...regionCities);
        });
        
        const foundCity = allCities.find((c: City) => createSlug(c.name) === citySlug);
        
        if (!foundCity) {
          setError('Город не найден');
          setLoading(false);
          return;
        }
        
        setCity(foundCity);
        setCityFromSlug(citySlug);

        const settlementsResponse = await fetch(`${API_ENDPOINTS.citySettlements}?action=settlements&city_id=${foundCity.id}`);
        const settlementsData = await settlementsResponse.json();
        
        const sortedSettlements = (settlementsData.settlements || []).sort((a: Settlement, b: Settlement) => 
          a.name.localeCompare(b.name, 'ru')
        );
        
        setSettlements(sortedSettlements);

        const contentResponse = await fetch(`${API_ENDPOINTS.pageContents}?page_key=delivery`);
        const contentData = await contentResponse.json();
        setContent({
          title: contentData.title || 'Доставка',
          htmlContent: contentData.content || '',
          metaDescription: contentData.meta_description || 'Служба доставки цветов FloRustic по России. Свежие цветы — доставка в течение 1.5 часов после оплаты. Работаем 24/7 без выходных. Контроль качества. Фото букета перед доставкой!',
          metaKeywords: contentData.meta_keywords || 'доставка цветов, условия доставки, доставка букетов'
        });
        
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [citySlug]);

  const settlementsList = settlements.slice(0, 5).map(s => s.name).join(', ');
  const settlementsCount = settlements.length;
  
  const pageTitle = city 
    ? `Условия доставки цветов ${city.name} — FloRustic | Доставка за 2 часа в ${settlements.slice(0, 3).map(s => s.name).join(', ')}`
    : 'Доставка - FloRustic';
  
  const pageDescription = city
    ? `Доставка цветов по городу ${city.name} и ${settlementsCount} населённым пунктам области. Развозим букеты в: ${settlementsList}${settlementsCount > 5 ? ` и ещё ${settlementsCount - 5} н.п.` : ''}. Стоимость от 200₽, время 1.5-2 часа. Работаем круглосуточно!`
    : content.metaDescription;
  
  const pageKeywords = city
    ? `условия доставки цветов ${city.name}, стоимость доставки ${city.name}, доставка букетов ${city.name}, доставка в населённые пункты ${city.name}, ${content.metaKeywords}`
    : content.metaKeywords;

  const canonicalUrl = `https://florustic.ru/city/${citySlug}/delivery`;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Helmet prioritizeSeoTags defer={false}>
          <html lang="ru" />
          <title>Загрузка...</title>
        </Helmet>
        <Header cartCount={totalItems} />
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="text-center py-12">
            <div className="animate-spin mx-auto mb-3 w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !city) {
    return (
      <div className="min-h-screen flex flex-col">
        <Helmet prioritizeSeoTags defer={false}>
          <html lang="ru" />
          <title>Город не найден - FloRustic</title>
        </Helmet>
        <Header cartCount={totalItems} />
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="text-center py-12">
            <Icon name="AlertCircle" size={64} className="mx-auto mb-4 text-destructive" />
            <h2 className="text-2xl font-bold mb-2">Город не найден</h2>
            <p className="text-muted-foreground mb-6">
              К сожалению, страница этого города не существует
            </p>
            <Button onClick={() => navigate('/')}>
              <Icon name="Home" size={18} className="mr-2" />
              На главную
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet prioritizeSeoTags defer={false}>
        <html lang="ru" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <link rel="canonical" href={canonicalUrl} />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="FloRustic" />
        <meta property="og:locale" content="ru_RU" />
        
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
                "name": city.name,
                "item": `https://florustic.ru/city/${citySlug}`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Доставка"
              }
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": `Доставка цветов в ${city.name}`,
            "description": pageDescription,
            "provider": {
              "@type": "Organization",
              "name": "FloRustic",
              "url": "https://florustic.ru"
            },
            "areaServed": settlements.map(s => ({
              "@type": "City",
              "name": s.name
            })),
            "offers": settlements.map(s => ({
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": `Доставка цветов в ${s.name}`
              },
              "price": s.delivery_price,
              "priceCurrency": "RUB"
            }))
          })}
        </script>
      </Helmet>
      
      <Header cartCount={totalItems} />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">

          
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Доставка цветов в {city.name}
          </h1>

          {content.htmlContent && (
            <div 
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: content.htmlContent }}
            />
          )}

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">
              Доставка букетов и цветов: населённые пункты и стоимость
            </h2>
            
            {settlements.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-card rounded-lg overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left p-4 font-semibold">Населённый пункт</th>
                      <th className="text-right p-4 font-semibold">Стоимость доставки</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settlements.map((settlement, index) => (
                      <tr 
                        key={settlement.id}
                        className={index % 2 === 0 ? 'bg-card' : 'bg-muted/30'}
                      >
                        <td className="p-4">{settlement.name}</td>
                        <td className="p-4 text-right font-semibold text-primary">
                          {settlement.delivery_price.toLocaleString('ru-RU')} ₽
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/30 rounded-lg">
                <Icon name="Package" size={48} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Информация о населённых пунктах пока недоступна
                </p>
              </div>
            )}
          </div>

          {settlements.length > 0 && (
            <div className="mt-16 bg-muted/30 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">
                Доставка цветов и букетов в населённые пункты
              </h2>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p className="mb-4">
                  Служба доставки FloRustic осуществляет доставку свежих цветов и букетов 
                  в {city.name} и следующие населённые пункты:
                </p>
                <p className="leading-relaxed">
                  {settlements.map((s, index) => (
                    <span key={s.id}>
                      <strong className="text-foreground">доставка цветов {s.name}</strong>
                      {index < settlements.length - 1 ? ', ' : '.'}
                    </span>
                  ))}
                </p>
                <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">
                  Как заказать доставку букетов в {city.name}?
                </h3>
                <p className="mb-4">
                  Заказать доставку букетов можно в любой из указанных населённых пунктов. 
                  Доставка цветов осуществляется ежедневно. Гарантируем свежесть и качество каждого букета. 
                  Работаем напрямую с поставщиками, поэтому предлагаем лучшие цены на доставку цветов 
                  в {city.name} и окрестностях.
                </p>
                <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">
                  Стоимость доставки букетов по населённым пунктам
                </h3>
                <p>
                  Цена доставки зависит от удалённости населённого пункта. В таблице выше указана точная 
                  стоимость доставки цветов для каждого населённого пункта. Минимальная стоимость доставки — 
                  от {Math.min(...settlements.map(s => s.delivery_price)).toLocaleString('ru-RU')} ₽.
                </p>
              </div>
            </div>
          )}

          <div className="mt-12 text-center">
            <Button 
              onClick={() => navigate(`/city/${citySlug}`)}
              size="lg"
            >
              <Icon name="ArrowLeft" size={18} className="mr-2" />
              Вернуться к каталогу
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CityDelivery;