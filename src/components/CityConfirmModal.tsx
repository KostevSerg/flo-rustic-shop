import { useEffect, useState } from 'react';
import { useCity } from '@/contexts/CityContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CitySelector from '@/components/CitySelector';

export const CityConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const { selectedCity, setCity } = useCity();

  useEffect(() => {
    const hasConfirmedCity = localStorage.getItem('cityConfirmed');
    const hasDetectedLocation = localStorage.getItem('hasDetectedLocation');
    
    if (!hasConfirmedCity && hasDetectedLocation) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('cityConfirmed', 'true');
    setIsOpen(false);
  };

  const handleChangeCity = () => {
    setShowSelector(true);
  };

  const handleCitySelect = (city: string, cityId: number) => {
    setCity(city, cityId);
    localStorage.setItem('cityConfirmed', 'true');
    setIsOpen(false);
    setShowSelector(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        {!showSelector ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl">Ваш город</DialogTitle>
              <DialogDescription className="text-center text-base pt-4">
                Вы хотите доставить цветы в городе <span className="font-semibold text-foreground">{selectedCity}</span> или выбрать другой?
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 pt-4">
              <Button onClick={handleConfirm} size="lg" className="w-full">
                Да, всё верно
              </Button>
              <Button onClick={handleChangeCity} variant="outline" size="lg" className="w-full">
                Выбрать другой город
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl">Выберите город</DialogTitle>
            </DialogHeader>
            <div className="pt-4">
              <CitySelector value={selectedCity} onChange={handleCitySelect} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};