import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Guarantees = () => {
  const { totalItems } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={totalItems} />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-8">Гарантии</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-3xl font-bold mb-4">Наши обязательства</h2>
              <p className="text-lg mb-6">
                Мы гарантируем высокое качество каждого букета и несем полную ответственность за свежесть цветов 
                и своевременную доставку.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-accent/30 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">🌸 Свежесть цветов</h3>
                  <p>
                    Все цветы поступают к нам напрямую от проверенных поставщиков. 
                    Гарантируем свежесть букета минимум 7 дней при правильном уходе.
                  </p>
                </div>
                
                <div className="bg-accent/30 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">⏰ Точное время</h3>
                  <p>
                    Доставим букет в указанное время с точностью до 30 минут. 
                    Курьер предупредит о прибытии за 15 минут.
                  </p>
                </div>
                
                <div className="bg-accent/30 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">📸 Фото букета</h3>
                  <p>
                    Перед доставкой отправим вам фотографию готового букета, 
                    чтобы вы могли убедиться в его качестве.
                  </p>
                </div>
                
                <div className="bg-accent/30 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">💯 Замена букета</h3>
                  <p>
                    Если букет не соответствует заявленному качеству, 
                    мы заменим его или вернем деньги в полном объеме.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-primary/5 p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-4">Возврат и обмен</h2>
              <div className="space-y-4 text-lg">
                <p>
                  Если вы обнаружили дефект или несоответствие букета заказу, свяжитесь с нами в течение 2 часов 
                  после получения.
                </p>
                <p className="font-semibold">
                  Мы бесплатно заменим букет или вернем деньги — выбор за вами.
                </p>
                <p className="text-muted-foreground">
                  Свяжитесь с нами по телефону +7 (999) 123-45-67 или напишите на почту info@florustic.ru
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Guarantees;