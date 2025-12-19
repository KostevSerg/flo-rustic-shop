import { Link } from 'react-router-dom';
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

interface CityHomePageProductsProps {
  cityName: string;
  citySlug: string;
  featuredProducts: Product[];
  giftProducts: Product[];
  recommendedProducts: Product[];
  onAddToCart: (product: Product) => void;
}

const CityHomePageProducts = ({
  cityName,
  citySlug,
  featuredProducts,
  giftProducts,
  recommendedProducts,
  onAddToCart
}: CityHomePageProductsProps) => {
  return (
    <>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Icon name="Star" size={28} className="text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold">Популярные букеты в {cityName}</h2>
            </div>
            <Button asChild variant="outline" className="hidden sm:flex">
              <Link to="/catalog">
                Все букеты
                <Icon name="ArrowRight" size={18} className="ml-2" />
              </Link>
            </Button>
          </div>
          {featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Package" size={48} className="mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Пока нет популярных букетов для этого города</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    citySlug={citySlug}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
              <div className="flex justify-center mt-8 sm:hidden">
                <Button asChild variant="outline">
                  <Link to="/catalog">
                    Все букеты
                    <Icon name="ArrowRight" size={18} className="ml-2" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {giftProducts.length > 0 && (
        <section className="py-12 md:py-16 bg-accent/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Icon name="Gift" size={28} className="text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold">Подарки</h2>
              </div>
              <Button asChild variant="outline" className="hidden sm:flex">
                <Link to="/catalog">
                  Все подарки
                  <Icon name="ArrowRight" size={18} className="ml-2" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {giftProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  citySlug={citySlug}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
            <div className="flex justify-center mt-8 sm:hidden">
              <Button asChild variant="outline">
                <Link to="/catalog">
                  Все подарки
                  <Icon name="ArrowRight" size={18} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {recommendedProducts.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Icon name="Heart" size={28} className="text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold">Рекомендуем</h2>
              </div>
              <Button asChild variant="outline" className="hidden sm:flex">
                <Link to="/catalog">
                  Смотреть все
                  <Icon name="ArrowRight" size={18} className="ml-2" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  citySlug={citySlug}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
            <div className="flex justify-center mt-8 sm:hidden">
              <Button asChild variant="outline">
                <Link to="/catalog">
                  Смотреть все
                  <Icon name="ArrowRight" size={18} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default CityHomePageProducts;
