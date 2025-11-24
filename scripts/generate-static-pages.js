// Скрипт для генерации статичных HTML-файлов с правильными meta-тегами
// Запускается после билда: node scripts/generate-static-pages.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '..', 'dist');
const BASE_HTML_PATH = path.join(DIST_DIR, 'index.html');

// Окончания городов для предложного падежа
const CITY_ENDINGS = {
  'Москва': 'Москве', 'Санкт-Петербург': 'Санкт-Петербурге',
  'Новосибирск': 'Новосибирске', 'Екатеринбург': 'Екатеринбурге',
  'Казань': 'Казани', 'Волгоград': 'Волгограде', 'Бийск': 'Бийске',
  'Барнаул': 'Барнауле', 'Воронеж': 'Воронеже', 'Красноярск': 'Красноярске',
  'Нижний Новгород': 'Нижнем Новгороде', 'Челябинск': 'Челябинске',
  'Самара': 'Самаре', 'Омск': 'Омске', 'Ростов-на-Дону': 'Ростове-на-Дону',
  'Уфа': 'Уфе', 'Пермь': 'Перми'
};

function getCityName(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getCityPrepositional(cityName) {
  return CITY_ENDINGS[cityName] || cityName + 'е';
}

function createSlug(name) {
  return name.toLowerCase()
    .replace(/ё/g, 'e')
    .replace(/ /g, '-')
    .replace(/а/g, 'a').replace(/б/g, 'b').replace(/в/g, 'v').replace(/г/g, 'g')
    .replace(/д/g, 'd').replace(/е/g, 'e').replace(/ж/g, 'zh').replace(/з/g, 'z')
    .replace(/и/g, 'i').replace(/й/g, 'j').replace(/к/g, 'k').replace(/л/g, 'l')
    .replace(/м/g, 'm').replace(/н/g, 'n').replace(/о/g, 'o').replace(/п/g, 'p')
    .replace(/р/g, 'r').replace(/с/g, 's').replace(/т/g, 't').replace(/у/g, 'u')
    .replace(/ф/g, 'f').replace(/х/g, 'h').replace(/ц/g, 'c').replace(/ч/g, 'ch')
    .replace(/ш/g, 'sh').replace(/щ/g, 'sch').replace(/ъ/g, '').replace(/ы/g, 'y')
    .replace(/ь/g, '').replace(/э/g, 'e').replace(/ю/g, 'yu').replace(/я/g, 'ya');
}

async function fetchCities() {
  try {
    const response = await fetch('https://functions.poehali.dev/3f4d37f0-b84f-4157-83b7-55bdb568e459?action=list');
    const data = await response.json();
    return data.cities || [];
  } catch (error) {
    console.error('Ошибка загрузки городов:', error);
    return [];
  }
}

async function fetchProducts() {
  try {
    const response = await fetch('https://functions.poehali.dev/f3ffc9b4-fbea-48e8-959d-c34ea68e6531?action=list');
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
    return [];
  }
}

function updateMetaTags(html, title, description, url) {
  let updated = html;
  
  // Обновляем title
  updated = updated.replace(
    /<title>.*?<\/title>/,
    `<title>${title}</title>`
  );
  
  // Обновляем description
  updated = updated.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${description}"`
  );
  
  // Добавляем canonical если его нет
  if (!updated.includes('<link rel="canonical"')) {
    updated = updated.replace(
      '</head>',
      `    <link rel="canonical" href="${url}" />\n</head>`
    );
  } else {
    updated = updated.replace(
      /<link rel="canonical" href="[^"]*"/,
      `<link rel="canonical" href="${url}"`
    );
  }
  
  return updated;
}

function saveHtmlFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf-8');
}

