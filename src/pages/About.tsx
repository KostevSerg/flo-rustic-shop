import { useCart } from '@/contexts/CartContext';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/icon';

const About = () => {
  const { totalItems } = useCart();

  const pageTitle = "О нас — FloRustic | Флористическая студия на Бали";
  const pageDescription = "FloRustic — профессиональная флористическая студия с доставкой цветов по Бали. Опытные флористы, свежие цветы, уникальные композиции. Доставка букетов в Денпасар, Убуд, Чангу, Семиньяк с 2020 года.";

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="florustic бали, о нас, флористическая студия бали, доставка цветов бали, флористы бали" />
        <link rel="canonical" href="https://flowersbali.ru/about" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content="https://flowersbali.ru/about" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": pageTitle,
            "description": pageDescription,
            "url": "https://flowersbali.ru/about",
            "mainEntity": {
              "@type": "Organization",
              "name": "FloRustic",
              "foundingDate": "2020",
              "description": "Флористическая студия на Бали"
            }
          })}
        </script>
      </Helmet>
      
      <Header cartCount={totalItems} />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-8">О FloRustic — флористической студии на Бали</h1>
          
          <div className="space-y-6 text-lg leading-relaxed">
            <p>
              <strong>FloRustic</strong> — это профессиональная флористическая студия на Бали, где каждый букет создается с любовью и вниманием к деталям. 
              Мы работаем с 2020 года и специализируемся на доставке свежих цветов по всему острову: Денпасар, Убуд, Чангу, Семиньяк, Санур, Нуса Дуа.
            </p>
            
            <div className="bg-primary/5 p-6 rounded-lg border-l-4 border-primary my-8">
              <p className="text-xl font-semibold">
                Мы верим, что цветы — это не просто подарок, а способ выразить свои чувства и создать незабываемые эмоции.
              </p>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-4">Наша команда и подход к работе</h2>
            <p>
              Наша команда опытных флористов работает только со свежими цветами от проверенных поставщиков Бали и международных поставщиков. 
              Мы ежедневно следим за качеством каждого цветка и гарантируем свежесть букетов минимум 7 дней.
            </p>
            <p>
              Флористы FloRustic постоянно обучаются новым техникам, следят за мировыми трендами во флористике и создают уникальные авторские композиции. 
              Мы умеем работать с классическими букетами из роз и пионов, а также создаём экзотические тропические композиции из орхидей и местных балийских цветов.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-4">Наша история</h2>
            <p>
              С 2020 года мы дарим радость жителям и гостям Бали, и гордимся тем, что стали частью ваших важных моментов — 
              от романтических свиданий и свадеб до дней рождения, юбилеев и простых знаков внимания близким людям.
            </p>
            <p>
              За это время мы выполнили более 5000 заказов, оформили десятки свадебных церемоний и корпоративных мероприятий. 
              Наши клиенты возвращаются к нам снова и снова, рекомендуют друзьям и оставляют тёплые отзывы.
            </p>

            <div className="grid md:grid-cols-3 gap-6 my-12">
              <div className="text-center p-6 bg-accent/10 rounded-lg">
                <Icon name="Award" size={48} className="text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary mb-2">5000+</div>
                <div className="text-muted-foreground">Счастливых клиентов</div>
              </div>
              <div className="text-center p-6 bg-accent/10 rounded-lg">
                <Icon name="Star" size={48} className="text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary mb-2">4.9</div>
                <div className="text-muted-foreground">Средний рейтинг</div>
              </div>
              <div className="text-center p-6 bg-accent/10 rounded-lg">
                <Icon name="MapPin" size={48} className="text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary mb-2">6</div>
                <div className="text-muted-foreground">Городов на Бали</div>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-4">Что мы предлагаем</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-background border rounded-lg">
                <Icon name="Flower2" size={32} className="text-primary mb-3" />
                <h3 className="text-xl font-bold mb-2">Свежие букеты</h3>
                <p className="text-muted-foreground">
                  Розы, пионы, тюльпаны, орхидеи, гортензии и экзотические тропические цветы. 
                  Более 50 готовых композиций и возможность индивидуального заказа.
                </p>
              </div>
              <div className="p-6 bg-background border rounded-lg">
                <Icon name="Truck" size={32} className="text-primary mb-3" />
                <h3 className="text-xl font-bold mb-2">Быстрая доставка</h3>
                <p className="text-muted-foreground">
                  Доставка букетов в течение 2 часов по всему Бали. 
                  Работаем ежедневно с 9:00 до 21:00 без выходных и праздников.
                </p>
              </div>
              <div className="p-6 bg-background border rounded-lg">
                <Icon name="Heart" size={32} className="text-primary mb-3" />
                <h3 className="text-xl font-bold mb-2">Свадебная флористика</h3>
                <p className="text-muted-foreground">
                  Оформление свадебных церемоний, букеты невесты, бутоньерки, композиции для банкетов. 
                  Индивидуальный дизайн под вашу концепцию.
                </p>
              </div>
              <div className="p-6 bg-background border rounded-lg">
                <Icon name="Briefcase" size={32} className="text-primary mb-3" />
                <h3 className="text-xl font-bold mb-2">Корпоративные заказы</h3>
                <p className="text-muted-foreground">
                  Оформление офисов, букеты для партнёров и сотрудников, цветочный декор мероприятий. 
                  Специальные цены для постоянных клиентов.
                </p>
              </div>
            </div>

            <div className="bg-accent/30 p-8 rounded-lg mt-12">
              <h2 className="text-3xl font-bold mb-6">Наши ценности</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <Icon name="Check" size={24} className="text-primary mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Свежесть и качество</h3>
                    <p className="text-muted-foreground">Каждый цветок проверяется перед сборкой букета. Гарантия свежести 7+ дней.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Icon name="Check" size={24} className="text-primary mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Индивидуальный подход</h3>
                    <p className="text-muted-foreground">Учитываем ваши пожелания и создаём букеты точно под ваш запрос и бюджет.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Icon name="Check" size={24} className="text-primary mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Своевременная доставка</h3>
                    <p className="text-muted-foreground">Привезём букет точно к нужному времени. Курьер на связи 24/7.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Icon name="Check" size={24} className="text-primary mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Честные цены</h3>
                    <p className="text-muted-foreground">Без скрытых доплат и наценок. Цена на сайте = финальная цена доставки.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 p-8 rounded-lg mt-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Почему клиенты выбирают FloRustic?</h2>
              <p className="text-lg mb-6">
                Мы не просто продаём цветы — мы создаём эмоции и помогаем вам дарить радость близким людям. 
                Каждый букет FloRustic — это результат профессионализма, креативности и любви к своему делу.
              </p>
              <p className="text-muted-foreground">
                Заказывая цветы у нас, вы получаете не только красивый букет, но и уверенность, 
                что он будет доставлен вовремя, будет свежим и точно понравится получателю.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;