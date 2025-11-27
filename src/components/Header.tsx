import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import CitySelector from '@/components/CitySelector';
import { useCity } from '@/contexts/CityContext';
import { useSiteTexts } from '@/contexts/SiteTextsContext';

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
  const { getText } = useSiteTexts();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [showSocialMenu, setShowSocialMenu] = useState(false);
  const [showMobileSocial, setShowMobileSocial] = useState(false);
  const socialMenuRef = useRef<HTMLDivElement>(null);
  const mobileSocialRef = useRef<HTMLDivElement>(null);
  const citySlug = createSlug(selectedCity);

  const socialLinks = [
    {
      name: 'WhatsApp',
      url: getText('social', 'whatsapp', 'https://wa.me/79991234567'),
      icon: 'MessageCircle',
      color: 'text-green-500',
      type: 'icon' as const
    },
    {
      name: 'Telegram',
      url: getText('social', 'telegram', 'https://t.me/florustic'),
      icon: 'Send',
      color: 'text-blue-500',
      type: 'icon' as const
    },
    {
      name: 'VK',
      url: getText('social', 'vk', 'https://vk.com/florustic'),
      icon: 'vk',
      color: 'text-blue-600',
      type: 'svg' as const
    },
    {
      name: 'Max',
      url: getText('social', 'max', 'https://max.ru/u/f9LHodD0cOLaj4fsu5wKI6LNXgNQIoYrIHyE1shHRfAm_B2ofo1AohePtMA'),
      icon: 'https://cdn.poehali.dev/files/57988f4d-dee7-4f5f-87a4-68a574db22b2.png',
      color: '',
      type: 'image' as const
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (socialMenuRef.current && !socialMenuRef.current.contains(event.target as Node)) {
        setShowSocialMenu(false);
      }
      if (mobileSocialRef.current && !mobileSocialRef.current.contains(event.target as Node)) {
        setShowMobileSocial(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            <div className="relative" ref={mobileSocialRef}>
              <button 
                onClick={() => setShowMobileSocial(!showMobileSocial)}
                className="flex items-center justify-center bg-primary text-primary-foreground p-1.5 rounded-lg hover:bg-primary/90 transition"
                title="Социальные сети"
              >
                <Icon name="Share2" size={18} />
              </button>
              {showMobileSocial && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-border rounded-lg shadow-lg p-3 z-50">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm mb-3">Наши социальные сети</h3>
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                        onClick={() => setShowMobileSocial(false)}
                      >
                        {social.type === 'icon' && (
                          <Icon name={social.icon} size={20} className={social.color} />
                        )}
                        {social.type === 'svg' && (
                          <svg 
                            viewBox="0 0 24 24" 
                            width="20" 
                            height="20" 
                            fill="currentColor"
                            className={social.color}
                          >
                            <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.18 14.23h-1.8c-.68 0-.89-.54-2.11-1.76-1.06-1.02-1.53-1.16-1.8-1.16-.37 0-.48.11-.48.63v1.61c0 .43-.14.69-1.27.69-1.89 0-3.99-1.15-5.47-3.3-2.22-3.17-2.83-5.56-2.83-6.05 0-.27.11-.52.63-.52h1.8c.47 0 .65.21.83.72.96 2.58 2.57 4.84 3.23 4.84.25 0 .36-.11.36-.74v-2.88c-.09-1.55-.91-1.68-.91-2.23 0-.22.18-.43.47-.43h2.83c.4 0 .54.21.54.68v3.88c0 .4.18.54.3.54.25 0 .45-.14.9-.59 1.38-1.56 2.37-3.96 2.37-3.96.13-.27.34-.52.81-.52h1.8c.54 0 .66.28.54.68-.21.98-2.23 3.7-2.23 3.7-.21.34-.29.49 0 .88.21.29.9.88 1.36 1.41.84.94 1.49 1.73 1.67 2.28.17.56-.1.84-.65.84z"/>
                          </svg>
                        )}
                        {social.type === 'image' && (
                          <img 
                            src={social.icon}
                            alt={social.name}
                            width="20"
                            height="20"
                            className="rounded"
                          />
                        )}
                        <span className="font-medium">{social.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
              <div className="relative" ref={socialMenuRef}>
                <button 
                  onClick={() => setShowSocialMenu(!showSocialMenu)}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition"
                >
                  <Icon name="Share2" size={20} />
                  <span className="whitespace-nowrap">Социальные сети</span>
                </button>
                {showSocialMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-border rounded-lg shadow-lg p-4 z-50">
                    <div className="space-y-2">
                      <h3 className="font-semibold mb-3">Наши социальные сети</h3>
                      {socialLinks.map((social) => (
                        <a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                          onClick={() => setShowSocialMenu(false)}
                        >
                          {social.type === 'icon' && (
                            <Icon name={social.icon} size={22} className={social.color} />
                          )}
                          {social.type === 'svg' && (
                            <svg 
                              viewBox="0 0 24 24" 
                              width="22" 
                              height="22" 
                              fill="currentColor"
                              className={social.color}
                            >
                              <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.18 14.23h-1.8c-.68 0-.89-.54-2.11-1.76-1.06-1.02-1.53-1.16-1.8-1.16-.37 0-.48.11-.48.63v1.61c0 .43-.14.69-1.27.69-1.89 0-3.99-1.15-5.47-3.3-2.22-3.17-2.83-5.56-2.83-6.05 0-.27.11-.52.63-.52h1.8c.47 0 .65.21.83.72.96 2.58 2.57 4.84 3.23 4.84.25 0 .36-.11.36-.74v-2.88c-.09-1.55-.91-1.68-.91-2.23 0-.22.18-.43.47-.43h2.83c.4 0 .54.21.54.68v3.88c0 .4.18.54.3.54.25 0 .45-.14.9-.59 1.38-1.56 2.37-3.96 2.37-3.96.13-.27.34-.52.81-.52h1.8c.54 0 .66.28.54.68-.21.98-2.23 3.7-2.23 3.7-.21.34-.29.49 0 .88.21.29.9.88 1.36 1.41.84.94 1.49 1.73 1.67 2.28.17.56-.1.84-.65.84z"/>
                            </svg>
                          )}
                          {social.type === 'image' && (
                            <img 
                              src={social.icon}
                              alt={social.name}
                              width="22"
                              height="22"
                              className="rounded"
                            />
                          )}
                          <span className="font-medium">{social.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
              onChange={(city, cityId, region) => {
                setCity(city, cityId, region);
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
              <div className="space-y-2">
                <p className="text-sm font-semibold">Социальные сети:</p>
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    {social.type === 'icon' && (
                      <Icon name={social.icon} size={20} className={social.color} />
                    )}
                    {social.type === 'svg' && (
                      <svg 
                        viewBox="0 0 24 24" 
                        width="20" 
                        height="20" 
                        fill="currentColor"
                        className={social.color}
                      >
                        <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.18 14.23h-1.8c-.68 0-.89-.54-2.11-1.76-1.06-1.02-1.53-1.16-1.8-1.16-.37 0-.48.11-.48.63v1.61c0 .43-.14.69-1.27.69-1.89 0-3.99-1.15-5.47-3.3-2.22-3.17-2.83-5.56-2.83-6.05 0-.27.11-.52.63-.52h1.8c.47 0 .65.21.83.72.96 2.58 2.57 4.84 3.23 4.84.25 0 .36-.11.36-.74v-2.88c-.09-1.55-.91-1.68-.91-2.23 0-.22.18-.43.47-.43h2.83c.4 0 .54.21.54.68v3.88c0 .4.18.54.3.54.25 0 .45-.14.9-.59 1.38-1.56 2.37-3.96 2.37-3.96.13-.27.34-.52.81-.52h1.8c.54 0 .66.28.54.68-.21.98-2.23 3.7-2.23 3.7-.21.34-.29.49 0 .88.21.29.9.88 1.36 1.41.84.94 1.49 1.73 1.67 2.28.17.56-.1.84-.65.84z"/>
                      </svg>
                    )}
                    {social.type === 'image' && (
                      <img 
                        src={social.icon}
                        alt={social.name}
                        width="20"
                        height="20"
                        className="rounded"
                      />
                    )}
                    <span>{social.name}</span>
                  </a>
                ))}
              </div>
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