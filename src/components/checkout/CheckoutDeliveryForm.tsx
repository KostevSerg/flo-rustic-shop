import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface WorkHours {
  from: string;
  to: string;
}

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
  deliveryTimeFrom: string;
  deliveryTimeTo: string;
  settlements: Settlement[];
  loadingSettlements: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  getTodayDate: () => string;
  cityWorkHours: WorkHours | null;
}

const CheckoutDeliveryForm = ({
  selectedCity,
  settlementId,
  address,
  deliveryDate,
  deliveryTimeFrom,
  deliveryTimeTo,
  settlements,
  loadingSettlements,
  onChange,
  getTodayDate,
  cityWorkHours
}: CheckoutDeliveryFormProps) => {
  return (
    <div className="bg-card rounded-lg p-3 md:p-4 space-y-2 md:space-y-3">
      <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
        <Icon name="MapPin" size={18} className="text-primary" />
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
        <label className="block text-sm font-medium mb-1">
          Промежуток доставки
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">С</label>
            <Input
              type="time"
              name="deliveryTimeFrom"
              value={deliveryTimeFrom}
              onChange={onChange}
              placeholder="10:00"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">До</label>
            <Input
              type="time"
              name="deliveryTimeTo"
              value={deliveryTimeTo}
              onChange={onChange}
              placeholder="18:00"
            />
          </div>
        </div>
        {cityWorkHours && (
          <p className="text-xs text-muted-foreground mt-1">
            Филиал работает с {cityWorkHours.from} до {cityWorkHours.to}
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckoutDeliveryForm;