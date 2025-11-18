import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface InfoSectionsProps {
  selectedCity: string;
  citySlug: string;
}

const InfoSections = ({ selectedCity, citySlug }: InfoSectionsProps) => {
  return (
    <>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
              Доставка цветов — это просто!
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-3 flex items-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground mr-3">1</span>
                    Выберите букет
                  </h3>
                  <p className="text-muted-foreground pl-13">
                    В каталоге более 50 композиций: розы, пионы, тюльпаны, орхидеи и другие цветы.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 flex items-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground mr-3">2</span>
                    Оформите заказ
                  </h3>
                  <p className="text-muted-foreground pl-13">
                    Укажите адрес доставки в {selectedCity || 'вашем городе'}, время и пожелания. Открытка в подарок бесплатно.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-3 flex items-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground mr-3">3</span>
                    Мы соберём букет
                  </h3>
                  <p className="text-muted-foreground pl-13">
                    Флористы составят композицию из свежих цветов в красивой дизайнерской упаковке.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 flex items-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground mr-3">4</span>
                    Доставим вовремя
                  </h3>
                  <p className="text-muted-foreground pl-13">
                    Курьер привезёт букет точно в срок. Доставка по {selectedCity || 'всей России'}.
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Link to={`/city/${citySlug}`}>
                <Button size="lg" className="text-lg px-8">
                  Заказать букет сейчас
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Цветы для любого повода
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-background p-6 rounded-lg">
                <Icon name="Heart" size={40} className="text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Романтика</h3>
                <p className="text-muted-foreground">
                  Букеты роз для свиданий, признаний в любви, годовщин. Красные, белые, розовые розы.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg">
                <Icon name="Gift" size={40} className="text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Подарки</h3>
                <p className="text-muted-foreground">
                  День рождения, 8 марта, День матери. Яркие миксы, пионы, гортензии с доставкой.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg">
                <Icon name="Briefcase" size={40} className="text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Бизнес</h3>
                <p className="text-muted-foreground">
                  Корпоративные букеты для партнёров и деловых мероприятий с доставкой.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InfoSections;
