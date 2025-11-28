import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

window.addEventListener('error', (event) => {
  if (event.filename?.includes('poehali.dev') || event.message?.includes('CORS')) {
    event.preventDefault();
    return;
  }
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('CORS') || event.reason?.message?.includes('XMLHttpRequest')) {
    event.preventDefault();
    return;
  }
  console.error('Unhandled promise rejection:', event.reason);
});

const rootElement = document.getElementById("root")!;

const loader = document.getElementById('app-loader');
if (loader) {
  loader.remove();
}

try {
  createRoot(rootElement).render(<App />);
} catch (error) {
  console.error('Failed to render app:', error);
  rootElement.innerHTML = '<div style="padding: 20px; text-align: center; font-family: system-ui, sans-serif;"><h2>Ошибка загрузки приложения</h2><p>Попробуйте обновить страницу</p><button onclick="location.reload()" style="background: #10b981; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; margin-top: 16px;">Обновить</button></div>';
}