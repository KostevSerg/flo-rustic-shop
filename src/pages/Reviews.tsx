import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreadcrumbsNav from '@/components/BreadcrumbsNav';
import Icon from '@/components/ui/icon';
import API_ENDPOINTS from '@/config/api';

interface Review {
  id: number;
  name: string;
  city: string;
  rating: number;
  comment: string;
  created_at: string;
}

const Reviews = () => {
  const { totalItems } = useCart();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.reviews}`);
        const data = await response.json();
        setReviews(data.reviews || []);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const reviewsSchema = reviews.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FloRustic",
    "url": "https://florustic.ru",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": averageRating,
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
        "url": "https://florustic.ru",
        "image": "https://cdn.poehali.dev/files/a67d7855-c81c-456d-8393-2b2ec7bfd0bd.png"
      },
      "author": {
        "@type": "Person",
        "name": review.name
      },
      "datePublished": new Date(review.created_at).toISOString().split('T')[0],
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating.toString(),
        "bestRating": "5"
      },
      "reviewBody": review.comment
    }))
  } : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Отзывы о FloRustic — Реальные мнения клиентов о доставке цветов</title>
        <meta name="description" content={`Служба доставки цветов FloRustic. Свежие цветы — доставка в течение 1.5 часов после оплаты. Отзывы: ${reviews.length} реальных мнений клиентов. Средний рейтинг ${averageRating}/5. Оценка качества букетов и сервиса!`} />
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
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin mx-auto mb-3 w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
                <p className="text-muted-foreground">Загрузка отзывов...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Пока нет отзывов. Будьте первым!</p>
              </div>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{review.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(review.created_at)} • {review.city}
                      </p>
                    </div>
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Icon key={i} name="Star" size={20} className="text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-foreground leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
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