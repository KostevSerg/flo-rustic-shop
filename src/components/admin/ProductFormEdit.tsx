import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import API_ENDPOINTS from '@/config/api';

interface Subcategory {
  id: number;
  name: string;
  category: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  composition?: string;
  image_url: string;
  base_price: number;
  category: string;
  subcategory_id?: number | null;
}

interface ProductFormEditProps {
  editingProduct: Product;
  setEditingProduct: (product: Product) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const ProductFormEdit = ({ editingProduct, setEditingProduct, onSubmit, onCancel }: ProductFormEditProps) => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  useEffect(() => {
    if (editingProduct.category === 'Цветы') {
      fetchSubcategories();
    } else {
      setSubcategories([]);
    }
  }, [editingProduct.category]);

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
                  value={editingProduct.base_price === 0 ? '' : editingProduct.base_price}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numValue = value === '' ? 0 : parseInt(value, 10);
                    setEditingProduct({ ...editingProduct, base_price: isNaN(numValue) ? 0 : numValue });
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Категория <span className="text-destructive">*</span>
                </label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value, subcategory_id: null })}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  required
                >
                  <option value="Цветы">Цветы</option>
                  <option value="Шары">Шары</option>
                  <option value="Подарки">Подарки</option>
                </select>
              </div>
              {editingProduct.category === 'Цветы' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Подкатегория</label>
                  <select
                    value={editingProduct.subcategory_id || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, subcategory_id: e.target.value ? parseInt(e.target.value) : null })}
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
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Ссылка на изображение
              </label>
              <input
                type="url"
                value={editingProduct.image_url}
                onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com/image.jpg"
              />
              {editingProduct.image_url && (
                <div className="mt-3">
                  <img 
                    src={editingProduct.image_url} 
                    alt="Предпросмотр" 
                    className="max-w-xs rounded-lg border border-border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Описание</label>
              <textarea
                value={editingProduct.description}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Состав</label>
              <textarea
                value={editingProduct.composition || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, composition: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                rows={2}
                placeholder="Например: 5 роз, 3 эвкалипта, зелень..."
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