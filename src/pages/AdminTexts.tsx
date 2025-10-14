import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminAuth from '@/components/AdminAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useSiteTexts } from '@/contexts/SiteTextsContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import API_ENDPOINTS from '@/config/api';

interface SiteText {
  id: number;
  page: string;
  key: string;
  value: string;
  description: string;
}

const AdminTexts = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdminAuth();
  const { totalItems } = useCart();
  const { toast } = useToast();
  const { refreshTexts } = useSiteTexts();
  const [texts, setTexts] = useState<SiteText[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTexts();
    }
  }, [isAuthenticated]);

  const fetchTexts = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.siteTexts);
      const data = await response.json();
      setTexts(data.texts || []);
    } catch (error) {
      console.error('Failed to fetch texts:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить тексты',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (text: SiteText) => {
    setEditingId(text.id);
    setEditValue(text.value);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const saveEdit = async (id: number) => {
    setSaving(true);
    try {
      const response = await fetch(API_ENDPOINTS.siteTexts, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          value: editValue
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTexts(prevTexts => 
          prevTexts.map(t => t.id === id ? { ...t, value: editValue } : t)
        );
        setEditingId(null);
        setEditValue('');
        await refreshTexts();
        toast({
          title: 'Успешно',
          description: 'Текст обновлён'
        });
      } else {
        throw new Error(data.error || 'Update failed');
      }
    } catch (error) {
      console.error('Failed to update text:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить текст',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const groupedTexts = texts.reduce((acc, text) => {
    if (!acc[text.page]) {
      acc[text.page] = [];
    }
    acc[text.page].push(text);
    return acc;
  }, {} as Record<string, SiteText[]>);

  const pageNames: Record<string, string> = {
    'home': 'Главная страница',
    'catalog': 'Каталог',
    'footer': 'Футер',
    'contacts': 'Контакты'
  };

  return (
    <AdminAuth>
      <div className="min-h-screen flex flex-col bg-background">
        <Header cartCount={totalItems} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin')}
                className="flex items-center"
              >
                <Icon name="ArrowLeft" size={20} className="mr-2" />
                Назад
              </Button>
              <h1 className="text-3xl font-bold">Редактирование текстов сайта</h1>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin mx-auto mb-3 w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
              <p className="text-muted-foreground">Загрузка текстов...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedTexts).map(([page, pageTexts]) => (
                <div key={page} className="bg-card rounded-lg border p-6">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <Icon name="FileText" size={24} className="mr-2 text-primary" />
                    {pageNames[page] || page}
                  </h2>
                  <div className="space-y-4">
                    {pageTexts.map(text => (
                      <div key={text.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                              {text.description || text.key}
                            </h3>
                            {editingId === text.id ? (
                              <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-full min-h-[100px] p-3 border rounded-md resize-y"
                                autoFocus
                              />
                            ) : (
                              <p className="text-foreground whitespace-pre-wrap">
                                {text.value}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-3">
                          {editingId === text.id ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={cancelEdit}
                                disabled={saving}
                              >
                                Отмена
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => saveEdit(text.id)}
                                disabled={saving}
                              >
                                {saving ? 'Сохранение...' : 'Сохранить'}
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEdit(text)}
                            >
                              <Icon name="Pencil" size={16} className="mr-2" />
                              Редактировать
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </AdminAuth>
  );
};

export default AdminTexts;