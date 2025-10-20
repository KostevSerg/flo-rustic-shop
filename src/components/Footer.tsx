import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useSiteTexts } from '@/contexts/SiteTextsContext';
import { useCity } from '@/contexts/CityContext';
import API_ENDPOINTS from '@/config/api';

interface CityContact {
  phone: string;
  email: string;
  address: string;
}

const Footer = () => {
  const { getText } = useSiteTexts();
  const { selectedCity } = useCity();
  const [cityContact, setCityContact] = useState<CityContact | null>(null);

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
  
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <img 
                src="https://cdn.poehali.dev/files/9580fd38-7d54-40e5-9120-ff97a68d6c3b.png" 
                alt="FloRustic" 
                className="h-16"
              />
            </div>
            <p className="text-primary-foreground/80 text-sm">
              {getText('footer', 'description', 'Служба доставки цветов. Доставляем цветы и подарки, которые дарят радость!')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">Навигация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/catalog" className="hover:text-primary-foreground/80 transition">
                  Каталог
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-foreground/80 transition">
                  О нас
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="hover:text-primary-foreground/80 transition">
                  Доставка
                </Link>
              </li>
              <li>
                <Link to="/guarantees" className="hover:text-primary-foreground/80 transition">
                  Гарантии
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">Контакты</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li className="flex items-center space-x-2">
                <Icon name="Phone" size={16} />
                <span>{cityContact?.phone || getText('contacts', 'phone', '+7 (999) 123-45-67')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon name="Mail" size={16} />
                <span>{cityContact?.email || getText('contacts', 'email', 'info@florustic.ru')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon name="MapPin" size={16} />
                <span>{cityContact?.address || getText('contacts', 'address', 'г. Москва, ул. Цветочная, 15')}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">Мы в соцсетях</h3>
            <div className="flex space-x-4">
              <a 
                href={getText('social', 'whatsapp', 'https://wa.me/79991234567')} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:opacity-80 transition"
              >
                <Icon name="MessageCircle" size={24} />
              </a>
              <a 
                href={getText('social', 'telegram', 'https://t.me/florustic')} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:opacity-80 transition"
              >
                <Icon name="Send" size={24} />
              </a>
              <a 
                href={getText('social', 'vk', 'https://vk.com/florustic')} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:opacity-80 transition"
              >
                <svg 
                  viewBox="0 0 24 24" 
                  width="24" 
                  height="24" 
                  fill="currentColor"
                  className="inline-block"
                >
                  <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.18 14.23h-1.8c-.68 0-.89-.54-2.11-1.76-1.06-1.02-1.53-1.16-1.8-1.16-.37 0-.48.11-.48.63v1.61c0 .43-.14.69-1.27.69-1.89 0-3.99-1.15-5.47-3.3-2.22-3.17-2.83-5.56-2.83-6.05 0-.27.11-.52.63-.52h1.8c.47 0 .65.21.83.72.96 2.58 2.57 4.84 3.23 4.84.25 0 .36-.11.36-.74v-2.88c-.09-1.55-.91-1.68-.91-2.23 0-.22.18-.43.47-.43h2.83c.4 0 .54.21.54.68v3.88c0 .4.18.54.3.54.25 0 .45-.14.9-.59 1.38-1.56 2.37-3.96 2.37-3.96.13-.27.34-.52.81-.52h1.8c.54 0 .66.28.54.68-.21.98-2.23 3.7-2.23 3.7-.21.34-.29.49 0 .88.21.29.9.88 1.36 1.41.84.94 1.49 1.73 1.67 2.28.17.56-.1.84-.65.84z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; 2025 FloRustic. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;