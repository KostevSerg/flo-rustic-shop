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
                <div
                  key={order.id}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">Заказ #{order.order_number}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[order.status]}`}>
                          {statusLabels[order.status]}
                        </span>
                        {order.payment_status === 'paid' && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-green-500/20 text-green-700 border-green-500/30">
                            ✅ Оплачен
                          </span>
                        )}
                        {order.payment_status === 'pending' && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-yellow-500/20 text-yellow-700 border-yellow-500/30">
                            ⏳ Ожидает оплаты
                          </span>
                        )}
                        {order.payment_status === 'failed' && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-red-500/20 text-red-700 border-red-500/30">
                            ❌ Не оплачен
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleString('ru-RU')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{order.total_amount} ₽</p>
                      {order.payment_status === 'paid' && (
                        <p className="text-sm text-green-600 font-medium">Оплачено</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Клиент</p>
                      <p className="font-semibold">{order.customer_name}</p>
                      <p className="text-sm">{order.customer_phone}</p>
                      {order.customer_email && (
                        <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Доставка</p>
                      <p className="font-semibold">{order.city_name}, {order.region}</p>
                      <p className="text-sm">{order.delivery_address}</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Товары:</p>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} × {item.quantity}</span>
                          <span className="font-semibold">{item.price * item.quantity} ₽</span>
                        </div>
                      ))}
                      {order.promo_code && order.discount_amount && (
                        <div className="flex justify-between text-sm pt-2 border-t border-border/50">
                          <span className="text-green-600 font-medium">Промокод {order.promo_code} (-{order.promo_discount}%)</span>
                          <span className="font-semibold text-green-600">-{order.discount_amount} ₽</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

        {selectedOrder && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90vw] max-w-3xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Заказ #{selectedOrder.order_number}</h2>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedOrder.created_at).toLocaleString('ru-RU')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="hover:bg-accent/50 rounded-lg p-2 transition-colors"
              >
                <Icon name="X" size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-accent/20 rounded-lg p-4">
                <h3 className="font-bold mb-3 flex items-center">
                  <Icon name="Settings" size={18} className="mr-2" />
                  Статус заказа
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statusLabels).map(([status, label]) => (
                    <Button
                      key={status}
                      variant={selectedOrder.status === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-accent/20 rounded-lg p-4">
                  <h3 className="font-bold mb-3 flex items-center">
                    <Icon name="UserCheck" size={18} className="mr-2" />
                    Получатель
                  </h3>
                  <p className="font-semibold mb-1">{selectedOrder.recipient_name || selectedOrder.customer_name}</p>
                  <p className="text-sm mb-1">{selectedOrder.recipient_phone || selectedOrder.customer_phone}</p>
                  {selectedOrder.customer_email && (
                    <p className="text-sm text-muted-foreground">{selectedOrder.customer_email}</p>
                  )}
                </div>

                {(selectedOrder.sender_name || selectedOrder.sender_phone) && (
                  <div className="bg-accent/20 rounded-lg p-4">
                    <h3 className="font-bold mb-3 flex items-center">
                      <Icon name="User" size={18} className="mr-2" />
                      Отправитель
                    </h3>
                    {selectedOrder.sender_name && (
                      <p className="font-semibold mb-1">{selectedOrder.sender_name}</p>
                    )}
                    {selectedOrder.sender_phone && (
                      <p className="text-sm">{selectedOrder.sender_phone}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-accent/20 rounded-lg p-4">
                  <h3 className="font-bold mb-3 flex items-center">
                    <Icon name="MapPin" size={18} className="mr-2" />
                    Адрес доставки
                  </h3>
                  <p className="font-semibold mb-1">{selectedOrder.city_name}, {selectedOrder.region}</p>
                  <p className="text-sm">{selectedOrder.delivery_address}</p>
                </div>

                {(selectedOrder.delivery_date || selectedOrder.delivery_time) && (
                  <div className="bg-accent/20 rounded-lg p-4">
                    <h3 className="font-bold mb-3 flex items-center">
                      <Icon name="CalendarClock" size={18} className="mr-2" />
                      Время доставки
                    </h3>
                    {selectedOrder.delivery_date && (
                      <p className="font-semibold mb-1">
                        {new Date(selectedOrder.delivery_date).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    )}
                    {selectedOrder.delivery_time && (
                      <p className="text-sm">
                        {selectedOrder.delivery_time === 'any' ? 'Любое время' : 
                         selectedOrder.delivery_time === 'morning' ? 'Утро (9:00-12:00)' :
                         selectedOrder.delivery_time === 'day' ? 'День (12:00-17:00)' :
                         selectedOrder.delivery_time === 'evening' ? 'Вечер (17:00-21:00)' :
                         selectedOrder.delivery_time}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {selectedOrder.postcard_text && (
                <div className="bg-accent/20 rounded-lg p-4">
                  <h3 className="font-bold mb-3 flex items-center">
                    <Icon name="MessageSquare" size={18} className="mr-2" />
                    Текст открытки
                  </h3>
                  <p className="text-sm whitespace-pre-wrap">{selectedOrder.postcard_text}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {selectedOrder.payment_method && (
                  <div className="bg-accent/20 rounded-lg p-4">
                    <h3 className="font-bold mb-3 flex items-center">
                      <Icon name="CreditCard" size={18} className="mr-2" />
                      Способ оплаты
                    </h3>
                    <p className="text-sm">
                      {selectedOrder.payment_method === 'online' ? 'Онлайн оплата' : 
                       selectedOrder.payment_method === 'cash' ? 'Наличными курьеру' :
                       selectedOrder.payment_method === 'card' ? 'Картой курьеру' :
                       selectedOrder.payment_method}
                    </p>
                  </div>
                )}

                <div className="bg-accent/20 rounded-lg p-4">
                  <h3 className="font-bold mb-3 flex items-center">
                    <Icon name="CheckCircle" size={18} className="mr-2" />
                    Статус оплаты
                  </h3>
                  {selectedOrder.payment_status === 'paid' ? (
                    <p className="text-sm font-semibold text-green-600">✅ Оплачен</p>
                  ) : selectedOrder.payment_status === 'pending' ? (
                    <p className="text-sm font-semibold text-yellow-600">⏳ Ожидает оплаты</p>
                  ) : selectedOrder.payment_status === 'failed' ? (
                    <p className="text-sm font-semibold text-red-600">❌ Не оплачен</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Статус не определён</p>
                  )}
                  {selectedOrder.payment_id && (
                    <p className="text-xs text-muted-foreground mt-1">ID: {selectedOrder.payment_id}</p>
                  )}
                </div>
              </div>

              <div className="bg-accent/20 rounded-lg p-4">
                <h3 className="font-bold mb-3 flex items-center">
                  <Icon name="Package" size={18} className="mr-2" />
                  Товары
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.price} ₽ × {item.quantity}</p>
                      </div>
                      <p className="font-bold">{item.price * item.quantity} ₽</p>
                    </div>
                  ))}
                  {selectedOrder.promo_code && selectedOrder.discount_amount && (
                    <div className="flex justify-between items-center pt-2 border-t border-border/50">
                      <div>
                        <p className="font-semibold text-green-600">Промокод {selectedOrder.promo_code}</p>
                        <p className="text-sm text-muted-foreground">Скидка {selectedOrder.promo_discount}%</p>
                      </div>
                      <p className="font-bold text-green-600">-{selectedOrder.discount_amount} ₽</p>
                    </div>
                  )}
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-lg">Итого:</p>
                      <p className="font-bold text-2xl text-primary">{selectedOrder.total_amount} ₽</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-accent/20 rounded-lg p-4">
                <h3 className="font-bold mb-3 flex items-center">
                  <Icon name="FileText" size={18} className="mr-2" />
                  Примечания
                </h3>
                <textarea
                  defaultValue={selectedOrder.notes || ''}
                  onBlur={(e) => handleUpdateNotes(selectedOrder.id, e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="Добавьте примечание к заказу..."
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteOrder(selectedOrder.id, selectedOrder.order_number)}
                  className="flex-1"
                >
                  <Icon name="Trash2" size={18} className="mr-2" />
                  Удалить заказ
                </Button>
              </div>
            </div>
          </div>
        </>
        )}
      </div>
    </AdminAuth>
  );
};

export default AdminOrders;