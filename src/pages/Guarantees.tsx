import { useCart } from '@/contexts/CartContext';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreadcrumbsNav from '@/components/BreadcrumbsNav';
import API_ENDPOINTS from '@/config/api';

const Guarantees = () => {
  const { totalItems } = useCart();
  const [content, setContent] = useState({ 
    title: 'Гарантии', 
    htmlContent: '',
    metaDescription: 'Гарантии качества цветов и доставки FloRustic. Свежие букеты и профессиональный сервис.',
    metaKeywords: 'гарантии качества, свежие цветы, доставка цветов'
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
          metaDescription: data.meta_description || 'Гарантии качества цветов и доставки FloRustic. Свежие букеты и профессиональный сервис.',
          metaKeywords: data.meta_keywords || 'гарантии качества, свежие цветы, доставка цветов'
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
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Какие гарантии качества цветов?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Мы гарантируем свежесть всех цветов. Если вы получили несвежие цветы, мы заменим букет бесплатно или вернём деньги."
                }
              },
              {
                "@type": "Question",
                "name": "Что делать, если букет не понравился?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Свяжитесь с нами в течение 24 часов после получения. Мы заменим букет или вернём деньги."
                }
              },
              {
                "@type": "Question",
                "name": "Гарантируете ли вы доставку вовремя?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Да, мы гарантируем доставку в указанное время. При опоздании более чем на 1 час доставка будет бесплатной."
                }
              }
            ]
          })}
        </script>
      </Helmet>
      
      <Header cartCount={totalItems} />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <BreadcrumbsNav items={[{ name: 'Гарантии' }]} />
          
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