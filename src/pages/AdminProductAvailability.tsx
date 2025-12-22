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

interface City {
  id: number;
  name: string;
}

interface Exclusion {
  id: number;
  product_id: number;
  city_id: number;
  city_name?: string;
  product_name?: string;
}

const AdminProductAvailability = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [exclusions, setExclusions] = useState<Exclusion[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, citiesRes, exclusionsRes] = await Promise.all([
        fetch('https://functions.poehali.dev/f3ffc9b4-fbea-48e8-959d-c34ea68e6531?show_all=true'),
        fetch('https://functions.poehali.dev/f0bbad86-72e5-485e-a2bf-fb7d6ec24b21'),
        fetch('https://functions.poehali.dev/3d5447c1-b58a-433c-baf2-2d7d74403326')
      ]);

      const productsData = await productsRes.json();
      const citiesData = await citiesRes.json();
      const exclusionsData = await exclusionsRes.json();

      setProducts(productsData.products || []);
      setCities(citiesData.cities || []);
      setExclusions(exclusionsData.exclusions || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные',
        variant: 'destructive',
      });
    }
  };

  const addExclusion = async () => {
    if (!selectedProduct || !selectedCity) {
      toast({
        title: 'Ошибка',
        description: 'Выберите товар и город',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/3d5447c1-b58a-433c-baf2-2d7d74403326', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: parseInt(selectedProduct),
          city_id: parseInt(selectedCity),
        }),
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Товар отключен в выбранном городе',
        });
        setSelectedProduct('');
        setSelectedCity('');
        loadData();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отключить товар',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const removeExclusion = async (productId: number, cityId: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://functions.poehali.dev/3d5447c1-b58a-433c-baf2-2d7d74403326?product_id=${productId}&city_id=${cityId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Товар снова доступен в городе',
        });
        loadData();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось включить товар',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCity = () => {
    const grouped: { [key: string]: Exclusion[] } = {};
    exclusions.forEach((exc) => {
      const cityName = exc.city_name || '';
      if (!grouped[cityName]) grouped[cityName] = [];
      grouped[cityName].push(exc);
    });
    return grouped;
  };

  const groupedExclusions = getProductsByCity();

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
            <p className="text-gray-600">Управление доступностью товаров в городах</p>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Отключить товар в городе</CardTitle>
            <CardDescription>
              По умолчанию все товары доступны во всех городах. Здесь вы можете отключить товар для конкретного города.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="flex-1">
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

              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Выберите город" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={addExclusion} disabled={loading}>
                <Icon name="Ban" className="mr-2 h-4 w-4" />
                Отключить
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {Object.keys(groupedExclusions).length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500">
                  <Icon name="CheckCircle" className="mx-auto h-12 w-12 mb-4 text-green-500" />
                  <p>Все товары доступны во всех городах</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            Object.entries(groupedExclusions).map(([cityName, cityExclusions]) => (
              <Card key={cityName}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="MapPin" className="h-5 w-5" />
                    {cityName}
                    <Badge variant="secondary">{cityExclusions.length}</Badge>
                  </CardTitle>
                  <CardDescription>Недоступные товары в этом городе</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {cityExclusions.map((exc) => (
                      <Badge key={exc.id} variant="outline" className="px-3 py-2">
                        {exc.product_name}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-4 w-4 p-0"
                          onClick={() => removeExclusion(exc.product_id, exc.city_id)}
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
