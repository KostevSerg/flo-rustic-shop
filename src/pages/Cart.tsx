import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreadcrumbsNav from '@/components/BreadcrumbsNav';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  useEffect(() => {
    if (items.length > 0 && typeof window.ym !== 'undefined') {
      window.ym(104746725, 'ecommerce', 'detail', {
        products: items.map(item => ({
          id: item.id.toString(),
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      });
    }
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Helmet>
          <title>Корзина — FloRustic | Оформление заказа цветов</title>
          <meta name="description" content="Корзина FloRustic — оформите заказ цветов онлайн за 2 минуты. Выбор способа оплаты и доставки. Доставка по России за 2 часа. Безопасная оплата картой или наличными при получении!" />
          <meta name="robots" content="noindex, follow" />
          <link rel="canonical" href="https://florustic.ru/cart" />
        </Helmet>
        <Header cartCount={totalItems} />
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-accent/20 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="ShoppingCart" size={64} className="text-muted-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Корзина пуста</h1>
            <p className="text-muted-foreground mb-8">
              Добавьте букеты из каталога, чтобы оформить заказ
            </p>
            <Link to="/catalog">
              <Button size="lg" className="bg-primary text-primary-foreground">
                Перейти в каталог
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedPrice = totalPrice ? totalPrice.toLocaleString('ru-RU') : '0';
  const itemsCount = totalItems || 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{`Корзина (${itemsCount}) — FloRustic | Оформление заказа`}</title>
        <meta name="description" content={`В корзине ${itemsCount} товаров на ${formattedPrice}₽. Оформите заказ за 2 минуты. Доставка цветов по России. Оплата картой или наличными. Гарантия свежести!`} />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://florustic.ru/cart" />
      </Helmet>

      <Header cartCount={totalItems} />
      <main className="flex-1 container mx-auto px-4 py-16">
        <BreadcrumbsNav items={[{ name: 'Корзина' }]} />
        <h1 className="text-5xl font-bold text-center mb-12">Корзина</h1>
        
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-card border border-border rounded-lg p-6 flex gap-6">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-accent/20 rounded-lg px-3 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="hover:text-primary transition"
                      >
                        <Icon name="Minus" size={16} />
                      </button>
                      <span className="font-semibold w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="hover:text-primary transition"
                      >
                        <Icon name="Plus" size={16} />
                      </button>
                    </div>
                    <span className="text-lg font-bold">{item.price * item.quantity} ₽</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    removeFromCart(item.id);
                    if (typeof window.ym !== 'undefined') {
                      window.ym(104746725, 'ecommerce', 'remove', {
                        products: [{
                          id: item.id.toString(),
                          name: item.name,
                          price: item.price,
                          quantity: item.quantity
                        }]
                      });
                    }
                  }}
                  className="text-muted-foreground hover:text-destructive transition"
                >
                  <Icon name="Trash2" size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-accent/20 rounded-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Итого</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-lg">
                  <span className="text-muted-foreground">Товаров:</span>
                  <span className="font-semibold">{totalItems} шт</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-muted-foreground">Сумма:</span>
                  <span className="font-semibold">{totalPrice} ₽</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-muted-foreground">Доставка:</span>
                  <span className="font-semibold text-primary">Бесплатно</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between text-2xl font-bold">
                    <span>К оплате:</span>
                    <span>{totalPrice} ₽</span>
                  </div>
                </div>
              </div>
              <Link to="/checkout">
                <Button size="lg" className="w-full bg-primary text-primary-foreground text-lg">
                  Оформить заказ
                </Button>
              </Link>
              <Link to="/catalog">
                <Button variant="outline" size="lg" className="w-full mt-3">
                  Продолжить покупки
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;