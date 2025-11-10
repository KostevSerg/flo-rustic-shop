import { useEffect } from 'react';
import API_ENDPOINTS from '@/config/api';

const Sitemap = () => {
  useEffect(() => {
    window.location.href = API_ENDPOINTS.sitemap;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin mx-auto mb-3 w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="text-muted-foreground">Загрузка sitemap...</p>
      </div>
    </div>
  );
};

export default Sitemap;