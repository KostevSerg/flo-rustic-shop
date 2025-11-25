import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createSlug = (name) => {
  const transliteration = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', ' ': '-'
  };
  
  let result = '';
  const lower = name.toLowerCase();
  for (const char of lower) {
    result += transliteration[char] || char;
  }
  return result;
};

const getCityPrepositional = (city) => {
  const endings = {
    'Москва': 'Москве',
    'Санкт-Петербург': 'Санкт-Петербурге',
    'Новосибирск': 'Новосибирске',
    'Екатеринбург': 'Екатеринбурге',
    'Красноярск': 'Красноярске',
    'Барнаул': 'Барнауле',
    'Бийск': 'Бийске',
    'Мамонтово': 'Мамонтово',
    'Иркутск': 'Иркутске',
    'Томск': 'Томске',
    'Омск': 'Омске'
  };
  return endings[city] || city + 'е';
};

const getBaseHTML = () => {
  const indexPath = path.join(path.dirname(__dirname), 'dist', 'index.html');
  return fs.readFileSync(indexPath, 'utf-8');
};

const generateCityHTML = (city, baseHTML) => {
  const cityPrep = getCityPrepositional(city.name);
  const regionPart = city.region ? `, ${city.region}` : '';
  
  const title = `Доставка цветов ${city.name}${regionPart} — FloRustic | Купить розы, тюльпаны, пионы с доставкой в ${cityPrep}`;
  const description = `Заказать свежие цветы с доставкой в ${city.name}${regionPart} от FloRustic. Букеты роз, тюльпанов, пионов, хризантем за 2 часа. Композиции ручной работы. Круглосуточный заказ онлайн в ${cityPrep}!`;
  const url = `https://florustic.ru/city/${city.slug}`;
  
  let html = baseHTML;
  
  // Replace title
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${title}</title>`
  );
  
  // Replace description
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${description}"`
  );
  
  // Add or replace canonical
  if (html.includes('<link rel="canonical"')) {
    html = html.replace(
      /<link rel="canonical" href="[^"]*"/,
      `<link rel="canonical" href="${url}"`
    );
  } else {
    html = html.replace('</head>', `    <link rel="canonical" href="${url}" />\n</head>`);
  }
  
  // Add Open Graph tags if not present
  if (!html.includes('property="og:url"')) {
    const ogTags = `
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />`;
    html = html.replace('</head>', ogTags + '\n</head>');
  }
  
  return html;
};

const fetchCities = async () => {
  try {
    const response = await fetch('https://functions.poehali.dev/f33ee89c-e17b-4d45-a1fb-52de0d0e4ec9');
    const data = await response.json();
    
    const cities = [];
    for (const region in data.cities) {
      for (const city of data.cities[region]) {
        cities.push({
          name: city.name,
          region: city.region,
          slug: createSlug(city.name)
        });
      }
    }
    return cities;
  } catch (error) {
    console.error('Failed to fetch cities:', error);
    return [];
  }
};

const main = async () => {
  console.log('🚀 Generating SEO pages...');
  
  const distPath = path.join(path.dirname(__dirname), 'dist');
  
  if (!fs.existsSync(distPath)) {
    console.error('❌ dist/ folder not found. Please run build first.');
    process.exit(1);
  }
  
  console.log('📦 Loading base HTML template...');
  const baseHTML = getBaseHTML();
  
  console.log('📍 Fetching cities from API...');
  const cities = await fetchCities();
  console.log(`   Found ${cities.length} cities`);
  
  let generated = 0;
  
  for (const city of cities) {
    const cityDir = path.join(distPath, 'city', city.slug);
    fs.mkdirSync(cityDir, { recursive: true });
    
    const html = generateCityHTML(city, baseHTML);
    fs.writeFileSync(path.join(cityDir, 'index.html'), html);
    
    generated++;
    
    if (generated % 50 === 0) {
      console.log(`  ✓ Generated ${generated}/${cities.length} pages...`);
    }
  }
  
  console.log(`✅ Successfully generated ${generated} SEO pages in dist/city/!`);
  console.log('');
  console.log('📤 Next steps:');
  console.log('   1. Test locally: npm run preview');
  console.log('   2. Deploy: commit and push to production');
  console.log('');
};

main().catch(console.error);
