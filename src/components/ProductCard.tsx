import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCartNotification } from '@/contexts/CartNotificationContext';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  description: string;
  composition?: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { showNotification } = useCartNotification();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart();
    
    if (typeof window.ym !== 'undefined') {
      window.ym(104746725, 'reachGoal', 'add_to_cart');
      
      window.ym(104746725, 'ecommerce', 'add', {
        products: [{
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          quantity: 1
        }]
      });
    }
    
    showNotification(product.name, 1);
  };

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer max-w-[280px] md:max-w-none mx-auto">
        <div className="relative overflow-hidden aspect-square max-h-[280px] md:max-h-none bg-muted">
          <img 
            src={product.image} 
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-3 md:p-6">
          <h3 className="text-base md:text-2xl font-bold mb-1 md:mb-2">{product.name}</h3>
          <p className="text-muted-foreground mb-2 md:mb-2 text-sm md:text-sm line-clamp-2">{product.description}</p>
          {product.composition && (
            <p className="text-muted-foreground/80 mb-2 md:mb-4 text-xs italic line-clamp-1">
              Состав: {product.composition}
            </p>
          )}
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg md:text-2xl font-bold">{Math.round(product.price)} ₽</span>
            <Button 
              onClick={handleAddToCart}
              className="bg-primary text-primary-foreground hover:opacity-90 text-sm md:text-sm px-3 md:px-4 py-1.5 md:py-2"
            >
              <Icon name="ShoppingCart" size={16} className="mr-1 md:mr-2" />
              <span className="hidden sm:inline">В корзину</span>
              <span className="sm:hidden">+</span>
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;