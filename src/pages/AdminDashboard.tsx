import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminAuth from '@/components/AdminAuth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import API_ENDPOINTS from '@/config/api';

interface Stats {
  totalOrders: number;
  newOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCities: number;
}

const AdminDashboard = () => {
  const { totalItems } = useCart();
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    newOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCities: 0
  });
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes, citiesRes] = await Promise.all([
        fetch(API_ENDPOINTS.orders),
        fetch(API_ENDPOINTS.products),
        fetch(API_ENDPOINTS.cities)
      ]);

      const orders = await ordersRes.json();
      const products = await productsRes.json();
      const citiesData = await citiesRes.json();

      const ordersArray = Array.isArray(orders) ? orders : [];
      const newOrdersCount = ordersArray.filter((o: any) => o.status === 'new').length;
      const totalRevenue = ordersArray.reduce((sum: number, o: any) => sum + parseFloat(o.total_amount || 0), 0);
      
      const productsArray = Array.isArray(products) ? products : [];
      const citiesCount = Object.values(citiesData.cities || {}).flat().length;

      setStats({
        totalOrders: ordersArray.length,
        newOrders: newOrdersCount,
        totalRevenue: Math.round(totalRevenue),
        totalProducts: productsArray.length,
        totalCities: citiesCount
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <AdminAuth>
      <div className="min-h-screen flex flex-col bg-accent/5">
        <Header cartCount={totalItems} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2">Админ-панель</h1>
                <p className="text-muted-foreground">
                  Управление интернет-магазином
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={logout}
                >
                  <Icon name="LogOut" size={18} className="mr-2" />
                  Выйти
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  <Icon name="Home" size={18} className="mr-2" />
                  На главную
                </Button>
              </div>
            </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Icon name="ShoppingBag" size={24} className="text-blue-600" />
                    </div>
                    {stats.newOrders > 0 && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        {stats.newOrders} новых
                      </span>
                    )}
                  </div>
                  <p className="text-3xl font-bold mb-1">{stats.totalOrders}</p>
                  <p className="text-muted-foreground">Всего заказов</p>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Icon name="DollarSign" size={24} className="text-green-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1">{stats.totalRevenue.toLocaleString()} ₽</p>
                  <p className="text-muted-foreground">Общая выручка</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Icon name="Package" size={24} className="text-purple-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1">{stats.totalProducts}</p>
                  <p className="text-muted-foreground">Товаров в каталоге</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Icon name="MapPin" size={24} className="text-orange-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1">{stats.totalCities}</p>
                  <p className="text-muted-foreground">Городов доставки</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <button
                  onClick={() => navigate('/admin/orders')}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 text-left"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="ShoppingCart" size={24} className="text-primary" />
                    </div>
                    <Icon name="ArrowRight" size={20} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Заказы</h3>
                  <p className="text-muted-foreground text-sm">
                    Просмотр и управление заказами клиентов
                  </p>
                </button>

                <button
                  onClick={() => navigate('/admin/products')}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 text-left"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="Package" size={24} className="text-primary" />
                    </div>
                    <Icon name="ArrowRight" size={20} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Товары</h3>
                  <p className="text-muted-foreground text-sm">
                    Добавление и редактирование товаров
                  </p>
                </button>

                <button
                  onClick={() => navigate('/admin/reviews')}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 text-left"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="MessageSquare" size={24} className="text-primary" />
                    </div>
                    <Icon name="ArrowRight" size={20} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Отзывы</h3>
                  <p className="text-muted-foreground text-sm">
                    Модерация отзывов клиентов
                  </p>
                </button>

                <button
                  onClick={() => navigate('/admin/cities')}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 text-left"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="MapPin" size={24} className="text-primary" />
                    </div>
                    <Icon name="ArrowRight" size={20} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Города</h3>
                  <p className="text-muted-foreground text-sm">
                    Управление городами доставки
                  </p>
                </button>

                <button
                  onClick={() => navigate('/admin/city-contacts')}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 text-left"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="Phone" size={24} className="text-primary" />
                    </div>
                    <Icon name="ArrowRight" size={20} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Контакты городов</h3>
                  <p className="text-muted-foreground text-sm">
                    Управление контактами для каждого города
                  </p>
                </button>

                <button
                  onClick={() => navigate('/admin/texts')}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 text-left"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="FileText" size={24} className="text-primary" />
                    </div>
                    <Icon name="ArrowRight" size={20} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Редактирование сайта</h3>
                  <p className="text-muted-foreground text-sm">
                    Изменение текстов на страницах
                  </p>
                </button>

                <button
                  onClick={() => navigate('/admin/promo-codes')}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 text-left"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="Tag" size={24} className="text-primary" />
                    </div>
                    <Icon name="ArrowRight" size={20} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Промокоды</h3>
                  <p className="text-muted-foreground text-sm">
                    Создание и управление промокодами
                  </p>
                </button>

                <button
                  onClick={() => navigate('/admin/page-contents')}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 text-left"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="FileEdit" size={24} className="text-primary" />
                    </div>
                    <Icon name="ArrowRight" size={20} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Статические страницы</h3>
                  <p className="text-muted-foreground text-sm">
                    Редактирование страниц "О нас", "Доставка", "Гарантии"
                  </p>
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
    </AdminAuth>
  );
};

export default AdminDashboard;