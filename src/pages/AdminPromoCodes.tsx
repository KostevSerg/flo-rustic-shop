import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminAuth from '@/components/AdminAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';
import API_ENDPOINTS from '@/config/api';

interface PromoCode {
  id: number;
  code: string;
  discount_percent: number;
  is_active: boolean;
  created_at: string;
}

const AdminPromoCodes = () => {
  const { totalItems } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPromo, setNewPromo] = useState({
    code: '',
    discount_percent: ''
  });

  const loadPromoCodes = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.promoCodes);
      const data = await response.json();
      setPromoCodes(data.promo_codes || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить промокоды',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPromoCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPromo.code || !newPromo.discount_percent) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    const discount = parseInt(newPromo.discount_percent);
    if (discount < 1 || discount > 100) {
      toast({
        title: 'Ошибка',
        description: 'Скидка должна быть от 1 до 100%',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.promoCodes, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newPromo.code.toUpperCase(),
          discount_percent: discount
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add promo code');
      }

      toast({
        title: 'Успешно',
        description: `Промокод "${newPromo.code}" создан`
      });

      setNewPromo({ code: '', discount_percent: '' });
      setShowAddForm(false);
      loadPromoCodes();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось создать промокод',
        variant: 'destructive'
      });
    }
  };

  const handleDeletePromoCode = async (promoId: number, code: string) => {
    if (!confirm(`Деактивировать промокод "${code}"?`)) return;

    try {
      const response = await fetch(API_ENDPOINTS.promoCodes, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: promoId })
      });

      if (!response.ok) throw new Error('Failed to delete promo code');

      toast({
        title: 'Успешно',
        description: `Промокод "${code}" деактивирован`
      });

      loadPromoCodes();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось деактивировать промокод',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    loadPromoCodes();
  }, []);

  return (
    <AdminAuth>
      <div className="min-h-screen flex flex-col">
        <Header cartCount={totalItems} />
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2">Управление промокодами</h1>
                <p className="text-muted-foreground">
                  Создавайте промокоды со скидками для клиентов
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate('/admin')}>
                  <Icon name="LayoutDashboard" size={18} className="mr-2" />
                  Админ-панель
                </Button>
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                  <Icon name="Plus" size={18} className="mr-2" />
                  Создать промокод
                </Button>
              </div>
            </div>

            {showAddForm && (
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Новый промокод</h2>
                <form onSubmit={handleAddPromoCode} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Код промокода <span className="text-destructive">*</span>
                    </label>
                    <Input
                      value={newPromo.code}
                      onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                      placeholder="SUMMER2024"
                      className="uppercase"
                      maxLength={50}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Процент скидки <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={newPromo.discount_percent}
                      onChange={(e) => setNewPromo({ ...newPromo, discount_percent: e.target.value })}
                      placeholder="10"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit">Создать промокод</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddForm(false);
                        setNewPromo({ code: '', discount_percent: '' });
                      }}
                    >
                      Отмена
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Загрузка промокодов...</p>
              </div>
            ) : promoCodes.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Tag" size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Промокодов пока нет</p>
              </div>
            ) : (
              <div className="space-y-4">
                {promoCodes.map((promo) => (
                  <div
                    key={promo.id}
                    className="bg-card border border-border rounded-lg p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-6">
                      <div className="bg-primary/10 px-4 py-2 rounded-lg">
                        <p className="text-2xl font-bold text-primary">{promo.code}</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">Скидка {promo.discount_percent}%</p>
                        <p className="text-sm text-muted-foreground">
                          Создан: {new Date(promo.created_at).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {promo.is_active ? (
                        <span className="text-sm bg-green-500/10 text-green-500 px-3 py-1 rounded">
                          Активен
                        </span>
                      ) : (
                        <span className="text-sm bg-gray-500/10 text-gray-500 px-3 py-1 rounded">
                          Неактивен
                        </span>
                      )}
                      {promo.is_active && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeletePromoCode(promo.id, promo.code)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      )}
                    </div>
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

export default AdminPromoCodes;
