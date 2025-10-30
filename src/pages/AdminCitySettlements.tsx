import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import AdminAuth from '@/components/AdminAuth';
import API_ENDPOINTS from '@/config/api';
import SettlementBulkImport from '@/components/settlements/SettlementBulkImport';
import SettlementForm from '@/components/settlements/SettlementForm';
import SettlementList from '@/components/settlements/SettlementList';

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
  const [showBulkImport, setShowBulkImport] = useState(false);

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
      const response = await fetch(`${API_ENDPOINTS.cities}?action=settlements&city_id=${cityId}`);
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
      const response = await fetch(`${API_ENDPOINTS.cities}?action=settlements`, {
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
      const response = await fetch(`${API_ENDPOINTS.cities}?action=settlements`, {
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
      const response = await fetch(`${API_ENDPOINTS.cities}?action=settlements&id=${settlementId}`, {
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

  const handleBulkImportSuccess = () => {
    setShowBulkImport(false);
    fetchSettlements();
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
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowBulkImport(true);
                      setShowAddForm(false);
                      setEditingId(null);
                    }}
                  >
                    <Icon name="Upload" size={18} className="mr-2" />
                    Массовая загрузка
                  </Button>
                  <Button onClick={() => {
                    setShowAddForm(true);
                    setShowBulkImport(false);
                    setEditingId(null);
                    setFormData({ name: '', delivery_price: '0' });
                  }}>
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить населенный пункт
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            {showBulkImport && (
              <SettlementBulkImport
                cityId={cityId!}
                onSuccess={handleBulkImportSuccess}
                onCancel={() => setShowBulkImport(false)}
              />
            )}

            {showAddForm && (
              <SettlementForm
                formData={formData}
                onFormDataChange={setFormData}
                onSubmit={handleAdd}
                onCancel={() => {
                  setShowAddForm(false);
                  setFormData({ name: '', delivery_price: '0' });
                }}
              />
            )}

            <SettlementList
              settlements={settlements}
              loading={loading}
              editingId={editingId}
              formData={formData}
              onFormDataChange={setFormData}
              onEdit={startEdit}
              onUpdate={handleUpdate}
              onCancelEdit={cancelEdit}
              onDelete={handleDelete}
              onAddFirst={() => setShowAddForm(true)}
            />
          </div>
        </main>
        <Footer />
      </div>
    </AdminAuth>
  );
};

export default AdminCitySettlements;
