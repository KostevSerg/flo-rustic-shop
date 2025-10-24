import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

async function testFetch() {
  console.log('🧪 Testing city fetch...\n');
  console.log(`📡 API URL: ${CITIES_API_URL}\n`);
  
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
  
  const citiesWithSlugs = allCities.map(city => ({
    slug: generateSlug(city.name),
    name: city.name
  }));
  
  console.log(`✅ Found ${citiesWithSlugs.length} cities\n`);
  console.log('📋 Preview (first 10):');
  console.log('='.repeat(60));
  citiesWithSlugs.slice(0, 10).forEach((city, i) => {
    console.log(`${i+1}. ${city.name} → /city/${city.slug}/`);
  });
  console.log('='.repeat(60));
  console.log(`\n... and ${citiesWithSlugs.length - 10} more cities`);
  
  console.log('\n📄 Example meta tags for Волгоград:');
  console.log('='.repeat(60));
  const exampleCity = citiesWithSlugs.find(c => c.name === 'Волгоград') || citiesWithSlugs[0];
  const title = `Доставка цветов ${exampleCity.name} — FloRustic | Букеты с доставкой в ${exampleCity.name}`;
  const description = `Служба доставки цветов в ${exampleCity.name}. Свежие цветы в ${exampleCity.name} — доставка в течение 1.5 часов после оплаты.`;
  console.log(`<title>${title}</title>`);
  console.log(`<meta name="description" content="${description}">`);
  console.log(`<link rel="canonical" href="https://florustic.ru/city/${exampleCity.slug}">`);
  console.log('='.repeat(60));
}

testFetch().catch(console.error);
