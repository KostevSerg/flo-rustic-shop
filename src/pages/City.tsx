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

interface Subcategory {
  id: number;
  name: string;
  category: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category?: string;
  subcategory_id?: number | null;
  subcategory_name?: string;
}

interface City {
  id: number;
  name: string;
  region: string;
  work_hours?: {
    [key: string]: {
      from: string;
      to: string;
    }
  };
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
  const [cityData, setCityData] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('Цветы');
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [activeSubcategory, setActiveSubcategory] = useState<number | null>(null);

  useEffect(() => {
    if (activeCategory === 'Цветы') {
      fetchSubcategories();
    } else {
      setSubcategories([]);
      setActiveSubcategory(null);
    }
  }, [activeCategory]);

  const fetchSubcategories = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.products}?action=subcategories&category=Цветы`);
      const data = await response.json();
      setSubcategories(data.subcategories || []);
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
    }
  };

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
        setCityData(foundCity);
        
        let productsUrl = `${API_ENDPOINTS.products}?city=${encodeURIComponent(foundCityName)}`;
        if (activeSubcategory) {
          productsUrl += `&subcategory_id=${activeSubcategory}`;
        } else {
          productsUrl += `&category=${encodeURIComponent(activeCategory)}`;
        }
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
  }, [citySlug, activeCategory, activeSubcategory]);

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
  const pageDescription = `Доставка свежих цветов и букетов в ${cityName}. Большой выбор композиций для любого случая. Быстрая доставка по городу ${cityName}. Заказать букет онлайн с доставкой на дом. Свежие цветы, доступные цены.`;
  const pageUrl = `https://florustic.ru/city/${citySlug}`;
  const keywords = `доставка цветов ${cityName}, букеты ${cityName}, цветы ${cityName}, купить букет ${cityName}, заказать цветы ${cityName}, florustic ${cityName}, доставка цветов россия`;

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
            <strong>FloRustic</strong> — профессиональная доставка свежих букетов по городу {cityName}. 
            Работаем ежедневно с 9:00 до 21:00, доставка за 2 часа.
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Розы, пионы, тюльпаны, орхидеи и другие сезонные цветы. 
            Выберите готовый букет из каталога или закажите индивидуальную композицию.
          </p>
          
          <div className="space-y-4">
            <div className="flex justify-center gap-4 flex-wrap">
              <Button
                variant={activeCategory === 'Цветы' ? 'default' : 'outline'}
                onClick={() => {
                  setActiveCategory('Цветы');
                  setActiveSubcategory(null);
                }}
                className="px-6"
              >
                Цветы
              </Button>
              <Button
                variant={activeCategory === 'Шары' ? 'default' : 'outline'}
                onClick={() => {
                  setActiveCategory('Шары');
                  setActiveSubcategory(null);
                }}
                className="px-6"
              >
                Шары
              </Button>
              <Button
                variant={activeCategory === 'Подарки' ? 'default' : 'outline'}
                onClick={() => {
                  setActiveCategory('Подарки');
                  setActiveSubcategory(null);
                }}
                className="px-6"
              >
                Подарки
              </Button>
            </div>
            
            {activeCategory === 'Цветы' && subcategories.length > 0 && (
              <div className="flex justify-center gap-2 flex-wrap">
                <Button
                  variant={activeSubcategory === null ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveSubcategory(null)}
                >
                  Все цветы
                </Button>
                {subcategories.map(sub => (
                  <Button
                    key={sub.id}
                    variant={activeSubcategory === sub.id ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveSubcategory(sub.id)}
                  >
                    {sub.name}
                  </Button>
                ))}
              </div>
            )}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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

        <div className="max-w-4xl mx-auto mt-16 space-y-12">
          <section className="bg-card rounded-lg p-8 border">
            <h2 className="text-3xl font-bold mb-6">Купить цветы в {cityName} с доставкой</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">FloRustic</strong> — это профессиональная служба доставки цветов в {cityName}. 
                Мы предлагаем широкий выбор свежих букетов для любого повода: дни рождения, свадьбы, юбилеи, 
                корпоративные мероприятия или просто чтобы порадовать близких.
              </p>
              <p>
                Когда вы хотите <strong className="text-foreground">заказать букет в {cityName}</strong>, важно выбрать надежного поставщика. 
                Мы работаем только со свежими цветами от проверенных поставщиков и гарантируем качество каждой композиции. 
                Наши флористы создают уникальные букеты, которые обязательно произведут впечатление.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Почему выбирают нас для доставки цветов в {cityName}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg p-6 border">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Icon name="Clock" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Быстрая доставка</h3>
                    <p className="text-muted-foreground text-sm">
                      Доставим букет по {cityName} за 2-4 часа. Работаем ежедневно, включая выходные и праздники.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg p-6 border">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Icon name="Flower2" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Свежие цветы</h3>
                    <p className="text-muted-foreground text-sm">
                      Только свежие цветы от проверенных поставщиков. Гарантируем свежесть каждого букета.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg p-6 border">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Icon name="Star" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Опытные флористы</h3>
                    <p className="text-muted-foreground text-sm">
                      Наши флористы создают букеты с любовью и профессионализмом. Каждая композиция уникальна.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg p-6 border">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Icon name="ShieldCheck" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Контроль качества</h3>
                    <p className="text-muted-foreground text-sm">
                      Каждый букет проверяется перед отправкой, чтобы соответствовать высоким стандартам.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-card rounded-lg p-8 border">
            <h2 className="text-2xl font-bold mb-6">Как заказать цветы в {cityName}</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Выберите букет</h3>
                  <p className="text-muted-foreground text-sm">
                    Просмотрите наш каталог и выберите понравившийся букет или композицию
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Оформите заказ</h3>
                  <p className="text-muted-foreground text-sm">
                    Укажите адрес доставки, контактные данные и желаемое время доставки
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Получите доставку</h3>
                  <p className="text-muted-foreground text-sm">
                    Курьер доставит свежий букет точно в срок по указанному адресу в {cityName}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Популярные вопросы о доставке цветов в {cityName}</h2>
            <div className="space-y-4">
              <details className="bg-card rounded-lg border overflow-hidden group">
                <summary className="p-6 cursor-pointer font-semibold hover:bg-accent/50 transition-colors flex items-center justify-between">
                  Сколько стоит доставка цветов по {cityName}?
                  <Icon name="ChevronDown" size={20} className="group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-muted-foreground">
                  Стоимость доставки зависит от адреса и времени. В пределах центра {cityName} доставка обычно 
                  составляет 200-400 рублей. Уточняйте точную стоимость при оформлении заказа.
                </div>
              </details>

              <details className="bg-card rounded-lg border overflow-hidden group">
                <summary className="p-6 cursor-pointer font-semibold hover:bg-accent/50 transition-colors flex items-center justify-between">
                  Как быстро можно доставить букет в {cityName}?
                  <Icon name="ChevronDown" size={20} className="group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-muted-foreground">
                  Мы доставляем цветы по {cityName} за 2-4 часа с момента оформления заказа. 
                  Также доступна срочная доставка за 1-2 часа за дополнительную плату.
                </div>
              </details>

              <details className="bg-card rounded-lg border overflow-hidden group">
                <summary className="p-6 cursor-pointer font-semibold hover:bg-accent/50 transition-colors flex items-center justify-between">
                  Можно ли заказать цветы с доставкой на определенное время?
                  <Icon name="ChevronDown" size={20} className="group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-muted-foreground">
                  Да, при оформлении заказа вы можете указать желаемое время доставки. 
                  Мы постараемся доставить букет точно в указанное время.
                </div>
              </details>

              <details className="bg-card rounded-lg border overflow-hidden group">
                <summary className="p-6 cursor-pointer font-semibold hover:bg-accent/50 transition-colors flex items-center justify-between">
                  Какие способы оплаты доступны?
                  <Icon name="ChevronDown" size={20} className="group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-muted-foreground">
                  Вы можете оплатить заказ онлайн картой при оформлении или наличными/картой курьеру при получении. 
                  Также принимаем оплату через СБП.
                </div>
              </details>

              <details className="bg-card rounded-lg border overflow-hidden group">
                <summary className="p-6 cursor-pointer font-semibold hover:bg-accent/50 transition-colors flex items-center justify-between">
                  Что делать, если получатель не на месте?
                  <Icon name="ChevronDown" size={20} className="group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-muted-foreground">
                  Курьер свяжется с получателем или с вами, чтобы договориться о времени повторной доставки. 
                  Также можно оставить букет соседям или на ресепшн (по согласованию).
                </div>
              </details>
            </div>
          </section>

          <section className="bg-card rounded-lg p-8 border text-center">
            <h2 className="text-2xl font-bold mb-4">Готовы купить цветы в {cityName}?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Выберите букет из нашего каталога и оформите заказ прямо сейчас. 
              Доставим свежие цветы по {cityName} в удобное для вас время.
            </p>
            <Button size="lg" className="text-lg px-8" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Icon name="Flower2" size={20} className="mr-2" />
              Выбрать букет
            </Button>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default City;