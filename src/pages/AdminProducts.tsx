import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminAuth from '@/components/AdminAuth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';
import API_ENDPOINTS from '@/config/api';

interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string;
  base_price: number;
  category: string;
}

interface City {
  id: number;
  name: string;
  region: string;
}

const AdminProducts = () => {
  const { totalItems } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [cities, setCities] = useState<Record<string, City[]>>({});
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    image_url: '',
    base_price: '',
    category: ''
  });
  const [editProduct, setEditProduct] = useState({
    id: 0,
    name: '',
    description: '',
    image_url: '',
    base_price: '',
    category: ''
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.products);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить товары',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCities = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.cities);
      const data = await response.json();
      setCities(data.cities || {});
    } catch (error) {
      console.error('Failed to load cities:', error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProduct.name || !newProduct.base_price) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.products, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          ...newProduct,
          base_price: parseInt(newProduct.base_price)
        })
      });

      if (!response.ok) throw new Error('Failed to add product');

      toast({
        title: 'Успешно',
        description: `Товар "${newProduct.name}" добавлен`
      });

      setNewProduct({ name: '', description: '', image_url: '', base_price: '', category: '' });
      setShowAddForm(false);
      loadProducts();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить товар',
        variant: 'destructive'
      });
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editProduct.name || !editProduct.base_price) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.products, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editProduct.id,
          name: editProduct.name,
          description: editProduct.description,
          image_url: editProduct.image_url,
          base_price: parseInt(editProduct.base_price),
          category: editProduct.category
        })
      });

      if (!response.ok) throw new Error('Failed to update product');

      toast({
        title: 'Успешно',
        description: `Товар "${editProduct.name}" обновлён`
      });

      setShowEditModal(false);
      loadProducts();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить товар',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteProduct = async (productId: number, productName: string) => {
    if (!confirm(`Удалить товар "${productName}"?`)) return;

    try {
      const response = await fetch(API_ENDPOINTS.products, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId })
      });

      if (!response.ok) throw new Error('Failed to delete product');

      toast({
        title: 'Успешно',
        description: `Товар "${productName}" удален`
      });

      loadProducts();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить товар',
        variant: 'destructive'
      });
    }
  };

  const handleSetCityPrice = async (cityId: number, cityName: string, price: string) => {
    if (!selectedProduct || !price) return;

    try {
      const response = await fetch(API_ENDPOINTS.products, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_city_price',
          product_id: selectedProduct.id,
          city_id: cityId,
          price: parseInt(price)
        })
      });

      if (!response.ok) throw new Error('Failed to set price');

      toast({
        title: 'Успешно',
        description: `Цена для города ${cityName} установлена: ${price} ₽`
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось установить цену',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    loadProducts();
    loadCities();
  }, []);

  return (
    <AdminAuth>
      <div className="min-h-screen flex flex-col">
        <Header cartCount={totalItems} />
        <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Управление товарами</h1>
              <p className="text-muted-foreground">
                Добавляйте товары и настраивайте цены для разных городов
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate('/admin')}>
                <Icon name="LayoutDashboard" size={18} className="mr-2" />
                Админ-панель
              </Button>
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить товар
              </Button>
            </div>
          </div>

          {showAddForm && (
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Добавить новый товар</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Название товара <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder='Например: Букет "Нежность"'
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Базовая цена <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="number"
                      value={newProduct.base_price}
                      onChange={(e) => setNewProduct({ ...newProduct, base_price: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="3500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Категория <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Выберите категорию</option>
                      <option value="Цветы">Цветы</option>
                      <option value="Шары">Шары</option>
                      <option value="Подарки">Подарки</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">URL изображения</label>
                    <input
                      type="url"
                      value={newProduct.image_url}
                      onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Описание</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                      placeholder="Описание букета..."
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="submit">
                    <Icon name="Save" size={18} className="mr-2" />
                    Сохранить
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewProduct({ name: '', description: '', image_url: '', base_price: '', category: '' });
                    }}
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Загрузка товаров...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-card border border-border rounded-lg overflow-hidden">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold">{product.base_price} ₽</span>
                      {product.category && (
                        <span className="text-xs bg-accent px-2 py-1 rounded">
                          {product.category}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditProduct({
                            id: product.id,
                            name: product.name,
                            description: product.description,
                            image_url: product.image_url,
                            base_price: product.base_price.toString(),
                            category: product.category
                          });
                          setShowEditModal(true);
                        }}
                      >
                        <Icon name="Pencil" size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowPriceModal(true);
                        }}
                      >
                        <Icon name="DollarSign" size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showEditModal && (
            <>
              <div
                className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
                onClick={() => setShowEditModal(false)}
              />
              <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90vw] max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Редактировать товар</h3>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="hover:bg-accent/50 rounded-lg p-2 transition-colors"
                    >
                      <Icon name="X" size={24} />
                    </button>
                  </div>
                </div>
                <form onSubmit={handleEditProduct} className="p-6 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Название товара <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        value={editProduct.name}
                        onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Базовая цена <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="number"
                          value={editProduct.base_price}
                          onChange={(e) => setEditProduct({ ...editProduct, base_price: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Категория <span className="text-destructive">*</span>
                        </label>
                        <select
                          value={editProduct.category}
                          onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        >
                          <option value="">Выберите категорию</option>
                          <option value="Цветы">Цветы</option>
                          <option value="Шары">Шары</option>
                          <option value="Подарки">Подарки</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">URL изображения</label>
                      <input
                        type="url"
                        value={editProduct.image_url}
                        onChange={(e) => setEditProduct({ ...editProduct, image_url: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Описание</label>
                      <textarea
                        value={editProduct.description}
                        onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button type="submit">
                      <Icon name="Save" size={18} className="mr-2" />
                      Сохранить изменения
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowEditModal(false)}
                    >
                      Отмена
                    </Button>
                  </div>
                </form>
              </div>
            </>
          )}

          {showPriceModal && selectedProduct && (
            <>
              <div
                className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
                onClick={() => setShowPriceModal(false)}
              />
              <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90vw] max-w-3xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Цены для "{selectedProduct.name}"</h3>
                    <button
                      onClick={() => setShowPriceModal(false)}
                      className="hover:bg-accent/50 rounded-lg p-2 transition-colors"
                    >
                      <Icon name="X" size={24} />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Базовая цена: {selectedProduct.base_price} ₽
                  </p>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  {Object.entries(cities).map(([region, regionCities]) => (
                    <div key={region} className="mb-6 last:mb-0">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Icon name="MapPin" size={18} className="mr-2 text-primary" />
                        {region}
                      </h4>
                      <div className="space-y-2">
                        {regionCities.map((city) => (
                          <div key={city.id} className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
                            <span className="flex-1">{city.name}</span>
                            <input
                              type="number"
                              placeholder={`${selectedProduct.base_price}`}
                              className="w-32 px-3 py-1 rounded border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                              onBlur={(e) => {
                                if (e.target.value) {
                                  handleSetCityPrice(city.id, city.name, e.target.value);
                                }
                              }}
                            />
                            <span className="text-muted-foreground">₽</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
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

export default AdminProducts;