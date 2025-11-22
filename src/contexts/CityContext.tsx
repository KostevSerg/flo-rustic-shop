import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface CityContextType {
  selectedCity: string;
  selectedCityId: number;
  selectedCityRegion: string;
  setCity: (city: string, cityId: number, region?: string) => void;
  initAutoDetection: (fromHomePage?: boolean) => void;
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

  const initAutoDetection = async (fromHomePage: boolean = false) => {
    const hasDetectedLocation = localStorage.getItem('hasDetectedLocation');
    const savedCity = localStorage.getItem('selectedCity');
    
    if (fromHomePage && !hasDetectedLocation) {
      await detectUserLocation();
      return;
    }
    
    if (!savedCity) {
      setSelectedCity('Москва');
      setSelectedCityId(1);
      setSelectedCityRegion('Москва');
    }
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
        if (Date.now() - timestamp < 5 * 60 * 1000) {
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
          'Волгоград': { lat: 48.7080, lon: 44.5133 },
          'Краснодар': { lat: 45.0355, lon: 38.9753 },
          'Саратов': { lat: 51.5924, lon: 46.0348 },
          'Тюмень': { lat: 57.1522, lon: 65.5272 },
          'Тольятти': { lat: 53.5303, lon: 49.3461 },
          'Ижевск': { lat: 56.8498, lon: 53.2045 },
          'Барнаул': { lat: 53.3481, lon: 83.7798 },
          'Ульяновск': { lat: 54.3142, lon: 48.4031 },
          'Иркутск': { lat: 52.2870, lon: 104.3050 },
          'Хабаровск': { lat: 48.4827, lon: 135.0838 },
          'Ярославль': { lat: 57.6261, lon: 39.8845 },
          'Владивосток': { lat: 43.1332, lon: 131.9113 },
          'Махачкала': { lat: 42.9849, lon: 47.5047 },
          'Томск': { lat: 56.4977, lon: 84.9744 },
          'Оренбург': { lat: 51.7727, lon: 55.0988 },
          'Кемерово': { lat: 55.3331, lon: 86.0864 },
          'Новокузнецк': { lat: 53.7557, lon: 87.1099 },
          'Рязань': { lat: 54.6269, lon: 39.6916 },
          'Астрахань': { lat: 46.3497, lon: 48.0408 },
          'Набережные Челны': { lat: 55.7430, lon: 52.4112 },
          'Пенза': { lat: 53.2001, lon: 45.0000 },
          'Липецк': { lat: 52.6103, lon: 39.5705 },
          'Киров': { lat: 58.6035, lon: 49.6679 },
          'Чебоксары': { lat: 56.1439, lon: 47.2489 },
          'Калининград': { lat: 54.7104, lon: 20.4522 },
          'Тула': { lat: 54.1961, lon: 37.6182 },
          'Курск': { lat: 51.7373, lon: 36.1873 },
          'Ставрополь': { lat: 45.0428, lon: 41.9734 },
          'Сочи': { lat: 43.5855, lon: 39.7231 },
          'Улан-Удэ': { lat: 51.8272, lon: 107.6063 },
          'Тверь': { lat: 56.8587, lon: 35.9176 },
          'Магнитогорск': { lat: 53.4072, lon: 58.9794 },
          'Иваново': { lat: 57.0000, lon: 40.9737 },
          'Брянск': { lat: 53.2521, lon: 34.3717 },
          'Белгород': { lat: 50.5950, lon: 36.5870 },
          'Сургут': { lat: 61.2500, lon: 73.3833 },
          'Владимир': { lat: 56.1366, lon: 40.3966 },
          'Нижний Тагил': { lat: 57.9197, lon: 59.9650 },
          'Архангельск': { lat: 64.5401, lon: 40.5433 },
          'Чита': { lat: 52.0346, lon: 113.5004 },
          'Калуга': { lat: 54.5293, lon: 36.2754 },
          'Смоленск': { lat: 54.7818, lon: 32.0401 },
          'Волжский': { lat: 48.7851, lon: 44.7753 },
          'Курган': { lat: 55.4500, lon: 65.3333 },
          'Орёл': { lat: 52.9651, lon: 36.0785 },
          'Череповец': { lat: 59.1333, lon: 37.9000 },
          'Владикавказ': { lat: 43.0231, lon: 44.6820 },
          'Мурманск': { lat: 68.9585, lon: 33.0827 },
          'Вологда': { lat: 59.2206, lon: 39.8839 },
          'Саранск': { lat: 54.1838, lon: 45.1749 },
          'Тамбов': { lat: 52.7213, lon: 41.4525 },
          'Стерлитамак': { lat: 53.6250, lon: 55.9500 },
          'Грозный': { lat: 43.3178, lon: 45.6986 },
          'Якутск': { lat: 62.0355, lon: 129.6755 },
          'Кострома': { lat: 57.7679, lon: 40.9269 },
          'Петрозаводск': { lat: 61.7849, lon: 34.3469 },
          'Нижневартовск': { lat: 60.9344, lon: 76.5531 },
          'Новороссийск': { lat: 44.7233, lon: 37.7686 },
          'Йошкар-Ола': { lat: 56.6315, lon: 47.8910 },
          'Бийск': { lat: 52.5396, lon: 85.2139 },
          'Сыктывкар': { lat: 61.6681, lon: 50.8067 },
          'Комсомольск-на-Амуре': { lat: 50.5500, lon: 137.0167 }
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
        if (Date.now() - timestamp < 5 * 60 * 1000) {
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