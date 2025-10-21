import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import ImageUpload from '@/components/ui/image-upload';

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
    <div className="bg-card border border-border rounded-lg mb-8">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Icon name="Plus" size={24} />
          Новый товар
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Заполните информацию о букете или подарке</p>
      </div>
      
      <form onSubmit={onSubmit} className="p-6 space-y-6">
        {/* Основная информация */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Icon name="Package" size={20} />
            Основная информация
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Название товара <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={product.name}
                onChange={(e) => onChange({ ...product, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                placeholder='Например: Букет "Весенняя радость"'
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
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                required
              >
                <option value="">Выберите категорию</option>
                <option value="Цветы">🌸 Цветы</option>
                <option value="Шары">🎈 Шары</option>
                <option value="Подарки">🎁 Подарки</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Базовая цена <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={product.base_price}
                  onChange={(e) => onChange({ ...product, base_price: e.target.value })}
                  className="w-full px-4 py-2.5 pr-12 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="3500"
                  required
                  min="0"
                  step="1"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">₽</span>
              </div>
            </div>
          </div>
        </div>

        {/* Описание */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Icon name="FileText" size={20} />
            Описание
          </h3>
          
          <div>
            <textarea
              value={product.description}
              onChange={(e) => onChange({ ...product, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              rows={4}
              placeholder="Опишите букет: состав цветов, повод для подарка, особенности..."
            />
            <p className="text-xs text-muted-foreground mt-1">Подробное описание поможет покупателям сделать выбор</p>
          </div>
        </div>

        {/* Изображение */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Icon name="Image" size={20} />
            Фотография
          </h3>
          
          <ImageUpload
            currentImage={product.image_url}
            onImageChange={(url) => onChange({ ...product, image_url: url })}
            label=""
          />
        </div>

        {/* Кнопки */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button type="submit" size="lg">
            <Icon name="Save" size={18} className="mr-2" />
            Сохранить товар
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={onCancel}>
            <Icon name="X" size={18} className="mr-2" />
            Отмена
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductAddForm;