import { Link } from 'react-router-dom';
import { useSiteTexts } from '@/contexts/SiteTextsContext';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  citySlug: string;
}

const HeroSection = ({ citySlug }: HeroSectionProps) => {
  const { getText } = useSiteTexts();

  return (
    <section className="relative bg-gradient-to-br from-accent/20 to-background py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in">
            {getText('home', 'hero_title', 'Цветы - чтобы радовать каждый день!')}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-6 animate-fade-in">
            {getText('home', 'hero_subtitle', 'Свежие букеты с доставкой по городу. Создаем композиции с душой и вниманием к деталям.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to={`/city/${citySlug}`}>
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
  );
};

export default HeroSection;
