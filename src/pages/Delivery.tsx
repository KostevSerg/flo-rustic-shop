import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Delivery = () => {
  const [cartCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={cartCount} />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-8">Доставка</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-3xl font-bold mb-4">Условия доставки</h2>
              <div className="space-y-4 text-lg">
                <p>
                  Мы доставляем цветы ежедневно с 9:00 до 21:00. Возможна срочная доставка в течение 2 часов.
                </p>
                <div className="bg-accent/30 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Стоимость доставки:</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>В пределах центра города</span>
                      <span className="font-semibold">Бесплатно</span>
                    </li>
                    <li className="flex justify-between">
                      <span>За пределами центра (до 10 км)</span>
                      <span className="font-semibold">300 ₽</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Пригород (10-20 км)</span>
                      <span className="font-semibold">500 ₽</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Срочная доставка (в течение 2 часов)</span>
                      <span className="font-semibold">+500 ₽</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-4">Как оформить заказ</h2>
              <ol className="space-y-4 text-lg list-decimal list-inside">
                <li>Выберите понравившийся букет в каталоге</li>
                <li>Добавьте его в корзину и оформите заказ</li>
                <li>Укажите адрес и удобное время доставки</li>
                <li>Наш курьер привезет свежий букет точно в срок</li>
              </ol>
            </section>

            <section className="bg-primary/5 p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-4">Важная информация</h2>
              <ul className="space-y-3 text-lg">
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  <span>Доставка букетов осуществляется только при получателе</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  <span>Возможна анонимная доставка</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  <span>Фото букета отправляется перед доставкой</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Delivery;
