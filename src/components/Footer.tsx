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
              <a href="#" className="hover:opacity-80 transition">
                <Icon name="Instagram" size={24} />
              </a>
              <a href="#" className="hover:opacity-80 transition">
                <Icon name="Facebook" size={24} />
              </a>
              <a href="#" className="hover:opacity-80 transition">
                <Icon name="MessageCircle" size={24} />
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