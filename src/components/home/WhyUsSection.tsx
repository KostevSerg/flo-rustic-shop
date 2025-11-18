import Icon from '@/components/ui/icon';

interface WhyUsSectionProps {
  selectedCity: string;
}

const WhyUsSection = ({ selectedCity }: WhyUsSectionProps) => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Почему выбирают FloRustic
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Мы — служба доставки цветов по всей России{selectedCity ? `, включая ${selectedCity}` : ''}. 
            Собираем красивые букеты из свежих цветов на любой случай.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Flower2" size={32} className="text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Свежие цветы</h3>
            <p className="text-muted-foreground text-sm">
              Прямые поставки от лучших производителей каждый день
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Truck" size={32} className="text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Быстрая доставка</h3>
            <p className="text-muted-foreground text-sm">
              Доставляем за 2 часа по всему городу. Работаем ежедневно 9:00-21:00
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Shield" size={32} className="text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">100% Качество</h3>
            <p className="text-muted-foreground text-sm">
              Каждый букет проходит контроль качества перед доставкой
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Heart" size={32} className="text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">С любовью</h3>
            <p className="text-muted-foreground text-sm">
              Каждый букет создаём вручную опытные флористы с многолетним стажем
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
