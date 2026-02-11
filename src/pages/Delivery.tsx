import { useCart } from '@/contexts/CartContext';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageSEO from '@/components/PageSEO';
import API_ENDPOINTS from '@/config/api';
import { useCitySEO } from '@/hooks/useCitySEO';

const Delivery = () => {
  const { totalItems } = useCart();
  const [content, setContent] = useState({ 
    title: 'Доставка', 
    htmlContent: '',
    metaDescription: 'Служба доставки цветов FloRustic по России. Свежие цветы — доставка в течение 1.5 часов после оплаты. Работаем 24/7 без выходных. Контроль качества. Фото букета перед доставкой!',
    metaKeywords: 'доставка цветов, условия доставки, доставка букетов'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.pageContents}?page_key=delivery`);
        const data = await response.json();
        setContent({
          title: data.title || 'Доставка',
          htmlContent: data.content || '',
          metaDescription: data.meta_description || 'Служба доставки цветов FloRustic по России. Свежие цветы — доставка в течение 1.5 часов после оплаты. Работаем 24/7 без выходных. Контроль качества. Фото букета перед доставкой!',
          metaKeywords: data.meta_keywords || 'доставка цветов, условия доставки, доставка букетов'
        });
      } catch (error) {
        console.error('Failed to load page content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const { title: pageTitle, description: pageDescription } = useCitySEO(
    content.title,
    content.metaDescription
  );

  const canonicalUrl = 'https://florustic.ru/delivery';

  return (
    <div className="min-h-screen flex flex-col">
      <PageSEO
        title={pageTitle}
        description={pageDescription}
        canonical={canonicalUrl}
      />
      <Header cartCount={totalItems} />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">

          
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {content.title}
          </h1>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin mx-auto mb-3 w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
              <p className="text-muted-foreground">Загрузка...</p>
            </div>
          ) : (
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content.htmlContent }}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Delivery;