import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import WorkHoursInput from '@/components/admin/WorkHoursInput';

interface WorkHours {
  monday?: { from: string; to: string };
  tuesday?: { from: string; to: string };
  wednesday?: { from: string; to: string };
  thursday?: { from: string; to: string };
  friday?: { from: string; to: string };
  saturday?: { from: string; to: string };
  sunday?: { from: string; to: string };
}

interface City {
  id: number;
  name: string;
  region_id: number;
  timezone: string;
  work_hours?: WorkHours;
  address?: string;
  price_markup_percent?: number;
}

interface CityModalProps {
  isOpen: boolean;
  editingCity: City | null;
  formData: {
    name: string;
    timezone: string;
    work_hours: WorkHours | null;
    address: string;
    price_markup_percent: number;
  };
  saving: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: any) => void;
}

const CityModal = ({
  isOpen,
  editingCity,
  formData,
  saving,
  onClose,
  onSubmit,
  onChange
}: CityModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90vw] max-w-2xl max-h-[90vh] overflow-y-auto bg-card border rounded-xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">
            {editingCity ? 'Редактировать город' : 'Добавить город'}
          </h3>
          <button onClick={onClose} className="hover:bg-accent/50 rounded-lg p-2">
            <Icon name="X" size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Название города *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => onChange('name', e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Москва"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Часовой пояс *</label>
              <select
                value={formData.timezone}
                onChange={(e) => onChange('timezone', e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="Europe/Moscow">МСК (UTC+3)</option>
                <option value="Europe/Kaliningrad">МСК-1 (UTC+2)</option>
                <option value="Europe/Samara">МСК+1 (UTC+4)</option>
                <option value="Asia/Yekaterinburg">МСК+2 (UTC+5)</option>
                <option value="Asia/Omsk">МСК+3 (UTC+6)</option>
                <option value="Asia/Novosibirsk">МСК+4 (UTC+7)</option>
                <option value="Asia/Krasnoyarsk">МСК+4 (UTC+7)</option>
                <option value="Asia/Irkutsk">МСК+5 (UTC+8)</option>
                <option value="Asia/Yakutsk">МСК+6 (UTC+9)</option>
                <option value="Asia/Vladivostok">МСК+7 (UTC+10)</option>
                <option value="Asia/Magadan">МСК+8 (UTC+11)</option>
                <option value="Asia/Kamchatka">МСК+9 (UTC+12)</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Адрес офиса/магазина</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => onChange('address', e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="г. Москва, ул. Примерная, д. 1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Этот адрес будет отображаться на странице контактов и в футере
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Наценка на товары (%)
              </label>
              <input
                type="number"
                min="0"
                max="999.99"
                step="0.01"
                value={formData.price_markup_percent}
                onChange={(e) => onChange('price_markup_percent', parseFloat(e.target.value) || 0)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Процент наценки от базовой цены (например, 10 = +10%)
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <WorkHoursInput
              value={formData.work_hours}
              onChange={(value) => onChange('work_hours', value)}
            />
          </div>

          <div className="flex space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? 'Сохранение...' : editingCity ? 'Обновить' : 'Добавить'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CityModal;