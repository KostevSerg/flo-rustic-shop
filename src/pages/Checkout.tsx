import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const Checkout = () => {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Москва',
    comment: '',
    paymentMethod: 'card',
    deliveryDate: '',
    deliveryTime: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    const paymentMethodLabels: Record<string, string> = {
      'card': 'Картой онлайн',
      'cash': 'Наличными при получении',
      'card-courier': 'Картой курьеру'
    };

    const orderData = {
      order: {
        city: formData.city,
        address: formData.address,
        deliveryDate: formData.deliveryDate,
        deliveryTime: formData.deliveryTime,
        totalPrice: totalPrice,
        paymentMethod: paymentMethodLabels[formData.paymentMethod] || formData.paymentMethod,
        comment: formData.comment
      },
      customer: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email
      },
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    };

    try {
      const response = await fetch('https://functions.poehali.dev/97825be8-1815-431a-99ba-3b3ed7c3f8a5', {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={totalItems} />
      <main className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-12">Оформление заказа</h1>
        
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Icon name="User" size={24} className="mr-3 text-primary" />
                  Контактные данные
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ваше имя <span className="text-destructive">*</span>
                    </label>
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Иван Иванов"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Телефон <span className="text-destructive">*</span>
                    </label>
                    <input 
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+7 (999) 123-45-67"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Icon name="MapPin" size={24} className="mr-3 text-primary" />
                  Адрес доставки
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Город</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Москва">Москва</option>
                      <option value="Санкт-Петербург">Санкт-Петербург</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Адрес <span className="text-destructive">*</span>
                    </label>
                    <input 
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Улица, дом, квартира"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Дата доставки</label>
                      <input 
                        type="date"
                        name="deliveryDate"
                        value={formData.deliveryDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Время доставки</label>
                      <input 
                        type="time"
                        name="deliveryTime"
                        value={formData.deliveryTime}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Icon name="CreditCard" size={24} className="mr-3 text-primary" />
                  Способ оплаты
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span>Картой онлайн</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span>Наличными при получении</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="radio"
                      name="paymentMethod"
                      value="card-courier"
                      checked={formData.paymentMethod === 'card-courier'}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span>Картой курьеру</span>
                  </label>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Icon name="MessageSquare" size={24} className="mr-3 text-primary" />
                  Комментарий к заказу
                </h2>
                <textarea 
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Пожелания к букету, особенности доставки..."
                />
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-accent/20 rounded-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Ваш заказ</h2>
              <div className="space-y-3 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold">{item.price * item.quantity} ₽</span>
                  </div>
                ))}
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between text-lg">
                    <span className="text-muted-foreground">Товары:</span>
                    <span className="font-semibold">{totalPrice} ₽</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-muted-foreground">Доставка:</span>
                    <span className="font-semibold text-primary">Бесплатно</span>
                  </div>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between text-2xl font-bold">
                    <span>Итого:</span>
                    <span>{totalPrice} ₽</span>
                  </div>
                </div>
              </div>
              <Button 
                size="lg" 
                className="w-full bg-primary text-primary-foreground text-lg"
                onClick={handleSubmit}
              >
                Подтвердить заказ
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-4">
                Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;