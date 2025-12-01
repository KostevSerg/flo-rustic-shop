import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import API_ENDPOINTS from '@/config/api';

interface Product {
  id: number;
  name: string;
  description: string;
  composition?: string;
  image_url: string;
  base_price: number;
  category: string;
  categories?: string[];
  is_featured?: boolean;
  is_active?: boolean;
  subcategory_id?: number | null;
  subcategory_name?: string;
  subcategories?: Array<{subcategory_id: number; name: string; category: string}>;
}

interface City {
  id: number;
  name: string;
  region: string;
}

export const useProductsData = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [cities, setCities] = useState<Record<string, City[]>>({});
  const [loading, setLoading] = useState(false);

  const clearProductsCache = () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('products_')) {
        localStorage.removeItem(key);
      }
    });
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.products}?with_relations=true&show_all=true`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить товары',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCities = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.cities);
      const data = await response.json();
      setCities(data.cities || {});
    } catch (error) {
      console.error('Failed to load cities:', error);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCities();
  }, []);

  return {
    products,
    cities,
    loading,
    loadProducts,
    clearProductsCache
  };
};
