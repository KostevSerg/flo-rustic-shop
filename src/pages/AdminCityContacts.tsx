import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminAuth from '@/components/AdminAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface CityContact {
  id: number;
  city_id: number;
  city_name: string;
  phone: string;
  email: string;
  address: string;
  working_hours: string;
  delivery_info: string;
}

const AdminCityContacts = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdminAuth();
  const { totalItems } = useCart();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<CityContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<CityContact>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchContacts();
    }
  }, [isAuthenticated]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/3f4d37f0-b84f-4157-83b7-55bdb568e459?action=contacts');
      const data = await response.json();
      setContacts(data.contacts || []);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить контакты',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (contact: CityContact) => {
    setEditingId(contact.id);
    setEditForm(contact);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editForm.city_id) return;

    setSaving(true);
    try {
      const response = await fetch('https://functions.poehali.dev/3f4d37f0-b84f-4157-83b7-55bdb568e459?action=contacts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          city_id: editForm.city_id,
          phone: editForm.phone || '',
          email: editForm.email || '',
          address: editForm.address || '',
          working_hours: editForm.working_hours || '',
          delivery_info: editForm.delivery_info || ''
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setContacts(prevContacts => 
          prevContacts.map(c => c.city_id === editForm.city_id ? { ...c, ...editForm } as CityContact : c)
        );
        setEditingId(null);
        setEditForm({});
        toast({
          title: 'Успешно',
          description: 'Контакты обновлены'
        });
      } else {
        throw new Error(data.error || 'Update failed');
      }
    } catch (error) {
      console.error('Failed to update contact:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить контакты',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
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
              <h1 className="text-3xl font-bold">Контакты городов</h1>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin mx-auto mb-3 w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
              <p className="text-muted-foreground">Загрузка контактов...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contacts.map(contact => (
                <div key={contact.id} className="bg-card rounded-lg border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-semibold flex items-center">
                      <Icon name="MapPin" size={24} className="mr-2 text-primary" />
                      {contact.city_name}
                    </h2>
                    {editingId === contact.id ? (
                      <div className="flex space-x-2">
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
                          onClick={saveEdit}
                          disabled={saving}
                        >
                          {saving ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(contact)}
                      >
                        <Icon name="Pencil" size={16} className="mr-2" />
                        Редактировать
                      </Button>
                    )}
                  </div>

                  {editingId === contact.id ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Телефон</label>
                        <input
                          type="text"
                          value={editForm.phone || ''}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-full p-2 border rounded-md"
                          placeholder="+7 (999) 123-45-67"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                          type="email"
                          value={editForm.email || ''}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full p-2 border rounded-md"
                          placeholder="info@florustic.ru"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Адрес</label>
                        <input
                          type="text"
                          value={editForm.address || ''}
                          onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                          className="w-full p-2 border rounded-md"
                          placeholder="г. Москва, ул. Цветочная, 15"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Часы работы</label>
                        <input
                          type="text"
                          value={editForm.working_hours || ''}
                          onChange={(e) => setEditForm({ ...editForm, working_hours: e.target.value })}
                          className="w-full p-2 border rounded-md"
                          placeholder="Круглосуточно"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Информация о доставке</label>
                        <textarea
                          value={editForm.delivery_info || ''}
                          onChange={(e) => setEditForm({ ...editForm, delivery_info: e.target.value })}
                          className="w-full p-2 border rounded-md min-h-[80px]"
                          placeholder="Бесплатная доставка в пределах центра"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-muted-foreground">Телефон:</span>
                        <p className="mt-1">{contact.phone || '—'}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-muted-foreground">Email:</span>
                        <p className="mt-1">{contact.email || '—'}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-muted-foreground">Адрес:</span>
                        <p className="mt-1">{contact.address || '—'}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-muted-foreground">Часы работы:</span>
                        <p className="mt-1">{contact.working_hours || '—'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-semibold text-muted-foreground">Информация о доставке:</span>
                        <p className="mt-1">{contact.delivery_info || '—'}</p>
                      </div>
                    </div>
                  )}
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

export default AdminCityContacts;
