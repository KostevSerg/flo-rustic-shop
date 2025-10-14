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
import ProductAddForm from '@/components/admin/ProductAddForm';
import ProductEditModal from '@/components/admin/ProductEditModal';
import ProductPriceModal from '@/components/admin/ProductPriceModal';
import ProductCard from '@/components/admin/ProductCard';

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

  const handleEditClick = (product: Product) => {
    setEditProduct({
      id: product.id,
      name: product.name || '',
      description: product.description || '',
      image_url: product.image_url || '',
      base_price: product.base_price ? product.base_price.toString() : '',
      category: product.category || ''
    });
    setShowEditModal(true);
  };

  const handlePriceClick = (product: Product) => {
    setSelectedProduct(product);
    setShowPriceModal(true);
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
              <ProductAddForm
                product={newProduct}
                onSubmit={handleAddProduct}
                onChange={setNewProduct}
                onCancel={() => {
                  setShowAddForm(false);
                  setNewProduct({ name: '', description: '', image_url: '', base_price: '', category: '' });
                }}
              />
            )}

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Загрузка товаров...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={handleEditClick}
                    onSetPrice={handlePriceClick}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>
            )}

            {showEditModal && (
              <ProductEditModal
                product={editProduct}
                onSubmit={handleEditProduct}
                onChange={setEditProduct}
                onClose={() => setShowEditModal(false)}
              />
            )}

            {showPriceModal && selectedProduct && (
              <ProductPriceModal
                product={selectedProduct}
                cities={cities}
                onSetPrice={handleSetCityPrice}
                onClose={() => setShowPriceModal(false)}
              />
            )}
          </div>
        </main>
        <Footer />
      </div>
    </AdminAuth>
  );
};

export default AdminProducts;