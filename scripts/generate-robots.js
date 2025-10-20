import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateRobotsTxt = () => {
  try {
    console.log('Generating robots.txt...');
    
    const domain = 'https://florustic.ru';
    
    const robotsTxt = `# Основные правила для всех поисковых систем
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /cart
Disallow: /checkout

# Разрешаем индексацию основных разделов
Allow: /catalog
Allow: /city/*
Allow: /product/*
Allow: /about
Allow: /delivery
Allow: /guarantees
Allow: /contacts
Allow: /reviews

# Google
User-agent: Googlebot
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /cart
Disallow: /checkout
Crawl-delay: 0

# Яндекс
User-agent: Yandex
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /cart
Disallow: /checkout
Crawl-delay: 0

# Bing
User-agent: Bingbot
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /cart
Disallow: /checkout

# Социальные сети (для превью)
User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: TelegramBot
Allow: /

# Sitemap
Sitemap: ${domain}/sitemap.xml

# Дополнительная информация
# Обновлено: ${new Date().toISOString().split('T')[0]}
# Домен: ${domain}
`;

    const robotsPath = path.join(__dirname, '..', 'public', 'robots.txt');
    fs.writeFileSync(robotsPath, robotsTxt, 'utf-8');
    
    console.log('✅ robots.txt generated successfully!');
    console.log(`   Saved to: ${robotsPath}`);
    console.log(`   Sitemap: ${domain}/sitemap.xml`);
    
  } catch (error) {
    console.error('❌ Error generating robots.txt:', error);
    process.exit(1);
  }
};

generateRobotsTxt();
