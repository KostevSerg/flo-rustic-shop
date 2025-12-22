import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Block indexing of pages with ?generating=true parameter
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('generating')) {
  const metaRobots = document.createElement('meta');
  metaRobots.name = 'robots';
  metaRobots.content = 'noindex, nofollow';
  document.head.appendChild(metaRobots);
}

const APP_VERSION = new Date().toISOString().split('T')[0].replace(/-/g, '');
const storedVersion = localStorage.getItem('app_version');
const BUILD_TIMESTAMP = Date.now().toString();

if (storedVersion !== APP_VERSION) {
  console.log('New version detected, clearing all caches...');
  
  const cartData = localStorage.getItem('cart');
  const selectedCity = localStorage.getItem('selected-city');
  
  localStorage.clear();
  sessionStorage.clear();
  
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name));
    });
  }
  
  localStorage.setItem('app_version', APP_VERSION);
  localStorage.setItem('build_timestamp', BUILD_TIMESTAMP);
  
  if (cartData) localStorage.setItem('cart', cartData);
  if (selectedCity) localStorage.setItem('selected-city', selectedCity);
  
  console.log('Caches cleared, important data restored');
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

const loader = document.getElementById('loader');
if (loader) {
  setTimeout(() => loader.remove(), 100);
}

if (!rootElement) {
  console.error('Root element not found');
  document.body.innerHTML = '<div style="padding: 20px; text-align: center; font-family: system-ui, sans-serif;"><h2>Ошибка загрузки</h2><p>Root элемент не найден</p></div>';
} else {
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Failed to render app:', error);
    rootElement.innerHTML = '<div style="padding: 20px; text-align: center; font-family: system-ui, sans-serif;"><h2>Ошибка загрузки приложения</h2><p>Попробуйте обновить страницу</p><button onclick="location.reload()" style="background: #10b981; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; margin-top: 16px;">Обновить</button></div>';
  }
}