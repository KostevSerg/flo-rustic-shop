import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '@/contexts/CartContext';
import { useSiteTexts } from '@/contexts/SiteTextsContext';
import { useCity } from '@/contexts/CityContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ReviewsSection from '@/components/ReviewsSection';
import SiteLinksMarkup from '@/components/SiteLinksMarkup';
import BreadcrumbsNav from '@/components/BreadcrumbsNav';
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

const Index = () => {
  const location = useLocation();
  const { addToCart, totalItems } = useCart();
  const { getText } = useSiteTexts();
  const { selectedCity, initAutoDetection } = useCity();
  const citySlug = createSlug(selectedCity);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Не рендерим Helmet Index, если мы не на главной странице
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
            "@type": "LocalBusiness",
            "@id": "https://florustic.ru/#organization",
            "name": "FloRustic",
            "description": pageDescription,
            "url": canonicalUrl,
            "telephone": "+7-xxx-xxx-xxxx",
            "priceRange": "₽₽₽",
            "image": "https://florustic.ru/logo.png",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": selectedCity || "Россия",
              "addressCountry": "RU"
            },
            "geo": selectedCity && {
              "@type": "GeoCoordinates"
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": "09:00",
                "closes": "21:00"
              }
            ],
            "areaServed": [
              {"@type": "City", "name": "Москва"},
              {"@type": "City", "name": "Санкт-Петербург"},
              {"@type": "City", "name": "Казань"},
              {"@type": "City", "name": "Екатеринбург"},
              {"@type": "City", "name": "Новосибирск"},
              {"@type": "Country", "name": "Россия"}
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "250",
              "bestRating": "5",
              "worstRating": "1"
            }
          })}
        </script>
        
        {featuredProducts.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "itemListElement": featuredProducts.map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Product",
                  "@id": `https://florustic.ru/product/${product.id}`,
                  "name": product.name,
                  "description": product.description,
                  "image": product.image_url,
                  "offers": {
                    "@type": "Offer",
                    "url": `https://florustic.ru/product/${product.id}`,
                    "priceCurrency": "RUB",
                    "price": product.price,
                    "availability": "https://schema.org/InStock",
                    "seller": {
                      "@type": "Organization",
                      "name": "FloRustic"
                    }
                  }
                }
              }))
            })}
          </script>
        )}
        
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
        <section className="relative bg-gradient-to-br from-accent/20 to-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in">
              {selectedCity 
                ? `Доставка цветов в ${selectedCity} — свежие букеты за 1.5 часа`
                : 'Доставка цветов по России — свежие букеты за 1.5 часа'
              }
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-6 animate-fade-in">
              Более 500 букетов ручной работы. Розы, тюльпаны, пионы с доставкой {selectedCity ? `по ${selectedCity}` : 'по всей России'}. 
              Работаем ежедневно с 9:00 до 21:00. Бесплатная открытка к каждому заказу.
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

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
            {getText('home', 'popular_title', 'Популярные товары')}
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-8 max-w-2xl mx-auto">
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
                    composition: product.composition,
                    price: product.price,
                    image: product.image_url || 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop'
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

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="text-3xl font-bold mb-6">
              Доставка цветов {selectedCity ? `в ${selectedCity}` : 'по России'} — FloRustic
            </h2>
            <p className="text-muted-foreground mb-4">
              <strong>FloRustic</strong> — это современная служба доставки свежих цветов и букетов{selectedCity ? ` в ${selectedCity}` : ' по всей России'}. 
              Мы работаем напрямую с лучшими цветочными плантациями и гарантируем свежесть каждого бутона. 
              Наша миссия — делать приятные моменты ещё более особенными через красоту живых цветов.
            </p>
            
            <h3 className="text-2xl font-bold mt-8 mb-4">Почему стоит заказать цветы в FloRustic?</h3>
            <p className="text-muted-foreground mb-4">
              В нашем каталоге представлено более 500 букетов и цветочных композиций на любой вкус и бюджет. 
              Розы, тюльпаны, пионы, орхидеи, гортензии, хризантемы — мы собираем букеты из самых популярных 
              и экзотических цветов. Каждый букет создаётся вручную опытными флористами с учётом пожеланий клиента.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Быстрая доставка</strong> — наше главное преимущество. Мы доставляем цветы{selectedCity ? ` по ${selectedCity}` : ''} 
              в течение 1.5-2 часов после оформления заказа. Работаем ежедневно с 9:00 до 21:00, включая выходные и праздники. 
              Возможна срочная доставка за 60 минут для особых случаев.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4">Цветы для любого случая</h3>
            <p className="text-muted-foreground mb-4">
              Букеты FloRustic подходят для любых событий: <strong>день рождения, свадьба, юбилей, романтическое свидание, 
              8 марта, День матери, выпускной, корпоративные мероприятия</strong>. Мы также предлагаем траурные венки 
              и композиции для выражения соболезнований.
            </p>
            <p className="text-muted-foreground mb-4">
              Наши флористы помогут подобрать идеальный букет под конкретный повод и бюджет. В комплект входит 
              бесплатная открытка с вашими пожеланиями и фирменная упаковка. При заказе от 3000 рублей — 
              доставка бесплатная по {selectedCity || 'городу'}.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4">Как заказать доставку цветов?</h3>
            <p className="text-muted-foreground mb-4">
              Оформить заказ очень просто: выберите букет в каталоге, добавьте в корзину, укажите адрес доставки{selectedCity ? ` в ${selectedCity}` : ''}, 
              желаемое время и текст открытки. Оплата производится онлайн банковской картой или при получении. 
              После оплаты флористы начинают сборку композиции из самых свежих цветов.
            </p>
            <p className="text-muted-foreground mb-4">
              Мы гарантируем 100% качество и свежесть цветов. Если букет не соответствует фото или цветы увяли 
              в течение 3 дней — вернём деньги или бесплатно заменим композицию. Фото букета отправляется 
              перед доставкой для вашего утверждения.
            </p>

            <div className="bg-accent/10 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-bold mb-3">Закажите цветы с доставкой прямо сейчас!</h3>
              <p className="text-muted-foreground mb-4">
                Более 10 000 довольных клиентов{selectedCity ? ` в ${selectedCity}` : ' по всей России'} уже доверили 
                нам важные моменты своей жизни. Присоединяйтесь!
              </p>
              <Link to={`/city/${citySlug}`}>
                <Button size="lg" className="text-lg px-8">
                  Смотреть каталог букетов
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;