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

interface OrderListItemProps {
  order: Order;
  statusLabels: Record<string, string>;
  statusColors: Record<string, string>;
  onClick: () => void;
}

const OrderListItem = ({ order, statusLabels, statusColors, onClick }: OrderListItemProps) => {
  return (
    <div
      className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
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
  );
};

export default OrderListItem;