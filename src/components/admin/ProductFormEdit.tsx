import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import ImageUpload from '@/components/ui/image-upload';
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
  categories?: string[];
  subcategory_id?: number | null;
  subcategory_ids?: number[];
  subcategories?: Array<{subcategory_id: number; name: string; category: string}>;
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
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    setLoadingSubcategories(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.products}?action=subcategories`);
      const data = await response.json();
      setSubcategories(data.subcategories || []);
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  const toggleCategory = (cat: string) => {
    const categories = editingProduct.categories || [editingProduct.category];
    const newCategories = categories.includes(cat)
      ? categories.filter(c => c !== cat)
      : [...categories, cat];
    setEditingProduct({ ...editingProduct, categories: newCategories });
  };

  const toggleSubcategory = (subId: number) => {
    const subcategoryIds = editingProduct.subcategory_ids || 
      (editingProduct.subcategories ? editingProduct.subcategories.map(s => s.subcategory_id) : 
      (editingProduct.subcategory_id ? [editingProduct.subcategory_id] : []));
    const newSubcategoryIds = subcategoryIds.includes(subId)
      ? subcategoryIds.filter(id => id !== subId)
      : [...subcategoryIds, subId];
    setEditingProduct({ ...editingProduct, subcategory_ids: newSubcategoryIds });
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90vw] max-w-2xl max-h-[90vh] bg-card border border-border rounded-xl shadow-2xl flex flex-col">
        <div className="px-4 py-3 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Редактировать товар</h3>
            <button
              onClick={onCancel}
              className="hover:bg-accent/50 rounded-lg p-1.5 transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto flex-1 px-4 py-4">
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Категории <span className="text-muted-foreground">(выберите одну или несколько)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Цветы', 'Шары', 'Подарки', 'Композиции'].map(cat => {
                    const categories = editingProduct.categories || [editingProduct.category];
                    const isSelected = categories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-border hover:border-primary'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Подкатегории <span className="text-muted-foreground">(необязательно)</span>
                </label>
                {loadingSubcategories ? (
                  <div className="text-sm text-muted-foreground">Загрузка...</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {subcategories.map(sub => {
                      const subcategoryIds = editingProduct.subcategory_ids || 
                        (editingProduct.subcategories ? editingProduct.subcategories.map(s => s.subcategory_id) : 
                        (editingProduct.subcategory_id ? [editingProduct.subcategory_id] : []));
                      const isSelected = subcategoryIds.includes(sub.id);
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => toggleSubcategory(sub.id)}
                          className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                            isSelected
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background border-border hover:border-primary'
                          }`}
                        >
                          {sub.name} <span className="text-xs opacity-70">({sub.category})</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div>
              <ImageUpload
                currentImage={editingProduct.image_url}
                onImageChange={(url) => setEditingProduct({ ...editingProduct, image_url: url })}
                label="Изображение товара"
              />
              <div className="mt-2">
                <label className="block text-xs font-medium mb-1 text-muted-foreground">
                  Или укажите URL изображения
                </label>
                <input
                  type="url"
                  value={editingProduct.image_url}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://cdn.poehali.dev/files/... или /images/products/..."
                />
              </div>
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
          </div>
          <div className="flex gap-3 px-4 py-3 border-t border-border flex-shrink-0 bg-card">
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
    </>
  );
};

export default ProductFormEdit;