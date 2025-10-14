import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const Catalog = () => {
  const { addToCart, totalItems } = useCart();

  const products = [
    {
      id: 1,
      name: 'Нежность',
      description: 'Букет из розовых и белых роз с эвкалиптом',
      price: 3500,
      image: 'https://cdn.poehali.dev/projects/be23cceb-0ab8-4764-8b57-fed61fedc50e/files/24578968-7a19-4e34-bde7-3db4eeb6fbfb.jpg'
    },
    {
      id: 2,
      name: 'Классика',
      description: 'Элегантный букет из красных роз и белых лилий',
      price: 4200,
      image: 'https://cdn.poehali.dev/projects/be23cceb-0ab8-4764-8b57-fed61fedc50e/files/0d6e767d-1dda-4de4-a9eb-29047a061763.jpg'
    },
    {
      id: 3,
      name: 'Полевой',
      description: 'Букет с подсолнухами, ромашками и зеленью',
      price: 2800,
      image: 'https://cdn.poehali.dev/projects/be23cceb-0ab8-4764-8b57-fed61fedc50e/files/77f65509-61f6-4258-b779-cb174989f3e5.jpg'
    },
    {
      id: 4,
      name: 'Весенний',
      description: 'Яркий микс из тюльпанов и гипсофилы',
      price: 3200,
      image: 'https://cdn.poehali.dev/projects/be23cceb-0ab8-4764-8b57-fed61fedc50e/files/24578968-7a19-4e34-bde7-3db4eeb6fbfb.jpg'
    },
    {
      id: 5,
      name: 'Романтика',
      description: 'Пионы и кустовые розы в нежных тонах',
      price: 4500,
      image: 'https://cdn.poehali.dev/projects/be23cceb-0ab8-4764-8b57-fed61fedc50e/files/0d6e767d-1dda-4de4-a9eb-29047a061763.jpg'
    },
    {
      id: 6,
      name: 'Летний',
      description: 'Гортензии с декоративной зеленью',
      price: 3800,
      image: 'https://cdn.poehali.dev/projects/be23cceb-0ab8-4764-8b57-fed61fedc50e/files/77f65509-61f6-4258-b779-cb174989f3e5.jpg'
    }
  ];

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={totalItems} />
      <main className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-4">Каталог</h1>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Выберите идеальный букет для любого случая
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={() => handleAddToCart(product)} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Catalog;