import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface Settlement {
  id: number;
  city_id: number;
  name: string;
  delivery_price: number;
  is_active: boolean;
}

interface SettlementListProps {
  settlements: Settlement[];
  loading: boolean;
  editingId: number | null;
  formData: {
    name: string;
    delivery_price: string;
  };
  onFormDataChange: (data: { name: string; delivery_price: string }) => void;
  onEdit: (settlement: Settlement) => void;
  onUpdate: (id: number) => void;
  onCancelEdit: () => void;
  onDelete: (id: number, name: string) => void;
  onAddFirst: () => void;
}

const SettlementList = ({
  settlements,
  loading,
  editingId,
  formData,
  onFormDataChange,
  onEdit,
  onUpdate,
  onCancelEdit,
  onDelete,
  onAddFirst
}: SettlementListProps) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin mx-auto mb-3 w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  if (settlements.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg">
        <Icon name="MapPin" size={48} className="mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground mb-4">Населенные пункты не добавлены</p>
        <Button onClick={onAddFirst}>
          <Icon name="Plus" size={18} className="mr-2" />
          Добавить первый
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {settlements.map(settlement => (
        <div key={settlement.id} className="bg-card rounded-lg p-4 border">
          {editingId === settlement.id ? (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Название <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
                    placeholder="Название населенного пункта"
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
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => onUpdate(settlement.id)}>
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить
                </Button>
                <Button size="sm" variant="outline" onClick={onCancelEdit}>
                  Отмена
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{settlement.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Доставка: {settlement.delivery_price > 0 ? `${settlement.delivery_price} ₽` : 'Бесплатно'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(settlement)}>
                  <Icon name="Pencil" size={16} className="mr-2" />
                  Изменить
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(settlement.id, settlement.name)}
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SettlementList;
