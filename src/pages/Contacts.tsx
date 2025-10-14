import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/icon';

const Contacts = () => {
  const [cartCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={cartCount} />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-8">Контакты</h1>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-accent/30 p-3 rounded-lg">
                  <Icon name="Phone" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Телефон</h3>
                  <p className="text-muted-foreground">+7 (999) 123-45-67</p>
                  <p className="text-sm text-muted-foreground">Ежедневно с 9:00 до 21:00</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-accent/30 p-3 rounded-lg">
                  <Icon name="Mail" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email</h3>
                  <p className="text-muted-foreground">info@florustic.ru</p>
                  <p className="text-sm text-muted-foreground">Ответим в течение часа</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-accent/30 p-3 rounded-lg">
                  <Icon name="MapPin" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Адрес</h3>
                  <p className="text-muted-foreground">г. Москва, ул. Цветочная, д. 15</p>
                  <p className="text-sm text-muted-foreground">Ближайшее метро: Парк культуры</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-accent/30 p-3 rounded-lg">
                  <Icon name="Clock" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Режим работы</h3>
                  <p className="text-muted-foreground">Понедельник - Воскресенье</p>
                  <p className="text-sm text-muted-foreground">9:00 - 21:00, без выходных</p>
                </div>
              </div>
            </div>

            <div className="bg-accent/20 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Напишите нам</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ваше имя</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Иван Иванов"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Телефон</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Сообщение</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ваше сообщение..."
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Отправить
                </button>
              </form>
            </div>
          </div>

          <div className="bg-primary/5 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Мы в социальных сетях</h2>
            <div className="flex justify-center space-x-6">
              <a href="#" className="bg-accent/30 p-4 rounded-lg hover:bg-accent/50 transition">
                <Icon name="Instagram" size={32} />
              </a>
              <a href="#" className="bg-accent/30 p-4 rounded-lg hover:bg-accent/50 transition">
                <Icon name="Facebook" size={32} />
              </a>
              <a href="#" className="bg-accent/30 p-4 rounded-lg hover:bg-accent/50 transition">
                <Icon name="MessageCircle" size={32} />
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contacts;
