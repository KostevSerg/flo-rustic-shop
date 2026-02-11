import { useState, useEffect, useMemo } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useCity } from '@/contexts/CityContext';
import { useSiteTexts } from '@/contexts/SiteTextsContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageSEO from '@/components/PageSEO';
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

const Catalog = () => {
  const { addToCart, totalItems } = useCart();
  const { selectedCity } = useCity();
  const { getText } = useSiteTexts();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const CACHE_KEY = `products_${selectedCity}`;
        const cached = localStorage.getItem(CACHE_KEY);
        
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          // Кеш на 10 минут
          if (Date.now() - timestamp < 10 * 60 * 1000) {
            setProducts(data);
            setLoading(false);
            return;
          }
        }
        
        const url = `${API_ENDPOINTS.products}?city=${encodeURIComponent(selectedCity)}`;
        const response = await fetch(url);
        const data = await response.json();
        const productsList = data.products || [];
        
        setProducts(productsList);
        
        // Сохраняем в кеш
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: productsList,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      if (!sortOrder) return 0;
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    });
  }, [products, sortOrder]);

  const cityForMeta = selectedCity || 'России';
  const pageTitle = 'Каталог букетов | FloRustic — Доставка цветов';
  const pageDescription = `Служба доставки цветов в ${cityForMeta}. Свежие цветы в ${cityForMeta} — доставка в течение 1.5 часов после оплаты. Каталог: более 500 букетов на любой случай. Розы, тюльпаны, пионы, композиции. Цены от 990₽!`;

  return (
    <div className="min-h-screen flex flex-col">
      <PageSEO
        title={pageTitle}
        description={pageDescription}
        canonical="https://florustic.ru/catalog"
      />
      <Header cartCount={totalItems} />
      <main className="flex-1 container mx-auto px-4 py-16">

        
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-3 md:mb-4">
          {getText('catalog', 'title', 'Каталог')}
        </h1>
        <p className="text-sm md:text-base text-center text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto px-4">
          {getText('catalog', 'subtitle', 'Выберите идеальный букет для любого случая')}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mb-8 md:mb-12 px-4">
          <Button
            variant={sortOrder === 'asc' ? 'default' : 'outline'}
            onClick={() => setSortOrder(sortOrder === 'asc' ? null : 'asc')}
            className="flex items-center justify-center gap-2 text-sm md:text-base h-9 md:h-10"
          >
            <Icon name="ArrowUpNarrowWide" size={16} />
            <span className="whitespace-nowrap">По возрастанию</span>
          </Button>
          <Button
            variant={sortOrder === 'desc' ? 'default' : 'outline'}
            onClick={() => setSortOrder(sortOrder === 'desc' ? null : 'desc')}
            className="flex items-center justify-center gap-2 text-sm md:text-base h-9 md:h-10"
          >
            <Icon name="ArrowDownWideNarrow" size={16} />
            <span className="whitespace-nowrap">По убыванию</span>
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin mx-auto mb-3 w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-muted-foreground">Загрузка товаров...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Товары не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {sortedProducts.map(product => (
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

export default Catalog;