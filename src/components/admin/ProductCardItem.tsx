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

interface ProductCardItemProps {
  product: Product;
  onEdit: (product: Product) => void;
  onSetPrice: (product: Product) => void;
  onDelete: (productId: number, productName: string) => void;
}

const ProductCardItem = ({ product, onEdit, onSetPrice, onDelete }: ProductCardItemProps) => {
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
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold">{product.base_price} ₽</span>
          {product.category && (
            <span className="text-xs bg-accent px-2 py-1 rounded">
              {product.category}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(product)}
          >
            <Icon name="Edit" size={16} className="mr-1" />
            Редактировать
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
