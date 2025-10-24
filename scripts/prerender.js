import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

const CITIES = [
  { slug: 'volgograd', name: 'Волгоград' },
  { slug: 'barnaul', name: 'Барнаул' },
  { slug: 'bijsk', name: 'Бийск' },
  { slug: 'belokuriha', name: 'Белокуриха' },
  { slug: 'moscow', name: 'Москва' },
  { slug: 'sankt-peterburg', name: 'Санкт-Петербург' },
  { slug: 'novosibirsk', name: 'Новосибирск' },
  { slug: 'ekaterinburg', name: 'Екатеринбург' },
  { slug: 'kazan', name: 'Казань' },
  { slug: 'nizhnij-novgorod', name: 'Нижний Новгород' },
];

function generateCityMeta(cityName, citySlug) {
  const title = `Доставка цветов ${cityName} — FloRustic | Букеты с доставкой в ${cityName}`;
  const description = `Служба доставки цветов в ${cityName}. Свежие цветы в ${cityName} — доставка в течение 1.5 часов после оплаты. Розы, тюльпаны, композиции ручной работы. Более 500 букетов в каталоге. Заказ онлайн 24/7!`;
  const url = `https://florustic.ru/city/${citySlug}`;
  
  return `
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${url}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${url}">
    <meta property="og:site_name" content="FloRustic">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
  `;
}

console.log('🚀 Starting prerendering...');

const indexHtml = fs.readFileSync(indexPath, 'utf8');

const cityDir = path.join(distPath, 'city');
if (!fs.existsSync(cityDir)) {
  fs.mkdirSync(cityDir, { recursive: true });
}

CITIES.forEach(({ slug, name }) => {
  const cityMeta = generateCityMeta(name, slug);
  const cityHtml = indexHtml.replace('</head>', `${cityMeta}</head>`);
  
  const cityPath = path.join(cityDir, slug);
  if (!fs.existsSync(cityPath)) {
    fs.mkdirSync(cityPath, { recursive: true });
  }
  
  fs.writeFileSync(path.join(cityPath, 'index.html'), cityHtml, 'utf8');
  console.log(`✅ Generated: /city/${slug}/index.html`);
});

console.log(`✅ Prerendering complete! Generated ${CITIES.length} city pages.`);
