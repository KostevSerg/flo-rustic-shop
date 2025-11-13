import { useEffect, useState } from 'react';

const SITEMAP_BACKEND_URL = 'https://functions.poehali.dev/58b61451-ee69-439e-b94c-195335bd5057';

export default function UpdateSitemapPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [urlCount, setUrlCount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const updateSitemap = async () => {
      try {
        setStatus('loading');
        
        const response = await fetch(SITEMAP_BACKEND_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const xmlContent = await response.text();
        const count = (xmlContent.match(/<url>/g) || []).length;
        setUrlCount(count);
        
        const blob = new Blob([xmlContent], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        setStatus('success');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
        setStatus('error');
      }
    };
    
    updateSitemap();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '48px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        textAlign: 'center'
      }}>
        {status === 'loading' && (
          <>
            <div style={{
              width: '64px',
              height: '64px',
              border: '4px solid #f3f4f6',
              borderTop: '4px solid #667eea',
              borderRadius: '50%',
              margin: '0 auto 24px',
              animation: 'spin 1s linear infinite'
            }} />
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', color: '#1f2937' }}>
              Загрузка sitemap
            </h1>
            <p style={{ color: '#6b7280' }}>
              Получаю актуальный список всех страниц...
            </p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div style={{
              width: '64px',
              height: '64px',
              background: '#10b981',
              borderRadius: '50%',
              margin: '0 auto 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px'
            }}>
              ✓
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', color: '#1f2937' }}>
              Sitemap скачан!
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              Всего страниц: <strong>{urlCount}</strong>
            </p>
            <div style={{
              background: '#f3f4f6',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#4b5563',
              textAlign: 'left'
            }}>
              <p style={{ marginBottom: '8px' }}>
                📁 Файл <code>sitemap.xml</code> скачан в папку загрузок
              </p>
              <p>
                📤 Замените файл <code>public/sitemap.xml</code> в проекте на скачанный
              </p>
            </div>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div style={{
              width: '64px',
              height: '64px',
              background: '#ef4444',
              borderRadius: '50%',
              margin: '0 auto 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px'
            }}>
              ✕
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', color: '#1f2937' }}>
              Ошибка
            </h1>
            <p style={{ color: '#ef4444', marginBottom: '16px' }}>
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#667eea',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Попробовать снова
            </button>
          </>
        )}
        
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
