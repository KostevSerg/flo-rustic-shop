import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface CityContextType {
  selectedCity: string;
  selectedCityId: number;
  selectedCityRegion: string;
  setCity: (city: string, cityId: number, region?: string) => void;
  initAutoDetection: () => void;
  setCityFromSlug: (citySlug: string) => Promise<boolean>;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

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

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

interface CityData {
  id: number;
  name: string;
  region?: string;
  latitude?: number;
  longitude?: number;
}

export const CityProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCity, setSelectedCity] = useState('Москва');
  const [selectedCityId, setSelectedCityId] = useState(1);
  const [selectedCityRegion, setSelectedCityRegion] = useState('Москва');

  useEffect(() => {
    const savedCity = localStorage.getItem('selectedCity');
    const savedCityId = localStorage.getItem('selectedCityId');
    const savedCityRegion = localStorage.getItem('selectedCityRegion');
    
    if (savedCity && savedCityId) {
      setSelectedCity(savedCity);
      setSelectedCityId(parseInt(savedCityId, 10));
      if (savedCityRegion) {
        setSelectedCityRegion(savedCityRegion);
      }
    }
  }, []);

  const initAutoDetection = async () => {
    const hasDetectedLocation = localStorage.getItem('hasDetectedLocation');
    if (hasDetectedLocation) return;
    
    await detectUserLocation();
  };

  const detectUserLocation = async () => {
    if (!navigator.geolocation) return;

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;

      const CACHE_KEY = 'cities_cache';
      let data;
      
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data: cachedData, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          data = { cities: cachedData };
        }
      }
      
      if (!data) {
        const response = await fetch('https://functions.poehali.dev/3f4d37f0-b84f-4157-83b7-55bdb568e459?action=list');
        data = await response.json();
        
        if (data.cities) {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: data.cities,
            timestamp: Date.now()
          }));
        }
      }

      if (data.cities) {
        const allCities: CityData[] = [];
        Object.values(data.cities).forEach((regionCities: any) => {
          allCities.push(...regionCities);
        });

        const cityCoordinates: Record<string, { lat: number; lon: number }> = {
          'Москва': { lat: 55.7558, lon: 37.6173 },
          'Санкт-Петербург': { lat: 59.9343, lon: 30.3351 },
          'Барнаул': { lat: 53.3481, lon: 83.7798 },
          'Бийск': { lat: 52.5396, lon: 85.2139 },
          'Новосибирск': { lat: 55.0084, lon: 82.9357 },
          'Екатеринбург': { lat: 56.8389, lon: 60.6057 },
          'Казань': { lat: 55.8304, lon: 49.0661 },
          'Нижний Новгород': { lat: 56.2965, lon: 43.9361 },
          'Челябинск': { lat: 55.1644, lon: 61.4368 },
          'Самара': { lat: 53.1959, lon: 50.1002 },
          'Омск': { lat: 54.9885, lon: 73.3242 },
          'Ростов-на-Дону': { lat: 47.2357, lon: 39.7015 },
          'Уфа': { lat: 54.7388, lon: 55.9721 },
          'Красноярск': { lat: 56.0153, lon: 92.8932 },
          'Воронеж': { lat: 51.6720, lon: 39.1843 },
          'Пермь': { lat: 58.0105, lon: 56.2502 },
          'Волгоград': { lat: 48.7080, lon: 44.5133 }
        };

        let nearestCity: CityData | null = null;
        let minDistance = Infinity;

        allCities.forEach(city => {
          const coords = cityCoordinates[city.name];
          if (coords) {
            const distance = calculateDistance(latitude, longitude, coords.lat, coords.lon);
            if (distance < minDistance) {
              minDistance = distance;
              nearestCity = city;
            }
          }
        });

        if (nearestCity) {
          setSelectedCity(nearestCity.name);
          setSelectedCityId(nearestCity.id);
          if (nearestCity.region) {
            setSelectedCityRegion(nearestCity.region);
            localStorage.setItem('selectedCityRegion', nearestCity.region);
          }
          localStorage.setItem('selectedCity', nearestCity.name);
          localStorage.setItem('selectedCityId', nearestCity.id.toString());
          localStorage.setItem('hasDetectedLocation', 'true');
          
          const citySlug = createSlug(nearestCity.name);
          window.location.href = `/city/${citySlug}`;
        }
      }
    } catch (error) {
      console.log('Геолокация недоступна, используем город по умолчанию');
      localStorage.setItem('hasDetectedLocation', 'true');
    }
  };

  const setCity = (city: string, cityId: number, region?: string) => {
    setSelectedCity(city);
    setSelectedCityId(cityId);
    if (region) {
      setSelectedCityRegion(region);
      localStorage.setItem('selectedCityRegion', region);
    }
    localStorage.setItem('selectedCity', city);
    localStorage.setItem('selectedCityId', cityId.toString());
  };

  const setCityFromSlug = async (citySlug: string): Promise<boolean> => {
    try {
      const CACHE_KEY = 'cities_cache';
      let data;
      
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data: cachedData, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          data = { cities: cachedData };
        }
      }
      
      if (!data) {
        const response = await fetch('https://functions.poehali.dev/3f4d37f0-b84f-4157-83b7-55bdb568e459?action=list');
        data = await response.json();
        
        if (data.cities) {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: data.cities,
            timestamp: Date.now()
          }));
        }
      }

      if (data.cities) {
        const allCities: CityData[] = [];
        Object.values(data.cities).forEach((regionCities: any) => {
          allCities.push(...regionCities);
        });

        const foundCity = allCities.find(c => createSlug(c.name) === citySlug);
        
        if (foundCity) {
          setCity(foundCity.name, foundCity.id, foundCity.region);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Failed to set city from slug:', error);
      return false;
    }
  };

  return (
    <CityContext.Provider
      value={{
        selectedCity,
        selectedCityId,
        selectedCityRegion,
        setCity,
        initAutoDetection,
        setCityFromSlug,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};