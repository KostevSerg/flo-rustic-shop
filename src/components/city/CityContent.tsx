import Icon from '@/components/ui/icon';

interface CityContentProps {
  cityName: string;
}

const CityContent = ({ cityName }: CityContentProps) => {
  return (
    <div className="max-w-4xl mx-auto mt-16 space-y-12">
      <section className="bg-card rounded-lg p-8 border">
        <h2 className="text-3xl font-bold mb-6">Купить цветы в {cityName} с доставкой</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            <strong className="text-foreground">FloRustic</strong> — это профессиональная служба доставки цветов в {cityName}. 
            Мы предлагаем широкий выбор свежих букетов для любого повода: дни рождения, свадьбы, юбилеи, 
            корпоративные мероприятия или просто чтобы порадовать близких.
          </p>
          <p>
            Когда вы хотите <strong className="text-foreground">заказать букет в {cityName}</strong>, важно выбрать надежного поставщика. 
            Мы работаем только со свежими цветами от проверенных поставщиков и гарантируем качество каждой композиции. 
            Наши флористы создают уникальные букеты, которые обязательно произведут впечатление.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Почему выбирают нас для доставки цветов в {cityName}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 rounded-full p-3">
                <Icon name="Clock" size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Быстрая доставка</h3>
                <p className="text-muted-foreground text-sm">
                  Доставим букет по {cityName} за 2-4 часа. Работаем ежедневно, включая выходные и праздники.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 rounded-full p-3">
                <Icon name="Flower2" size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Свежие цветы</h3>
                <p className="text-muted-foreground text-sm">
                  Используем только свежие цветы напрямую от поставщиков. Гарантируем качество каждого букета.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 rounded-full p-3">
                <Icon name="Shield" size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Гарантия качества</h3>
                <p className="text-muted-foreground text-sm">
                  Если вас не устроит букет, мы вернем деньги или заменим композицию бесплатно.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 rounded-full p-3">
                <Icon name="CreditCard" size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Удобная оплата</h3>
                <p className="text-muted-foreground text-sm">
                  Принимаем оплату картой, наличными курьеру или безналичным переводом.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card rounded-lg p-8 border">
        <h2 className="text-2xl font-bold mb-6">Как заказать доставку цветов в {cityName}</h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold mb-2">Выберите букет</h3>
              <p className="text-muted-foreground text-sm">
                Просмотрите наш каталог и выберите подходящий букет или композицию
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold mb-2">Оформите заказ</h3>
              <p className="text-muted-foreground text-sm">
                Укажите адрес доставки, время и способ оплаты
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold mb-2">Получите букет</h3>
              <p className="text-muted-foreground text-sm">
                Курьер доставит свежий букет точно в назначенное время
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card rounded-lg p-8 border">
        <h2 className="text-2xl font-bold mb-6">Популярные букеты для доставки в {cityName}</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            <strong className="text-foreground">Букеты роз</strong> — классика, которая никогда не выходит из моды. 
            Красные розы символизируют страстную любовь, белые — чистоту и нежность, розовые — благодарность.
          </p>
          <p>
            <strong className="text-foreground">Композиции с пионами</strong> идеально подходят для романтических подарков. 
            Эти роскошные цветы с нежными лепестками создают атмосферу праздника.
          </p>
          <p>
            <strong className="text-foreground">Весенние тюльпаны</strong> — символ весны и обновления. 
            Идеальный подарок на 8 марта или день рождения в весенний период.
          </p>
          <p>
            <strong className="text-foreground">Смешанные букеты</strong> из разных видов цветов позволяют создать 
            уникальную композицию, которая точно понравится получателю.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Частые вопросы о доставке цветов в {cityName}</h2>
        <div className="space-y-4">
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold mb-2">Как быстро можно доставить букет?</h3>
            <p className="text-muted-foreground text-sm">
              Стандартная доставка занимает 2-4 часа с момента оформления заказа. 
              Также доступна срочная доставка за 1 час с доплатой.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold mb-2">Можно ли доставить букет анонимно?</h3>
            <p className="text-muted-foreground text-sm">
              Да, мы можем организовать анонимную доставку. Просто укажите это при оформлении заказа, 
              и курьер передаст букет без упоминания отправителя.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold mb-2">Какие способы оплаты вы принимаете?</h3>
            <p className="text-muted-foreground text-sm">
              Мы принимаем оплату банковскими картами (Visa, MasterCard, МИР), наличными курьеру при получении, 
              а также безналичный расчет для юридических лиц.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold mb-2">Что делать, если букет не понравился?</h3>
            <p className="text-muted-foreground text-sm">
              Если вы не удовлетворены качеством букета, свяжитесь с нашей службой поддержки в течение 24 часов. 
              Мы либо заменим букет бесплатно, либо вернем полную стоимость заказа.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-card rounded-lg p-8 border">
        <h2 className="text-2xl font-bold mb-6">Контакты для заказа цветов в {cityName}</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Чтобы <strong className="text-foreground">заказать доставку цветов в {cityName}</strong>, 
            просто выберите букет из каталога и оформите заказ онлайн. Если у вас есть вопросы или нужна консультация флориста, 
            свяжитесь с нами по телефону или через онлайн-чат.
          </p>
          <p>
            <strong className="text-foreground">Режим работы:</strong> Ежедневно с 9:00 до 21:00<br />
            <strong className="text-foreground">Телефон:</strong> +7 (999) 123-45-67<br />
            <strong className="text-foreground">Email:</strong> info@florustic.ru
          </p>
          <p>
            Мы гарантируем свежесть цветов, своевременную доставку и индивидуальный подход к каждому заказу. 
            <strong className="text-foreground">Закажите букет прямо сейчас</strong> и порадуйте близких красивыми цветами!
          </p>
        </div>
      </section>
    </div>
  );
};

export default CityContent;