async function generateStaticPages() {
  console.log('🚀 Начинаем генерацию статичных HTML...\n');
  
  // Читаем базовый HTML
  if (!fs.existsSync(BASE_HTML_PATH)) {
    console.error('❌ Файл dist/index.html не найден. Сначала запустите build.');
    process.exit(1);
  }
  
  const baseHtml = fs.readFileSync(BASE_HTML_PATH, 'utf-8');
  let generatedCount = 0;
  
  // 1. Генерируем страницы городов
  console.log('📍 Загружаем города...');
  const cities = await fetchCities();
  console.log(`   Найдено городов: ${cities.length}\n`);
  
  for (const city of cities) {
    const slug = createSlug(city.name);
    const cityName = city.name;
    const cityPrep = getCityPrepositional(cityName);
    
    const title = `Доставка цветов ${cityName} — FloRustic | Купить розы, тюльпаны, пионы с доставкой в ${cityPrep}`;
    const description = `Заказать свежие цветы с доставкой в ${cityName} от FloRustic. Букеты роз, тюльпанов, пионов за 2 часа. Композиции ручной работы. Круглосуточный заказ онлайн в ${cityPrep}!`;
    const url = `https://florustic.ru/city/${slug}`;
    
    const updatedHtml = updateMetaTags(baseHtml, title, description, url);
    const filePath = path.join(DIST_DIR, 'city', slug, 'index.html');
    
    saveHtmlFile(filePath, updatedHtml);
    generatedCount++;
    
    if (generatedCount % 50 === 0) {
      console.log(`   Создано ${generatedCount} страниц...`);
    }
  }
  
  console.log(`✅ Создано ${cities.length} страниц городов\n`);
  
  // 2. Генерируем страницы товаров
  console.log('🌸 Загружаем товары...');
  const products = await fetchProducts();
  console.log(`   Найдено товаров: ${products.length}\n`);
  
  for (const product of products) {
    const title = `${product.name} — купить с доставкой | FloRustic`;
    const description = `Служба доставки цветов FloRustic. ${product.name} — ${product.price}₽. Свежие букеты с доставкой за 1.5 часа после оплаты. Заказ онлайн 24/7!`;
    const url = `https://florustic.ru/product/${product.id}`;
    
    const updatedHtml = updateMetaTags(baseHtml, title, description, url);
    const filePath = path.join(DIST_DIR, 'product', String(product.id), 'index.html');
    
    saveHtmlFile(filePath, updatedHtml);
    generatedCount++;
  }
  
  console.log(`✅ Создано ${products.length} страниц товаров\n`);
  
  // 3. Генерируем статичные страницы
  const staticPages = [
    {
      path: 'catalog',
      title: 'Каталог букетов | FloRustic — Доставка цветов',
      description: 'Служба доставки цветов FloRustic. Каталог: более 500 букетов. Розы, тюльпаны, пионы. Цены от 990₽!'
    },
    {
      path: 'delivery',
      title: 'Доставка цветов по России | FloRustic',
      description: 'Служба доставки цветов FloRustic по России. Доставка за 1.5 часа. Работаем 24/7 без выходных!'
    },
    {
      path: 'about',
      title: 'О нас | FloRustic — Доставка цветов',
      description: 'Служба доставки цветов FloRustic. Профессиональные флористы, свежие букеты, доставка за 2 часа.'
    },
    {
      path: 'contacts',
      title: 'Контакты | FloRustic — Доставка цветов',
      description: 'Контакты службы доставки цветов FloRustic. Работаем 24/7 по всей России.'
    },
    {
      path: 'reviews',
      title: 'Отзывы клиентов | FloRustic — Доставка цветов',
      description: 'Отзывы клиентов о доставке цветов FloRustic. Реальные отзывы о качестве букетов и сервисе.'
    }
  ];
  
  for (const page of staticPages) {
    const url = `https://florustic.ru/${page.path}`;
    const updatedHtml = updateMetaTags(baseHtml, page.title, page.description, url);
    const filePath = path.join(DIST_DIR, page.path, 'index.html');
    
    saveHtmlFile(filePath, updatedHtml);
    generatedCount++;
  }
  
  console.log(`✅ Создано ${staticPages.length} статичных страниц\n`);
  console.log(`\n🎉 Всего сгенерировано: ${generatedCount} HTML-файлов!`);
}

generateStaticPages().catch(console.error);
