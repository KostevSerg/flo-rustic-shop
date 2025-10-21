import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string;
  base_price: number;
  category: string;
  categories?: string[];
  subcategories?: Array<{subcategory_id: number; name: string; category: string}>;
  is_featured?: boolean;
}

interface ProductCardItemProps {
  product: Product;
  onEdit: (product: Product) => void;
  onSetPrice: (product: Product) => void;
  onDelete: (productId: number, productName: string) => void;
  onToggleFeatured: (productId: number, currentStatus: boolean) => void;
}

const ProductCardItem = ({ product, onEdit, onSetPrice, onDelete, onToggleFeatured }: ProductCardItemProps) => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl font-bold">{product.base_price || 0} ₽</span>
            {product.is_featured && (
              <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded flex items-center gap-1">
                <Icon name="Star" size={12} />
                Популярный
              </span>
            )}
          </div>
          {(product.categories && product.categories.length > 0) && (
            <div className="flex flex-wrap gap-1 mb-2">
              {product.categories.map((cat, idx) => (
                <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {cat}
                </span>
              ))}
            </div>
          )}
          {(product.subcategories && product.subcategories.length > 0) && (
            <div className="flex flex-wrap gap-1">
              {product.subcategories.map((sub) => (
                <span key={sub.subcategory_id} className="text-xs bg-accent/50 px-2 py-0.5 rounded">
                  {sub.name}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(product)}
            className="flex-1"
          >
            <Icon name="Edit" size={16} className="mr-1" />
            Редактировать
          </Button>
          <Button
            size="sm"
            variant={product.is_featured ? "default" : "outline"}
            onClick={() => onToggleFeatured(product.id, product.is_featured || false)}
            title={product.is_featured ? "Убрать из популярных" : "Добавить в популярные"}
          >
            <Icon name="Star" size={16} />
          </Button>
        </div>
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onSetPrice(product)}
          >
            <Icon name="DollarSign" size={16} className="mr-1" />
            Цены
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(product.id, product.name)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardItem;