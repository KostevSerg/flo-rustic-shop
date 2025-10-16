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
import OrderListItem from '@/components/admin/OrderListItem';
import OrderDetailsModal from '@/components/admin/OrderDetailsModal';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  city_id: number;
  city_name: string;
  region: string;
  delivery_address: string;
  items: OrderItem[];
  total_amount: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  promo_code?: string | null;
  promo_discount?: number | null;
  discount_amount?: number | null;
  recipient_name?: string | null;
  recipient_phone?: string | null;
  sender_name?: string | null;
  sender_phone?: string | null;
  delivery_date?: string | null;
  delivery_time?: string | null;
  postcard_text?: string | null;
  payment_method?: string | null;
  payment_status?: string | null;
  payment_id?: string | null;
}

const statusLabels: Record<string, string> = {
  'new': 'Новый',
  'processing': 'В обработке',
  'shipped': 'Отправлен',
  'delivered': 'Доставлен',
  'cancelled': 'Отменён'
};

const statusColors: Record<string, string> = {
  'new': 'bg-blue-500/20 text-blue-700 border-blue-500/30',
  'processing': 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
  'shipped': 'bg-purple-500/20 text-purple-700 border-purple-500/30',
  'delivered': 'bg-green-500/20 text-green-700 border-green-500/30',
  'cancelled': 'bg-red-500/20 text-red-700 border-red-500/30'
};

const AdminOrders = () => {
  const { totalItems } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const url = filterStatus === 'all' 
        ? API_ENDPOINTS.orders
        : `${API_ENDPOINTS.orders}?status=${filterStatus}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить заказы',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [filterStatus]);

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.orders, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');

      toast({
        title: 'Успешно',
        description: `Статус заказа обновлён на "${statusLabels[newStatus]}"`
      });

      loadOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateNotes = async (orderId: number, notes: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.orders, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, notes })
      });

      if (!response.ok) throw new Error('Failed to update notes');

      toast({
        title: 'Успешно',
        description: 'Примечание сохранено'
      });

      loadOrders();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить примечание',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteOrder = async (orderId: number, orderNumber: string) => {
    if (!confirm(`Удалить заказ ${orderNumber}?`)) return;

    try {
      const response = await fetch(`${API_ENDPOINTS.orders}?id=${orderId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete order');

      toast({
        title: 'Успешно',
        description: `Заказ ${orderNumber} удалён`
      });

      loadOrders();
      setSelectedOrder(null);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить заказ',
        variant: 'destructive'
      });
    }
  };

  return (
    <AdminAuth>
      <div className="min-h-screen flex flex-col bg-accent/5">
        <Header cartCount={totalItems} />
        <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Управление заказами</h1>
              <p className="text-muted-foreground">
                Просматривайте и обновляйте статус заказов
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
            </div>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              size="sm"
            >
              Все
            </Button>
            {Object.entries(statusLabels).map(([status, label]) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                onClick={() => setFilterStatus(status)}
                size="sm"
              >
                {label}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <Icon name="Package" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h2 className="text-2xl font-bold mb-2">Заказов пока нет</h2>
              <p className="text-muted-foreground">
                {filterStatus === 'all' ? 'Здесь появятся новые заказы' : `Нет заказов со статусом "${statusLabels[filterStatus]}"`}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <OrderListItem
                  key={order.id}
                  order={order}
                  statusLabels={statusLabels}
                  statusColors={statusColors}
                  onClick={() => setSelectedOrder(order)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            statusLabels={statusLabels}
            onClose={() => setSelectedOrder(null)}
            onUpdateStatus={handleUpdateStatus}
            onUpdateNotes={handleUpdateNotes}
            onDelete={handleDeleteOrder}
          />
        )}
      </div>
    </AdminAuth>
  );
};

export default AdminOrders;
