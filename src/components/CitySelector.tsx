import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface City {
  id: number;
  name: string;
  region: string;
}

interface CitySelectorProps {
  value: string;
  onChange: (city: string, cityId: number) => void;
}

const CitySelector = ({ value, onChange }: CitySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState<Record<string, City[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/3f4d37f0-b84f-4157-83b7-55bdb568e459');
        const data = await response.json();
        setCities(data.cities || {});
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

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

  const handleSelect = (cityName: string, cityId: number) => {
    onChange(cityName, cityId);
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
              ) : Object.keys(filteredCities).length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Icon name="Search" size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Города не найдены</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4 p-6">
                  {Object.entries(filteredCities).map(([region, regionCities]) => (
                    <div key={region} className="bg-accent/20 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <Icon name="MapPin" size={18} className="mr-2 text-primary" />
                        <h4 className="font-semibold text-sm text-muted-foreground">
                          {region}
                        </h4>
                      </div>
                      <div className="space-y-1">
                        {regionCities.map((city) => (
                          <button
                            key={city.id}
                            onClick={() => handleSelect(city.name, city.id)}
                            className="w-full px-3 py-2 text-left rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
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