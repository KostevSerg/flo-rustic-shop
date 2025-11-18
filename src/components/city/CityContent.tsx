import Icon from '@/components/ui/icon';

interface CityContentProps {
  cityName: string;
}

const getCityInPrepositional = (city: string): string => {
  const endings: Record<string, string> = {
    'Алейск': 'Алейске',
    'Ангарск': 'Ангарске',
    'Ачинск': 'Ачинске',
    'Барнаул': 'Барнауле',
    'Белгород': 'Белгороде',
    'Белово': 'Белово',
    'Белокуриха': 'Белокурихе',
    'Бийск': 'Бийске',
    'Бирюч': 'Бирюче',
    'Благовещенск': 'Благовещенске',
    'Боготол': 'Боготоле',
    'Бодайбо': 'Бодайбо',
    'Борисовка': 'Борисовке',
    'Бородино': 'Бородино',
    'Братск': 'Братске',
    'Валуйки': 'Валуйках',
    'Вилючинск': 'Вилючинске',
    'Волгоград': 'Волгограде',
    'Волоконовка': 'Волоконовке',
    'Воронеж': 'Воронеже',
    'Гальбштадт': 'Гальбштадте',
    'Гурьевск': 'Гурьевске',
    'Екатеринбург': 'Екатеринбурге',
    'Елизово': 'Елизово',
    'Енисейск': 'Енисейске',
    'Ермаковское': 'Ермаковском',
    'Железногорск': 'Железногорске',
    'Завитинск': 'Завитинске',
    'ЗАТО Циолковского': 'ЗАТО Циолковского',
    'Зеленогорск': 'Зеленогорске',
    'Зея': 'Зее',
    'Зима': 'Зиме',
    'Ивня': 'Ивне',
    'Иланский': 'Иланском',
    'Казань': 'Казани',
    'Камень-на-Оби': 'Камне-на-Оби',
    'Канск': 'Канске',
    'Кемерово': 'Кемерово',
    'Киселёвск': 'Киселёвске',
    'Короча': 'Короче',
    'Красноярск': 'Красноярске',
    'Куйтун': 'Куйтуне',
    'Кулунда': 'Кулунде',
    'Ленинск-Кузнецкий': 'Ленинске-Кузнецком',
    'Лесосибирск': 'Лесосибирске',
    'Мамонтово': 'Мамонтово',
    'Мариинск': 'Мариинске',
    'Междуреченск': 'Междуреченске',
    'Минусинск': 'Минусинске',
    'Москва': 'Москве',
    'Назарово': 'Назарово',
    'Нижний Новгород': 'Нижнем Новгороде',
    'Новокузнецк': 'Новокузнецке',
    'Новосибирск': 'Новосибирске',
    'Норильск': 'Норильске',
    'Омск': 'Омске',
    'Осинники': 'Осинниках',
    'Павловск': 'Павловске',
    'Пермь': 'Перми',
    'Петропавловск-Камчатский': 'Петропавловске-Камчатском',
    'Поспелиха': 'Поспелихе',
    'Прокопьевск': 'Прокопьевске',
    'Райчихинск': 'Райчихинске',
    'Ракитное': 'Ракитном',
    'Ребриха': 'Ребрихе',
    'Ростов-на-Дону': 'Ростове-на-Дону',
    'Рубцовск': 'Рубцовске',
    'Самара': 'Самаре',
    'Санкт-Петербург': 'Санкт-Петербурге',
    'Саянск': 'Саянске',
    'Свирск': 'Свирске',
    'Свободный': 'Свободном',
    'Славгород': 'Славгороде',
    'Слюдянка': 'Слюдянке',
    'Сосновоборск': 'Сосновоборске',
    'Строитель': 'Строителе',
    'Тайга': 'Тайге',
    'Тайшет': 'Тайшете',
    'Тальменка': 'Тальменке',
    'Тулун': 'Тулуне',
    'Ужур': 'Ужуре',
    'Усолье-Сибирское': 'Усолье-Сибирском',
    'Уфа': 'Уфе',
    'Уяр': 'Уяре',
    'Челябинск': 'Челябинске',
    'Черемхово': 'Черемхово',
    'Шарыпово': 'Шарыпово',
    'Шебекино': 'Шебекино',
    'Шелехово': 'Шелехово',
    'Шипуново': 'Шипуново',
    'Шуменское': 'Шуменском',
    'Юрга': 'Юрге',
    'Яровое': 'Яровом',
    'Яя': 'Яе'
  };
  
  return endings[city] || city + 'е';
};

