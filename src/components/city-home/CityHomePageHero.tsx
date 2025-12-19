import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CityHomePageHeroProps {
  cityName: string;
  citySlug: string;
}

const CityHomePageHero = ({ cityName, citySlug }: CityHomePageHeroProps) => {
  return (
    <section className="relative bg-gradient-to-br from-accent/20 to-background py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in">
            Доставка цветов в {cityName}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-6 animate-fade-in">
            Доставка свежих букетов в {cityName}. Создаем композиции с душой и вниманием к деталям.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button asChild size="lg" className="text-base">
              <Link to="/catalog">
                <Icon name="ShoppingBag" size={20} className="mr-2" />
                Смотреть каталог
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base">
              <Link to={`/city/${citySlug}/delivery`}>
                <Icon name="Truck" size={20} className="mr-2" />
                Условия доставки
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CityHomePageHero;
