import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '@/contexts/CartContext';
import { useCity } from '@/contexts/CityContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import API_ENDPOINTS from '@/config/api';

interface Product {
  id: number;
  name: string;
  description: string;
  composition?: string;
  price: number;
  image_url: string;
  category?: string;
}

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, totalItems } = useCart();
  const { selectedCity } = useCity();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(false);

  const cityForMeta = selectedCity || 'России';
  const defaultTitle = `Букет цветов — купить в ${cityForMeta} | FloRustic`;
  const defaultDescription = `Служба доставки цветов FloRustic в ${cityForMeta}. Свежие букеты ручной работы, доставка 1.5 часа после оплаты. Заказ онлайн 24/7!`;

  useEffect(() => {
    const fetchProduct = async (retryCount = 0) => {
      if (!id) return;
      
      setLoading(true);
      setError(false);
      
      try {
        const url = `${API_ENDPOINTS.products}?id=${id}&city=${encodeURIComponent(selectedCity)}`;
        const response = await fetch(url, { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.products && data.products.length > 0) {
          const loadedProduct = data.products[0];
          setProduct(loadedProduct);
          
          if (typeof window.ym !== 'undefined') {
            window.ym(104746725, 'ecommerce', 'detail', {
              products: [{
                id: loadedProduct.id.toString(),
                name: loadedProduct.name,
                price: loadedProduct.price,
                category: loadedProduct.category || 'Букеты'
              }]
            });
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        
        if (retryCount < 2) {
          setTimeout(() => fetchProduct(retryCount + 1), 1000);
          return;
        }
        
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, selectedCity]);

  const handleAddToCart = () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        description: product.description,
        composition: product.composition,
        price: product.price,
        image: product.image_url
      });
    }
    
    if (typeof window.ym !== 'undefined') {
      window.ym(104746725, 'reachGoal', 'buy_now');
      
      window.ym(104746725, 'ecommerce', 'add', {
        products: [{
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          quantity: quantity
        }]
      });
    }
    
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Helmet>
          <title>{defaultTitle}</title>
          <meta name="description" content={defaultDescription} />
          <link rel="canonical" href={`https://florustic.ru/product/${id}`} />
        </Helmet>
        <Header cartCount={totalItems} />
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="text-center py-12">
            <div className="animate-spin mx-auto mb-3 w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-muted-foreground">Загрузка товара...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Helmet>
          <title>{defaultTitle}</title>
          <meta name="description" content={defaultDescription} />
          <link rel="canonical" href={`https://florustic.ru/product/${id}`} />
        </Helmet>
        <Header cartCount={totalItems} />
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="text-center py-12">
            <Icon name="AlertCircle" size={64} className="mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">Товар не найден</h1>
            <p className="text-muted-foreground mb-8">
              К сожалению, товар с ID {id} не найден или временно недоступен
            </p>
            <Link to="/">
              <Button size="lg">Вернуться на главную</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const cityForMeta = selectedCity || 'России';
  const pageTitle = `${product.name} — купить в ${cityForMeta} | FloRustic`;
  const pageDescription = `Служба доставки цветов в ${cityForMeta}. ${product.name} — ${product.price}₽. Свежие цветы в ${cityForMeta}, доставка в течение 1.5 часов после оплаты. ${product.description ? product.description.slice(0, 80) : 'Букеты ручной работы'}. Заказ онлайн 24/7!`;
  const productUrl = `https://florustic.ru/product/${id}${selectedCity ? `?city=${encodeURIComponent(selectedCity)}` : ''}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image_url,
    "brand": {
      "@type": "Brand",
      "name": "FloRustic"
    },
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "RUB",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": 300,
          "currency": "RUB"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "RU"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 2,
            "unitCode": "HUR"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 1,
            "unitCode": "HUR"
          }
        }
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 1,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn"
      },
      "seller": {
        "@type": "Organization",
        "name": "FloRustic",
        "url": "https://florustic.ru"
      }
    },
    "category": product.category || "Букеты"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`${product.name}, купить ${product.name} ${selectedCity}, букет ${selectedCity}, цветы ${selectedCity}, florustic`} />
        <link rel="canonical" href={productUrl} />
        
        <meta property="og:type" content="product" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={product.image_url} />
        <meta property="og:url" content={productUrl} />
        <meta property="product:price:amount" content={product.price.toString()} />
        <meta property="product:price:currency" content="RUB" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={product.image_url} />
        
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      </Helmet>

      <Header cartCount={totalItems} />
      
      <main className="flex-1 container mx-auto px-4 py-8">

        
        <Link 
          to="/catalog" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <Icon name="ArrowLeft" size={20} />
          Назад к каталогу
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
            <img 
              src={product.image_url} 
              alt={product.name}
              loading="eager"
              fetchpriority="high"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
              {product.category && (
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm mb-4">
                  {product.category}
                </span>
              )}
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              {product.composition && (
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm font-semibold mb-1">Состав:</p>
                  <p className="text-sm text-muted-foreground">{product.composition}</p>
                </div>
              )}
            </div>

            <div className="border-t border-b py-6 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Цена в г. {selectedCity}</span>
                <span className="text-3xl font-bold">{Math.round(product.price)} ₽</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">Количество:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Icon name="Minus" size={16} />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Icon name="Plus" size={16} />
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleAddToCart}
                size="lg"
                className="w-full text-lg"
              >
                <Icon name="ShoppingCart" size={20} className="mr-2" />
                Добавить в корзину за {Math.round(product.price * quantity)} ₽
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <Icon name="Truck" size={20} className="text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Быстрая доставка</p>
                  <p className="text-muted-foreground">В течение дня</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="Shield" size={20} className="text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Гарантия свежести</p>
                  <p className="text-muted-foreground">100% качество</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Product;