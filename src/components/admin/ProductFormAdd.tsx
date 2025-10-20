import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import API_ENDPOINTS from '@/config/api';

interface Subcategory {
  id: number;
  name: string;
  category: string;
}

interface ProductFormAddProps {
  newProduct: {
    name: string;
    description: string;
    image_url: string;
    base_price: string;
    category: string;
    subcategory_id?: number | null;
  };
  setNewProduct: (product: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const ProductFormAdd = ({ newProduct, setNewProduct, onSubmit, onCancel }: ProductFormAddProps) => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  useEffect(() => {
    if (newProduct.category === 'Цветы') {
      fetchSubcategories();
    } else {
      setSubcategories([]);
      setNewProduct({ ...newProduct, subcategory_id: null });
    }
  }, [newProduct.category]);

  const fetchSubcategories = async () => {
    setLoadingSubcategories(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.products}?action=subcategories&category=Цветы`);
      const data = await response.json();
      setSubcategories(data.subcategories || []);
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
    } finally {
      setLoadingSubcategories(false);
    }
  };

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
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
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
              value={newProduct.base_price}
              onChange={(e) => setNewProduct({ ...newProduct, base_price: e.target.value })}
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
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value, subcategory_id: null })}
              className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              required
            >
              <option value="Цветы">Цветы</option>
              <option value="Шары">Шары</option>
              <option value="Подарки">Подарки</option>
            </select>
          </div>
          {newProduct.category === 'Цветы' && (
            <div>
              <label className="block text-sm font-medium mb-2">Подкатегория</label>
              <select
                value={newProduct.subcategory_id || ''}
                onChange={(e) => setNewProduct({ ...newProduct, subcategory_id: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                disabled={loadingSubcategories}
              >
                <option value="">Без подкатегории</option>
                {subcategories.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-2">URL изображения</label>
            <input
              type="url"
              value={newProduct.image_url}
              onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Описание</label>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
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

export default ProductFormAdd;