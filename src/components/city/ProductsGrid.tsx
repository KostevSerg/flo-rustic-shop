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
      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mb-6 md:mb-8 px-4">
        <Button
          variant={sortOrder === 'asc' ? 'default' : 'outline'}
          onClick={() => onSortChange(sortOrder === 'asc' ? null : 'asc')}
          className="flex items-center justify-center gap-2 text-sm md:text-base h-9 md:h-10"
        >
          <Icon name="ArrowUpNarrowWide" size={16} />
          <span className="whitespace-nowrap">По возрастанию</span>
        </Button>
        <Button
          variant={sortOrder === 'desc' ? 'default' : 'outline'}
          onClick={() => onSortChange(sortOrder === 'desc' ? null : 'desc')}
          className="flex items-center justify-center gap-2 text-sm md:text-base h-9 md:h-10"
        >
          <Icon name="ArrowDownWideNarrow" size={16} />
          <span className="whitespace-nowrap">По убыванию</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-12 md:mb-16">
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