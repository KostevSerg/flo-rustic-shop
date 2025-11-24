// Cloudflare Worker для SEO: отдаёт правильные мета-теги ботам
// Разместите этот скрипт в Cloudflare Workers для вашего домена

const CITY_ENDINGS = {
  'Москва': 'Москве', 'Санкт-Петербург': 'Санкт-Петербурге',
  'Новосибирск': 'Новосибирске', 'Екатеринбург': 'Екатеринбурге',
  'Казань': 'Казани', 'Волгоград': 'Волгограде', 'Бийск': 'Бийске',
  'Барнаул': 'Барнауле', 'Воронеж': 'Воронеже', 'Красноярск': 'Красноярске',
};

function getCityName(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getCityPrepositional(cityName) {
  return CITY_ENDINGS[cityName] || cityName + 'е';
}

function isBot(userAgent) {
  const botPatterns = ['googlebot', 'yandexbot', 'bingbot', 'slurp', 'duckduckbot'];
  const ua = userAgent.toLowerCase();
  return botPatterns.some(bot => ua.includes(bot));
}

function generateMetaTags(path) {
  // Product pages
  if (path.startsWith('/product/')) {
    return {
      title: 'Букет цветов — купить с доставкой | FloRustic',
      description: 'Служба доставки цветов FloRustic. Свежие букеты ручной работы с доставкой за 1.5 часа после оплаты. Заказ онлайн 24/7!'
    };
  }
  
  // City pages
  if (path.startsWith('/city/')) {
    const parts = path.split('/');
    const slug = parts[2];
    const cityName = getCityName(slug);
    const cityPrep = getCityPrepositional(cityName);
    
    return {
      title: `Доставка цветов ${cityName} — FloRustic | Купить розы, тюльпаны, пионы с доставкой в ${cityPrep}`,
      description: `Заказать свежие цветы с доставкой в ${cityName} от FloRustic. Букеты роз, тюльпанов, пионов за 2 часа. Композиции ручной работы. Круглосуточный заказ онлайн в ${cityPrep}!`
    };
  }
  
  // Catalog
  if (path === '/catalog' || path === '/catalog/') {
    return {
      title: 'Каталог букетов | FloRustic — Доставка цветов',
      description: 'Служба доставки цветов FloRustic. Каталог: более 500 букетов. Розы, тюльпаны, пионы. Цены от 990₽!'
    };
  }
  
  // Delivery
  if (path === '/delivery' || path === '/delivery/') {
    return {
      title: 'Доставка цветов по России | FloRustic',
      description: 'Служба доставки цветов FloRustic по России. Доставка за 1.5 часа. Работаем 24/7 без выходных!'
    };
  }
  
  return null; // Default - let original HTML pass through
}

async function handleRequest(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  
  // Only intercept bot requests
  if (!isBot(userAgent)) {
    return fetch(request);
  }
  
  const meta = generateMetaTags(url.pathname);
  
  // If no special meta tags needed, pass through
  if (!meta) {
    return fetch(request);
  }
  
  // Fetch original HTML
  const response = await fetch(request);
  let html = await response.text();
  
  // Replace title and description
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${meta.title}</title>`
  );
  
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${meta.description}"`
  );
  
  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
      'cache-control': 'public, max-age=3600'
    }
  });
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
