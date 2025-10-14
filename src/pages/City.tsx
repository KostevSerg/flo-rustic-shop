import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

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
  slug: string;
}

const City = () => {
  const { citySlug } = useParams<{ citySlug: string }>();
  const navigate = useNavigate();
  const { addToCart, totalItems } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [city, setCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCityAndProducts = async () => {
      if (!citySlug) return;
      
      setLoading(true);
      setError('');
      
      try {
        const citiesUrl = 'https://functions.poehali.dev/bb2b7d69-0c7e-4fa4-a4dc-fe6f20b98c33';
        const citiesResponse = await fetch(citiesUrl);
        const citiesData = await citiesResponse.json();
        
        const foundCity = citiesData.cities.find((c: City) => c.slug === citySlug);
        
        if (!foundCity) {
          setError('Город не найден');
          setLoading(false);
          return;
        }
        
        setCity(foundCity);
        
        const productsUrl = `https://functions.poehali.dev/f3ffc9b4-fbea-48e8-959d-c34ea68e6531?city=${encodeURIComponent(foundCity.name)}`;
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
  }, [citySlug]);

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

  if (error || !city) {
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

  const pageTitle = `Цветы ${city.name} | Доставка букетов в ${city.name} — FloRustic`;
  const pageDescription = `Доставка свежих цветов и букетов в ${city.name}. Большой выбор композиций для любого случая. Быстрая доставка по городу ${city.name}. Заказать букет онлайн с доставкой на дом.`;
  const pageUrl = `https://florustic.ru/city/${city.slug}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`цветы ${city.name}, букеты ${city.name}, доставка цветов ${city.name}, купить букет ${city.name}, заказать цветы ${city.name}, свежие цветы ${city.name}`} />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="FloRustic" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        
        <link rel="canonical" href={pageUrl} />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            "name": `FloRustic — Цветы в ${city.name}`,
            "description": pageDescription,
            "url": pageUrl,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": city.name,
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
            Цветы в {city.name}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Доставка свежих букетов по городу {city.name}. Выберите идеальный букет для любого случая
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Package" size={64} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              В данный момент товары для города {city.name} не добавлены
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