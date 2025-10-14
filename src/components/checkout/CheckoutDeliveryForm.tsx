import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface Settlement {
  id: number;
  name: string;
  delivery_price: number;
}

interface CheckoutDeliveryFormProps {
  selectedCity: string;
  settlementId: string;
  address: string;
  deliveryDate: string;
  deliveryTime: string;
  settlements: Settlement[];
  loadingSettlements: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  getTodayDate: () => string;
}

const CheckoutDeliveryForm = ({
  selectedCity,
  settlementId,
  address,
  deliveryDate,
  deliveryTime,
  settlements,
  loadingSettlements,
  onChange,
  getTodayDate
}: CheckoutDeliveryFormProps) => {
  return (
    <div className="bg-card rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Icon name="MapPin" size={20} className="text-primary" />
        Доставка
      </h2>

      <div>
        <label className="block text-sm font-medium mb-1">Город</label>
        <Input
          value={selectedCity || 'Не выбран'}
          disabled
          className="bg-muted"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Выберите город в шапке сайта
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Населенный пункт <span className="text-destructive">*</span>
        </label>
        {loadingSettlements ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
            Загрузка...
          </div>
        ) : settlements.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Населенные пункты не настроены для этого города
          </p>
        ) : (
          <select
            name="settlementId"
            value={settlementId}
            onChange={onChange}
            className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            required
          >
            <option value="">Выберите населенный пункт</option>
            {settlements.map(settlement => (
              <option key={settlement.id} value={settlement.id}>
                {settlement.name} 
                {settlement.delivery_price > 0 && ` (+${settlement.delivery_price} ₽ доставка)`}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Адрес доставки <span className="text-destructive">*</span>
        </label>
        <Input
          name="address"
          value={address}
          onChange={onChange}
          placeholder="Улица, дом, квартира"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Дата доставки</label>
          <Input
            type="date"
            name="deliveryDate"
            value={deliveryDate}
            onChange={onChange}
            min={getTodayDate()}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Время доставки</label>
          <select
            name="deliveryTime"
            value={deliveryTime}
            onChange={onChange}
            className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background"
          >
            <option value="any">В любое время</option>
            <option value="morning">Утро (9:00 - 12:00)</option>
            <option value="day">День (12:00 - 18:00)</option>
            <option value="evening">Вечер (18:00 - 21:00)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDeliveryForm;
