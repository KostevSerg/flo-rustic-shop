import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useSiteTexts } from '@/contexts/SiteTextsContext';
import { useCity } from '@/contexts/CityContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReviewsSection from '@/components/ReviewsSection';
import HomeSEO from '@/components/home/HomeSEO';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import ProductsSection from '@/components/home/ProductsSection';
import WhyUsSection from '@/components/home/WhyUsSection';
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
  is_gift?: boolean;
  is_recommended?: boolean;
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

const Index = () => {
  const location = useLocation();
  const { addToCart, totalItems } = useCart();
  const { getText } = useSiteTexts();
  const { selectedCity, initAutoDetection } = useCity();
  const citySlug = createSlug(selectedCity);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [giftProducts, setGiftProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    initAutoDetection(true);
  }, []);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const CACHE_KEY = `products_${selectedCity}`;
        const cached = localStorage.getItem(CACHE_KEY);
        let shouldFetchFresh = true;
        
        if (cached) {
          const { data, timestamp, version } = JSON.parse(cached);
          const cacheAge = Date.now() - timestamp;
          
          if (cacheAge < 2 * 60 * 1000 && version === 2) {
            const featured = data.filter((p: Product) => p.is_featured);
            setFeaturedProducts(featured);
            
            const gifts = data.filter((p: Product) => p.is_gift);
            setGiftProducts(gifts);
            
            const recommended = data.filter((p: Product) => p.is_recommended);
            setRecommendedProducts(recommended);
            
            setLoading(false);
            shouldFetchFresh = false;
          }
        }
        
        if (shouldFetchFresh) {
          const response = await fetch(`${API_ENDPOINTS.products}?city=${encodeURIComponent(selectedCity)}`);
          const data = await response.json();
          const products = data.products || [];
          
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: products,
            timestamp: Date.now(),
            version: 2
          }));
          
          const featured = products.filter((p: Product) => p.is_featured);
          setFeaturedProducts(featured);
          
          const gifts = products.filter((p: Product) => p.is_gift);
          setGiftProducts(gifts);
          
          const recommended = products.filter((p: Product) => p.is_recommended);
          setRecommendedProducts(recommended);
        }
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

  return (
    <div className="min-h-screen flex flex-col">
      <HomeSEO isHomePage={isHomePage} selectedCity={selectedCity} />
      <Header cartCount={totalItems} />
      
      <main className="flex-1">
        <HeroSection citySlug={citySlug} />

        <FeaturedProductsSection
          featuredProducts={featuredProducts}
          loading={loading}
          citySlug={citySlug}
          onAddToCart={handleAddToCart}
        />

        <ProductsSection
          products={giftProducts}
          citySlug={citySlug}
          title="Подарки"
          iconName="Gift"
          bgClassName="bg-accent/10"
          buttonText="Все подарки"
          onAddToCart={handleAddToCart}
        />

        <ProductsSection
          products={recommendedProducts}
          citySlug={citySlug}
          title="Рекомендуем"
          iconName="ThumbsUp"
          bgClassName="bg-background"
          buttonText="Смотреть каталог"
          onAddToCart={handleAddToCart}
        />

        <ReviewsSection />

        <WhyUsSection selectedCity={selectedCity} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;