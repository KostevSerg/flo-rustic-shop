import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import API_ENDPOINTS from '@/config/api';

interface City {
  id: number;
  name: string;
  region_id: number;
  timezone: string;
  work_hours?: any;
  is_active?: boolean;
  address?: string;
  price_markup_percent?: number;
}

interface Region {
  id: number;
  name: string;
  is_active: boolean;
  cities?: City[];
}

export const useRegionsAndCities = (isAuthenticated: boolean) => {
  const { toast } = useToast();
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRegions, setExpandedRegions] = useState<number[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const timestamp = Date.now();
      const [regionsRes, citiesRes] = await Promise.all([
        fetch(`${API_ENDPOINTS.cities}?action=regions&all=true&_t=${timestamp}`, { cache: 'no-store' }),
        fetch(`${API_ENDPOINTS.cities}?all=true&_t=${timestamp}`, { cache: 'no-store' })
      ]);

      const regionsData = await regionsRes.json();
      const citiesData = await citiesRes.json();

      const regionsWithCities = (regionsData.regions || []).map((region: Region) => {
        const regionCities: City[] = [];
        Object.values(citiesData.cities || {}).forEach((cityList: any) => {
          cityList.forEach((city: any) => {
            if (city.region_id === region.id) {
              regionCities.push(city);
            }
          });
        });
        return { ...region, cities: regionCities };
      });

      setRegions(regionsWithCities);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleRegion = (regionId: number) => {
    setExpandedRegions(prev =>
      prev.includes(regionId)
        ? prev.filter(id => id !== regionId)
        : [...prev, regionId]
    );
  };

  const deleteRegion = async (regionId: number, regionName: string) => {
    if (!confirm(`Удалить регион "${regionName}"? Все города в нём также будут удалены.`)) return;

    try {
      const response = await fetch(`${API_ENDPOINTS.cities}?action=delete-region&id=${regionId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно',
          description: 'Регион удален'
        });
        fetchData();
      } else {
        throw new Error(data.error || 'Delete failed');
      }
    } catch (error) {
      console.error('Failed to delete region:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить регион',
        variant: 'destructive'
      });
    }
  };

  const deleteCity = async (cityId: number, cityName: string) => {
    if (!confirm(`Удалить город "${cityName}"?`)) return;

    try {
      const response = await fetch(`${API_ENDPOINTS.cities}?action=delete&id=${cityId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно',
          description: 'Город удален'
        });
        fetchData();
      } else {
        throw new Error(data.error || 'Delete failed');
      }
    } catch (error) {
      console.error('Failed to delete city:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить город',
        variant: 'destructive'
      });
    }
  };

  const toggleRegionVisibility = async (regionId: number, isActive: boolean) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.cities}?action=update-region&id=${regionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: isActive })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно',
          description: isActive ? 'Регион показан на сайте' : 'Регион скрыт с сайта'
        });
        fetchData();
      } else {
        throw new Error(data.error || 'Update failed');
      }
    } catch (error) {
      console.error('Failed to toggle region visibility:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить видимость региона',
        variant: 'destructive'
      });
    }
  };

  const toggleCityVisibility = async (cityId: number, isActive: boolean) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.cities}?action=update&id=${cityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: isActive })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно',
          description: isActive ? 'Город показан на сайте' : 'Город скрыт с сайта'
        });
        fetchData();
      } else {
        throw new Error(data.error || 'Update failed');
      }
    } catch (error) {
      console.error('Failed to toggle city visibility:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить видимость города',
        variant: 'destructive'
      });
    }
  };

  return {
    regions,
    loading,
    expandedRegions,
    toggleRegion,
    deleteRegion,
    deleteCity,
    toggleRegionVisibility,
    toggleCityVisibility,
    refetchData: fetchData
  };
};