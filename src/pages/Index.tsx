import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Index = () => {
  const { addToCart, totalItems } = useCart();

  const popularProducts = [
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
    }
  ];

  const handleAddToCart = (product: typeof popularProducts[0]) => {
    addToCart(product);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={totalItems} />
      
      <section className="relative bg-gradient-to-br from-accent/20 to-background py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Цветы, которые дарят эмоции
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
              Свежие букеты с доставкой по городу. Создаем композиции с душой и вниманием к деталям.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link to="/catalog">
                <Button size="lg" className="bg-primary text-primary-foreground hover:opacity-90 text-lg px-8">
                  Смотреть каталог
                </Button>
              </Link>
              <Link to="/contacts">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Связаться с нами
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Популярные товары</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Наши самые любимые композиции, которые выбирают чаще всего
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {popularProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={() => handleAddToCart(product)} />
            ))}
          </div>
          <div className="text-center">
            <Link to="/catalog">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Весь каталог
                <Icon name="ArrowRight" size={20} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Flower2" size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Свежие цветы</h3>
              <p className="text-muted-foreground text-sm">
                Прямые поставки от лучших производителей
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Truck" size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Доставка</h3>
              <p className="text-muted-foreground text-sm">
                Бесплатная доставка в пределах центра
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Shield" size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Гарантия</h3>
              <p className="text-muted-foreground text-sm">
                Свежесть букета минимум 7 дней
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Clock" size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Работаем 24/7</h3>
              <p className="text-muted-foreground text-sm">
                Принимаем заказы круглосуточно
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;