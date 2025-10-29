import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getLatestBuildPath() {
  const buildsPath = path.join(__dirname, '..', 'builds');
  const builds = fs.readdirSync(buildsPath);
  const latestBuild = builds.sort().reverse()[0];
  const latestBuildPath = path.join(buildsPath, latestBuild);
  
  // Check if there's a subdirectory (hash folder)
  const subDirs = fs.readdirSync(latestBuildPath);
  if (subDirs.length > 0 && fs.statSync(path.join(latestBuildPath, subDirs[0])).isDirectory()) {
    return path.join(latestBuildPath, subDirs[0]);
  }
  
  return latestBuildPath;
}

const distPath = fs.existsSync(path.join(__dirname, '..', 'dist')) 
  ? path.join(__dirname, '..', 'dist')
  : getLatestBuildPath();
  
const indexPath = path.join(distPath, 'index.html');

const func2urlPath = path.join(__dirname, '..', 'backend', 'func2url.json');
const func2url = JSON.parse(fs.readFileSync(func2urlPath, 'utf8'));
const CITIES_API_URL = func2url.cities;

function generateSlug(cityName) {
  return cityName
    .toLowerCase()
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
  console.log('🔍 Fetching cities from database...');
  const response = await fetch(CITIES_API_URL);
  const data = await response.json();
  
  let allCities = [];
  if (data.cities && typeof data.cities === 'object') {
    Object.keys(data.cities).forEach(regionName => {
      const citiesInRegion = data.cities[regionName];
      if (Array.isArray(citiesInRegion)) {
        allCities = allCities.concat(citiesInRegion);
      }
    });
  }
  
  return allCities.map(city => ({
    slug: generateSlug(city.name),
    name: city.name
  }));
}

function generateCityMeta(cityName, citySlug) {
  const title = `Купить цветы в ${cityName} с доставкой — FloRustic | Букеты ${cityName}`;
  const description = `Купить цветы в ${cityName} с доставкой за 2 часа. Свежие букеты, розы, тюльпаны, композиции ручной работы. Более 500 букетов в каталоге FloRustic. Заказ онлайн 24/7!`;
  const url = `https://florustic.ru/city/${citySlug}`;
  const keywords = `доставка цветов ${cityName}, букеты ${cityName}, цветы ${cityName}, купить букет ${cityName}, заказать цветы ${cityName}, florustic ${cityName}, цветы с доставкой ${cityName}`;
  
  return `
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywords}">
    <link rel="canonical" href="${url}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${url}">
    <meta property="og:site_name" content="FloRustic">
    <meta property="og:locale" content="ru_RU">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
  `;
}

async function prerender() {
  console.log('🚀 Starting prerendering...');
  console.log(`📂 Using build path: ${distPath}`);
  console.log(`📄 Index file: ${indexPath}`);
  console.log('');
  
  const CITIES = await fetchCities();
  console.log(`✅ Found ${CITIES.length} active cities\n`);
  
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
  
  console.log(`\n✅ Prerendering complete! Generated ${CITIES.length} city pages.`);
}

prerender().catch(error => {
  console.error('❌ Error during prerendering:', error);
  process.exit(1);
});