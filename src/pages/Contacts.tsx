import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useCity } from '@/contexts/CityContext';
import { useSiteTexts } from '@/contexts/SiteTextsContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/icon';
import API_ENDPOINTS from '@/config/api';
import { Button } from '@/components/ui/button';

interface CityContactData {
  id: number;
  city_id: number;
  city_name: string;
  phone: string;
  email: string;
  address: string;
  working_hours: string;
  delivery_info: string;
}

const Contacts = () => {
  const { totalItems } = useCart();
  const { selectedCity } = useCity();
  const { getText } = useSiteTexts();

  const [selectedContact, setSelectedContact] = useState<CityContactData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCityContact = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_ENDPOINTS.cities}?action=contacts&city=${encodeURIComponent(selectedCity)}`);
        const data = await response.json();
        if (data.contact) {
          setSelectedContact(data.contact);
        }
      } catch (error) {
        console.error('Failed to fetch city contact:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCityContact();
  }, [selectedCity]);

  const getMapUrl = (address: string) => {
    return `https://yandex.ru/maps/?text=${encodeURIComponent(address)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartCount={totalItems} />
        <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Загрузка контактов...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={totalItems} />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-4">Контакты</h1>
          <p className="text-center text-muted-foreground text-lg mb-12">
            Свяжитесь с нами удобным способом — работаем во всех городах присутствия
          </p>



          {selectedContact && (
            <>
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-6">
                  <div className="text-center md:text-left mb-8">
                    <h2 className="text-3xl font-bold mb-2">г. {selectedContact.city_name}</h2>
                    <p className="text-muted-foreground">Контактная информация</p>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-accent/30 p-3 rounded-lg flex-shrink-0">
                      <Icon name="Phone" size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Телефон</h3>
                      <a href={`tel:${selectedContact.phone}`} className="text-muted-foreground hover:text-primary transition">
                        {selectedContact.phone}
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedContact.working_hours || 'Ежедневно с 9:00 до 21:00'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-accent/30 p-3 rounded-lg flex-shrink-0">
                      <Icon name="Mail" size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Email</h3>
                      <a href={`mailto:${selectedContact.email}`} className="text-muted-foreground hover:text-primary transition">
                        {selectedContact.email}
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">Ответим в течение часа</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-accent/30 p-3 rounded-lg flex-shrink-0">
                      <Icon name="MapPin" size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Адрес</h3>
                      <p className="text-muted-foreground">{selectedContact.address}</p>
                      <a 
                        href={getMapUrl(selectedContact.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline mt-2 inline-flex items-center gap-1"
                      >
                        Открыть на карте
                        <Icon name="ExternalLink" size={14} />
                      </a>
                    </div>
                  </div>

                  {selectedContact.delivery_info && (
                    <div className="flex items-start space-x-4">
                      <div className="bg-accent/30 p-3 rounded-lg flex-shrink-0">
                        <Icon name="Truck" size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Доставка</h3>
                        <p className="text-muted-foreground text-sm">{selectedContact.delivery_info}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-card border rounded-lg overflow-hidden h-[500px]">
                  <iframe
                    src={`https://yandex.ru/map-widget/v1/?ll=37.617635,55.755814&mode=search&text=${encodeURIComponent(selectedContact.address)}&z=15`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    style={{ position: 'relative' }}
                    title={`Карта ${selectedContact.city_name}`}
                  ></iframe>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Icon name="Clock" size={32} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Режим работы</h3>
                  <p className="text-muted-foreground text-sm">
                    {selectedContact.working_hours || 'Ежедневно с 9:00 до 21:00'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Без выходных</p>
                </div>

                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Icon name="Timer" size={32} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Быстрая доставка</h3>
                  <p className="text-muted-foreground text-sm">
                    За 2 часа по городу
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Срочная доставка за 1 час</p>
                </div>

                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Icon name="ShieldCheck" size={32} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Гарантия качества</h3>
                  <p className="text-muted-foreground text-sm">
                    Свежесть цветов 7 дней
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Или вернём деньги</p>
                </div>
              </div>
            </>
          )}

          <div className="bg-primary/5 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Мы в социальных сетях</h2>
            <div className="flex justify-center gap-4 mb-6">
              <a 
                href={getText('social', 'whatsapp', 'https://wa.me/79991234567')} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-accent/30 p-4 rounded-lg hover:bg-accent/50 transition"
                title="WhatsApp"
              >
                <Icon name="MessageCircle" size={32} />
              </a>
              <a 
                href={getText('social', 'telegram', 'https://t.me/florustic')} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-accent/30 p-4 rounded-lg hover:bg-accent/50 transition"
                title="Telegram"
              >
                <Icon name="Send" size={32} />
              </a>
              <a 
                href={getText('social', 'vk', 'https://vk.com/florustic')} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-accent/30 p-4 rounded-lg hover:bg-accent/50 transition"
                title="VK"
              >
                <svg 
                  viewBox="0 0 24 24" 
                  width="32" 
                  height="32" 
                  fill="currentColor"
                  className="inline-block"
                >
                  <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.18 14.23h-1.8c-.68 0-.89-.54-2.11-1.76-1.06-1.02-1.53-1.16-1.8-1.16-.37 0-.48.11-.48.63v1.61c0 .43-.14.69-1.27.69-1.89 0-3.99-1.15-5.47-3.3-2.22-3.17-2.83-5.56-2.83-6.05 0-.27.11-.52.63-.52h1.8c.47 0 .65.21.83.72.96 2.58 2.57 4.84 3.23 4.84.25 0 .36-.11.36-.74v-2.88c-.09-1.55-.91-1.68-.91-2.23 0-.22.18-.43.47-.43h2.83c.4 0 .54.21.54.68v3.88c0 .4.18.54.3.54.25 0 .45-.14.9-.59 1.38-1.56 2.37-3.96 2.37-3.96.13-.27.34-.52.81-.52h1.8c.54 0 .66.28.54.68-.21.98-2.23 3.7-2.23 3.7-.21.34-.29.49 0 .88.21.29.9.88 1.36 1.41.84.94 1.49 1.73 1.67 2.28.17.56-.1.84-.65.84z"/>
                </svg>
              </a>
            </div>
            <p className="text-center text-muted-foreground">
              Следите за новинками и специальными предложениями в наших социальных сетях
            </p>
          </div>

          <div className="bg-card border rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Остались вопросы?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Позвоните нам или напишите в мессенджер — наши флористы с удовольствием проконсультируют 
              вас по выбору букета и условиям доставки.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <a href={`tel:${selectedContact?.phone}`}>
                  <Icon name="Phone" size={20} className="mr-2" />
                  Позвонить
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={`mailto:${selectedContact?.email}`}>
                  <Icon name="Mail" size={20} className="mr-2" />
                  Написать
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contacts;