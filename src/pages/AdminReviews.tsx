import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import API_ENDPOINTS from '@/config/api';

interface Review {
  id: number;
  name: string;
  city: string;
  email?: string;
  phone?: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

const AdminReviews = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdminAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    fetchReviews();
  }, [isAuthenticated, navigate]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.cities}?action=reviews&all=true`);
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить отзывы',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.cities}?action=reviews`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: reviewId,
          is_approved: !currentStatus
        })
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: currentStatus ? 'Отзыв снят с публикации' : 'Отзыв одобрен и опубликован'
        });
        fetchReviews();
      } else {
        throw new Error('Failed to update review');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус отзыва',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.cities}?action=reviews&id=${reviewId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Отзыв удален'
        });
        fetchReviews();
      } else {
        throw new Error('Failed to delete review');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить отзыв',
        variant: 'destructive'
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={18}
        className={i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
      />
    ));
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'pending') return !review.is_approved;
    if (filter === 'approved') return review.is_approved;
    return true;
  });

  const pendingCount = reviews.filter(r => !r.is_approved).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/admin')}>
                <Icon name="ArrowLeft" size={20} className="mr-2" />
                Назад
              </Button>
              <h1 className="text-2xl font-bold">Модерация отзывов</h1>
              {pendingCount > 0 && (
                <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full">
                  {pendingCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
          >
            На модерации {pendingCount > 0 && `(${pendingCount})`}
          </Button>
          <Button
            variant={filter === 'approved' ? 'default' : 'outline'}
            onClick={() => setFilter('approved')}
          >
            Опубликованные
          </Button>
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            Все
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin mx-auto mb-3 w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-muted-foreground">Загрузка отзывов...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl">
            <Icon name="MessageSquare" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {filter === 'pending' ? 'Нет отзывов на модерации' : 'Отзывы не найдены'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredReviews.map(review => (
              <div
                key={review.id}
                className={`bg-card rounded-xl p-6 shadow-sm border-2 ${
                  review.is_approved ? 'border-green-500/20' : 'border-yellow-500/20'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{review.name}</h3>
                      <div className="flex gap-1">
                        {renderStars(review.rating)}
                      </div>
                      {review.is_approved ? (
                        <span className="bg-green-500/10 text-green-600 text-xs font-medium px-2 py-1 rounded">
                          Опубликован
                        </span>
                      ) : (
                        <span className="bg-yellow-500/10 text-yellow-600 text-xs font-medium px-2 py-1 rounded">
                          На модерации
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Icon name="MapPin" size={14} />
                        <span>{review.city}</span>
                      </div>
                      {review.email && (
                        <div className="flex items-center gap-1">
                          <Icon name="Mail" size={14} />
                          <span>{review.email}</span>
                        </div>
                      )}
                      {review.phone && (
                        <div className="flex items-center gap-1">
                          <Icon name="Phone" size={14} />
                          <span>{review.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Icon name="Calendar" size={14} />
                        <span>
                          {new Date(review.created_at).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-4 bg-muted/30 p-4 rounded-lg">
                  {review.comment}
                </p>

                <div className="flex gap-2">
                  <Button
                    variant={review.is_approved ? 'outline' : 'default'}
                    onClick={() => handleApprove(review.id, review.is_approved)}
                  >
                    <Icon
                      name={review.is_approved ? 'EyeOff' : 'Check'}
                      size={16}
                      className="mr-2"
                    />
                    {review.is_approved ? 'Снять с публикации' : 'Одобрить'}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(review.id)}
                  >
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Удалить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;