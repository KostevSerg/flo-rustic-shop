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
}

interface ProductsSectionProps {
  products: Product[];
  citySlug: string;
  title: string;
  subtitle: string;
  iconName?: string;
  bgClassName?: string;
  buttonText?: string;
  onAddToCart: (product: Product) => void;
}

const ProductsSection = ({ 
  products, 
  citySlug, 
  title,
  subtitle,
  iconName,
  bgClassName = 'bg-background',
  buttonText = 'Смотреть каталог',
  onAddToCart 
}: ProductsSectionProps) => {
  if (products.length === 0) return null;

  return (
    <section className={`py-12 ${bgClassName}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          {iconName && <Icon name={iconName} size={32} className="inline-block mr-2 text-primary" />}
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map(product => (
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
          ))}
        </div>
        <div className="text-center">
          <Link to={`/city/${citySlug}`}>
            <Button size="lg" variant="outline" className="text-lg px-8">
              {buttonText}
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;