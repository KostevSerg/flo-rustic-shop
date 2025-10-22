import { Helmet } from 'react-helmet-async';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreadcrumbsNav from '@/components/BreadcrumbsNav';
import Icon from '@/components/ui/icon';

const Reviews = () => {
  const { totalItems } = useCart();

  const reviews = [
    {
      id: 1,
      name: 'Анна Смирнова',
      date: '15 марта 2024',
      rating: 5,
      text: 'Заказывала букет на день рождения мамы. Цветы свежие, красиво оформлены, доставили точно в срок. Мама была в восторге! Спасибо FloRustic!'
    },
    {
      id: 2,
      name: 'Дмитрий Петров',
      date: '10 марта 2024',
      rating: 5,
      text: 'Отличный сервис! Букет превзошел все ожидания. Флористы действительно профессионалы своего дела. Буду заказывать еще.'
    },
    {
      id: 3,
      name: 'Елена Ковалева',
      date: '5 марта 2024',
      rating: 5,
      text: 'Прекрасные цветы и очень вежливые курьеры. Заказываю здесь регулярно, качество всегда на высоте. Рекомендую!'
    },
    {
      id: 4,
      name: 'Михаил Соколов',
      date: '28 февраля 2024',
      rating: 4,
      text: 'Хороший выбор букетов, свежие цветы. Единственное пожелание — хотелось бы больше эксклюзивных композиций.'
    },
    {
      id: 5,
      name: 'Ольга Новикова',
      date: '20 февраля 2024',
      rating: 5,
      text: 'Заказывала букет с доставкой на работу. Все было идеально! Цветы простояли больше недели. Очень довольна!'
    },
    {
      id: 6,
      name: 'Сергей Волков',
      date: '12 февраля 2024',
      rating: 5,
      text: 'Быстрая доставка, красивая упаковка, приятные цены. Жена была счастлива. Спасибо за вашу работу!'
    }
  ];

  const reviewsSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FloRustic",
    "url": "https://florustic.ru",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": reviews.length.toString(),
      "bestRating": "5",
      "worstRating": "1",
      "itemReviewed": {
        "@type": "LocalBusiness",
        "name": "FloRustic",
        "image": "https://cdn.poehali.dev/files/a67d7855-c81c-456d-8393-2b2ec7bfd0bd.png",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "RU"
        },
        "priceRange": "₽₽"
      }
    },
    "review": reviews.map(review => ({
      "@type": "Review",
      "itemReviewed": {
        "@type": "LocalBusiness",
        "name": "FloRustic",
        "image": "https://cdn.poehali.dev/files/a67d7855-c81c-456d-8393-2b2ec7bfd0bd.png"
      },
      "author": {
        "@type": "Person",
        "name": review.name
      },
      "datePublished": review.date,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating.toString(),
        "bestRating": "5"
      },
      "reviewBody": review.text
    }))
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Отзывы о FloRustic — Реальные мнения клиентов о доставке цветов</title>
        <meta name="description" content="Читайте отзывы клиентов о FloRustic. Реальные мнения покупателей о качестве цветов, скорости доставки и сервисе. Более 1000+ положительных отзывов." />
        <meta name="keywords" content="отзывы florustic, отзывы о доставке цветов, качество цветов отзывы, букеты отзывы, florustic мнения клиентов" />
        <link rel="canonical" href="https://florustic.ru/reviews" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Отзывы о FloRustic — Реальные мнения клиентов" />
        <meta property="og:description" content="Читайте отзывы клиентов о FloRustic. Реальные мнения о качестве цветов и доставке." />
        <meta property="og:url" content="https://florustic.ru/reviews" />
        <meta property="og:image" content="https://cdn.poehali.dev/files/a67d7855-c81c-456d-8393-2b2ec7bfd0bd.png" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Отзывы о FloRustic" />
        <meta name="twitter:description" content="Читайте отзывы клиентов о FloRustic" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Главная",
                "item": "https://florustic.ru/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Отзывы"
              }
            ]
          })}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify(reviewsSchema)}
        </script>
      </Helmet>

      <Header cartCount={totalItems} />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <BreadcrumbsNav items={[{ name: 'Отзывы' }]} />
          
          <h1 className="text-5xl font-bold text-center mb-4">Отзывы</h1>
          <p className="text-center text-muted-foreground mb-12">
            Что говорят наши клиенты
          </p>
          
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{review.name}</h3>
                    <p className="text-sm text-muted-foreground">{review.date}</p>
                  </div>
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <Icon key={i} name="Star" size={20} className="text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
                <p className="text-foreground leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-accent/20 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Оставьте свой отзыв</h2>
            <p className="text-muted-foreground mb-6">
              Поделитесь своим мнением о нашем сервисе
            </p>
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition">
              Написать отзыв
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Reviews;