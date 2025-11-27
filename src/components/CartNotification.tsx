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
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998] animate-in fade-in"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[90%] max-w-sm animate-in zoom-in-95 fade-in duration-200">
        <div className="bg-background border-2 border-primary rounded-xl shadow-2xl p-4 sm:p-6">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Закрыть"
          >
            <Icon name="X" size={20} />
          </button>
          
          <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
              <Icon name="Check" className="text-primary" size={24} />
            </div>
            
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1 sm:mb-2">
              Добавлено в корзину!
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
              {productName} — {quantity} шт.
            </p>
          </div>
          
          <div className="flex flex-col gap-2 sm:gap-3">
            <Button 
              onClick={handleGoToCart}
              size="lg"
              className="w-full text-sm sm:text-base h-10 sm:h-11"
            >
              <Icon name="ShoppingCart" size={18} className="mr-2" />
              Перейти в корзину
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              size="lg"
              className="w-full text-sm sm:text-base h-10 sm:h-11"
            >
              Продолжить покупки
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};