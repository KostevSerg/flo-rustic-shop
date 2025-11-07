import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import API_ENDPOINTS from '@/config/api';

interface City {
  id: number;
  name: string;
  region: string;
}

interface CitySelectorProps {
  value: string;
  onChange: (city: string, cityId: number, region?: string) => void;
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

const CitySelector = ({ value, onChange }: CitySelectorProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState<Record<string, City[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const fetchCities = async () => {
      const CACHE_KEY = 'cities_cache';
      const CACHE_DURATION = 24 * 60 * 60 * 1000;

      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setCities(data);
            setLoading(false);
            return;
          }
        }

        const response = await fetch(API_ENDPOINTS.cities);
        const data = await response.json();
        const citiesData = data.cities || {};
        
        setCities(citiesData);
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: citiesData,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [isOpen]);

  const filteredCities = Object.entries(cities).reduce((acc, [region, regionCities]) => {
    const filtered = regionCities.filter(city =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      region.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[region] = filtered;
    }
    return acc;
  }, {} as Record<string, City[]>);

  const handleSelect = (cityName: string, cityId: number, region: string) => {
    onChange(cityName, cityId, region);
    setIsOpen(false);
    setSearchQuery('');
    
    const slug = createSlug(cityName);
    if (!location.pathname.startsWith('/admin')) {
      navigate(`/city/${slug}`);
    }
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer flex justify-between items-center bg-background"
      >
        <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
          {value || 'Выберите город'}
        </span>
        <Icon name={isOpen ? 'ChevronUp' : 'ChevronDown'} size={20} />
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90vw] max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Выберите город доставки</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-accent/50 rounded-lg p-2 transition-colors"
                >
                  <Icon name="X" size={24} />
                </button>
              </div>
              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Поиск города или региона..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-[70vh]">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">
                  <div className="animate-spin mx-auto mb-3 w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  Загрузка городов...
                </div>
              ) : Object.keys(filteredCities).length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Icon name="Search" size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Города не найдены</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-3 p-4">
                  {Object.entries(filteredCities).map(([region, regionCities]) => (
                    <div key={region} className="bg-accent/20 rounded-lg p-3">
                      <div className="flex items-center mb-2 pb-2 border-b border-border/50">
                        <Icon name="MapPin" size={16} className="mr-1.5 text-primary flex-shrink-0" />
                        <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                          {region}
                        </h4>
                      </div>
                      <div className="space-y-0.5">
                        {regionCities.map((city) => (
                          <button
                            key={city.id}
                            onClick={() => handleSelect(city.name, city.id, region)}
                            className="w-full px-2 py-1.5 text-left text-sm rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            {city.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CitySelector;