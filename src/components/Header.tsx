import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import CitySelector from '@/components/CitySelector';
import { useCity } from '@/contexts/CityContext';

interface HeaderProps {
  cartCount: number;
}

const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/ё/g, 'e')
    .replace(/[^\u0430-\u044f\u0410-\u042fa-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

const Header = ({ cartCount }: HeaderProps) => {
  const { selectedCity, setCity } = useCity();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const citySlug = createSlug(selectedCity);

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center">
            <img 
              src="https://cdn.poehali.dev/files/9580fd38-7d54-40e5-9120-ff97a68d6c3b.png" 
              alt="FloRustic" 
              className="h-16"
            />
          </Link>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden"
          >
            <Icon name={isMenuOpen ? "X" : "Menu"} size={24} />
          </button>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link to={`/city/${citySlug}`} className="hover:text-primary transition">
              Каталог
            </Link>
            <Link to="/delivery" className="hover:text-primary transition">
              Доставка
            </Link>
            <Link to="/guarantees" className="hover:text-primary transition">
              Гарантии
            </Link>
            <Link to="/contacts" className="hover:text-primary transition">
              Контакты
            </Link>
            <Link to="/about" className="hover:text-primary transition">
              О нас
            </Link>
          </nav>

          <div className="hidden lg:flex items-center space-x-6">
            <div className="w-56">
              <CitySelector
                value={selectedCity}
                onChange={setCity}
              />
            </div>

            <Link to="/admin" className="hover:text-primary transition" title="Админ-панель">
              <Icon name="Settings" size={24} />
            </Link>

            <div className="flex items-center gap-4">
              <a href="tel:+79952151096" className="flex items-center gap-2 hover:text-primary transition font-medium">
                <Icon name="Phone" size={20} />
                <span className="whitespace-nowrap">+7 995 215-10-96</span>
              </a>
              <a 
                href="https://wa.me/79952151096" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 hover:text-primary transition bg-green-500 text-white px-3 py-2 rounded-lg"
                title="Написать в WhatsApp"
              >
                <Icon name="MessageCircle" size={20} />
                <span className="whitespace-nowrap">WhatsApp</span>
              </a>
            </div>

            <Link to="/cart" className="relative hover:text-primary transition">
              <Icon name="ShoppingCart" size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="lg:hidden pb-4 space-y-3 animate-fade-in">
            <Link to={`/city/${citySlug}`} className="block hover:text-primary transition" onClick={() => setIsMenuOpen(false)}>
              Каталог
            </Link>
            <Link to="/delivery" className="block hover:text-primary transition" onClick={() => setIsMenuOpen(false)}>
              Доставка
            </Link>
            <Link to="/guarantees" className="block hover:text-primary transition" onClick={() => setIsMenuOpen(false)}>
              Гарантии
            </Link>
            <Link to="/contacts" className="block hover:text-primary transition" onClick={() => setIsMenuOpen(false)}>
              Контакты
            </Link>
            <Link to="/about" className="block hover:text-primary transition" onClick={() => setIsMenuOpen(false)}>
              О нас
            </Link>
            <div className="space-y-3 pt-3 border-t border-border">
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={20} className="flex-shrink-0" />
                <div className="flex-1">
                  <CitySelector
                    value={selectedCity}
                    onChange={setCity}
                  />
                </div>
              </div>
              <a href="tel:+79952151096" className="flex items-center gap-2 hover:text-primary transition font-medium">
                <Icon name="Phone" size={20} />
                <span>+7 995 215-10-96</span>
              </a>
              <a 
                href="https://wa.me/79952151096" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 hover:text-primary transition bg-green-500 text-white px-3 py-2 rounded-lg"
              >
                <Icon name="MessageCircle" size={20} />
                <span>WhatsApp</span>
              </a>
              <div className="flex items-center justify-end space-x-4">
                <Link to="/admin" className="hover:text-primary transition" onClick={() => setIsMenuOpen(false)}>
                  <Icon name="Settings" size={24} />
                </Link>
                <Link to="/cart" className="relative hover:text-primary transition">
                  <Icon name="ShoppingCart" size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;