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
  onChange: (city: string) => void;
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

  const handleSelect = (cityName: string) => {
    onChange(cityName);
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
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-hidden">
            <div className="p-3 border-b border-border sticky top-0 bg-card">
              <div className="relative">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Поиск города или региона..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-80">
              {loading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Загрузка городов...
                </div>
              ) : Object.keys(filteredCities).length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  Города не найдены
                </div>
              ) : (
                Object.entries(filteredCities).map(([region, regionCities]) => (
                  <div key={region} className="border-b border-border last:border-0">
                    <div className="px-4 py-2 bg-accent/30 text-sm font-semibold text-muted-foreground sticky top-0">
                      {region}
                    </div>
                    {regionCities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => handleSelect(city.name)}
                        className="w-full px-4 py-2 text-left hover:bg-accent/50 transition-colors"
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CitySelector;
