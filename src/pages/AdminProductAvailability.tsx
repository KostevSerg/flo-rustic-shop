import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
}

interface Region {
  id: number;
  name: string;
}

interface Exclusion {
  id: number;
  product_id: number;
  region_id: number;
  region_name?: string;
  product_name?: string;
}

const AdminProductAvailability = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [exclusions, setExclusions] = useState<Exclusion[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedRegions, setSelectedRegions] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, regionsRes, exclusionsRes] = await Promise.all([
        fetch('https://functions.poehali.dev/f3ffc9b4-fbea-48e8-959d-c34ea68e6531?show_all=true'),
        fetch('https://functions.poehali.dev/3f4d37f0-b84f-4157-83b7-55bdb568e459'),
        fetch('https://functions.poehali.dev/f1685790-c2c6-4e36-b81b-aa4a25d7c812')
      ]);

      const productsData = await productsRes.json();
      const citiesData = await regionsRes.json();
      const exclusionsData = await exclusionsRes.json();

      setProducts(productsData.products || []);
      
      // Извлекаем список регионов из структуры с городами
      const regionsMap = new Map<number, Region>();
      if (citiesData.cities) {
        Object.entries(citiesData.cities).forEach(([regionName, cities]: [string, any]) => {
          if (Array.isArray(cities) && cities.length > 0) {
            const firstCity = cities[0];
            if (firstCity.region_id) {
              regionsMap.set(firstCity.region_id, {
                id: firstCity.region_id,
                name: regionName
              });
            }
          }
        });
      }
      setRegions(Array.from(regionsMap.values()).sort((a, b) => a.name.localeCompare(b.name)));
      
      setExclusions(exclusionsData.exclusions || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные',
        variant: 'destructive',
      });
    }
  };

  const toggleRegion = (regionId: number) => {
    const newSelected = new Set(selectedRegions);
    if (newSelected.has(regionId)) {
      newSelected.delete(regionId);
    } else {
      newSelected.add(regionId);
    }
    setSelectedRegions(newSelected);
  };

  const selectAllRegions = () => {
    setSelectedRegions(new Set(regions.map(r => r.id)));
  };

  const clearAllRegions = () => {
    setSelectedRegions(new Set());
  };

  const addExclusions = async () => {
    if (!selectedProduct || selectedRegions.size === 0) {
      toast({
        title: 'Ошибка',
        description: 'Выберите товар и хотя бы один регион',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const promises = Array.from(selectedRegions).map(regionId =>
        fetch('https://functions.poehali.dev/f1685790-c2c6-4e36-b81b-aa4a25d7c812', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_id: parseInt(selectedProduct),
            region_id: regionId,
          }),
        })
      );

      await Promise.all(promises);

      toast({
        title: 'Успешно',
        description: `Товар отключен в ${selectedRegions.size} регион${selectedRegions.size === 1 ? 'е' : 'ах'}`,
      });
      setSelectedProduct('');
      setSelectedRegions(new Set());
      loadData();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отключить товар в регионах',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const removeExclusion = async (productId: number, regionId: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://functions.poehali.dev/f1685790-c2c6-4e36-b81b-aa4a25d7c812?product_id=${productId}&region_id=${regionId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Товар снова доступен в регионе',
        });
        loadData();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось включить товар в регионе',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getProductsByRegion = () => {
    const grouped: { [key: string]: Exclusion[] } = {};
    exclusions.forEach((exc) => {
      const regionName = exc.region_name || '';
      if (!grouped[regionName]) grouped[regionName] = [];
      grouped[regionName].push(exc);
    });
    return grouped;
  };

  const groupedExclusions = getProductsByRegion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/admin')}>
            <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
            Назад
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Доступность товаров</h1>
            <p className="text-gray-600">Управление доступностью товаров в регионах</p>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Отключить товар в регионах</CardTitle>
            <CardDescription>
              По умолчанию все товары доступны во всех регионах. Выберите товар и регионы для отключения.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Товар</label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите товар" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">
                  Регионы ({selectedRegions.size} из {regions.length} выбрано)
                </label>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={selectAllRegions}
                    type="button"
                  >
                    Выбрать все
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearAllRegions}
                    type="button"
                  >
                    Снять все
                  </Button>
                </div>
              </div>
              <div className="border rounded-lg p-4 max-h-64 overflow-y-auto bg-white">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {regions.map((region) => (
                    <label
                      key={region.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRegions.has(region.id)}
                        onChange={() => toggleRegion(region.id)}
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                      <span className="text-sm">{region.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <Button onClick={addExclusions} disabled={loading || !selectedProduct || selectedRegions.size === 0} className="w-full">
              <Icon name="Ban" className="mr-2 h-4 w-4" />
              Отключить товар в {selectedRegions.size} регион{selectedRegions.size === 1 ? 'е' : selectedRegions.size > 1 && selectedRegions.size < 5 ? 'ах' : 'ах'}
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {Object.keys(groupedExclusions).length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500">
                  <Icon name="CheckCircle" className="mx-auto h-12 w-12 mb-4 text-green-500" />
                  <p>Все товары доступны во всех регионах</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            Object.entries(groupedExclusions).map(([regionName, regionExclusions]) => (
              <Card key={regionName}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="MapPin" className="h-5 w-5" />
                    {regionName}
                    <Badge variant="secondary">{regionExclusions.length}</Badge>
                  </CardTitle>
                  <CardDescription>Недоступные товары в этом регионе</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {regionExclusions.map((exc) => (
                      <Badge key={exc.id} variant="outline" className="px-3 py-2">
                        {exc.product_name}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-4 w-4 p-0"
                          onClick={() => removeExclusion(exc.product_id, exc.region_id)}
                          disabled={loading}
                        >
                          <Icon name="X" className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductAvailability;