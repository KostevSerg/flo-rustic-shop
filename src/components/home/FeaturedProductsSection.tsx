import { Link } from 'react-router-dom';
import { useSiteTexts } from '@/contexts/SiteTextsContext';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

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

interface FeaturedProductsSectionProps {
  featuredProducts: Product[];
  loading: boolean;
  citySlug: string;
  onAddToCart: (product: Product) => void;
}

const FeaturedProductsSection = ({ 
  featuredProducts, 
  loading, 
  citySlug, 
  onAddToCart 
}: FeaturedProductsSectionProps) => {
  const { getText } = useSiteTexts();

  return (
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
                onAddToCart={() => onAddToCart(product)} 
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
  );
};

export default FeaturedProductsSection;
