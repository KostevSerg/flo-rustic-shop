import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useSiteTexts } from '@/contexts/SiteTextsContext';
import { useCity } from '@/contexts/CityContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReviewsSection from '@/components/ReviewsSection';
import PageSEO from '@/components/PageSEO';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import API_ENDPOINTS from '@/config/api';
import CityHomePageHero from '@/components/city-home/CityHomePageHero';
import CityHomePageProducts from '@/components/city-home/CityHomePageProducts';

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

const getCityInPrepositional = (city: string): string => {
  const endings: Record<string, string> = {
    'Алейск': 'Алейске', 'Ангарск': 'Ангарске', 'Ачинск': 'Ачинске', 'Барнаул': 'Барнауле',
    'Белгород': 'Белгороде', 'Белово': 'Белово', 'Белокуриха': 'Белокурихе', 'Бийск': 'Бийске',
    'Бирюч': 'Бирюче', 'Благовещенск': 'Благовещенске', 'Боготол': 'Боготоле', 'Бодайбо': 'Бодайбо',
    'Борисовка': 'Борисовке', 'Бородино': 'Бородино', 'Братск': 'Братске', 'Валуйки': 'Валуйках',
    'Вилючинск': 'Вилючинске', 'Волгоград': 'Волгограде', 'Волоконовка': 'Волоконовке',
    'Воронеж': 'Воронеже', 'Гальбштадт': 'Гальбштадте', 'Гурьевск': 'Гурьевске',
    'Екатеринбург': 'Екатеринбурге', 'Елизово': 'Елизово', 'Енисейск': 'Енисейске',
    'Ермаковское': 'Ермаковском', 'Железногорск': 'Железногорске', 'Завитинск': 'Завитинске',
    'ЗАТО Циолковского': 'ЗАТО Циолковского', 'Зеленогорск': 'Зеленогорске', 'Зея': 'Зее',
    'Зима': 'Зиме', 'Ивня': 'Ивне', 'Иланский': 'Иланском', 'Казань': 'Казани',
    'Камень-на-Оби': 'Камне-на-Оби', 'Канск': 'Канске', 'Кемерово': 'Кемерово',
    'Киселёвск': 'Киселёвске', 'Короча': 'Короче', 'Красноярск': 'Красноярске',
    'Куйтун': 'Куйтуне', 'Кулунда': 'Кулунде', 'Ленинск-Кузнецкий': 'Ленинске-Кузнецком',
    'Лесосибирск': 'Лесосибирске', 'Мамонтово': 'Мамонтово', 'Мариинск': 'Мариинске',
    'Междуреченск': 'Междуреченске', 'Минусинск': 'Минусинске', 'Москва': 'Москве',
    'Назарово': 'Назарово', 'Нижний Новгород': 'Нижнем Новгороде', 'Новокузнецк': 'Новокузнецке',
    'Новосибирск': 'Новосибирске', 'Норильск': 'Норильске', 'Омск': 'Омске',
    'Осинники': 'Осинниках', 'Павловск': 'Павловске', 'Пермь': 'Перми',
    'Петропавловск-Камчатский': 'Петропавловске-Камчатском', 'Поспелиха': 'Поспелихе',
    'Прокопьевск': 'Прокопьевске', 'Райчихинск': 'Райчихинске', 'Ракитное': 'Ракитном',
    'Ребриха': 'Ребрихе', 'Ростов-на-Дону': 'Ростове-на-Дону', 'Рубцовск': 'Рубцовске',
    'Самара': 'Самаре', 'Санкт-Петербург': 'Санкт-Петербурге', 'Саянск': 'Саянске',
    'Свирск': 'Свирске', 'Свободный': 'Свободном', 'Славгород': 'Славгороде',
    'Слюдянка': 'Слюдянке', 'Сосновоборск': 'Сосновоборске', 'Строитель': 'Строителе',
    'Тайга': 'Тайге', 'Тайшет': 'Тайшете', 'Тальменка': 'Тальменке', 'Тулун': 'Тулуне',
    'Ужур': 'Ужуре', 'Усолье-Сибирское': 'Усолье-Сибирском', 'Уфа': 'Уфе', 'Уяр': 'Уяре',
    'Челябинск': 'Челябинске', 'Черемхово': 'Черемхово', 'Шарыпово': 'Шарыпово',
    'Шебекино': 'Шебекино', 'Шелехово': 'Шелехово', 'Шипуново': 'Шипуново',
    'Шуменское': 'Шуменском', 'Юрга': 'Юрге', 'Яровое': 'Яровом', 'Яя': 'Яе'
  };
  return endings[city] || city + 'е';
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
    if (!citySlug || citySlug.trim() === '') {
      navigate('/', { replace: true });
      return;
    }

    const fetchCityAndProducts = async () => {
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
            setFeaturedProducts(featured);
            
            const gifts = data.filter((p: Product) => p.is_gift);
            setGiftProducts(gifts);
            
            const recommended = data.filter((p: Product) => p.is_recommended);
            setRecommendedProducts(recommended);
            
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
        setFeaturedProducts(featured);
        
        const gifts = products.filter((p: Product) => p.is_gift);
        setGiftProducts(gifts);
        
        const recommended = products.filter((p: Product) => p.is_recommended);
        setRecommendedProducts(recommended);
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

  const cityInPrepositional = getCityInPrepositional(cityName);
  const pageTitle = `Доставка цветов в ${cityInPrepositional} — FloRustic | Купить розы, тюльпаны, пионы`;
  const pageDescription = `Служба доставки цветов в ${cityInPrepositional}. Свежие букеты роз, тюльпанов, пионов за 2 часа. Заказ онлайн 24/7!`;

  return (
    <div className="min-h-screen flex flex-col">
      <PageSEO
        title={pageTitle}
        description={pageDescription}
        canonical={`https://florustic.ru/${citySlug}`}
      />
      <Header cartCount={totalItems} />
      
      <main className="flex-1">
        <CityHomePageHero 
          cityName={cityName}
          citySlug={citySlug || ''}
        />

        <CityHomePageProducts
          cityName={cityName}
          citySlug={citySlug || ''}
          featuredProducts={featuredProducts}
          giftProducts={giftProducts}
          recommendedProducts={recommendedProducts}
          onAddToCart={handleAddToCart}
        />

        <ReviewsSection 
          title={`Отзывы о доставке цветов в ${cityName}`} 
          description={getText('reviews_subtitle')}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default CityHomePage;