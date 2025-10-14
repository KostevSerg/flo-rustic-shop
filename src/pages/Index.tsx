import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface City {
  id: number;
  name: string;
  slug: string;
}

const Index = () => {
  const { addToCart, totalItems } = useCart();
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/bb2b7d69-0c7e-4fa4-a4dc-fe6f20b98c33');
        const data = await response.json();
        setCities(data.cities || []);
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  const popularProducts = [
    {
      id: 1,
      name: 'Нежность',
      description: 'Букет из розовых и белых роз с эвкалиптом',
      price: 3500,
      image: 'https://cdn.poehali.dev/projects/be23cceb-0ab8-4764-8b57-fed61fedc50e/files/24578968-7a19-4e34-bde7-3db4eeb6fbfb.jpg'
    },
    {
      id: 2,
      name: 'Классика',
      description: 'Элегантный букет из красных роз и белых лилий',
      price: 4200,
      image: 'https://cdn.poehali.dev/projects/be23cceb-0ab8-4764-8b57-fed61fedc50e/files/0d6e767d-1dda-4de4-a9eb-29047a061763.jpg'
    },
    {
      id: 3,
      name: 'Полевой',
      description: 'Букет с подсолнухами, ромашками и зеленью',
      price: 2800,
      image: 'https://cdn.poehali.dev/projects/be23cceb-0ab8-4764-8b57-fed61fedc50e/files/77f65509-61f6-4258-b779-cb174989f3e5.jpg'
    }
  ];

  const handleAddToCart = (product: typeof popularProducts[0]) => {
    addToCart(product);
  };

  const citiesList = cities.map(c => c.name).join(', ');
  const pageTitle = 'FloRustic — Доставка свежих цветов и букетов по России';
  const pageDescription = `Доставка свежих цветов и букетов в ${citiesList || 'города России'}. Широкий выбор композиций для любого случая. Заказать букет онлайн с быстрой доставкой на дом.`;

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="доставка цветов, букеты с доставкой, заказать цветы онлайн, купить букет, свежие цветы, цветы на дом" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content="https://florustic.ru" />
        <meta property="og:site_name" content="FloRustic" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        
        <link rel="canonical" href="https://florustic.ru" />
        
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
      </Helmet>
      
      <Header cartCount={totalItems} />
      
      <section className="relative bg-gradient-to-br from-accent/20 to-background py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Цветы, которые дарят эмоции
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
              Свежие букеты с доставкой по городу. Создаем композиции с душой и вниманием к деталям.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link to="/catalog">
                <Button size="lg" className="bg-primary text-primary-foreground hover:opacity-90 text-lg px-8">
                  Смотреть каталог
                </Button>
              </Link>
              <Link to="/contacts">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Связаться с нами
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Популярные товары</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Наши самые любимые композиции, которые выбирают чаще всего
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {popularProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={() => handleAddToCart(product)} />
            ))}
          </div>
          <div className="text-center">
            <Link to="/catalog">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Весь каталог
                <Icon name="ArrowRight" size={20} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Доставка по городам</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Выберите свой город для просмотра актуального каталога и цен
          </p>
          
          {loadingCities ? (
            <div className="text-center py-8">
              <div className="animate-spin mx-auto mb-3 w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
              <p className="text-muted-foreground">Загрузка городов...</p>
            </div>
          ) : cities.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
              {cities.map(city => (
                <Link 
                  key={city.id} 
                  to={`/city/${city.slug}`}
                  className="group"
                >
                  <div className="bg-card border rounded-lg p-6 text-center hover:border-primary hover:shadow-lg transition-all duration-300">
                    <Icon name="MapPin" size={32} className="mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {city.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Города пока не добавлены</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Flower2" size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Свежие цветы</h3>
              <p className="text-muted-foreground text-sm">
                Прямые поставки от лучших производителей
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Truck" size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Доставка</h3>
              <p className="text-muted-foreground text-sm">
                Бесплатная доставка в пределах центра
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Shield" size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Гарантия</h3>
              <p className="text-muted-foreground text-sm">
                Свежесть букета минимум 7 дней
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Clock" size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Работаем 24/7</h3>
              <p className="text-muted-foreground text-sm">
                Принимаем заказы круглосуточно
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;