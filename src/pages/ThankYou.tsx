import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageSEO from '@/components/PageSEO';
import Icon from '@/components/ui/icon';

const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Проверяем, есть ли флаг успешного заказа
    const orderPlaced = sessionStorage.getItem('orderPlaced');
    
    if (!orderPlaced) {
      // Если флага нет - редиректим на главную
      navigate('/', { replace: true });
      return;
    }
    
    // Удаляем флаг, чтобы при повторном заходе редиректило
    sessionStorage.removeItem('orderPlaced');
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageSEO
        title="Спасибо за заказ — FloRustic"
        noindex={true}
      />
        <Header />
        
        <main className="flex-grow flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Icon name="Check" className="w-10 h-10 text-primary" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Спасибо за заказ!
            </h1>
            
            <p className="text-muted-foreground text-lg">
              Мы свяжемся с вами в ближайшее время для подтверждения заказа
            </p>
            
            <div className="pt-8">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Icon name="Home" size={20} />
                Вернуться на главную
              </Link>
            </div>
          </div>
        </main>
        
        <Footer />
    </div>
  );
};

export default ThankYou;