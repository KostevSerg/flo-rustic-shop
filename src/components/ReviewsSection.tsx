import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useCity } from '@/contexts/CityContext';
import API_ENDPOINTS from '@/config/api';

interface Review {
  id: number;
  name: string;
  city: string;
  rating: number;
  comment: string;
  created_at: string;
}

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { selectedCity } = useCity();
  
  const [formData, setFormData] = useState({
    name: '',
    city: selectedCity || '',
    email: '',
    phone: '',
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    if (selectedCity) {
      setFormData(prev => ({ ...prev, city: selectedCity }));
    }
  }, [selectedCity]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.cities}?action=reviews`);
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.city.trim() || !formData.comment.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля: имя, город и отзыв',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_ENDPOINTS.cities}?action=reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Спасибо за отзыв!',
          description: 'Ваш отзыв отправлен на модерацию и скоро появится на сайте'
        });
        
        setFormData({
          name: '',
          city: selectedCity || '',
          email: '',
          phone: '',
          rating: 5,
          comment: ''
        });
      } else {
        throw new Error(data.error || 'Failed to submit review');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить отзыв. Попробуйте позже',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={20}
        className={i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
      />
    ));
  };

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Отзывы наших клиентов</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Мы ценим мнение каждого клиента и стремимся делать наш сервис лучше
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <h3 className="text-2xl font-semibold mb-6">Что говорят о нас</h3>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-card rounded-xl p-6 animate-pulse">
                    <div className="h-4 bg-muted rounded w-1/3 mb-3"></div>
                    <div className="h-3 bg-muted rounded w-full mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl">
                <Icon name="MessageSquare" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Пока нет отзывов. Станьте первым!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {reviews.map(review => (
                  <div key={review.id} className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{review.name}</h4>
                        <p className="text-sm text-muted-foreground">{review.city}</p>
                      </div>
                      <div className="flex gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed">{review.comment}</p>
                    <p className="text-xs text-muted-foreground mt-3">
                      {new Date(review.created_at).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-6">Оставить отзыв</h3>
            <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Имя <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ваше имя"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Город доставки <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Город"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email (необязательно)
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Телефон (необязательно)
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+7 995 215-10-96"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Оценка <span className="text-destructive">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="transition-transform hover:scale-110"
                    >
                      <Icon
                        name="Star"
                        size={32}
                        className={
                          star <= formData.rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Отзыв <span className="text-destructive">*</span>
                </label>
                <Textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Расскажите о вашем опыте..."
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <div className="animate-spin mr-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                    Отправка...
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={18} className="mr-2" />
                    Отправить отзыв
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Отзыв будет опубликован после проверки модератором
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;