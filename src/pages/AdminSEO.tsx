import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface SEOPage {
  type: string;
  slug?: string;
  id?: number;
  path?: string;
  title: string;
  description: string;
  url: string;
}

interface GenerateResult {
  success: boolean;
  message: string;
  total_pages: number;
  cities_count: number;
  products_count: number;
  static_count: number;
  pages: SEOPage[];
}

const AdminSEO = () => {
  const { totalItems } = useCart();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('https://functions.poehali.dev/b451bedf-c8cc-4b4f-9cbb-787ee21d7499', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Failed to generate SEO pages:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const downloadJSON = () => {
    if (!result) return;

    const dataStr = JSON.stringify(result.pages, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'seo-meta-tags.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Генератор SEO страниц | FloRustic Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Header cartCount={totalItems} />

      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center">
            <Icon name="Search" size={40} className="inline mr-3" />
            Генератор SEO страниц
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Создание уникальных meta-тегов для всех страниц сайта
          </p>

          <div className="bg-card rounded-lg border p-8 mb-6">
            <h2 className="text-xl font-semibold mb-4">Что делает этот инструмент?</h2>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="flex items-start gap-2">
                <Icon name="Check" size={20} className="text-primary mt-1 flex-shrink-0" />
                <span>Загружает все города и товары из базы данных</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={20} className="text-primary mt-1 flex-shrink-0" />
                <span>Генерирует уникальные title и description для каждой страницы</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={20} className="text-primary mt-1 flex-shrink-0" />
                <span>Создает правильные URL с каноническими ссылками</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={20} className="text-primary mt-1 flex-shrink-0" />
                <span>Яндекс и Google увидят правильные мета-теги при индексации</span>
              </li>
            </ul>

            <Button 
              onClick={handleGenerate} 
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading ? (
                <>
                  <div className="animate-spin mr-2 w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Генерация...
                </>
              ) : (
                <>
                  <Icon name="Sparkles" size={20} className="mr-2" />
                  Сгенерировать мета-теги
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Icon name="AlertCircle" size={24} className="text-destructive flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-destructive mb-1">Ошибка</h3>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="bg-primary/5 border border-primary rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <Icon name="CheckCircle2" size={32} className="text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-1">Успешно сгенерировано!</h3>
                  <p className="text-muted-foreground">{result.message}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-background rounded-lg p-4">
                  <div className="text-3xl font-bold text-primary mb-1">{result.total_pages}</div>
                  <div className="text-sm text-muted-foreground">Всего страниц</div>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <div className="text-3xl font-bold text-primary mb-1">{result.cities_count}</div>
                  <div className="text-sm text-muted-foreground">Городов</div>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <div className="text-3xl font-bold text-primary mb-1">{result.products_count}</div>
                  <div className="text-sm text-muted-foreground">Товаров</div>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <div className="text-3xl font-bold text-primary mb-1">{result.static_count}</div>
                  <div className="text-sm text-muted-foreground">Статичных страниц</div>
                </div>
              </div>

              <Button 
                onClick={downloadJSON}
                variant="outline"
                className="w-full"
              >
                <Icon name="Download" size={20} className="mr-2" />
                Скачать JSON с мета-тегами
              </Button>

              <div className="mt-6 p-4 bg-background rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Icon name="Info" size={18} />
                  Примеры сгенерированных тегов
                </h4>
                <div className="space-y-4 text-sm">
                  {result.pages.slice(0, 3).map((page, idx) => (
                    <div key={idx} className="border-l-2 border-primary pl-3">
                      <div className="font-mono text-xs text-muted-foreground mb-1">{page.url}</div>
                      <div className="font-semibold">{page.title}</div>
                      <div className="text-muted-foreground mt-1">{page.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminSEO;
