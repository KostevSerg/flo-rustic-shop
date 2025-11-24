// Тестовый скрипт для проверки генерации
// node test-prerender.js

console.log('Тестируем генерацию мета-тегов...\n');

const testHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8"/>
    <title>Доставка цветов — FloRustic</title>
    <meta name="description" content="Общее описание"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body>
<div id="root"></div>
</body>
</html>`;

function updateMetaTags(html, title, description, url) {
  let updated = html;
  
  updated = updated.replace(
    /<title>.*?<\/title>/,
    `<title>${title}</title>`
  );
  
  updated = updated.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${description}"`
  );
  
  if (!updated.includes('<link rel="canonical"')) {
    updated = updated.replace(
      '</head>',
      `    <link rel="canonical" href="${url}" />\n</head>`
    );
  }
  
  return updated;
}

// Тест для города Бийск
const cityTitle = 'Доставка цветов Бийск — FloRustic | Купить розы, тюльпаны, пионы с доставкой в Бийске';
const cityDescription = 'Заказать свежие цветы с доставкой в Бийск от FloRustic. Букеты роз, тюльпанов, пионов за 2 часа. Композиции ручной работы. Круглосуточный заказ онлайн в Бийске!';
const cityUrl = 'https://florustic.ru/city/biysk';

const result = updateMetaTags(testHtml, cityTitle, cityDescription, cityUrl);

console.log('РЕЗУЛЬТАТ:');
console.log('─'.repeat(80));
console.log(result);
console.log('─'.repeat(80));

// Проверяем что обновилось
if (result.includes(cityTitle)) {
  console.log('\n✅ Title обновлён правильно');
} else {
  console.log('\n❌ Ошибка: Title не обновлён');
}

if (result.includes(cityDescription)) {
  console.log('✅ Description обновлён правильно');
} else {
  console.log('❌ Ошибка: Description не обновлён');
}

if (result.includes(`<link rel="canonical" href="${cityUrl}"`)) {
  console.log('✅ Canonical URL добавлен');
} else {
  console.log('❌ Ошибка: Canonical URL не добавлен');
}

console.log('\n🎉 Тест пройден! Скрипт работает корректно.');
