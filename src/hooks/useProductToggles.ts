import { useToast } from '@/hooks/use-toast';
import API_ENDPOINTS from '@/config/api';

export const useProductToggles = (loadProducts: () => void, clearProductsCache: () => void) => {
  const { toast } = useToast();

  const handleToggleFeatured = async (productId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(API_ENDPOINTS.products, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: productId,
          is_featured: !currentStatus
        })
      });

      if (!response.ok) throw new Error('Failed to toggle featured');

      toast({
        title: 'Успешно',
        description: !currentStatus ? 'Товар добавлен в популярные' : 'Товар убран из популярных'
      });

      clearProductsCache();
      loadProducts();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус товара',
        variant: 'destructive'
      });
    }
  };

  const handleToggleActive = async (productId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(API_ENDPOINTS.products, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: productId,
          is_active: !currentStatus
        })
      });

      if (!response.ok) throw new Error('Failed to toggle active');

      toast({
        title: 'Успешно',
        description: !currentStatus ? 'Товар теперь виден на сайте' : 'Товар скрыт с сайта'
      });

      loadProducts();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить видимость товара',
        variant: 'destructive'
      });
    }
  };

  const handleToggleGift = async (productId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(API_ENDPOINTS.products, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: productId,
          is_gift: !currentStatus
        })
      });

      if (!response.ok) throw new Error('Failed to toggle gift');

      toast({
        title: 'Успешно',
        description: !currentStatus ? 'Товар добавлен в подарки' : 'Товар убран из подарков'
      });

      clearProductsCache();
      loadProducts();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус товара',
        variant: 'destructive'
      });
    }
  };

  const handleToggleRecommended = async (productId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(API_ENDPOINTS.products, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: productId,
          is_recommended: !currentStatus
        })
      });

      if (!response.ok) throw new Error('Failed to toggle recommended');

      toast({
        title: 'Успешно',
        description: !currentStatus ? 'Товар добавлен в рекомендации' : 'Товар убран из рекомендаций'
      });

      clearProductsCache();
      loadProducts();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус товара',
        variant: 'destructive'
      });
    }
  };

  return {
    handleToggleFeatured,
    handleToggleActive,
    handleToggleGift,
    handleToggleRecommended
  };
};
