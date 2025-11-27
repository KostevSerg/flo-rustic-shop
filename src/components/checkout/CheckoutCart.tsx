import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CheckoutCartProps {
  items: CartItem[];
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

const CheckoutCart = ({ items, onRemove, onUpdateQuantity }: CheckoutCartProps) => {
  return (
    <div className="bg-card rounded-lg p-3 md:p-4 border border-border">
      <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Ваш заказ</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-2 md:gap-3 pb-3 border-b border-border last:border-0">
            <img 
              src={item.image} 
              alt={item.name}
              loading="lazy"
              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-1 mb-1">
                <h3 className="font-medium text-sm md:text-base line-clamp-2">{item.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(item.id)}
                  className="shrink-0 h-8 w-8 p-0"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{Math.round(item.price)} ₽</p>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="h-7 w-7 p-0"
                >
                  <Icon name="Minus" size={14} />
                </Button>
                <span className="w-6 text-center text-sm">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="h-7 w-7 p-0"
                >
                  <Icon name="Plus" size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutCart;