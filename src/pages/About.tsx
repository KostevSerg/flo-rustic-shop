import { useCart } from '@/contexts/CartContext';
import { useCity } from '@/contexts/CityContext';
import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreadcrumbsNav from '@/components/BreadcrumbsNav';
import API_ENDPOINTS from '@/config/api';

const getCityInPrepositionalCase = (city: string): string => {
  const cityMap: Record<string, string> = {
    'Барнаул': 'Барнауле',
    'Москва': 'Москве',
    'Санкт-Петербург': 'Санкт-Петербурге',
    'Новосибирск': 'Новосибирске',
    'Екатеринбург': 'Екатеринбурге',
    'Казань': 'Казани',
    'Нижний Новгород': 'Нижнем Новгороде',
    'Челябинск': 'Челябинске',
    'Самара': 'Самаре',
    'Омск': 'Омске',
    'Ростов-на-Дону': 'Ростове-на-Дону',
    'Уфа': 'Уфе',
    'Красноярск': 'Красноярске',
    'Воронеж': 'Воронеже',
    'Пермь': 'Перми',
    'Волгоград': 'Волгограде'
  };
  return cityMap[city] || city;
};

const About = () => {
  const { totalItems } = useCart();
  const { selectedCity } = useCity();
  const [content, setContent] = useState({ 
    title: 'О нас', 
    htmlContent: '',
    metaDescription: 'FloRustic — профессиональная флористическая студия с доставкой цветов по всей России.',
    metaKeywords: 'florustic, о нас, флористическая студия'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.pageContents}?page_key=about`);
        const data = await response.json();
        setContent({
          title: data.title || 'О нас',
          htmlContent: data.content || '',
          metaDescription: data.meta_description || 'FloRustic — профессиональная флористическая студия с доставкой цветов по всей России.',
          metaKeywords: data.meta_keywords || 'florustic, о нас, флористическая студия'
        });
      } catch (error) {
        console.error('Failed to load page content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const processedContent = useMemo(() => {
    if (!content.htmlContent) return '';
    
    const cityInPrepositional = getCityInPrepositionalCase(selectedCity);
    
    return content.htmlContent
      .replace(/\bБарнауле\b/g, cityInPrepositional)
      .replace(/\bБарнаул\b/g, selectedCity);
  }, [content.htmlContent, selectedCity]);

  const pageTitle = `${content.title} — FloRustic | Флористическая студия`;
  const pageDescription = content.metaDescription;

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={content.metaKeywords} />
        <link rel="canonical" href="https://florustic.ru/about" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content="https://florustic.ru/about" />
        
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
                "name": "О нас"
              }
            ]
          })}
        </script>
      </Helmet>
      
      <Header cartCount={totalItems} />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <BreadcrumbsNav items={[{ name: 'О нас' }]} />
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin mx-auto mb-3 w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
              <p className="text-muted-foreground">Загрузка...</p>
            </div>
          ) : (
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;