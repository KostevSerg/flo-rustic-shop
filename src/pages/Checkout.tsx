import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '@/contexts/CartContext';
import { useCity } from '@/contexts/CityContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import CheckoutRecipientForm from '@/components/checkout/CheckoutRecipientForm';
import CheckoutSenderForm from '@/components/checkout/CheckoutSenderForm';
import CheckoutDeliveryForm from '@/components/checkout/CheckoutDeliveryForm';
import CheckoutPaymentForm from '@/components/checkout/CheckoutPaymentForm';
import CheckoutAdditionalForm from '@/components/checkout/CheckoutAdditionalForm';
import CheckoutOrderSummary from '@/components/checkout/CheckoutOrderSummary';
import CheckoutPromoSection from '@/components/checkout/CheckoutPromoSection';
import CheckoutCart from '@/components/checkout/CheckoutCart';
import { useCheckoutData } from '@/hooks/useCheckoutData';
import API_ENDPOINTS from '@/config/api';

const Checkout = () => {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity } = useCart();
  const { selectedCity, selectedCityRegion } = useCity();
  const navigate = useNavigate();
  
  const {
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
    toast
  } = useCheckoutData();
  
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientPhone: '',
    senderName: '',
    senderPhone: '',
    email: '',
    settlementId: '',
    address: '',
    deliveryDate: '',
    deliveryTimeFrom: '',
    deliveryTimeTo: '',
    comment: '',
    postcard: '',
    paymentMethod: 'online'
  });

  useEffect(() => {
    if (!loadingSettlements && settlements.length > 0 && selectedCity && !formData.settlementId) {
      const matchingSettlement = settlements.find(
        s => s.name.toLowerCase() === selectedCity.toLowerCase()
      );
      
      if (matchingSettlement) {
        setFormData(prev => ({
          ...prev,
          settlementId: matchingSettlement.id.toString()
        }));
      }
    }
  }, [settlements, loadingSettlements, selectedCity, formData.settlementId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.recipientName || !formData.recipientPhone || !formData.senderPhone || !formData.address || !formData.settlementId) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    const selectedSettlement = settlements.find(s => s.id === parseInt(formData.settlementId));

    let cityId = null;
    try {
      const citiesResponse = await fetch(API_ENDPOINTS.cities);
      const citiesData = await citiesResponse.json();
      const allCities: any[] = [];
      Object.values(citiesData.cities || {}).forEach((regionCities: any) => {
        allCities.push(...regionCities);
      });
      const foundCity = allCities.find((c: any) => c.name === selectedCity);
      if (foundCity) {
        cityId = foundCity.id;
      }
    } catch (error) {
      console.error('Failed to get city_id:', error);
    }

    const orderData = {
      customer_name: formData.recipientName,
      customer_phone: formData.recipientPhone,
      customer_email: formData.email || null,
      city_id: cityId,
      delivery_address: formData.address,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total_amount: finalPrice,
      promo_code: appliedPromo?.code || null,
      discount_amount: discountAmount,
      recipient_name: formData.recipientName,
      recipient_phone: formData.recipientPhone,
      sender_name: formData.senderName || null,
      sender_phone: formData.senderPhone || null,
      delivery_date: formData.deliveryDate || null,
      delivery_time_from: formData.deliveryTimeFrom || null,
      delivery_time_to: formData.deliveryTimeTo || null,
      postcard_text: formData.postcard || null,
      payment_method: formData.paymentMethod
    };

    try {
      console.log('Отправка заказа:', orderData);
      const response = await fetch(API_ENDPOINTS.orders, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      console.log('Ответ сервера:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Ошибка создания заказа:', errorData);
        throw new Error(errorData.error || 'Failed to send order');
      }

      const result = await response.json();
      console.log('Заказ создан:', result);
      const orderId = result.id;
      const orderNumber = result.order_number;

      if (typeof window.ym !== 'undefined') {
        window.ym(104746725, 'reachGoal', 'purchase');
        
        window.ym(104746725, 'ecommerce', 'purchase', {
          actionField: {
            id: orderId.toString(),
            revenue: finalPrice,
            coupon: appliedPromo?.code || ''
          },
          products: items.map(item => ({
            id: item.id.toString(),
            name: item.name,
            price: item.price,
            quantity: item.quantity
          }))
        });
      }

      try {
        const selectedSettlement = settlements.find(s => s.id.toString() === formData.settlementId);
        const settlementName = selectedSettlement ? selectedSettlement.name : '';
        
        await fetch(API_ENDPOINTS.sendOrder, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order: {
              order_number: orderNumber,
              city: selectedCity || 'Не указан',
              region: selectedCityRegion || '',
              settlement: settlementName,
              address: formData.address,
              deliveryDate: formData.deliveryDate,
              deliveryTimeFrom: formData.deliveryTimeFrom,
              deliveryTimeTo: formData.deliveryTimeTo,
              totalPrice: finalPrice,
              paymentMethod: formData.paymentMethod === 'online' ? 'Онлайн оплата' : 'Оплата при получении',
              comment: formData.postcard,
              promoCode: appliedPromo?.code || null,
              discountAmount: discountAmount
            },
            customer: {
              recipient_name: formData.recipientName,
              recipient_phone: formData.recipientPhone,
              sender_name: formData.senderName,
              sender_phone: formData.senderPhone
            },
            items: items.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              image_url: item.image
            }))
          })
        });
        console.log('Письмо с заказом отправлено');
      } catch (emailError) {
        console.error('Ошибка отправки письма:', emailError);
      }

      console.log('Создание платежа для заказа:', orderId);
      const paymentResponse = await fetch(`${API_ENDPOINTS.orders}?action=create_payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalPrice,
          order_id: orderId,
          return_url: window.location.origin + '/'
        })
      });

      console.log('Ответ создания платежа:', paymentResponse.status);

      if (paymentResponse.ok) {
        const paymentData = await paymentResponse.json();
        console.log('Платеж создан, перенаправление на:', paymentData.payment_url);
        clearCart();
        window.location.href = paymentData.payment_url;
        return;
      } else {
        console.warn('Платёжная система недоступна, но заказ создан');
        clearCart();
        
        alert('Заказ принят! Проблема с платёжной системой. Заказ создан, вскоре наш специалист свяжется с вами для уточнения оплаты.');
        
        toast({
          title: "Заказ принят!",
          description: "Проблема с платёжной системой. Заказ создан, вскоре наш специалист свяжется с вами для уточнения оплаты.",
          duration: 5000
        });
        
        setTimeout(() => {
          navigate('/');
        }, 5000);
        return;
      }
    } catch (error: any) {
      console.error('Общая ошибка отправки заказа:', error);
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить заказ. Попробуйте позже или свяжитесь с нами по телефону.",
        variant: "destructive"
      });
    }
  };

  if (items.length === 0) {
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
      <Helmet prioritizeSeoTags defer={false}>
        <html lang="ru" />
        <title>Оформление заказа — FloRustic | Доставка цветов</title>
        <meta name="description" content="Служба доставки цветов FloRustic. Свежие цветы — доставка в течение 1.5 часов после оплаты. Оформление заказа за 2 минуты. Выбор оплаты: онлайн или при получении. Промокоды и скидки!" />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://florustic.ru/checkout" />
      </Helmet>

      <Header cartCount={totalItems} />
      <main className="flex-1 container mx-auto px-3 md:px-4 py-3 md:py-6">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/cart')} className="mb-2 text-sm md:text-base px-2 md:px-4">
            <Icon name="ArrowLeft" size={18} className="mr-1 md:mr-2" />
            Назад в корзину
          </Button>
          <h1 className="text-xl md:text-3xl font-bold mb-3 md:mb-6">Оформление заказа</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-3 md:gap-6">
              <div className="lg:col-span-2 space-y-3 md:space-y-4">
                <CheckoutCart 
                  items={items}
                  onRemove={removeFromCart}
                  onUpdateQuantity={updateQuantity}
                />

                <CheckoutRecipientForm
                  formData={formData}
                  onChange={handleChange}
                />

                <CheckoutSenderForm
                  formData={formData}
                  onChange={handleChange}
                />

                <CheckoutDeliveryForm
                  selectedCity={selectedCity}
                  settlementId={formData.settlementId}
                  address={formData.address}
                  deliveryDate={formData.deliveryDate}
                  deliveryTimeFrom={formData.deliveryTimeFrom}
                  deliveryTimeTo={formData.deliveryTimeTo}
                  settlements={settlements}
                  loadingSettlements={loadingSettlements}
                  onChange={handleChange}
                  getTodayDate={getTodayDate}
                  cityWorkHours={cityWorkHours}
                />

                <CheckoutPaymentForm
                  formData={formData}
                  onChange={handleChange}
                />

                <CheckoutAdditionalForm
                  formData={formData}
                  onChange={handleChange}
                />

                <CheckoutPromoSection
                  promoCode={promoCode}
                  setPromoCode={setPromoCode}
                  appliedPromo={appliedPromo}
                  checkingPromo={checkingPromo}
                  onApply={handleApplyPromoCode}
                  onRemove={handleRemovePromoCode}
                />
              </div>

              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-4">
                  <CheckoutOrderSummary
                    totalPrice={totalPrice}
                    deliveryPrice={deliveryPrice}
                    subtotal={subtotal}
                    discountAmount={discountAmount}
                    finalPrice={finalPrice}
                    appliedPromo={appliedPromo}
                  />
                  <Button 
                    type="submit"
                    size="lg"
                    className="w-full mt-4 text-base md:text-lg py-5 md:py-6"
                  >
                    Перейти к оплате
                  </Button>
                </div>
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