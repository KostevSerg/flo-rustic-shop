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
  const { selectedCity } = useCity();
  const citySlug = createSlug(selectedCity);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
      price: product.price,
      image: product.image_url
    });
  };

  const pageTitle = selectedCity 
    ? `Доставка цветов в ${selectedCity} — FloRustic | Свежие букеты с доставкой`
    : 'FloRustic — Доставка свежих цветов и букетов на Бали';
  
  const pageDescription = selectedCity
    ? `Доставка свежих цветов и букетов в ${selectedCity}, Бали. Широкий выбор композиций для любого случая. Заказать букет онлайн с быстрой доставкой на дом. Свежие цветы, доступные цены.`
    : 'Доставка свежих цветов и букетов на Бали: Денпасар, Убуд, Чангу, Семиньяк. Широкий выбор композиций для любого случая. Заказать букет онлайн с быстрой доставкой на дом.';

  const keywords = selectedCity
    ? `доставка цветов ${selectedCity}, букеты ${selectedCity}, цветы ${selectedCity}, заказать букет ${selectedCity}, купить цветы ${selectedCity}, florustic ${selectedCity}, доставка цветов бали`
    : 'доставка цветов бали, букеты бали, цветы денпасар, цветы убуд, цветы чангу, цветы семиньяк, заказать букет бали, купить цветы бали, florustic';

  const canonicalUrl = selectedCity && citySlug
    ? `https://flowersbali.ru/city/${citySlug}`
    : 'https://flowersbali.ru/';

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
            "telephone": "+62-xxx-xxx-xxxx",
            "priceRange": "$$",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": selectedCity || "Бали",
              "addressCountry": "ID"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "-8.65",
              "longitude": "115.22"
            },
            "openingHours": "Mo-Su 09:00-21:00",
            "areaServed": ["Денпасар", "Убуд", "Чангу", "Семиньяк", "Санур", "Нуса Дуа"],
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