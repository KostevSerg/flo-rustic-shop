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

interface Subcategory {
  id: number;
  name: string;
  category: string;
  is_active: boolean;
}

const AdminSubcategories = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { toast } = useToast();
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubcategory, setNewSubcategory] = useState({
    name: '',
    category: 'Цветы'
  });

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.products}?action=subcategories`);
      const data = await response.json();
      setSubcategories(data.subcategories || []);
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить подкатегории',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newSubcategory.name.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите название подкатегории',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.products, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create_subcategory',
          name: newSubcategory.name,
          category: newSubcategory.category
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при создании подкатегории');
      }

      toast({
        title: 'Успех',
        description: 'Подкатегория успешно создана'
      });

      setNewSubcategory({ name: '', category: 'Цветы' });
      setShowAddForm(false);
      fetchSubcategories();
    } catch (error) {
      console.error('Failed to add subcategory:', error);
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось добавить подкатегорию',
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
              <h1 className="text-3xl font-bold">Подкатегории цветов</h1>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Icon name={showAddForm ? "X" : "Plus"} size={20} className="mr-2" />
              {showAddForm ? 'Отмена' : 'Добавить подкатегорию'}
            </Button>
          </div>

          {showAddForm && (
            <div className="bg-card border rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Добавить подкатегорию</h2>
              <form onSubmit={handleAddSubcategory} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Название подкатегории <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={newSubcategory.name}
                      onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Например: Розы"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Категория <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={newSubcategory.category}
                      onChange={(e) => setNewSubcategory({ ...newSubcategory, category: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      required
                    >
                      <option value="Цветы">Цветы</option>
                      <option value="Шары">Шары</option>
                      <option value="Подарки">Подарки</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="submit">
                    <Icon name="Check" size={18} className="mr-2" />
                    Добавить
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Отмена
                  </Button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin mx-auto mb-3 w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
              <p className="text-muted-foreground">Загрузка...</p>
            </div>
          ) : subcategories.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border">
              <Icon name="Tag" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground mb-4">Подкатегорий пока нет</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Icon name="Plus" size={20} className="mr-2" />
                Создать первую подкатегорию
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subcategories.map(subcategory => (
                <div
                  key={subcategory.id}
                  className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{subcategory.name}</h3>
                      <p className="text-sm text-muted-foreground">{subcategory.category}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" disabled>
                        <Icon name="Pencil" size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" disabled>
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2 py-1 rounded ${subcategory.is_active ? 'bg-green-500/20 text-green-700' : 'bg-gray-500/20 text-gray-700'}`}>
                      {subcategory.is_active ? 'Активна' : 'Неактивна'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </AdminAuth>
  );
};

export default AdminSubcategories;