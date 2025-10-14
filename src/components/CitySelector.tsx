import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface City {
  id: number;
  name: string;
  slug: string;
}

interface CitySelectorProps {
  value: string;
  onChange: (city: string, cityId: number) => void;
}

const CitySelector = ({ value, onChange }: CitySelectorProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/bb2b7d69-0c7e-4fa4-a4dc-fe6f20b98c33');
        const data = await response.json();
        setCities(data.cities || []);
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (city: City) => {
    onChange(city.name, city.id);
    navigate(`/city/${city.slug}`);
    setIsOpen(false);
    setSearchQuery('');
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

            <div className="overflow-y-auto max-h-[60vh]">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">
                  <div className="animate-spin mx-auto mb-3 w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  Загрузка городов...
                </div>
              ) : filteredCities.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Icon name="Search" size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Города не найдены</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-6">
                  {filteredCities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleSelect(city)}
                      className="px-4 py-3 text-left rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors border border-border flex items-center group"
                    >
                      <Icon name="MapPin" size={18} className="mr-2 text-primary group-hover:text-primary-foreground" />
                      {city.name}
                    </button>
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