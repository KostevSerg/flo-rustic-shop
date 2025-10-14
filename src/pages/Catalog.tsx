import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category?: string;
}

const Catalog = () => {
  const { addToCart, totalItems } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Москва');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = `https://functions.poehali.dev/f3ffc9b4-fbea-48e8-959d-c34ea68e6531?city=${encodeURIComponent(selectedCity)}`;
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCity]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={totalItems} />
      <main className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-4">Каталог</h1>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Выберите идеальный букет для любого случая
        </p>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin mx-auto mb-3 w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-muted-foreground">Загрузка товаров...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Товары не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                onAddToCart={() => handleAddToCart(product)} 
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Catalog;