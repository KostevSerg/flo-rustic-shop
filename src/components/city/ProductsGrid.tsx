import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

interface ProductsGridProps {
  products: Product[];
  cityName: string;
  onAddToCart: (product: Product) => void;
  sortOrder: 'asc' | 'desc' | null;
  onSortChange: (order: 'asc' | 'desc' | null) => void;
}

const ProductsGrid = ({ products, cityName, onAddToCart, sortOrder, onSortChange }: ProductsGridProps) => {
  const sortedProducts = [...products].sort((a, b) => {
    if (!sortOrder) return 0;
    return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
  });

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="Package" size={64} className="mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">
          В данный момент товары для города {cityName} не добавлены
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center gap-3 mb-8">
        <Button
          variant={sortOrder === 'asc' ? 'default' : 'outline'}
          onClick={() => onSortChange(sortOrder === 'asc' ? null : 'asc')}
          className="flex items-center gap-2"
        >
          <Icon name="ArrowUpNarrowWide" size={16} />
          По возрастанию цены
        </Button>
        <Button
          variant={sortOrder === 'desc' ? 'default' : 'outline'}
          onClick={() => onSortChange(sortOrder === 'desc' ? null : 'desc')}
          className="flex items-center gap-2"
        >
          <Icon name="ArrowDownWideNarrow" size={16} />
          По убыванию цены
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {sortedProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={{
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price,
              image: product.image_url
            }} 
            onAddToCart={() => onAddToCart(product)} 
          />
        ))}
      </div>
    </>
  );
};

export default ProductsGrid;