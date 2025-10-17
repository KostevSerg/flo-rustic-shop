import { useCart } from '@/contexts/CartContext';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import API_ENDPOINTS from '@/config/api';

const Guarantees = () => {
  const { totalItems } = useCart();
  const [content, setContent] = useState({ 
    title: 'Гарантии', 
    htmlContent: '',
    metaDescription: 'Гарантии качества цветов и доставки. Свежесть букетов минимум 7 дней, возврат денег.',
    metaKeywords: 'гарантии качества, гарантия свежести цветов, возврат денег'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.pageContents}?page_key=guarantees`);
        const data = await response.json();
        setContent({
          title: data.title || 'Гарантии',
          htmlContent: data.content || '',
          metaDescription: data.meta_description || 'Гарантии качества цветов и доставки. Свежесть букетов минимум 7 дней, возврат денег.',
          metaKeywords: data.meta_keywords || 'гарантии качества, гарантия свежести цветов, возврат денег'
        });
      } catch (error) {
        console.error('Failed to load page content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const pageTitle = `${content.title} — FloRustic | Гарантии качества`;
  const pageDescription = content.metaDescription;

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={content.metaKeywords} />
        <link rel="canonical" href="https://florustic.ru/guarantees" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content="https://florustic.ru/guarantees" />
      </Helmet>
      
      <Header cartCount={totalItems} />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
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

export default Guarantees;
