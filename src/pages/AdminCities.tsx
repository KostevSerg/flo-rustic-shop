import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminAuth from '@/components/AdminAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import API_ENDPOINTS from '@/config/api';

interface City {
  id: number;
  name: string;
  region_id: number;
  region_name?: string;
  timezone: string;
  work_hours?: string;
}

interface Region {
  id: number;
  name: string;
}

const AdminCities = () => {
  console.log('🏁 AdminCities component rendering');
  const navigate = useNavigate();
  const { isAuthenticated } = useAdminAuth();
  console.log('🔐 isAuthenticated:', isAuthenticated);
  const { totalItems } = useCart();
  const { toast } = useToast();
  const [cities, setCities] = useState<Record<string, City[]>>({});
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    region_id: 0,
    timezone: 'Europe/Moscow',
    work_hours: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    console.log('🚀 fetchData started');
    setLoading(true);
    try {
      console.log('📡 Fetching from:', API_ENDPOINTS.cities);
      const [citiesRes, regionsRes] = await Promise.all([
        fetch(API_ENDPOINTS.cities),
        fetch(`${API_ENDPOINTS.cities}?action=regions`)
      ]);
      
      console.log('📦 Cities response:', citiesRes.status);
      console.log('📦 Regions response:', regionsRes.status);
      
      const citiesData = await citiesRes.json();
      const regionsData = await regionsRes.json();
      
      console.log('✅ Cities data:', citiesData);
      console.log('✅ Regions data:', regionsData);
      
      setCities(citiesData.cities || {});
      setRegions(regionsData.regions || []);
    } catch (error) {
      console.error('❌ Failed to fetch data:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
      console.log('✅ fetchData finished');
    }
  };

  const openAddModal = () => {
    if (regions.length === 0) {
      toast({
        title: 'Сначала создайте регион',
        description: 'Перейдите в раздел "Регионы" и создайте хотя бы один регион',
        variant: 'destructive'
      });
      return;
    }
    setEditingCity(null);
    setFormData({
      name: '',
      region_id: regions[0]?.id || 0,
      timezone: 'Europe/Moscow',
      work_hours: ''
    });
    setShowAddModal(true);
  };

  const openEditModal = (city: City) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      region_id: city.region_id,
      timezone: city.timezone || 'Europe/Moscow',
      work_hours: city.work_hours || ''
    });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingCity(null);
    setFormData({
      name: '',
      region_id: regions[0]?.id || 0,
      timezone: 'Europe/Moscow',
      work_hours: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.region_id) {
      toast({
        title: 'Ошибка',
        description: 'Заполните название города и выберите регион',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      const url = editingCity
        ? `${API_ENDPOINTS.cities}?action=update&id=${editingCity.id}`
        : `${API_ENDPOINTS.cities}?action=add`;

      const response = await fetch(url, {
        method: editingCity ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          region_id: formData.region_id,
          timezone: formData.timezone,
          work_hours: formData.work_hours.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно',
          description: editingCity ? 'Город обновлен' : 'Город добавлен'
        });
        closeModal();
        fetchData();
      } else {
        throw new Error(data.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Failed to save city:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить город',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cityId: number, cityName: string) => {
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

  return (
    <AdminAuth>
      <div className="min-h-screen flex flex-col bg-background">
        <Header cartCount={totalItems} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin')}
                className="flex items-center"
              >
                <Icon name="ArrowLeft" size={20} className="mr-2" />
                Назад
              </Button>
              <h1 className="text-3xl font-bold">Управление городами</h1>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => navigate('/admin/regions')}>
                <Icon name="Map" size={20} className="mr-2" />
                Регионы
              </Button>
              <Button onClick={openAddModal}>
                <Icon name="Plus" size={20} className="mr-2" />
                Добавить город
              </Button>
            </div>
          </div>

          {regions.length === 0 && !loading && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Сначала создайте регионы!</strong> Перейдите в раздел "Регионы" и создайте хотя бы один регион.
              </p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin mx-auto mb-3 w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
              <p className="text-muted-foreground">Загрузка городов...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(cities).map(([region, regionCities]) => (
                <div key={region} className="bg-card rounded-lg border p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Icon name="MapPin" size={24} className="mr-2 text-primary" />
                    {region}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {regionCities.map(city => (
                      <div key={city.id} className="bg-accent/20 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{city.name}</p>
                          <p className="text-sm text-muted-foreground">{city.timezone}</p>
                          {city.work_hours && (
                            <p className="text-sm text-muted-foreground mt-1">{city.work_hours}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(city)}
                          >
                            <Icon name="Pencil" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(city.id, city.name)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>

      {showAddModal && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90vw] max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {editingCity ? 'Редактировать город' : 'Добавить город'}
              </h3>
              <button onClick={closeModal} className="hover:bg-accent/50 rounded-lg p-2 transition-colors">
                <Icon name="X" size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Название города *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Москва"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Регион *</label>
                <select
                  value={formData.region_id}
                  onChange={(e) => setFormData({ ...formData, region_id: parseInt(e.target.value) })}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  {regions.map(region => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Часовой пояс *</label>
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="Europe/Moscow">Europe/Moscow (МСК)</option>
                  <option value="Asia/Barnaul">Asia/Barnaul (МСК+4)</option>
                  <option value="Europe/Samara">Europe/Samara (МСК+1)</option>
                  <option value="Asia/Yekaterinburg">Asia/Yekaterinburg (МСК+2)</option>
                  <option value="Asia/Omsk">Asia/Omsk (МСК+3)</option>
                  <option value="Asia/Novosibirsk">Asia/Novosibirsk (МСК+4)</option>
                  <option value="Asia/Krasnoyarsk">Asia/Krasnoyarsk (МСК+4)</option>
                  <option value="Asia/Irkutsk">Asia/Irkutsk (МСК+5)</option>
                  <option value="Asia/Yakutsk">Asia/Yakutsk (МСК+6)</option>
                  <option value="Asia/Vladivostok">Asia/Vladivostok (МСК+7)</option>
                  <option value="Asia/Magadan">Asia/Magadan (МСК+8)</option>
                  <option value="Asia/Kamchatka">Asia/Kamchatka (МСК+9)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Часы работы</label>
                <input
                  type="text"
                  value={formData.work_hours}
                  onChange={(e) => setFormData({ ...formData, work_hours: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="09:00 - 21:00"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
                  Отмена
                </Button>
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? 'Сохранение...' : editingCity ? 'Обновить' : 'Добавить'}
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </AdminAuth>
  );
};

export default AdminCities;