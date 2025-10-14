import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { toast } = useToast();

  const handleAddToCart = () => {
    onAddToCart();
    toast({
      title: "Добавлено в корзину",
      description: `${product.name} успешно добавлен в корзину`
    });
  };
  return (
    <div className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative overflow-hidden aspect-square">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
        <p className="text-muted-foreground mb-4 text-sm">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{product.price} ₽</span>
          <Button 
            onClick={handleAddToCart}
            className="bg-primary text-primary-foreground hover:opacity-90"
          >
            <Icon name="ShoppingCart" size={20} className="mr-2" />
            В корзину
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;