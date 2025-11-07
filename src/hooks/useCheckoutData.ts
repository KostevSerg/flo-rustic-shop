import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useCity } from '@/contexts/CityContext';
import API_ENDPOINTS from '@/config/api';

interface WorkHours {
  from: string;
  to: string;
}

interface Settlement {
  id: number;
  name: string;
  delivery_price: number;
}

interface PromoCode {
  code: string;
  discount_percent: number;
}

export const useCheckoutData = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { selectedCity, selectedCityRegion, setCity } = useCity();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loadingSettlements, setLoadingSettlements] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [checkingPromo, setCheckingPromo] = useState(false);
  const [cityWorkHours, setCityWorkHours] = useState<WorkHours | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  useEffect(() => {
    if (selectedCity) {
      fetchSettlements();
    }
  }, [selectedCity]);

  const fetchSettlements = async () => {
    setLoadingSettlements(true);
    try {
      const citiesResponse = await fetch(API_ENDPOINTS.cities);
      const citiesData = await citiesResponse.json();
      
      let cityId = null;
      const allCities: any[] = [];
      Object.values(citiesData.cities || {}).forEach((regionCities: any) => {
        allCities.push(...regionCities);
      });
      
      const foundCity = allCities.find((c: any) => c.name === selectedCity);
      if (foundCity) {
        cityId = foundCity.id;
        setCityWorkHours(foundCity.work_hours || null);
        
        if (foundCity.region && foundCity.region !== selectedCityRegion) {
          setCity(foundCity.name, foundCity.id, foundCity.region);
        }
        
        const settlementsResponse = await fetch(`${API_ENDPOINTS.cities}?action=settlements&city_id=${cityId}`);
        const settlementsData = await settlementsResponse.json();
        setSettlements(settlementsData.settlements || []);
      }
    } catch (error) {
      console.error('Failed to fetch settlements:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить населенные пункты',
        variant: 'destructive'
      });
    } finally {
      setLoadingSettlements(false);
    }
  };

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите промокод',
        variant: 'destructive'
      });
      return;
    }

    setCheckingPromo(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.promoCodes}?code=${encodeURIComponent(promoCode.toUpperCase())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Промокод не найден');
      }

      setAppliedPromo({
        code: data.promo.code,
        discount_percent: data.promo.discount_percent
      });

      toast({
        title: 'Промокод применён',
        description: `Скидка ${data.promo.discount_percent}% активирована`
      });
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Промокод не найден',
        variant: 'destructive'
      });
    } finally {
      setCheckingPromo(false);
    }
  };

  const handleRemovePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode('');
    toast({
      title: 'Промокод удален',
      description: 'Скидка отменена'
    });
  };

  return {
    settlements,
    loadingSettlements,
    promoCode,
    setPromoCode,
    appliedPromo,
    checkingPromo,
    cityWorkHours,
    handleApplyPromoCode,
    handleRemovePromoCode,
    clearCart,
    navigate,
    toast
  };
};
