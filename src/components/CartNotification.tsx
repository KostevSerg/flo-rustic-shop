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
    <div className="fixed bottom-6 right-6 z-[100] max-w-md animate-in slide-in-from-bottom-5 fade-in">
      <div className="bg-card border border-primary/20 rounded-lg shadow-2xl p-6 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="Check" className="text-primary" size={20} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground mb-1">
              Товар добавлен в корзину
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {productName} — {quantity} шт.
            </p>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleGoToCart}
                size="sm"
                className="flex-1"
              >
                В корзину
              </Button>
              <Button 
                onClick={onClose}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Продолжить
              </Button>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
