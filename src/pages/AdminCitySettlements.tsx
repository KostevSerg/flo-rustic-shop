import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import AdminAuth from '@/components/AdminAuth';

interface Settlement {
  id: number;
  city_id: number;
  name: string;
  delivery_price: number;
  is_active: boolean;
}

const AdminCitySettlements = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cityId = searchParams.get('city_id');
  const cityName = searchParams.get('city_name');
  const { isAuthenticated } = useAdminAuth();
  const { toast } = useToast();
  const { totalItems } = useCart();
  
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    delivery_price: '0'
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    if (!cityId) {
      navigate('/admin/cities');
      return;
    }
    fetchSettlements();
  }, [isAuthenticated, cityId, navigate]);

  const fetchSettlements = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://functions.poehali.dev/3f4d37f0-b84f-4157-83b7-55bdb568e459?action=settlements&city_id=${cityId}`);
      const data = await response.json();
      setSettlements(data.settlements || []);
    } catch (error) {
      console.error('Failed to fetch settlements:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить населенные пункты',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите название населенного пункта',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/3f4d37f0-b84f-4157-83b7-55bdb568e459?action=settlements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          city_id: parseInt(cityId!),
          name: formData.name,
          delivery_price: parseFloat(formData.delivery_price) || 0
        })
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Населенный пункт добавлен'
        });
        setFormData({ name: '', delivery_price: '0' });
        setShowAddForm(false);
        fetchSettlements();
      } else {
        throw new Error('Failed to add settlement');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить населенный пункт',
        variant: 'destructive'
      });
    }
  };

  const handleUpdate = async (settlementId: number) => {
    if (!formData.name.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите название населенного пункта',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/3f4d37f0-b84f-4157-83b7-55bdb568e459?action=settlements', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: settlementId,
          name: formData.name,
          delivery_price: parseFloat(formData.delivery_price) || 0
        })
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Населенный пункт обновлен'
        });
        setEditingId(null);
        setFormData({ name: '', delivery_price: '0' });
        fetchSettlements();
      } else {
        throw new Error('Failed to update settlement');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить населенный пункт',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (settlementId: number, settlementName: string) => {
    if (!confirm(`Удалить населенный пункт "${settlementName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`https://functions.poehali.dev/3f4d37f0-b84f-4157-83b7-55bdb568e459?action=settlements&id=${settlementId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Населенный пункт удален'
        });
        fetchSettlements();
      } else {
        throw new Error('Failed to delete settlement');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить населенный пункт',
        variant: 'destructive'
      });
    }
  };

  const startEdit = (settlement: Settlement) => {
    setEditingId(settlement.id);
    setFormData({
      name: settlement.name,
      delivery_price: settlement.delivery_price.toString()
    });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', delivery_price: '0' });
  };

  return (
    <AdminAuth>
      <div className="min-h-screen flex flex-col bg-background">
        <Header cartCount={totalItems} />
        <main className="flex-1">
          <div className="border-b bg-card">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" onClick={() => navigate('/admin/cities')}>
                    <Icon name="ArrowLeft" size={20} className="mr-2" />
                    Назад к городам
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold">Населенные пункты и доставка</h1>
                    <p className="text-muted-foreground mt-1">Город: {cityName}</p>
                  </div>
                </div>
                <Button onClick={() => {
                  setShowAddForm(true);
                  setEditingId(null);
                  setFormData({ name: '', delivery_price: '0' });
                }}>
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить населенный пункт
                </Button>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            {showAddForm && (
              <div className="bg-card rounded-lg p-6 mb-6 border-2 border-primary">
                <h2 className="text-xl font-semibold mb-4">Новый населенный пункт</h2>
                <form onSubmit={handleAdd} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Название <span className="text-destructive">*</span>
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Например: Центральный район"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Цена доставки, ₽
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.delivery_price}
                        onChange={(e) => setFormData({ ...formData, delivery_price: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">
                      <Icon name="Save" size={18} className="mr-2" />
                      Сохранить
                    </Button>
                    <Button type="button" variant="outline" onClick={() => {
                      setShowAddForm(false);
                      setFormData({ name: '', delivery_price: '0' });
                    }}>
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
            ) : settlements.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg">
                <Icon name="MapPin" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">Населенные пункты не добавлены</p>
                <Button onClick={() => setShowAddForm(true)}>
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить первый
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {settlements.map(settlement => (
                  <div key={settlement.id} className="bg-card rounded-lg p-4 border">
                    {editingId === settlement.id ? (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Название <span className="text-destructive">*</span>
                            </label>
                            <Input
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="Название населенного пункта"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Цена доставки, ₽
                            </label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={formData.delivery_price}
                              onChange={(e) => setFormData({ ...formData, delivery_price: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleUpdate(settlement.id)}>
                            <Icon name="Save" size={16} className="mr-2" />
                            Сохранить
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>
                            Отмена
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{settlement.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Доставка: {settlement.delivery_price > 0 ? `${settlement.delivery_price} ₽` : 'Бесплатно'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => startEdit(settlement)}>
                            <Icon name="Pencil" size={16} className="mr-2" />
                            Изменить
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(settlement.id, settlement.name)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </AdminAuth>
  );
};

export default AdminCitySettlements;
