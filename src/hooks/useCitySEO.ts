import { useMemo } from 'react';
import { useCity } from '@/contexts/CityContext';

export const declineCity = (city: string, caseType: 'prepositional' | 'dative'): string => {
  const declensions: Record<string, { prepositional: string; dative: string }> = {
    'Барнаул': { prepositional: 'Барнауле', dative: 'Барнаулу' },
    'Москва': { prepositional: 'Москве', dative: 'Москве' },
    'Санкт-Петербург': { prepositional: 'Санкт-Петербурге', dative: 'Санкт-Петербургу' },
    'Новосибирск': { prepositional: 'Новосибирске', dative: 'Новосибирску' },
    'Екатеринбург': { prepositional: 'Екатеринбурге', dative: 'Екатеринбургу' },
    'Казань': { prepositional: 'Казани', dative: 'Казани' },
    'Нижний Новгород': { prepositional: 'Нижнем Новгороде', dative: 'Нижнему Новгороду' },
    'Челябинск': { prepositional: 'Челябинске', dative: 'Челябинску' },
    'Самара': { prepositional: 'Самаре', dative: 'Самаре' },
    'Омск': { prepositional: 'Омске', dative: 'Омску' },
    'Ростов-на-Дону': { prepositional: 'Ростове-на-Дону', dative: 'Ростову-на-Дону' },
    'Уфа': { prepositional: 'Уфе', dative: 'Уфе' },
    'Красноярск': { prepositional: 'Красноярске', dative: 'Красноярску' },
    'Воронеж': { prepositional: 'Воронеже', dative: 'Воронежу' },
    'Пермь': { prepositional: 'Перми', dative: 'Перми' },
    'Волгоград': { prepositional: 'Волгограде', dative: 'Волгограду' },
    'Белокуриха': { prepositional: 'Белокурихе', dative: 'Белокурихе' },
    'Гальбштадт': { prepositional: 'Гальбштадте', dative: 'Гальбштадту' }
  };
  
  const declension = declensions[city];
  if (!declension) return city;
  
  return declension[caseType];
};

export const useCitySEO = (baseTitle: string, baseDescription: string) => {
  const { selectedCity } = useCity();
  
  const cityInPrepositional = useMemo(() => declineCity(selectedCity, 'prepositional'), [selectedCity]);
  
  const title = useMemo(() => {
    return `${baseTitle} в ${cityInPrepositional} — FloRustic | Доставка цветов`;
  }, [baseTitle, cityInPrepositional]);
  
  const description = useMemo(() => {
    return `${baseDescription} в ${cityInPrepositional}. Работаем ежедневно с 9:00 до 21:00, доставка за 2 часа.`;
  }, [baseDescription, cityInPrepositional]);
  
  return { title, description, selectedCity, cityInPrepositional };
};
