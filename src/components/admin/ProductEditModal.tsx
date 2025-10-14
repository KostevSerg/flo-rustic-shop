import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ProductEditData {
  id: number;
  name: string;
  description: string;
  image_url: string;
  base_price: string;
  category: string;
}

interface ProductEditModalProps {
  product: ProductEditData;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (product: ProductEditData) => void;
  onClose: () => void;
}

const ProductEditModal = ({ product, onSubmit, onChange, onClose }: ProductEditModalProps) => {
  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90vw] max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Редактировать товар</h3>
            <button
              onClick={onClose}
              className="hover:bg-accent/50 rounded-lg p-2 transition-colors"
            >
              <Icon name="X" size={24} />
            </button>
          </div>
        </div>
        <form onSubmit={onSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Название товара <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={product.name}
                onChange={(e) => onChange({ ...product, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Базовая цена <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  value={product.base_price}
                  onChange={(e) => onChange({ ...product, base_price: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Категория <span className="text-destructive">*</span>
                </label>
                <select
                  value={product.category}
                  onChange={(e) => onChange({ ...product, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Выберите категорию</option>
                  <option value="Цветы">Цветы</option>
                  <option value="Шары">Шары</option>
                  <option value="Подарки">Подарки</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL изображения</label>
              <input
                type="url"
                value={product.image_url}
                onChange={(e) => onChange({ ...product, image_url: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Описание</label>
              <textarea
                value={product.description}
                onChange={(e) => onChange({ ...product, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button type="submit">
              <Icon name="Save" size={18} className="mr-2" />
              Сохранить изменения
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProductEditModal;
