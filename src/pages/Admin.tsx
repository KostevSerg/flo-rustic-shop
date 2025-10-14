import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminAuth from '@/components/AdminAuth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';
import API_ENDPOINTS from '@/config/api';

interface City {
  id: number;
  name: string;
  region: string;
}

const Admin = () => {
  const { totalItems } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [cities, setCities] = useState<Record<string, City[]>>({});
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCity, setNewCity] = useState({ name: '', region: '' });
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [editForm, setEditForm] = useState({ name: '', region: '' });

  const loadCities = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.cities);
      const data = await response.json();
      setCities(data.cities || {});
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить города',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCity.name || !newCity.region) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.cities, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCity)
      });

      if (!response.ok) throw new Error('Failed to add city');

      toast({
        title: 'Успешно',
        description: `Город ${newCity.name} добавлен`
      });

      setNewCity({ name: '', region: '' });
      setShowAddForm(false);
      loadCities();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить город',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteCity = async (cityId: number, cityName: string) => {
    if (!confirm(`Удалить город ${cityName}?`)) return;

    try {
      const response = await fetch(API_ENDPOINTS.cities, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cityId })
      });

      if (!response.ok) throw new Error('Failed to delete city');

      toast({
        title: 'Успешно',
        description: `Город ${cityName} удален`
      });

      loadCities();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить город',
        variant: 'destructive'
      });
    }
  };

  const startEditCity = (city: City) => {
    setEditingCity(city);
    setEditForm({ name: city.name, region: city.region });
    setShowAddForm(false);
  };

  const cancelEditCity = () => {
    setEditingCity(null);
    setEditForm({ name: '', region: '' });
  };

  const handleUpdateCity = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingCity || !editForm.name || !editForm.region) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.cities, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCity.id,
          name: editForm.name,
          region: editForm.region
        })
      });

      if (!response.ok) throw new Error('Failed to update city');

      toast({
        title: 'Успешно',
        description: `Город ${editForm.name} обновлён`
      });

      cancelEditCity();
      loadCities();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить город',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    loadCities();
  }, []);

  return (
    <AdminAuth>
      <div className="min-h-screen flex flex-col">
        <Header cartCount={totalItems} />
        <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Управление городами</h1>
              <p className="text-muted-foreground">
                Управляйте городами и населенными пунктами доставки
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
              >
                <Icon name="LayoutDashboard" size={18} className="mr-2" />
                Админ-панель
              </Button>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить город
              </Button>
            </div>
          </div>

          {showAddForm && (
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Добавить новый город</h2>
              <form onSubmit={handleAddCity} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Название города <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={newCity.name}
                      onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Например: Краснодар"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Регион <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={newCity.region}
                      onChange={(e) => setNewCity({ ...newCity, region: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Например: Краснодарский край"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="submit">
                    <Icon name="Save" size={18} className="mr-2" />
                    Сохранить
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewCity({ name: '', region: '' });
                    }}
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </div>
          )}

          {editingCity && (
            <div className="bg-card border-2 border-primary rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Редактировать город</h2>
              <form onSubmit={handleUpdateCity} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Название города <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Например: Краснодар"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Регион <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.region}
                      onChange={(e) => setEditForm({ ...editForm, region: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Например: Краснодарский край"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="submit">
                    <Icon name="Save" size={18} className="mr-2" />
                    Сохранить изменения
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEditCity}
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Загрузка городов...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(cities).map(([region, regionCities]) => (
                <div key={region} className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Icon name="MapPin" size={20} className="mr-2 text-primary" />
                    {region}
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      ({regionCities.length} {regionCities.length === 1 ? 'город' : 'города'})
                    </span>
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {regionCities.map((city) => (
                      <div
                        key={city.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Icon name="Building2" size={18} className="text-primary" />
                          <span className="font-medium">{city.name}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/admin/city-settlements?city_id=${city.id}&city_name=${encodeURIComponent(city.name)}`)}
                            title="Населенные пункты и цены доставки"
                          >
                            <Icon name="MapPin" size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditCity(city)}
                            title="Редактировать название города"
                          >
                            <Icon name="Pencil" size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteCity(city.id, city.name)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {Object.keys(cities).length === 0 && (
                <div className="text-center py-12 bg-card border border-border rounded-lg">
                  <Icon name="MapPin" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Нет добавленных городов</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
    </AdminAuth>
  );
};

export default Admin;