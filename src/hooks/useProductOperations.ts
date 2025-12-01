import { useToast } from '@/hooks/use-toast';
import API_ENDPOINTS from '@/config/api';
import { submitProductToIndexNow } from '@/utils/indexnow';

interface Product {
  id: number;
  name: string;
  description: string;
  composition?: string;
  image_url: string;
  base_price: number;
  category: string;
  categories?: string[];
  subcategory_id?: number | null;
  subcategory_ids?: number[];
}

interface NewProductData {
  name: string;
  description: string;
  composition: string;
  image_url: string;
  base_price: string;
  category: string;
  categories: string[];
  subcategory_id: number | null;
  subcategory_ids: number[];
}

export const useProductOperations = (loadProducts: () => void) => {
  const { toast } = useToast();

  const handleAddProduct = async (newProduct: NewProductData, onSuccess: () => void) => {
    if (!newProduct.name || !newProduct.base_price) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    try {
      const payload = {
        action: 'create',
        ...newProduct,
        base_price: parseInt(newProduct.base_price)
      };
      console.log('Creating product with payload:', payload);
      
      const response = await fetch(API_ENDPOINTS.products, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to add product');

      const result = await response.json();
      const productId = result.product_id;

      toast({
        title: 'Успешно',
        description: `Товар "${newProduct.name}" добавлен`
      });

      if (productId) {
        submitProductToIndexNow(productId).then(indexResult => {
          if (indexResult.success) {
            toast({
              title: '🚀 IndexNow',
              description: 'Товар отправлен в поисковики (Bing, Yandex)',
              duration: 3000
            });
          }
        }).catch(err => console.error('IndexNow error:', err));
      }

      onSuccess();
      loadProducts();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить товар',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateProduct = async (editingProduct: Product, onSuccess: () => void) => {
    if (!editingProduct.base_price || editingProduct.base_price <= 0) {
      toast({
        title: 'Ошибка',
        description: 'Укажите корректную базовую цену',
        variant: 'destructive'
      });
      return;
    }

    try {
      const payload = {
        id: editingProduct.id,
        name: editingProduct.name,
        description: editingProduct.description,
        composition: editingProduct.composition,
        image_url: editingProduct.image_url,
        base_price: Number(editingProduct.base_price),
        category: editingProduct.category,
        categories: editingProduct.categories,
        subcategory_id: editingProduct.subcategory_id,
        subcategory_ids: editingProduct.subcategory_ids
      };
      console.log('Updating product with payload:', payload);
      
      const response = await fetch(API_ENDPOINTS.products, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to update product');

      toast({
        title: 'Успешно',
        description: `Товар "${editingProduct.name}" обновлен`
      });

      submitProductToIndexNow(editingProduct.id).then(indexResult => {
        if (indexResult.success) {
          toast({
            title: '🚀 IndexNow',
            description: 'Изменения отправлены в поисковики',
            duration: 3000
          });
        }
      }).catch(err => console.error('IndexNow error:', err));

      onSuccess();
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

  return {
    handleAddProduct,
    handleUpdateProduct,
    handleDeleteProduct
  };
};
