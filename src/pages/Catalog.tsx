import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCart } from '@/contexts/CartContext';
import { useCity } from '@/contexts/CityContext';
import { useSiteTexts } from '@/contexts/SiteTextsContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreadcrumbsNav from '@/components/BreadcrumbsNav';
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
        const url = `${API_ENDPOINTS.products}?city=${encodeURIComponent(selectedCity)}`;
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data.products || []);
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

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortOrder) return 0;
    return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
  });

  const pageTitle = 'Каталог букетов | FloRustic — Доставка цветов';
  const pageDescription = 'Каталог цветов FloRustic — более 500 букетов на любой случай. Розы, тюльпаны, пионы, композиции из стабилизированного мха. Свежие цветы от профессиональных флористов. Доставка по России за 2 часа. Цены от 990₽!';

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="каталог цветов, букеты цены, купить букет, цветочные композиции, розы, тюльпаны, лилии" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content="https://florustic.ru/catalog" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        
        <link rel="canonical" href="https://florustic.ru/catalog" />
      </Helmet>
      
      <Header cartCount={totalItems} />
      <main className="flex-1 container mx-auto px-4 py-16">
        <BreadcrumbsNav items={[{ name: 'Каталог' }]} />
        
        <h1 className="text-5xl font-bold text-center mb-4">
          {getText('catalog', 'title', 'Каталог')}
        </h1>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          {getText('catalog', 'subtitle', 'Выберите идеальный букет для любого случая')}
        </p>

        <div className="flex justify-center gap-3 mb-12">
          <Button
            variant={sortOrder === 'asc' ? 'default' : 'outline'}
            onClick={() => setSortOrder(sortOrder === 'asc' ? null : 'asc')}
            className="flex items-center gap-2"
          >
            <Icon name="ArrowUpNarrowWide" size={16} />
            По возрастанию цены
          </Button>
          <Button
            variant={sortOrder === 'desc' ? 'default' : 'outline'}
            onClick={() => setSortOrder(sortOrder === 'desc' ? null : 'desc')}
            className="flex items-center gap-2"
          >
            <Icon name="ArrowDownWideNarrow" size={16} />
            По убыванию цены
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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