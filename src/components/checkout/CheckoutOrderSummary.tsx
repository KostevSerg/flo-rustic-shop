import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
  deliveryPrice: number;
  finalPrice: number;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

const CheckoutOrderSummary = ({
  items,
  totalPrice,
  deliveryPrice,
  finalPrice,
  onUpdateQuantity,
  onRemove
}: CheckoutOrderSummaryProps) => {
  return (
    <div className="bg-card rounded-lg p-6 sticky top-24">
      <h2 className="text-xl font-semibold mb-4">Ваш заказ</h2>
      
      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
        {items.map(item => (
          <div key={item.id} className="flex gap-3 pb-3 border-b">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{item.name}</div>
              <div className="text-sm text-muted-foreground">
                {item.price} ₽ × {item.quantity}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="w-6 h-6 flex items-center justify-center border rounded hover:bg-accent"
                >
                  <Icon name="Minus" size={12} />
                </button>
                <span className="text-sm w-6 text-center">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-6 h-6 flex items-center justify-center border rounded hover:bg-accent"
                >
                  <Icon name="Plus" size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="ml-auto text-destructive hover:text-destructive/80"
                >
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 pt-4 border-t">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Товары:</span>
          <span className="font-medium">{totalPrice} ₽</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Доставка:</span>
          <span className="font-medium">
            {deliveryPrice > 0 ? `${deliveryPrice} ₽` : 'Бесплатно'}
          </span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t">
          <span>Итого:</span>
          <span>{finalPrice} ₽</span>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full mt-6"
      >
        Оформить заказ
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
      </p>
    </div>
  );
};

export default CheckoutOrderSummary;
