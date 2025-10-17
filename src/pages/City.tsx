import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import API_ENDPOINTS from '@/config/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category?: string;
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
    .replace(/[^\u0430-\u044f\u0410-\u042fa-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

type Category = 'Цветы' | 'Шары' | 'Подарки';

const City = () => {
  const { citySlug } = useParams<{ citySlug: string }>();
  const navigate = useNavigate();
  const { addToCart, totalItems } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [cityName, setCityName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('Цветы');

  useEffect(() => {
    const fetchCityAndProducts = async () => {
      if (!citySlug) return;
      
      setLoading(true);
      setError('');
      
      try {
        const citiesResponse = await fetch(API_ENDPOINTS.cities);
        const citiesData = await citiesResponse.json();
        
        let foundCityName = '';
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
        
        foundCityName = foundCity.name;
        setCityName(foundCityName);
        
        const productsUrl = `${API_ENDPOINTS.products}?city=${encodeURIComponent(foundCityName)}&category=${encodeURIComponent(activeCategory)}`;
        const productsResponse = await fetch(productsUrl);
        const productsData = await productsResponse.json();
        
        setProducts(productsData.products || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    fetchCityAndProducts();
  }, [citySlug, activeCategory]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
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

  const pageTitle = `Доставка цветов в ${cityName} — FloRustic | Букеты с доставкой в ${cityName}`;
  const pageDescription = `Доставка свежих цветов и букетов в ${cityName}, Бали. Большой выбор композиций для любого случая. Быстрая доставка по городу ${cityName}. Заказать букет онлайн с доставкой на дом. Свежие цветы, доступные цены.`;
  const pageUrl = `https://flowersbali.ru/city/${citySlug}`;
  const keywords = `доставка цветов ${cityName}, букеты ${cityName}, цветы ${cityName}, купить букет ${cityName}, заказать цветы ${cityName}, florustic ${cityName}, доставка цветов бали, цветы бали`;

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
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
            "@type": "LocalBusiness",
            "@id": pageUrl,
            "name": `FloRustic — Доставка цветов в ${cityName}`,
            "description": pageDescription,
            "url": pageUrl,
            "areaServed": {
              "@type": "City",
              "name": cityName
            },
            "priceRange": "$$",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "127"
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": cityName,
              "addressCountry": "RU"
            },
            "priceRange": "₽₽"
          })}
        </script>
      </Helmet>
      
      <Header cartCount={totalItems} />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="mb-6"
          >
            <Icon name="ArrowLeft" size={18} className="mr-2" />
            Назад
          </Button>
          <h1 className="text-5xl font-bold mb-4">
            Доставка цветов в {cityName}
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">
            <strong>FloRustic</strong> — профессиональная доставка свежих букетов по городу {cityName}, Бали. 
            Работаем ежедневно с 9:00 до 21:00, доставка за 2 часа.
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Розы, пионы, тюльпаны, орхидеи и экзотические тропические цветы Бали. 
            Выберите готовый букет из каталога или закажите индивидуальную композицию.
          </p>
          
          <div className="flex justify-center gap-4 flex-wrap">
            <Button
              variant={activeCategory === 'Цветы' ? 'default' : 'outline'}
              onClick={() => setActiveCategory('Цветы')}
              className="px-6"
            >
              Цветы
            </Button>
            <Button
              variant={activeCategory === 'Шары' ? 'default' : 'outline'}
              onClick={() => setActiveCategory('Шары')}
              className="px-6"
            >
              Шары
            </Button>
            <Button
              variant={activeCategory === 'Подарки' ? 'default' : 'outline'}
              onClick={() => setActiveCategory('Подарки')}
              className="px-6"
            >
              Подарки
            </Button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Package" size={64} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              В данный момент товары для города {cityName} не добавлены
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
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
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default City;