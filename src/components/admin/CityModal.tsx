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
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

interface CityModalProps {
  isOpen: boolean;
  editingCity: City | null;
  formData: {
    name: string;
    timezone: string;
    work_hours: WorkHours | null;
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
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
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90vw] max-w-md bg-card border rounded-xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">
            {editingCity ? 'Редактировать город' : 'Добавить город'}
          </h3>
          <button onClick={onClose} className="hover:bg-accent/50 rounded-lg p-2">
            <Icon name="X" size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
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
              <option value="Europe/Moscow">Europe/Moscow (МСК)</option>
              <option value="Europe/Kaliningrad">Europe/Kaliningrad (МСК-1)</option>
              <option value="Europe/Samara">Europe/Samara (МСК+1)</option>
              <option value="Asia/Yekaterinburg">Asia/Yekaterinburg (МСК+2)</option>
              <option value="Asia/Omsk">Asia/Omsk (МСК+3)</option>
              <option value="Asia/Novosibirsk">Asia/Novosibirsk (МСК+4)</option>
              <option value="Asia/Krasnoyarsk">Asia/Krasnoyarsk (МСК+4)</option>
              <option value="Asia/Irkutsk">Asia/Irkutsk (МСК+5)</option>
              <option value="Asia/Yakutsk">Asia/Yakutsk (МСК+6)</option>
              <option value="Asia/Vladivostok">Asia/Vladivostok (МСК+7)</option>
              <option value="Asia/Magadan">Asia/Magadan (МСК+8)</option>
              <option value="Asia/Kamchatka">Asia/Kamchatka (МСК+9)</option>
            </select>
          </div>

          <WorkHoursInput
            value={formData.work_hours}
            onChange={(value) => onChange('work_hours', value)}
          />

          <div className="border-t pt-4 mt-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <Icon name="Search" size={18} className="mr-2" />
              SEO настройки
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">SEO Title</label>
                <input
                  type="text"
                  value={formData.seo_title}
                  onChange={(e) => onChange('seo_title', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Доставка цветов в Барнауле — FloRustic"
                />
                <p className="text-xs text-muted-foreground mt-1">Заголовок страницы в поисковиках (рекомендуется 50-60 символов)</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">SEO Description</label>
                <textarea
                  value={formData.seo_description}
                  onChange={(e) => onChange('seo_description', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-20"
                  placeholder="Быстрая доставка цветов в Барнауле. Букеты ручной сборки от флористов. Доставка в день заказа."
                />
                <p className="text-xs text-muted-foreground mt-1">Описание для поисковых результатов (рекомендуется 150-160 символов)</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">SEO Keywords</label>
                <input
                  type="text"
                  value={formData.seo_keywords}
                  onChange={(e) => onChange('seo_keywords', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="цветы барнаул, доставка цветов барнаул, букеты барнаул"
                />
                <p className="text-xs text-muted-foreground mt-1">Ключевые слова через запятую для поисковой оптимизации</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
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