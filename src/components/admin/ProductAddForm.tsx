import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ProductFormData {
  name: string;
  description: string;
  image_url: string;
  base_price: string;
  category: string;
}

interface ProductAddFormProps {
  product: ProductFormData;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (product: ProductFormData) => void;
  onCancel: () => void;
}

const ProductAddForm = ({ product, onSubmit, onChange, onCancel }: ProductAddFormProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Добавить новый товар</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Название товара <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => onChange({ ...product, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder='Например: Букет "Нежность"'
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Базовая цена <span className="text-destructive">*</span>
            </label>
            <input
              type="number"
              value={product.base_price}
              onChange={(e) => onChange({ ...product, base_price: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="3500"
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
          <div>
            <label className="block text-sm font-medium mb-2">URL изображения</label>
            <input
              type="url"
              value={product.image_url}
              onChange={(e) => onChange({ ...product, image_url: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Описание</label>
            <textarea
              value={product.description}
              onChange={(e) => onChange({ ...product, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Описание букета..."
            />
          </div>
        </div>
        <div className="flex gap-3">
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

export default ProductAddForm;
