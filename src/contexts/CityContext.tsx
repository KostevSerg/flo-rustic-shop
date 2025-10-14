import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface CityContextType {
  selectedCity: string;
  selectedCityId: number;
  setCity: (city: string, cityId: number) => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCity, setSelectedCity] = useState('Москва');
  const [selectedCityId, setSelectedCityId] = useState(1);

  useEffect(() => {
    const savedCity = localStorage.getItem('selectedCity');
    const savedCityId = localStorage.getItem('selectedCityId');
    
    if (savedCity && savedCityId) {
      setSelectedCity(savedCity);
      setSelectedCityId(parseInt(savedCityId, 10));
    }
  }, []);

  const setCity = (city: string, cityId: number) => {
    setSelectedCity(city);
    setSelectedCityId(cityId);
    localStorage.setItem('selectedCity', city);
    localStorage.setItem('selectedCityId', cityId.toString());
  };

  return (
    <CityContext.Provider
      value={{
        selectedCity,
        selectedCityId,
        setCity,
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
