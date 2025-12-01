import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
  composition?: string;
  price: number;
  image_url?: string;
  category: string;
  is_featured?: boolean;
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

const CityHomePage = () => {
  const { citySlug } = useParams<{ citySlug: string }>();
  const navigate = useNavigate();
  const { addToCart, totalItems } = useCart();
  const { getText } = useSiteTexts();
  const { setCity } = useCity();
  const [cityName, setCityName] = useState<string>('');
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [giftProducts, setGiftProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCityAndProducts = async () => {
      if (!citySlug) return;
      
      setLoading(true);
      setError(false);
      
      try {
        const citiesResponse = await fetch(API_ENDPOINTS.cities);
        const citiesData = await citiesResponse.json();
        
        let foundCityName = '';
        const allCities: any[] = [];
        
        Object.values(citiesData.cities || {}).forEach((regionCities: any) => {
          allCities.push(...regionCities);
        });
        
        const foundCity = allCities.find((c: any) => createSlug(c.name) === citySlug);
        
        if (!foundCity) {
          setError(true);
          setLoading(false);
          return;
        }
        
        foundCityName = foundCity.name;
        setCityName(foundCityName);
        setCity(foundCity.name, foundCity.id, foundCity.region);

        const CACHE_KEY = `products_${foundCityName}`;
        const cached = localStorage.getItem(CACHE_KEY);
        
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 10 * 60 * 1000) {
            const featured = data.filter((p: Product) => p.is_featured);
            setFeaturedProducts(featured.slice(0, 3));
            
            const gifts = data.filter((p: Product) => p.is_gift);
            setGiftProducts(gifts.slice(0, 3));
            
            const recommended = data.filter((p: Product) => p.is_recommended);
            setRecommendedProducts(recommended.slice(0, 3));
            
            setLoading(false);
            return;
          }
        }
        
        const response = await fetch(`${API_ENDPOINTS.products}?city=${encodeURIComponent(foundCityName)}`);
        const data = await response.json();
        const products = data.products || [];
        
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: products,
          timestamp: Date.now()
        }));
        
        const featured = products.filter((p: Product) => p.is_featured);
        setFeaturedProducts(featured.slice(0, 3));
        
        const gifts = products.filter((p: Product) => p.is_gift);
        setGiftProducts(gifts.slice(0, 3));
        
        const recommended = products.filter((p: Product) => p.is_recommended);
        setRecommendedProducts(recommended.slice(0, 3));
      } catch (err) {
        console.error('Failed to load city products:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCityAndProducts();
  }, [citySlug]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartCount={totalItems} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-12">
            <div className="animate-spin mx-auto mb-3 w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !cityName) {
    return (
      <div className="min-h-screen flex flex-col">
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

  const pageTitle = `Доставка цветов в ${cityName} — FloRustic | Свежие букеты с доставкой`;
  const pageDescription = `Служба доставки цветов в ${cityName}. Свежие цветы в ${cityName} — доставка в течение 1.5 часов после оплаты. Розы, тюльпаны, композиции ручной работы. Более 500 букетов. Заказ онлайн 24/7!`;
  const keywords = `доставка цветов ${cityName}, букеты ${cityName}, цветы ${cityName}, заказать букет ${cityName}, купить цветы ${cityName}, florustic ${cityName}`;
  const canonicalUrl = `https://florustic.ru/${citySlug}`;

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
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FloristShop",
            "name": `FloRustic ${cityName}`,
            "description": pageDescription,
            "url": canonicalUrl,
            "priceRange": "₽₽",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": cityName,
              "addressCountry": "RU"
            },
            "openingHours": "Mo-Su 09:00-21:00"
          })}
        </script>
      </Helmet>
      
      <Header cartCount={totalItems} />
      
      <main className="flex-1">
        <section className="relative bg-gradient-to-br from-accent/20 to-background py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in">
                {getText('home', 'hero_title', 'Цветы - чтобы радовать каждый день!')}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mb-6 animate-fade-in">
                Доставка свежих букетов в {cityName}. Создаем композиции с душой и вниманием к деталям.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
                <Link to={`/city/${citySlug}`}>
                  <Button size="lg" className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8">
                    Смотреть каталог
                    <Icon name="ArrowRight" size={20} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8">
                    О нас
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                {getText('home', 'featured_title', 'Популярные букеты')}
              </h2>
              <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Цены для города {cityName}
              </p>
            </div>

            {featuredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
                  {featuredProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={{
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        image: product.image_url || ''
                      }} 
                      onAddToCart={() => handleAddToCart(product)} 
                    />
                  ))}
                </div>
                
                <div className="text-center">
                  <Link to={`/city/${citySlug}`}>
                    <Button size="lg" variant="outline" className="group">
                      Смотреть все товары
                      <Icon name="ArrowRight" size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Товары для {cityName} скоро появятся
                </p>
              </div>
            )}
          </div>
        </section>

        {giftProducts.length > 0 && (
          <section className="py-12 md:py-20 bg-accent/10">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                  <Icon name="Gift" size={32} className="inline-block mr-2 text-primary" />
                  Подарки
                </h2>
                <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
                  Готовые подарочные наборы для ваших близких. Цены для города {cityName}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
                {giftProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={{
                      id: product.id,
                      name: product.name,
                      description: product.description,
                      price: product.price,
                      image: product.image_url || ''
                    }} 
                    onAddToCart={() => handleAddToCart(product)} 
                  />
                ))}
              </div>
              
              <div className="text-center">
                <Link to={`/city/${citySlug}`}>
                  <Button size="lg" variant="outline" className="group">
                    Все подарки
                    <Icon name="ArrowRight" size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {recommendedProducts.length > 0 && (
          <section className="py-12 md:py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                  <Icon name="ThumbsUp" size={32} className="inline-block mr-2 text-primary" />
                  Рекомендуем
                </h2>
                <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
                  Специально подобранные букеты для особых моментов. Цены для города {cityName}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
                {recommendedProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={{
                      id: product.id,
                      name: product.name,
                      description: product.description,
                      price: product.price,
                      image: product.image_url || ''
                    }} 
                    onAddToCart={() => handleAddToCart(product)} 
                  />
                ))}
              </div>
              
              <div className="text-center">
                <Link to={`/city/${citySlug}`}>
                  <Button size="lg" variant="outline" className="group">
                    Смотреть каталог
                    <Icon name="ArrowRight" size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="py-12 md:py-20 bg-accent/10">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
              <div className="text-center p-4 md:p-6 bg-background rounded-lg shadow-sm">
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="Truck" size={24} className="text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  {getText('home', 'feature_1_title', 'Быстрая доставка')}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  {getText('home', 'feature_1_text', 'Доставим ваш заказ в течение 1.5 часов')}
                </p>
              </div>

              <div className="text-center p-4 md:p-6 bg-background rounded-lg shadow-sm">
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="Flower2" size={24} className="text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  {getText('home', 'feature_2_title', 'Свежие цветы')}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  {getText('home', 'feature_2_text', 'Работаем только со свежими цветами')}
                </p>
              </div>

              <div className="text-center p-4 md:p-6 bg-background rounded-lg shadow-sm">
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="Heart" size={24} className="text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  {getText('home', 'feature_3_title', 'С любовью')}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  {getText('home', 'feature_3_text', 'Каждый букет создаем с душой')}
                </p>
              </div>
            </div>
          </div>
        </section>

        <ReviewsSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default CityHomePage;