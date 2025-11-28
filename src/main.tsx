import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const APP_VERSION = '2.0.0';
const storedVersion = localStorage.getItem('app_version');

if (storedVersion !== APP_VERSION) {
  console.log('New version detected, clearing caches...');
  localStorage.clear();
  sessionStorage.clear();
  
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name));
    });
  }
  
  localStorage.setItem('app_version', APP_VERSION);
}

window.addEventListener('error', (event) => {
  if (event.filename?.includes('poehali.dev') || 
      event.message?.includes('CORS') ||
      event.message?.includes('XMLHttpRequest') ||
      event.message?.includes('Access to XMLHttpRequest')) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
  console.error('Global error:', event.error);
}, true);

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('CORS') || 
      event.reason?.message?.includes('XMLHttpRequest') ||
      event.reason?.message?.includes('Access to XMLHttpRequest')) {
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