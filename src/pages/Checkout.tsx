import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useCity } from '@/contexts/CityContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import CheckoutRecipientForm from '@/components/checkout/CheckoutRecipientForm';
import CheckoutSenderForm from '@/components/checkout/CheckoutSenderForm';
import CheckoutDeliveryForm from '@/components/checkout/CheckoutDeliveryForm';
import CheckoutPaymentForm from '@/components/checkout/CheckoutPaymentForm';
import CheckoutAdditionalForm from '@/components/checkout/CheckoutAdditionalForm';
import CheckoutOrderSummary from '@/components/checkout/CheckoutOrderSummary';
import API_ENDPOINTS from '@/config/api';

interface Settlement {
  id: number;
  name: string;
  delivery_price: number;
}

const Checkout = () => {
  const { items, totalItems, totalPrice, clearCart, removeFromCart, updateQuantity } = useCart();
  const { selectedCity } = useCity();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loadingSettlements, setLoadingSettlements] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount_percent: number } | null>(null);
  const [checkingPromo, setCheckingPromo] = useState(false);
  
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientPhone: '',
    senderName: '',
    senderPhone: '',
    email: '',
    settlementId: '',
    address: '',
    deliveryDate: '',
    deliveryTime: 'any',
    comment: '',
    postcard: '',
    paymentMethod: 'online'
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.recipientName || !formData.recipientPhone || !formData.address || !formData.settlementId) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    const selectedSettlement = settlements.find(s => s.id === parseInt(formData.settlementId));

    const orderData = {
      recipient_name: formData.recipientName,
      recipient_phone: formData.recipientPhone,
      sender_name: formData.senderName || null,
      sender_phone: formData.senderPhone || null,
      customer_email: formData.email || null,
      city: selectedCity,
      settlement_id: parseInt(formData.settlementId),
      settlement_name: selectedSettlement?.name || '',
      delivery_price: selectedSettlement?.delivery_price || 0,
      delivery_address: formData.address,
      delivery_date: formData.deliveryDate || null,
      delivery_time: formData.deliveryTime,
      comment: formData.comment || null,
      postcard_text: formData.postcard || null,
      payment_method: formData.paymentMethod,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total_amount: finalPrice,
      promo_code: appliedPromo?.code || null,
      discount_amount: discountAmount
    };

    try {
      const response = await fetch(API_ENDPOINTS.orders, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to send order');
      }

      const result = await response.json();
      const orderId = result.id;

      if (formData.paymentMethod === 'online') {
        const paymentResponse = await fetch(`${API_ENDPOINTS.orders}?action=create_payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: finalPrice,
            order_id: orderId,
            return_url: window.location.origin + '/orders/' + orderId
          })
        });

        if (paymentResponse.ok) {
          const paymentData = await paymentResponse.json();
          window.location.href = paymentData.payment_url;
          return;
        }
      }

      toast({
        title: "Заказ оформлен!",
        description: `Ваш заказ на сумму ${finalPrice} ₽ принят в обработку. Мы свяжемся с вами в ближайшее время.`
      });

      clearCart();
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить заказ. Попробуйте позже или свяжитесь с нами по телефону.",
        variant: "destructive"
      });
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const selectedSettlement = settlements.find(s => s.id === parseInt(formData.settlementId));
  const deliveryPrice = selectedSettlement?.delivery_price || 0;
  const subtotal = totalPrice + deliveryPrice;
  
  const discountAmount = appliedPromo 
    ? Math.round(subtotal * (appliedPromo.discount_percent / 100))
    : 0;
  
  const finalPrice = subtotal - discountAmount;

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen flex flex-col bg-accent/5">
      <Header cartCount={totalItems} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => navigate('/cart')}>
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад в корзину
            </Button>
            <h1 className="text-3xl font-bold">Оформление заказа</h1>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <CheckoutRecipientForm
                  recipientName={formData.recipientName}
                  recipientPhone={formData.recipientPhone}
                  onChange={handleChange}
                />

                <CheckoutSenderForm
                  senderName={formData.senderName}
                  senderPhone={formData.senderPhone}
                  email={formData.email}
                  onChange={handleChange}
                />

                <CheckoutDeliveryForm
                  selectedCity={selectedCity}
                  settlementId={formData.settlementId}
                  address={formData.address}
                  deliveryDate={formData.deliveryDate}
                  deliveryTime={formData.deliveryTime}
                  settlements={settlements}
                  loadingSettlements={loadingSettlements}
                  onChange={handleChange}
                  getTodayDate={getTodayDate}
                />

                <CheckoutPaymentForm
                  paymentMethod={formData.paymentMethod}
                  onChange={handleChange}
                />

                <CheckoutAdditionalForm
                  postcard={formData.postcard}
                  comment={formData.comment}
                  onChange={handleChange}
                />

                <div className="bg-card rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4">Промокод</h2>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Icon name="Tag" size={20} className="text-green-600" />
                        <div>
                          <p className="font-semibold text-green-700">{appliedPromo.code}</p>
                          <p className="text-sm text-green-600">Скидка {appliedPromo.discount_percent}%</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePromoCode}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Icon name="X" size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Введите промокод"
                        className="flex-1 px-3 py-2 border rounded-lg uppercase"
                        disabled={checkingPromo}
                      />
                      <Button
                        type="button"
                        onClick={handleApplyPromoCode}
                        disabled={checkingPromo || !promoCode.trim()}
                        variant="outline"
                      >
                        {checkingPromo ? 'Проверка...' : 'Применить'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <CheckoutOrderSummary
                  items={items}
                  totalPrice={totalPrice}
                  deliveryPrice={deliveryPrice}
                  finalPrice={finalPrice}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                  promoCode={appliedPromo?.code}
                  promoDiscount={appliedPromo?.discount_percent}
                  discountAmount={discountAmount}
                />
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;