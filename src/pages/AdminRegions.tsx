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

interface Region {
  id: number;
  name: string;
  is_active: boolean;
  cities_count?: number;
}

const AdminRegions = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdminAuth();
  const { totalItems } = useCart();
  const { toast } = useToast();
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [formData, setFormData] = useState({
    name: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegions();
    }
  }, [isAuthenticated]);

  const fetchRegions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.cities}?action=regions`);
      const data = await response.json();
      setRegions(data.regions || []);
    } catch (error) {
      console.error('Failed to fetch regions:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить регионы',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingRegion(null);
    setFormData({ name: '' });
    setShowAddModal(true);
  };

  const openEditModal = (region: Region) => {
    setEditingRegion(region);
    setFormData({ name: region.name });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingRegion(null);
    setFormData({ name: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
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
        body: JSON.stringify({ name: formData.name.trim() })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно',
          description: editingRegion ? 'Регион обновлен' : 'Регион добавлен'
        });
        closeModal();
        fetchRegions();
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

  const handleDelete = async (regionId: number, regionName: string, citiesCount: number) => {
    if (citiesCount > 0) {
      toast({
        title: 'Невозможно удалить',
        description: `В регионе "${regionName}" есть ${citiesCount} город(ов). Сначала удалите все города.`,
        variant: 'destructive'
      });
      return;
    }

    if (!confirm(`Удалить регион "${regionName}"?`)) return;

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
        fetchRegions();
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
              <h1 className="text-3xl font-bold">Управление регионами</h1>
            </div>
            <Button onClick={openAddModal}>
              <Icon name="Plus" size={20} className="mr-2" />
              Добавить регион
            </Button>
          </div>

          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Как это работает:</strong> Сначала создайте регионы (например, "Москва и Московская область"), 
              затем добавляйте города в эти регионы через раздел "Города".
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin mx-auto mb-3 w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
              <p className="text-muted-foreground">Загрузка регионов...</p>
            </div>
          ) : regions.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border">
              <Icon name="MapPin" size={48} className="mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-4">Регионы не найдены</p>
              <Button onClick={openAddModal}>
                <Icon name="Plus" size={20} className="mr-2" />
                Создать первый регион
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regions.map(region => (
                <div key={region.id} className="bg-card rounded-lg border p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold flex items-center mb-2">
                        <Icon name="MapPin" size={20} className="mr-2 text-primary" />
                        {region.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {region.cities_count || 0} город(ов)
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(region)}
                      className="flex-1"
                    >
                      <Icon name="Pencil" size={16} className="mr-2" />
                      Изменить
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(region.id, region.name, region.cities_count || 0)}
                      className="flex-1"
                    >
                      <Icon name="Trash2" size={16} className="mr-2" />
                      Удалить
                    </Button>
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
                {editingRegion ? 'Редактировать регион' : 'Добавить регион'}
              </h3>
              <button onClick={closeModal} className="hover:bg-accent/50 rounded-lg p-2 transition-colors">
                <Icon name="X" size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Название региона *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Москва и Московская область"
                  required
                  autoFocus
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Примеры: "Алтайский край", "Санкт-Петербург и Ленинградская область"
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
                  Отмена
                </Button>
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? 'Сохранение...' : editingRegion ? 'Обновить' : 'Добавить'}
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </AdminAuth>
  );
};

export default AdminRegions;
