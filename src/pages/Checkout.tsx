import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useCity } from '@/contexts/CityContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const Checkout = () => {
  const { items, totalItems, totalPrice, clearCart, removeFromCart, updateQuantity } = useCart();
  const { selectedCity } = useCity();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    recipientName: '',
    recipientPhone: '',
    senderName: '',
    senderPhone: '',
    email: '',
    address: '',
    deliveryDate: '',
    deliveryTime: 'any',
    comment: '',
    postcard: '',
    paymentMethod: 'cash',
    deliveryType: 'courier',
    anonymous: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.recipientName || !formData.recipientPhone || !formData.address) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    const orderData = {
      recipient_name: formData.recipientName,
      recipient_phone: formData.recipientPhone,
      sender_name: formData.anonymous ? 'Аноним' : (formData.senderName || null),
      sender_phone: formData.senderPhone || null,
      customer_email: formData.email || null,
      city: selectedCity,
      delivery_address: formData.address,
      delivery_date: formData.deliveryDate || null,
      delivery_time: formData.deliveryTime,
      comment: formData.comment || null,
      postcard_text: formData.postcard || null,
      payment_method: formData.paymentMethod,
      delivery_type: formData.deliveryType,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total_amount: totalPrice
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

      toast({
        title: "Заказ оформлен!",
        description: `Ваш заказ на сумму ${totalPrice} ₽ принят в обработку. Мы свяжемся с вами в ближайшее время.`
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

  const deliveryPrice = formData.deliveryType === 'pickup' ? 0 : 0;
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
                
                <div className="bg-card rounded-lg p-6 space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Icon name="User" size={20} className="text-primary" />
                    Получатель
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Имя получателя <span className="text-destructive">*</span>
                      </label>
                      <Input
                        name="recipientName"
                        value={formData.recipientName}
                        onChange={handleChange}
                        placeholder="Анна Петрова"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Телефон получателя <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="tel"
                        name="recipientPhone"
                        value={formData.recipientPhone}
                        onChange={handleChange}
                        placeholder="+7 (999) 123-45-67"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg p-6 space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Icon name="UserCheck" size={20} className="text-primary" />
                    Отправитель
                  </h2>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      name="anonymous"
                      checked={formData.anonymous}
                      onChange={handleChange}
                      className="w-4 h-4 rounded"
                    />
                    <label htmlFor="anonymous" className="text-sm cursor-pointer">
                      Анонимная доставка (не указывать отправителя)
                    </label>
                  </div>
                  {!formData.anonymous && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Ваше имя</label>
                        <Input
                          name="senderName"
                          value={formData.senderName}
                          onChange={handleChange}
                          placeholder="Иван Иванов"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Ваш телефон</label>
                        <Input
                          type="tel"
                          name="senderPhone"
                          value={formData.senderPhone}
                          onChange={handleChange}
                          placeholder="+7 (999) 123-45-67"
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1">Email для чека</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="bg-card rounded-lg p-6 space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Icon name="MapPin" size={20} className="text-primary" />
                    Доставка
                  </h2>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="courier"
                        checked={formData.deliveryType === 'courier'}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="font-medium">Курьерская доставка</div>
                        <div className="text-sm text-muted-foreground">Бесплатно по городу</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="pickup"
                        checked={formData.deliveryType === 'pickup'}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="font-medium">Самовывоз</div>
                        <div className="text-sm text-muted-foreground">Бесплатно</div>
                      </div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Адрес доставки <span className="text-destructive">*</span>
                    </label>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Улица, дом, квартира"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Город: {selectedCity || 'Не выбран'}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Дата доставки</label>
                      <Input
                        type="date"
                        name="deliveryDate"
                        value={formData.deliveryDate}
                        onChange={handleChange}
                        min={getTodayDate()}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Время доставки</label>
                      <select
                        name="deliveryTime"
                        value={formData.deliveryTime}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      >
                        <option value="any">В любое время</option>
                        <option value="morning">Утро (9:00 - 12:00)</option>
                        <option value="day">День (12:00 - 18:00)</option>
                        <option value="evening">Вечер (18:00 - 21:00)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg p-6 space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Icon name="CreditCard" size={20} className="text-primary" />
                    Оплата
                  </h2>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <div className="flex items-center gap-2">
                        <Icon name="Banknote" size={18} />
                        <span>Наличными при получении</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card-courier"
                        checked={formData.paymentMethod === 'card-courier'}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <div className="flex items-center gap-2">
                        <Icon name="CreditCard" size={18} />
                        <span>Картой курьеру</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={formData.paymentMethod === 'online'}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <div className="flex items-center gap-2">
                        <Icon name="Smartphone" size={18} />
                        <span>Онлайн на сайте</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-card rounded-lg p-6 space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Icon name="MessageSquare" size={20} className="text-primary" />
                    Дополнительно
                  </h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Текст открытки</label>
                    <Textarea
                      name="postcard"
                      value={formData.postcard}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Напишите текст для открытки..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Комментарий к заказу</label>
                    <Textarea
                      name="comment"
                      value={formData.comment}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Особые пожелания, примечания..."
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg p-6 sticky top-24">
                  <h2 className="text-xl font-semibold mb-4">Ваш заказ</h2>
                  
                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-3 pb-3 border-b">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.price} ₽ × {item.quantity}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-6 h-6 flex items-center justify-center border rounded hover:bg-accent"
                            >
                              <Icon name="Minus" size={12} />
                            </button>
                            <span className="text-sm w-6 text-center">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center border rounded hover:bg-accent"
                            >
                              <Icon name="Plus" size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="ml-auto text-destructive hover:text-destructive/80"
                            >
                              <Icon name="Trash2" size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Товары:</span>
                      <span className="font-medium">{totalPrice} ₽</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Доставка:</span>
                      <span className="font-medium text-green-600">Бесплатно</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Итого:</span>
                      <span>{finalPrice} ₽</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full mt-6"
                  >
                    Оформить заказ
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
                  </p>
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
