import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string;
  base_price: number;
  category: string;
}

interface ProductFormEditProps {
  editingProduct: Product;
  setEditingProduct: (product: Product) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const ProductFormEdit = ({ editingProduct, setEditingProduct, onSubmit, onCancel }: ProductFormEditProps) => {
  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90vw] max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Редактировать товар</h3>
            <button
              onClick={onCancel}
              className="hover:bg-accent/50 rounded-lg p-2 transition-colors"
            >
              <Icon name="X" size={24} />
            </button>
          </div>
        </div>
        <form onSubmit={onSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Название товара <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
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
                  value={editingProduct.base_price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, base_price: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Категория <span className="text-destructive">*</span>
                </label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  required
                >
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
                value={editingProduct.image_url}
                onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Описание</label>
              <textarea
                value={editingProduct.description}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
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
            <Button type="button" variant="outline" onClick={onCancel}>
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProductFormEdit;
