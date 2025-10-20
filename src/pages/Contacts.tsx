import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useCity } from '@/contexts/CityContext';
import { useSiteTexts } from '@/contexts/SiteTextsContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/icon';
import API_ENDPOINTS from '@/config/api';

interface CityContact {
  phone: string;
  email: string;
  address: string;
}

const Contacts = () => {
  const { totalItems } = useCart();
  const { selectedCity } = useCity();
  const { getText } = useSiteTexts();
  const [cityContact, setCityContact] = useState<CityContact | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    const fetchCityContact = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.cities}?action=contacts&city=${encodeURIComponent(selectedCity)}`);
        const data = await response.json();
        if (data.contact) {
          setCityContact({
            phone: data.contact.phone,
            email: data.contact.email,
            address: data.contact.address
          });
        }
      } catch (error) {
        console.error('Failed to fetch city contact:', error);
      }
    };

    if (selectedCity) {
      fetchCityContact();
    }
  }, [selectedCity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(API_ENDPOINTS.sendContactEmail, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', phone: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={totalItems} />
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
                  <p className="text-muted-foreground">{cityContact?.phone || getText('contacts', 'phone', '+7 995 215-10-96')}</p>
                  <p className="text-sm text-muted-foreground">Ежедневно с 9:00 до 21:00</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-accent/30 p-3 rounded-lg">
                  <Icon name="Mail" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email</h3>
                  <p className="text-muted-foreground">{cityContact?.email || getText('contacts', 'email', 'florustic@yandex.ru')}</p>
                  <p className="text-sm text-muted-foreground">Ответим в течение часа</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-accent/30 p-3 rounded-lg">
                  <Icon name="MapPin" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Адрес</h3>
                  <p className="text-muted-foreground">{cityContact?.address || getText('contacts', 'address', 'г. Москва, ул. Цветочная, 15')}</p>
                  <p className="text-sm text-muted-foreground">Город: {selectedCity}</p>
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ваше имя</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Иван Иванов"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Телефон</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+7 (999) 123-45-67"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Сообщение</label>
                  <textarea 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ваше сообщение..."
                    required
                  />
                </div>
                {submitStatus === 'success' && (
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                    Сообщение успешно отправлено!
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg">
                    Ошибка отправки. Попробуйте позже.
                  </div>
                )}
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Отправка...' : 'Отправить'}
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