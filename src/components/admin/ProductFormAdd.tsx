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

interface ProductFormAddProps {
  newProduct: {
    name: string;
    description: string;
    composition: string;
    image_url: string;
    base_price: string;
    category: string;
    categories?: string[];
    subcategory_id?: number | null;
    subcategory_ids?: number[];
  };
  setNewProduct: (product: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const ProductFormAdd = ({ newProduct, setNewProduct, onSubmit, onCancel }: ProductFormAddProps) => {
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
    const categories = newProduct.categories || [newProduct.category];
    const newCategories = categories.includes(cat)
      ? categories.filter(c => c !== cat)
      : [...categories, cat];
    setNewProduct({ ...newProduct, categories: newCategories });
  };

  const toggleSubcategory = (subId: number) => {
    const subcategoryIds = newProduct.subcategory_ids || (newProduct.subcategory_id ? [newProduct.subcategory_id] : []);
    const newSubcategoryIds = subcategoryIds.includes(subId)
      ? subcategoryIds.filter(id => id !== subId)
      : [...subcategoryIds, subId];
    setNewProduct({ ...newProduct, subcategory_ids: newSubcategoryIds });
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
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Категории <span className="text-muted-foreground">(выберите одну или несколько)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {['Цветы', 'Шары', 'Подарки', 'Композиции'].map(cat => {
                const categories = newProduct.categories || [newProduct.category];
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
                  const subcategoryIds = newProduct.subcategory_ids || (newProduct.subcategory_id ? [newProduct.subcategory_id] : []);
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
          <div className="md:col-span-2">
            <ImageUpload
              currentImage={newProduct.image_url}
              onImageChange={(url) => setNewProduct({ ...newProduct, image_url: url })}
              label="Изображение товара"
            />
            <div className="mt-2">
              <label className="block text-xs font-medium mb-1 text-muted-foreground">
                Или укажите URL изображения
              </label>
              <input
                type="url"
                value={newProduct.image_url}
                onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://cdn.poehali.dev/files/... или /images/products/..."
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Описание</label>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              rows={2}
              placeholder="Описание букета..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Состав</label>
            <textarea
              value={newProduct.composition}
              onChange={(e) => setNewProduct({ ...newProduct, composition: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              rows={2}
              placeholder="Например: 5 роз, 3 эвкалипта, зелень..."
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