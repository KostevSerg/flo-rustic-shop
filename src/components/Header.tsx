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
    .replace(/ /g, '-')
    .replace(/а/g, 'a').replace(/б/g, 'b').replace(/в/g, 'v').replace(/г/g, 'g')
    .replace(/д/g, 'd').replace(/е/g, 'e').replace(/ж/g, 'zh').replace(/з/g, 'z')
    .replace(/и/g, 'i').replace(/й/g, 'j').replace(/к/g, 'k').replace(/л/g, 'l')
    .replace(/м/g, 'm').replace(/н/g, 'n').replace(/о/g, 'o').replace(/п/g, 'p')
    .replace(/р/g, 'r').replace(/с/g, 's').replace(/т/g, 't').replace(/у/g, 'u')
    .replace(/ф/g, 'f').replace(/х/g, 'h').replace(/ц/g, 'c').replace(/ч/g, 'ch')
    .replace(/ш/g, 'sh').replace(/щ/g, 'sch').replace(/ъ/g, '').replace(/ы/g, 'y')
    .replace(/ь/g, '').replace(/э/g, 'e').replace(/ю/g, 'yu').replace(/я/g, 'ya');
};

const Header = ({ cartCount }: HeaderProps) => {
  const { selectedCity, setCity } = useCity();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCitySelector, setShowCitySelector] = useState(false);
  const citySlug = createSlug(selectedCity);

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex items-center justify-between py-2 md:py-4">
          <Link to="/" className="flex items-center">
            <img 
              src="https://cdn.poehali.dev/files/9580fd38-7d54-40e5-9120-ff97a68d6c3b.png" 
              alt="FloRustic" 
              className="h-12 md:h-16"
            />
          </Link>

          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setShowCitySelector(!showCitySelector)}
              className="flex items-center gap-1 text-sm hover:text-primary transition"
              title="Выбрать город"
            >
              <Icon name="MapPin" size={18} />
              <span className="max-w-[80px] truncate">{selectedCity}</span>
            </button>
            <a 
              href="https://wa.me/79952151096" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center bg-green-500 text-white p-1.5 rounded-lg hover:bg-green-600 transition"
              title="Написать в WhatsApp"
            >
              <Icon name="MessageCircle" size={18} />
            </a>
            <Link to="/cart" className="relative hover:text-primary transition">
              <Icon name="ShoppingCart" size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center text-[10px]">
                  {cartCount}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Icon name={isMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>

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

        {showCitySelector && (
          <div className="lg:hidden pb-4 border-t border-border pt-3 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Выберите город</h3>
              <button onClick={() => setShowCitySelector(false)}>
                <Icon name="X" size={18} />
              </button>
            </div>
            <CitySelector
              value={selectedCity}
              onChange={(city, cityId) => {
                setCity(city, cityId);
                setShowCitySelector(false);
              }}
            />
          </div>
        )}

        {isMenuOpen && (
          <nav className="lg:hidden pb-4 space-y-3 animate-fade-in border-t border-border pt-3">
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