import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminAuth from '@/components/AdminAuth';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';
import ProductFormAdd from '@/components/admin/ProductFormAdd';
import ProductFormEdit from '@/components/admin/ProductFormEdit';
import ProductCardItem from '@/components/admin/ProductCardItem';
import CityPriceModal from '@/components/admin/CityPriceModal';
import { useProductsData } from '@/hooks/useProductsData';
import { useProductOperations } from '@/hooks/useProductOperations';
import { useProductToggles } from '@/hooks/useProductToggles';
import { useCityPrice } from '@/hooks/useCityPrice';

interface Product {
  id: number;
  name: string;
  description: string;
  composition?: string;
  image_url: string;
  base_price: number;
  category: string;
  categories?: string[];
  is_featured?: boolean;
  is_active?: boolean;
  subcategory_id?: number | null;
  subcategory_name?: string;
  subcategories?: Array<{subcategory_id: number; name: string; category: string}>;
}

const AdminProducts = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const { products, cities, loading, loadProducts, clearProductsCache } = useProductsData();
  const { handleAddProduct, handleUpdateProduct, handleDeleteProduct } = useProductOperations(loadProducts);
  const { handleToggleFeatured, handleToggleActive, handleToggleGift, handleToggleRecommended } = useProductToggles(loadProducts, clearProductsCache);
  const { handleSetCityPrice } = useCityPrice();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    composition: '',
    image_url: '',
    base_price: '',
    category: 'Цветы',
    categories: ['Цветы'] as string[],
    subcategory_id: null as number | null,
    subcategory_ids: [] as number[]
  });

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortOrder) return 0;
    return sortOrder === 'asc' ? a.base_price - b.base_price : b.base_price - a.base_price;
  });

  const onAddProductSuccess = () => {
    setNewProduct({ name: '', description: '', composition: '', image_url: '', base_price: '', category: 'Цветы', categories: ['Цветы'], subcategory_id: null, subcategory_ids: [] });
    setShowAddForm(false);
  };

  const onUpdateProductSuccess = () => {
    setEditingProduct(null);
  };

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
              <ProductFormAdd
                newProduct={newProduct}
                setNewProduct={setNewProduct}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddProduct(newProduct, onAddProductSuccess);
                }}
                onCancel={() => {
                  setShowAddForm(false);
                  setNewProduct({ name: '', description: '', composition: '', image_url: '', base_price: '', category: 'Цветы', categories: ['Цветы'], subcategory_id: null, subcategory_ids: [] });
                }}
              />
            )}

            <div className="flex gap-2 mb-6">
              <Button
                variant={sortOrder === 'asc' ? 'default' : 'outline'}
                onClick={() => setSortOrder(sortOrder === 'asc' ? null : 'asc')}
                className="flex items-center gap-2"
              >
                <Icon name="ArrowUpNarrowWide" size={16} />
                По возрастанию цены
              </Button>
              <Button
                variant={sortOrder === 'desc' ? 'default' : 'outline'}
                onClick={() => setSortOrder(sortOrder === 'desc' ? null : 'desc')}
                className="flex items-center gap-2"
              >
                <Icon name="ArrowDownWideNarrow" size={16} />
                По убыванию цены
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Загрузка товаров...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCardItem
                    key={product.id}
                    product={product}
                    onEdit={setEditingProduct}
                    onSetPrice={(product) => {
                      setSelectedProduct(product);
                      setShowPriceModal(true);
                    }}
                    onDelete={handleDeleteProduct}
                    onToggleFeatured={handleToggleFeatured}
                    onToggleActive={handleToggleActive}
                    onToggleGift={handleToggleGift}
                    onToggleRecommended={handleToggleRecommended}
                  />
                ))}
              </div>
            )}

            {editingProduct && (
              <ProductFormEdit
                editingProduct={editingProduct}
                setEditingProduct={setEditingProduct}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateProduct(editingProduct, onUpdateProductSuccess);
                }}
                onCancel={() => setEditingProduct(null)}
              />
            )}

            {showPriceModal && selectedProduct && (
              <CityPriceModal
                selectedProduct={selectedProduct}
                cities={cities}
                onClose={() => setShowPriceModal(false)}
                onSetPrice={(cityId, cityName, price) => 
                  handleSetCityPrice(selectedProduct, cityId, cityName, price)
                }
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