const CityContent = ({ cityName }: CityContentProps) => {
  const cityPrepositional = getCityInPrepositional(cityName);
  
  return (
    <div className="max-w-4xl mx-auto mt-8 md:mt-16 space-y-6 md:space-y-12 hidden md:block">
      <section className="bg-card rounded-lg p-8 border">
        <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6">Купить цветы в {cityPrepositional} с доставкой</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            <strong className="text-foreground">Доставка цветов в {cityPrepositional}</strong> от FloRustic — это профессиональный сервис для тех, кто ценит качество и оперативность. 
            Мы предлагаем широкий выбор свежих букетов для любого повода: дни рождения, свадьбы, юбилеи, 
            корпоративные мероприятия или просто чтобы порадовать близких.
          </p>
          <p>
            Когда вы хотите <strong className="text-foreground">купить букет в {cityPrepositional}</strong>, важно выбрать надежного поставщика. 
            Мы работаем только со свежими цветами от проверенных поставщиков и гарантируем качество каждой композиции. 
            Наши флористы создают уникальные букеты, которые обязательно произведут впечатление на получателя.
          </p>
          <p>
            <strong className="text-foreground">Заказать цветы в {cityPrepositional}</strong> можно круглосуточно через наш сайт. 
            Каталог содержит более 500 позиций: розы, тюльпаны, пионы, хризантемы, орхидеи и авторские композиции ручной работы. 
            Доставка работает ежедневно с 9:00 до 21:00, включая выходные и праздничные дни.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Почему выбирают нас для доставки цветов в {cityPrepositional}</h2>
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 rounded-full p-3">
                <Icon name="Clock" size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Быстрая доставка</h3>
                <p className="text-muted-foreground text-sm">
                  Доставим букет в {cityPrepositional} за 2-4 часа. Работаем ежедневно, включая выходные и праздники.
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
        <h2 className="text-2xl font-bold mb-6">Как заказать доставку цветов в {cityPrepositional}</h2>
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
        <h2 className="text-2xl font-bold mb-6">Популярные цветы для доставки в {cityPrepositional}</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            <strong className="text-foreground">Купить розы в {cityPrepositional}</strong> — классический выбор для любого повода. 
            Букет из роз символизирует любовь и страсть. Красные розы дарят любимым, белые — на свадьбу, 
            розовые — в знак благодарности. У нас можно заказать букет из 25, 51 или 101 розы с доставкой на дом.
          </p>
          <p>
            <strong className="text-foreground">Купить тюльпаны в {cityPrepositional}</strong> особенно популярно весной. 
            Свежие тюльпаны — символ весны и обновления. Идеальный подарок на 8 марта, день рождения или просто 
            для хорошего настроения. Доставляем букеты из желтых, красных, белых и розовых тюльпанов.
          </p>
          <p>
            <strong className="text-foreground">Купить пионы в {cityPrepositional}</strong> можно в сезон с мая по июль. 
            Роскошные пионы с пышными лепестками идеально подходят для романтических подарков и свадебных букетов. 
            Эти цветы создают атмосферу праздника и радости.
          </p>
          <p>
            <strong className="text-foreground">Купить хризантемы в {cityPrepositional}</strong> — отличный выбор для осенних композиций. 
            Хризантемы долго стоят в вазе и радуют яркими красками. Подходят для подарка учителю, коллеге или маме.
          </p>
          <p>
            <strong className="text-foreground">Купить орхидеи в {cityPrepositional}</strong> можно круглый год. 
            Элегантные орхидеи в горшках или срезке — это роскошный подарок для особых случаев. 
            Символизируют красоту, роскошь и утонченность.
          </p>
          <p>
            Также у нас можно <strong className="text-foreground">купить лилии, гвоздики, альстромерии и гортензии в {cityPrepositional}</strong>. 
            Все цветы свежие, доставляются напрямую от поставщиков. Создаем авторские букеты и композиции на заказ.
          </p>
        </div>
      </section>

      <section className="bg-card rounded-lg p-8 border">
        <h2 className="text-2xl font-bold mb-6">Контакты для заказа цветов в {cityPrepositional}</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Чтобы <strong className="text-foreground">заказать доставку цветов в {cityName}</strong>, 
            просто выберите букет из каталога и оформите заказ онлайн. Если у вас есть вопросы или нужна консультация флориста, 
            свяжитесь с нами по телефону или через онлайн-чат.
          </p>
          <p>
            <strong className="text-foreground">Режим работы:</strong> Ежедневно с 9:00 до 21:00<br />
            <strong className="text-foreground">Телефон:</strong> +7 995 215-10-96<br />
            <strong className="text-foreground">Email:</strong> florustic@yandex.ru
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