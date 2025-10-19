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
  timezone: string;
  work_hours?: any;
}

interface Region {
  id: number;
  name: string;
  is_active: boolean;
  cities?: City[];
}

const AdminCities = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdminAuth();
  const { totalItems } = useCart();
  const { toast } = useToast();
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRegions, setExpandedRegions] = useState<number[]>([]);
  
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [regionForm, setRegionForm] = useState({ name: '' });
  
  const [showCityModal, setShowCityModal] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [cityForm, setCityForm] = useState({
    name: '',
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
    setLoading(true);
    try {
      const [regionsRes, citiesRes] = await Promise.all([
        fetch(`${API_ENDPOINTS.cities}?action=regions`),
        fetch(API_ENDPOINTS.cities)
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

  const openAddRegionModal = () => {
    setEditingRegion(null);
    setRegionForm({ name: '' });
    setShowRegionModal(true);
  };

  const openEditRegionModal = (region: Region) => {
    setEditingRegion(region);
    setRegionForm({ name: region.name });
    setShowRegionModal(true);
  };

  const closeRegionModal = () => {
    setShowRegionModal(false);
    setEditingRegion(null);
    setRegionForm({ name: '' });
  };

  const handleRegionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regionForm.name.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите название региона',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      const url = editingRegion
        ? `${API_ENDPOINTS.cities}?action=update-region&id=${editingRegion.id}`
        : `${API_ENDPOINTS.cities}?action=add-region`;

      const response = await fetch(url, {
        method: editingRegion ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regionForm.name.trim() })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно',
          description: editingRegion ? 'Регион обновлен' : 'Регион создан'
        });
        closeRegionModal();
        fetchData();
      } else {
        throw new Error(data.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Failed to save region:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить регион',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRegion = async (regionId: number, regionName: string) => {
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

  const openAddCityModal = (regionId: number) => {
    setEditingCity(null);
    setSelectedRegionId(regionId);
    setCityForm({
      name: '',
      timezone: 'Europe/Moscow',
      work_hours: ''
    });
    setShowCityModal(true);
  };

  const openEditCityModal = (city: City) => {
    setEditingCity(city);
    setSelectedRegionId(city.region_id);
    setCityForm({
      name: city.name,
      timezone: city.timezone || 'Europe/Moscow',
      work_hours: city.work_hours || ''
    });
    setShowCityModal(true);
  };

  const closeCityModal = () => {
    setShowCityModal(false);
    setEditingCity(null);
    setSelectedRegionId(null);
    setCityForm({
      name: '',
      timezone: 'Europe/Moscow',
      work_hours: ''
    });
  };

  const handleCitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityForm.name.trim() || !selectedRegionId) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
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
          name: cityForm.name.trim(),
          region_id: selectedRegionId,
          timezone: cityForm.timezone,
          work_hours: cityForm.work_hours.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно',
          description: editingCity ? 'Город обновлен' : 'Город добавлен'
        });
        closeCityModal();
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

  const handleDeleteCity = async (cityId: number, cityName: string) => {
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
              <h1 className="text-3xl font-bold">Регионы и города</h1>
            </div>
            <Button onClick={openAddRegionModal}>
              <Icon name="Plus" size={20} className="mr-2" />
              Добавить регион
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin mx-auto mb-3 w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
              <p className="text-muted-foreground">Загрузка...</p>
            </div>
          ) : regions.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border">
              <Icon name="MapPin" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground mb-4">Регионов пока нет</p>
              <Button onClick={openAddRegionModal}>
                <Icon name="Plus" size={20} className="mr-2" />
                Создать первый регион
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {regions.map(region => (
                <div key={region.id} className="bg-card rounded-lg border overflow-hidden">
                  <div className="p-4 flex items-center justify-between bg-accent/20">
                    <div className="flex items-center space-x-3 flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRegion(region.id)}
                        className="p-1"
                      >
                        <Icon
                          name={expandedRegions.includes(region.id) ? 'ChevronDown' : 'ChevronRight'}
                          size={20}
                        />
                      </Button>
                      <Icon name="Map" size={24} className="text-primary" />
                      <div>
                        <h3 className="font-semibold text-lg">{region.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {region.cities?.length || 0} {region.cities?.length === 1 ? 'город' : 'городов'}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openAddCityModal(region.id)}
                      >
                        <Icon name="Plus" size={16} className="mr-1" />
                        Город
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditRegionModal(region)}
                      >
                        <Icon name="Pencil" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRegion(region.id, region.name)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>

                  {expandedRegions.includes(region.id) && (
                    <div className="p-4 border-t">
                      {region.cities && region.cities.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {region.cities.map(city => (
                            <div
                              key={city.id}
                              className="bg-background rounded-lg p-3 border flex items-center justify-between"
                            >
                              <div className="flex-1">
                                <p className="font-medium">{city.name}</p>
                                <p className="text-sm text-muted-foreground">{city.timezone}</p>
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditCityModal(city)}
                                >
                                  <Icon name="Pencil" size={14} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteCity(city.id, city.name)}
                                >
                                  <Icon name="Trash2" size={14} />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <p className="mb-3">В этом регионе пока нет городов</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openAddCityModal(region.id)}
                          >
                            <Icon name="Plus" size={16} className="mr-1" />
                            Добавить город
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>

      {showRegionModal && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={closeRegionModal}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90vw] max-w-md bg-card border rounded-xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {editingRegion ? 'Редактировать регион' : 'Добавить регион'}
              </h3>
              <button onClick={closeRegionModal} className="hover:bg-accent/50 rounded-lg p-2">
                <Icon name="X" size={24} />
              </button>
            </div>

            <form onSubmit={handleRegionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Название региона *</label>
                <input
                  type="text"
                  value={regionForm.name}
                  onChange={(e) => setRegionForm({ name: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Московская область"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={closeRegionModal} className="flex-1">
                  Отмена
                </Button>
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? 'Сохранение...' : editingRegion ? 'Обновить' : 'Создать'}
                </Button>
              </div>
            </form>
          </div>
        </>
      )}

      {showCityModal && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={closeCityModal}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90vw] max-w-md bg-card border rounded-xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {editingCity ? 'Редактировать город' : 'Добавить город'}
              </h3>
              <button onClick={closeCityModal} className="hover:bg-accent/50 rounded-lg p-2">
                <Icon name="X" size={24} />
              </button>
            </div>

            <form onSubmit={handleCitySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Название города *</label>
                <input
                  type="text"
                  value={cityForm.name}
                  onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Москва"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Часовой пояс *</label>
                <select
                  value={cityForm.timezone}
                  onChange={(e) => setCityForm({ ...cityForm, timezone: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="Europe/Moscow">Europe/Moscow (МСК)</option>
                  <option value="Europe/Kaliningrad">Europe/Kaliningrad (МСК-1)</option>
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
                  value={cityForm.work_hours}
                  onChange={(e) => setCityForm({ ...cityForm, work_hours: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="09:00 - 21:00"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={closeCityModal} className="flex-1">
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
