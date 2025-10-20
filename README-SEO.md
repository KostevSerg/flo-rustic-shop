# Автоматическое обновление SEO файлов

## Как это работает

При каждой публикации сайта автоматически генерируются:
- `sitemap.xml` — карта сайта со всеми городами из базы данных
- `robots.txt` — правила индексации для поисковых роботов

## Файлы

- `scripts/generate-sitemap.js` — генератор sitemap
- `scripts/generate-robots.js` — генератор robots.txt
- `scripts/prebuild.js` — запускается перед сборкой
- `public/sitemap.xml` — карта сайта (автоматически обновляется)
- `public/robots.txt` — правила для роботов (автоматически обновляется)

## Ручной запуск

Чтобы обновить SEO файлы вручную:

```bash
# Обновить sitemap
node scripts/generate-sitemap.js

# Обновить robots.txt
node scripts/generate-robots.js

# Обновить всё сразу
node scripts/prebuild.js
```

## Что включено в sitemap.xml

1. **Статические страницы** (7 страниц):
   - Главная (/)
   - Каталог (/catalog)
   - О компании (/about)
   - Доставка (/delivery)
   - Гарантии (/guarantees)
   - Контакты (/contacts)
   - Отзывы (/reviews)

2. **Городские страницы** (автоматически):
   - Все активные города из БД
   - Формат: /city/[slug]
   - Пример: /city/barnaul

## Что включено в robots.txt

### Разрешено для индексации:
- ✅ Все страницы сайта (/)
- ✅ Каталог товаров (/catalog)
- ✅ Все городские страницы (/city/*)
- ✅ Все товары (/product/*)
- ✅ Информационные страницы (/about, /delivery, etc.)

### Запрещено для индексации:
- ❌ Админ-панель (/admin, /admin/*)
- ❌ Корзина (/cart)
- ❌ Оформление заказа (/checkout)

### Настройки для роботов:
- **Google** (Googlebot) — индексация без задержек
- **Яндекс** (Yandex) — индексация без задержек
- **Bing** (Bingbot) — стандартная индексация
- **Соцсети** — разрешён доступ для превью (Twitter, Facebook, Telegram)

## При добавлении нового города

1. Добавьте город через админ-панель
2. Опубликуйте сайт заново
3. Sitemap и robots.txt обновятся автоматически
4. Отправьте обновлённый sitemap в Google Search Console

## SEO оптимизация городов

Каждая городская страница включает:

- ✅ Уникальный title с названием города
- ✅ Мета-описание с ключевыми словами
- ✅ Schema.org разметка LocalBusiness
- ✅ Keywords: "купить букет [город]", "доставка цветов [город]"
- ✅ Canonical URL
- ✅ Open Graph теги
- ✅ Автоматически добавляется в sitemap.xml
- ✅ Разрешена индексация в robots.txt

## Отправка в поисковики

### Google Search Console
1. Откройте https://search.google.com/search-console
2. Добавьте свой домен florustic.ru
3. Отправьте sitemap: https://florustic.ru/sitemap.xml
4. Проверьте robots.txt: https://florustic.ru/robots.txt

### Яндекс.Вебмастер
1. Откройте https://webmaster.yandex.ru
2. Добавьте сайт florustic.ru
3. Отправьте sitemap: https://florustic.ru/sitemap.xml
4. Проверьте robots.txt: https://florustic.ru/robots.txt

## Проверка файлов

- **Sitemap:** https://florustic.ru/sitemap.xml
- **Robots.txt:** https://florustic.ru/robots.txt
- **Валидация sitemap:** https://www.xml-sitemaps.com/validate-xml-sitemap.html
- **Проверка robots.txt:** https://support.google.com/webmasters/answer/6062598

## Структура автоматизации

```
При публикации сайта:
  ↓
scripts/prebuild.js запускается
  ↓
  ├─→ generate-sitemap.js (загружает города из БД)
  │   └─→ создаёт public/sitemap.xml
  │
  └─→ generate-robots.js
      └─→ создаёт public/robots.txt
```

Оба файла автоматически публикуются вместе с сайтом.
