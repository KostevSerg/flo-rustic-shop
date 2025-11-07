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
    <div className="bg-card rounded-lg p-6 border border-border">
      <h2 className="text-xl font-semibold mb-4">Ваш заказ</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-0">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-muted-foreground">{item.price} ₽</p>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                >
                  <Icon name="Minus" size={16} />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <Icon name="Plus" size={16} />
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item.id)}
            >
              <Icon name="Trash2" size={18} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutCart;
