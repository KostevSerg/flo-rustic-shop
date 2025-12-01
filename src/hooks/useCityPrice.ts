import { useToast } from '@/hooks/use-toast';
import API_ENDPOINTS from '@/config/api';

interface Product {
  id: number;
  name: string;
}

export const useCityPrice = () => {
  const { toast } = useToast();

  const handleSetCityPrice = async (
    selectedProduct: Product | null,
    cityId: number,
    cityName: string,
    price: string
  ) => {
    if (!selectedProduct || !price) return;

    try {
      const response = await fetch(API_ENDPOINTS.products, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_city_price',
          product_id: selectedProduct.id,
          city_id: cityId,
          price: parseInt(price)
        })
      });

      if (!response.ok) throw new Error('Failed to set price');

      toast({
        title: 'Успешно',
        description: `Цена для города ${cityName} установлена: ${price} ₽`
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось установить цену',
        variant: 'destructive'
      });
    }
  };

  return {
    handleSetCityPrice
  };
};
