import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreadcrumbsNav from '@/components/BreadcrumbsNav';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import API_ENDPOINTS from '@/config/api';
import CitySEOHelmet from '@/components/city/CitySEOHelmet';
import CityHeader from '@/components/city/CityHeader';
import ProductsGrid from '@/components/city/ProductsGrid';
import CityContent from '@/components/city/CityContent';

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
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

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
      description: product.description,
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

  return (
    <div className="min-h-screen flex flex-col">
      <CitySEOHelmet cityName={cityName} citySlug={citySlug || ''} />
      
      <Header cartCount={totalItems} />
      <main className="flex-1 container mx-auto px-4 py-16">
        <BreadcrumbsNav items={[{ name: `Доставка в ${cityName}` }]} />
        
        <CityHeader
          cityName={cityName}
          activeCategory={activeCategory}
          activeSubcategory={activeSubcategory}
          subcategories={subcategories}
          onCategoryChange={setActiveCategory}
          onSubcategoryChange={setActiveSubcategory}
        />

        <ProductsGrid
          products={products}
          cityName={cityName}
          onAddToCart={handleAddToCart}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />

        <CityContent cityName={cityName} />
      </main>
      <Footer />
    </div>
  );
};

export default City;