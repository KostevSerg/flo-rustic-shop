import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface SettlementFormProps {
  formData: {
    name: string;
    delivery_price: string;
  };
  onFormDataChange: (data: { name: string; delivery_price: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const SettlementForm = ({
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  isEditing = false
}: SettlementFormProps) => {
  return (
    <div className="bg-card rounded-lg p-6 mb-6 border-2 border-primary">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? 'Редактирование населенного пункта' : 'Новый населенный пункт'}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Название <span className="text-destructive">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
              placeholder="Например: Центральный район"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Цена доставки, ₽
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.delivery_price}
              onChange={(e) => onFormDataChange({ ...formData, delivery_price: e.target.value })}
              placeholder="0"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="submit">
            <Icon name="Save" size={18} className="mr-2" />
            Сохранить
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettlementForm;
