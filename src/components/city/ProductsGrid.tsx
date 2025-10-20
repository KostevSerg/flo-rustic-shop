import ProductCard from '@/components/ProductCard';
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
}

const ProductsGrid = ({ products, cityName, onAddToCart }: ProductsGridProps) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      {products.map(product => (
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
  );
};

export default ProductsGrid;
