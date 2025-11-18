import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '@/contexts/CartContext';
import { useCity } from '@/contexts/CityContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReviewsSection from '@/components/ReviewsSection';
import SiteLinksMarkup from '@/components/SiteLinksMarkup';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import WhyUsSection from '@/components/home/WhyUsSection';
import InfoSections from '@/components/home/InfoSections';
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

const Index = () => {
  const location = useLocation();
  const { addToCart, totalItems } = useCart();
  const { selectedCity, initAutoDetection } = useCity();
  const citySlug = createSlug(selectedCity);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    initAutoDetection(true);
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
    : 'FloRustic — Доставка свежих цветов и букетов по всей России';
  
  const pageDescription = selectedCity
    ? `Служба доставки цветов в ${selectedCity}. Свежие цветы в ${selectedCity} — доставка в течение 1.5 часов после оплаты. Розы, тюльпаны, композиции ручной работы. Более 500 букетов. Заказ онлайн 24/7!`
    : 'Служба доставки цветов по России — более 200 городов. Свежие букеты ручной работы. Доставка в течение 1.5 часов после оплаты. Заказ онлайн 24/7!';

  const keywords = selectedCity
    ? `доставка цветов ${selectedCity}, букеты ${selectedCity}, цветы ${selectedCity}, заказать букет ${selectedCity}, купить цветы ${selectedCity}, florustic ${selectedCity}, доставка цветов россия`
    : 'доставка цветов россия, букеты с доставкой, цветы онлайн, заказать букет россия, купить цветы с доставкой, florustic, интернет магазин цветов';

  const canonicalUrl = 'https://florustic.ru/';

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet defer={false}>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords} />
        {isHomePage && <link rel="canonical" href={canonicalUrl} />}
        
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
            "areaServed": ["Москва", "Санкт-Петербург", "Казань", "Екатеринбург", "Новосибирск", "Россия"]
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
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "FloRustic",
            "url": "https://florustic.ru",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://florustic.ru/catalog?search={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>
      
      <SiteLinksMarkup />
      <Header cartCount={totalItems} />
      
      <main className="flex-1">
        <HeroSection citySlug={citySlug} />

        <FeaturedProductsSection 
          featuredProducts={featuredProducts}
          loading={loading}
          citySlug={citySlug}
          onAddToCart={handleAddToCart}
        />

        <ReviewsSection />

        <WhyUsSection selectedCity={selectedCity} />

        <InfoSections selectedCity={selectedCity} citySlug={citySlug} />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
