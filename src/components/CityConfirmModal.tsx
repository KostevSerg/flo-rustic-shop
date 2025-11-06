import { useEffect, useState } from 'react';
import { useCity } from '@/contexts/CityContext';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const CityConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedCity } = useCity();
  const navigate = useNavigate();

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
    localStorage.setItem('cityConfirmed', 'true');
    setIsOpen(false);
    navigate('/');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
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
      </DialogContent>
    </Dialog>
  );
};
