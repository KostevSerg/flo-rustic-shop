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
      const citiesResponse = await fetch('https://functions.poehali.dev/3f4d37f0-b84f-4157-83b7-55bdb568e459');
      const citiesData = await citiesResponse.json();
      
      let cityId = null;
      const allCities: any[] = [];
      Object.values(citiesData.cities || {}).forEach((regionCities: any) => {
        allCities.push(...regionCities);
      });
      
      const foundCity = allCities.find((c: any) => c.name === selectedCity);
      if (foundCity) {
        cityId = foundCity.id;
        
        const settlementsResponse = await fetch(`https://functions.poehali.dev/3f4d37f0-b84f-4157-83b7-55bdb568e459?action=settlements&city_id=${cityId}`);
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
      total_amount: finalPrice
    };

    try {
      const response = await fetch('https://functions.poehali.dev/92fe6c7e-b699-4325-a4e7-ee427bef50ae', {
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
        const paymentResponse = await fetch('https://functions.poehali.dev/92fe6c7e-b699-4325-a4e7-ee427bef50ae?action=create_payment', {
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
  const finalPrice = totalPrice + deliveryPrice;

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
              </div>

              <div className="lg:col-span-1">
                <CheckoutOrderSummary
                  items={items}
                  totalPrice={totalPrice}
                  deliveryPrice={deliveryPrice}
                  finalPrice={finalPrice}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
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