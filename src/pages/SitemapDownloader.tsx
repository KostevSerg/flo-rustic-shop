import { useState } from 'react';

export default function SitemapDownloader() {
  const [xml, setXml] = useState('');
  const [loading, setLoading] = useState(false);
  const [urlCount, setUrlCount] = useState(0);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/2acdad81-deba-4cdd-8cd1-feb9e24f4226');
      const xmlContent = await response.text();
      const count = (xmlContent.match(/<url>/g) || []).length;
      setXml(xmlContent);
      setUrlCount(count);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert('Не удалось загрузить sitemap');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(xml);
    alert('XML скопирован в буфер обмена!');
  };

  const handleDownload = () => {
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui' }}>
      <h1 style={{ marginBottom: '20px' }}>Загрузка Sitemap</h1>
      
      {!xml && (
        <button
          onClick={handleFetch}
          disabled={loading}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'wait' : 'pointer'
          }}
        >
          {loading ? 'Загрузка...' : 'Загрузить Sitemap'}
        </button>
      )}

      {xml && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <strong>Загружено {urlCount} страниц</strong>
            <br />
            <button onClick={handleCopy} style={{ marginRight: '10px', marginTop: '10px', padding: '8px 16px' }}>
              📋 Копировать XML
            </button>
            <button onClick={handleDownload} style={{ padding: '8px 16px' }}>
              💾 Скачать файл
            </button>
          </div>

          <textarea
            value={xml}
            readOnly
            style={{
              width: '100%',
              height: '500px',
              fontFamily: 'monospace',
              fontSize: '12px',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />

          <div style={{ marginTop: '20px', padding: '15px', background: '#f0f9ff', borderRadius: '8px' }}>
            <strong>Что дальше:</strong>
            <ol style={{ marginTop: '10px' }}>
              <li>Нажмите "Скачать файл" выше</li>
              <li>Скажите Юре: "Юра, вот содержимое для public/sitemap.xml:" и вставьте XML</li>
              <li>Либо сохраните файл и загрузите через GitHub</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
