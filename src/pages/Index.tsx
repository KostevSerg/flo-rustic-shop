import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '@/contexts/CartContext';
import { useSiteTexts } from '@/contexts/SiteTextsContext';
import { useCity } from '@/contexts/CityContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ReviewsSection from '@/components/ReviewsSection';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import API_ENDPOINTS from '@/config/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_featured?: boolean;
}

const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/ё/g, 'e')
    .replace(/[^\u0430-\u044f\u0410-\u042fa-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

const Index = () => {
  const { addToCart, totalItems } = useCart();
  const { getText } = useSiteTexts();
  const { selectedCity, initAutoDetection } = useCity();
  const citySlug = createSlug(selectedCity);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initAutoDetection();
  }, []);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.products}?city=${encodeURIComponent(selectedCity)}`);
        const data = await response.json();
        const featured = data.products.filter((p: Product) => p.is_featured);
        setFeaturedProducts(featured.slice(0, 3));
      } catch (error) {
        console.error('Failed to load featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, [selectedCity]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      description: product.description,
      composition: product.composition,
      price: product.price,
      image: product.image_url
    });
  };

  const pageTitle = selectedCity 
    ? `Доставка цветов в ${selectedCity} — FloRustic | Свежие букеты с доставкой`
    : 'FloRustic — Доставка свежих цветов и букетов по России';
  
  const pageDescription = selectedCity
    ? `Доставка свежих цветов и букетов в ${selectedCity}. Широкий выбор композиций для любого случая. Заказать букет онлайн с быстрой доставкой на дом. Свежие цветы, доступные цены.`
    : 'Доставка свежих цветов и букетов по всей России. Широкий выбор композиций для любого случая. Заказать букет онлайн с быстрой доставкой на дом. Работаем ежедневно.';

  const keywords = selectedCity
    ? `доставка цветов ${selectedCity}, букеты ${selectedCity}, цветы ${selectedCity}, заказать букет ${selectedCity}, купить цветы ${selectedCity}, florustic ${selectedCity}, доставка цветов россия`
    : 'доставка цветов россия, букеты с доставкой, цветы онлайн, заказать букет россия, купить цветы с доставкой, florustic, интернет магазин цветов';

  const canonicalUrl = selectedCity && citySlug
    ? `https://florustic.ru/city/${citySlug}`
    : 'https://florustic.ru/';

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
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
            "areaServed": ["Москва", "Санкт-Петербург", "Казань", "Екатеринбург", "Новосибирск", "Россия"],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "127"
            }
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
      </Helmet>
      
      <Header cartCount={totalItems} />
      
      <section className="relative bg-gradient-to-br from-accent/20 to-background py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              {getText('home', 'hero_title', 'Цветы, которые дарят эмоции')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
              {getText('home', 'hero_subtitle', 'Свежие букеты с доставкой по городу. Создаем композиции с душой и вниманием к деталям.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link to={`/city/${citySlug}`}>
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
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            {getText('home', 'popular_title', 'Популярные товары')}
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            {getText('home', 'popular_subtitle', 'Наши самые любимые композиции, которые выбирают чаще всего')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Загрузка товаров...</p>
              </div>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={{
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    image: product.image_url
                  }} 
                  onAddToCart={() => handleAddToCart(product)} 
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Популярные товары скоро появятся</p>
              </div>
            )}
          </div>
          <div className="text-center">
            <Link to={`/city/${citySlug}`}>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Весь каталог
                <Icon name="ArrowRight" size={20} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <ReviewsSection />

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Почему выбирают FloRustic
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Мы — служба доставки цветов по всей России{selectedCity ? `, включая ${selectedCity}` : ''}. 
              Собираем красивые букеты из свежих цветов на любой случай.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Flower2" size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Свежие цветы</h3>
              <p className="text-muted-foreground text-sm">
                Прямые поставки от лучших производителей каждый день
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Truck" size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Быстрая доставка</h3>
              <p className="text-muted-foreground text-sm">
                Доставляем за 2 часа по всему городу. Работаем ежедневно 9:00-21:00
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Shield" size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">100% Качество</h3>
              <p className="text-muted-foreground text-sm">
                Каждый букет проходит контроль качества перед доставкой
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Heart" size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">С любовью</h3>
              <p className="text-muted-foreground text-sm">
                Каждый букет создаём вручную опытные флористы с многолетним стажем
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
              Доставка цветов — это просто!
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-3 flex items-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground mr-3">1</span>
                    Выберите букет
                  </h3>
                  <p className="text-muted-foreground pl-13">
                    В каталоге более 50 композиций: розы, пионы, тюльпаны, орхидеи и другие цветы.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 flex items-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground mr-3">2</span>
                    Оформите заказ
                  </h3>
                  <p className="text-muted-foreground pl-13">
                    Укажите адрес доставки в {selectedCity || 'вашем городе'}, время и пожелания. Открытка в подарок бесплатно.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-3 flex items-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground mr-3">3</span>
                    Мы соберём букет
                  </h3>
                  <p className="text-muted-foreground pl-13">
                    Флористы составят композицию из свежих цветов в красивой дизайнерской упаковке.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 flex items-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground mr-3">4</span>
                    Доставим вовремя
                  </h3>
                  <p className="text-muted-foreground pl-13">
                    Курьер привезёт букет точно в срок. Доставка по {selectedCity || 'всей России'}.
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Link to={`/city/${citySlug}`}>
                <Button size="lg" className="text-lg px-8">
                  Заказать букет сейчас
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Цветы для любого повода
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-background p-6 rounded-lg">
                <Icon name="Heart" size={40} className="text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Романтика</h3>
                <p className="text-muted-foreground">
                  Букеты роз для свиданий, признаний в любви, годовщин. Красные, белые, розовые розы.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg">
                <Icon name="Gift" size={40} className="text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Подарки</h3>
                <p className="text-muted-foreground">
                  День рождения, 8 марта, День матери. Яркие миксы, пионы, гортензии с доставкой.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg">
                <Icon name="Briefcase" size={40} className="text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Бизнес</h3>
                <p className="text-muted-foreground">
                  Корпоративные букеты для партнёров и деловых мероприятий с доставкой.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;