export interface Region {
  id: number;
  name: string;
  cities: City[];
}

export interface City {
  id: number;
  name: string;
  timezone: string;
}

export const REGIONS: Region[] = [
  {
    id: 1,
    name: 'Москва и Московская область',
    cities: [
      { id: 1, name: 'Москва', timezone: 'Europe/Moscow' }
    ]
  },
  {
    id: 2,
    name: 'Санкт-Петербург и Ленинградская область',
    cities: [
      { id: 2, name: 'Санкт-Петербург', timezone: 'Europe/Moscow' }
    ]
  },
  {
    id: 3,
    name: 'Алтайский край',
    cities: [
      { id: 3, name: 'Барнаул', timezone: 'Asia/Barnaul' },
      { id: 4, name: 'Бийск', timezone: 'Asia/Barnaul' }
    ]
  }
];

export const getAllCities = (): City[] => {
  return REGIONS.flatMap(region => region.cities);
};

export const getCityById = (id: number): City | undefined => {
  return getAllCities().find(city => city.id === id);
};

export const getRegionByCity = (cityId: number): Region | undefined => {
  return REGIONS.find(region => 
    region.cities.some(city => city.id === cityId)
  );
};
