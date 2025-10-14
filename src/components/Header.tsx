import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  cartCount: number;
}

const Header = ({ cartCount }: HeaderProps) => {
  const [selectedCity, setSelectedCity] = useState('Москва');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-3">
            <div className="text-primary">
              <Icon name="Flower2" size={32} />
            </div>
            <span className="text-2xl font-bold">FloRustic</span>
          </Link>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden"
          >
            <Icon name={isMenuOpen ? "X" : "Menu"} size={24} />
          </button>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/catalog" className="hover:text-primary transition">
              Каталог
            </Link>
            <Link to="/delivery" className="hover:text-primary transition">
              Доставка
            </Link>
            <Link to="/guarantees" className="hover:text-primary transition">
              Гарантии
            </Link>
            <Link to="/about" className="hover:text-primary transition">
              О нас
            </Link>
            <Link to="/reviews" className="hover:text-primary transition">
              Отзывы
            </Link>
            <Link to="/contacts" className="hover:text-primary transition">
              Контакты
            </Link>
          </nav>

          <div className="hidden lg:flex items-center space-x-6">
            <button 
              onClick={() => setSelectedCity(selectedCity === 'Москва' ? 'Санкт-Петербург' : 'Москва')}
              className="flex items-center space-x-2 hover:text-primary transition"
            >
              <Icon name="MapPin" size={20} />
              <span>{selectedCity}</span>
            </button>

            <Link to="/admin" className="hover:text-primary transition" title="Админ-панель">
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

        {isMenuOpen && (
          <nav className="lg:hidden pb-4 space-y-3 animate-fade-in">
            <Link to="/catalog" className="block hover:text-primary transition" onClick={() => setIsMenuOpen(false)}>
              Каталог
            </Link>
            <Link to="/delivery" className="block hover:text-primary transition" onClick={() => setIsMenuOpen(false)}>
              Доставка
            </Link>
            <Link to="/guarantees" className="block hover:text-primary transition" onClick={() => setIsMenuOpen(false)}>
              Гарантии
            </Link>
            <Link to="/about" className="block hover:text-primary transition" onClick={() => setIsMenuOpen(false)}>
              О нас
            </Link>
            <Link to="/reviews" className="block hover:text-primary transition" onClick={() => setIsMenuOpen(false)}>
              Отзывы
            </Link>
            <Link to="/contacts" className="block hover:text-primary transition" onClick={() => setIsMenuOpen(false)}>
              Контакты
            </Link>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <button 
                onClick={() => setSelectedCity(selectedCity === 'Москва' ? 'Санкт-Петербург' : 'Москва')}
                className="flex items-center space-x-2 hover:text-primary transition"
              >
                <Icon name="MapPin" size={20} />
                <span>{selectedCity}</span>
              </button>
              <div className="flex items-center space-x-4">
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