import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CartNotificationProps {
  productName: string;
  quantity: number;
  onClose: () => void;
}

export const CartNotification = ({ productName, quantity, onClose }: CartNotificationProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleGoToCart = () => {
    navigate('/cart');
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/20 z-[9998] animate-in fade-in"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-md px-4 animate-in zoom-in-95 fade-in">
        <div className="bg-background border-2 border-primary rounded-xl shadow-2xl p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Icon name="Check" className="text-primary" size={32} />
            </div>
            
            <h3 className="text-xl font-bold text-foreground mb-2">
              Товар добавлен в корзину!
            </h3>
            <p className="text-sm text-muted-foreground">
              {productName} — {quantity} шт.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleGoToCart}
              size="lg"
              className="w-full text-base"
            >
              <Icon name="ShoppingCart" size={20} className="mr-2" />
              Перейти в корзину
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              size="lg"
              className="w-full text-base"
            >
              Продолжить покупки
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};