import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

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
  delivery_time_from?: string | null;
  delivery_time_to?: string | null;
  postcard_text?: string | null;
  payment_method?: string | null;
  payment_status?: string | null;
  payment_id?: string | null;
}

interface OrderDetailsModalProps {
  order: Order;
  statusLabels: Record<string, string>;
  onClose: () => void;
  onUpdateStatus: (orderId: number, newStatus: string) => void;
  onUpdateNotes: (orderId: number, notes: string) => void;
  onDelete: (orderId: number, orderNumber: string) => void;
}

const OrderDetailsModal = ({
  order,
  statusLabels,
  onClose,
  onUpdateStatus,
  onUpdateNotes,
  onDelete
}: OrderDetailsModalProps) => {
  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90vw] max-w-3xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Заказ #{order.order_number}</h2>
            <p className="text-sm text-muted-foreground">
              {new Date(order.created_at).toLocaleString('ru-RU')}
            </p>
          </div>
          <button
            onClick={onClose}
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
                  variant={order.status === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onUpdateStatus(order.id, status)}
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
              <p className="font-semibold mb-1">{order.recipient_name || order.customer_name}</p>
              <p className="text-sm mb-1">{order.recipient_phone || order.customer_phone}</p>
              {order.customer_email && (
                <p className="text-sm text-muted-foreground">{order.customer_email}</p>
              )}
            </div>

            {(order.sender_name || order.sender_phone) && (
              <div className="bg-accent/20 rounded-lg p-4">
                <h3 className="font-bold mb-3 flex items-center">
                  <Icon name="User" size={18} className="mr-2" />
                  Отправитель
                </h3>
                {order.sender_name && (
                  <p className="font-semibold mb-1">{order.sender_name}</p>
                )}
                {order.sender_phone && (
                  <p className="text-sm">{order.sender_phone}</p>
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
              <p className="font-semibold mb-1">{order.city_name}, {order.region}</p>
              <p className="text-sm">{order.delivery_address}</p>
            </div>

            {(order.delivery_date || order.delivery_time_from || order.delivery_time_to) && (
              <div className="bg-accent/20 rounded-lg p-4">
                <h3 className="font-bold mb-3 flex items-center">
                  <Icon name="CalendarClock" size={18} className="mr-2" />
                  Время доставки
                </h3>
                {order.delivery_date && (
                  <p className="font-semibold mb-1">
                    {new Date(order.delivery_date).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                )}
                {(order.delivery_time_from || order.delivery_time_to) && (
                  <p className="text-sm">
                    {order.delivery_time_from && order.delivery_time_to
                      ? `с ${order.delivery_time_from} до ${order.delivery_time_to}`
                      : order.delivery_time_from
                      ? `с ${order.delivery_time_from}`
                      : order.delivery_time_to
                      ? `до ${order.delivery_time_to}`
                      : ''}
                  </p>
                )}
              </div>
            )}
          </div>

          {order.postcard_text && (
            <div className="bg-accent/20 rounded-lg p-4">
              <h3 className="font-bold mb-3 flex items-center">
                <Icon name="MessageSquare" size={18} className="mr-2" />
                Текст открытки
              </h3>
              <p className="text-sm whitespace-pre-wrap">{order.postcard_text}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {order.payment_method && (
              <div className="bg-accent/20 rounded-lg p-4">
                <h3 className="font-bold mb-3 flex items-center">
                  <Icon name="CreditCard" size={18} className="mr-2" />
                  Способ оплаты
                </h3>
                <p className="text-sm">
                  {order.payment_method === 'online' ? 'Онлайн оплата' : 
                   order.payment_method === 'cash' ? 'Наличными курьеру' :
                   order.payment_method === 'card' ? 'Картой курьеру' :
                   order.payment_method}
                </p>
              </div>
            )}

            <div className="bg-accent/20 rounded-lg p-4">
              <h3 className="font-bold mb-3 flex items-center">
                <Icon name="CheckCircle" size={18} className="mr-2" />
                Статус оплаты
              </h3>
              {order.payment_status === 'paid' ? (
                <p className="text-sm font-semibold text-green-600">✅ Оплачен</p>
              ) : order.payment_status === 'pending' ? (
                <p className="text-sm font-semibold text-yellow-600">⏳ Ожидает оплаты</p>
              ) : order.payment_status === 'failed' ? (
                <p className="text-sm font-semibold text-red-600">❌ Не оплачен</p>
              ) : (
                <p className="text-sm text-muted-foreground">Статус не определён</p>
              )}
              {order.payment_id && (
                <p className="text-xs text-muted-foreground mt-1">ID: {order.payment_id}</p>
              )}
            </div>
          </div>

          <div className="bg-accent/20 rounded-lg p-4">
            <h3 className="font-bold mb-3 flex items-center">
              <Icon name="Package" size={18} className="mr-2" />
              Товары
            </h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.price} ₽ × {item.quantity}</p>
                  </div>
                  <p className="font-bold">{item.price * item.quantity} ₽</p>
                </div>
              ))}
              {order.promo_code && order.discount_amount && (
                <div className="flex justify-between items-center pt-2 border-t border-border/50">
                  <div>
                    <p className="font-semibold text-green-600">Промокод {order.promo_code}</p>
                    <p className="text-sm text-muted-foreground">Скидка {order.promo_discount}%</p>
                  </div>
                  <p className="font-bold text-green-600">-{order.discount_amount} ₽</p>
                </div>
              )}
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-lg">Итого:</p>
                  <p className="font-bold text-2xl text-primary">{order.total_amount} ₽</p>
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
              defaultValue={order.notes || ''}
              onBlur={(e) => onUpdateNotes(order.id, e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              placeholder="Добавьте примечание к заказу..."
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="destructive"
              onClick={() => onDelete(order.id, order.order_number)}
              className="flex-1"
            >
              <Icon name="Trash2" size={18} className="mr-2" />
              Удалить заказ
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Закрыть
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsModal;