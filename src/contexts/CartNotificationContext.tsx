import { createContext, useContext, useState, ReactNode } from 'react';
import { CartNotification } from '@/components/CartNotification';

interface CartNotificationContextType {
  showNotification: (productName: string, quantity: number) => void;
}

const CartNotificationContext = createContext<CartNotificationContextType | undefined>(undefined);

export const CartNotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<{ productName: string; quantity: number } | null>(null);

  const showNotification = (productName: string, quantity: number) => {
    setNotification({ productName, quantity });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <CartNotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <CartNotification
          productName={notification.productName}
          quantity={notification.quantity}
          onClose={hideNotification}
        />
      )}
    </CartNotificationContext.Provider>
  );
};

export const useCartNotification = () => {
  const context = useContext(CartNotificationContext);
  if (!context) {
    throw new Error('useCartNotification must be used within CartNotificationProvider');
  }
  return context;
};
