import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Region {
  id: number;
  name: string;
  is_active: boolean;
}

interface RegionModalProps {
  isOpen: boolean;
  editingRegion: Region | null;
  formData: { name: string };
  saving: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (name: string) => void;
}

const RegionModal = ({
  isOpen,
  editingRegion,
  formData,
  saving,
  onClose,
  onSubmit,
  onChange
}: RegionModalProps) => {
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
            {editingRegion ? 'Редактировать регион' : 'Добавить регион'}
          </h3>
          <button onClick={onClose} className="hover:bg-accent/50 rounded-lg p-2">
            <Icon name="X" size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Название региона *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onChange(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Московская область"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? 'Сохранение...' : editingRegion ? 'Обновить' : 'Создать'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegionModal;
