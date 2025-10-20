# Автоматическое обновление Sitemap

## Как это работает

При каждой публикации сайта автоматически генерируется актуальный `sitemap.xml` со всеми городами из базы данных.

## Файлы

- `scripts/generate-sitemap.js` — скрипт генерации sitemap
- `scripts/prebuild.js` — запускается перед сборкой
- `public/sitemap.xml` — готовый sitemap (автоматически обновляется)

## Ручной запуск

Чтобы обновить sitemap вручную:

```bash
node scripts/generate-sitemap.js
```

## Что включено в sitemap

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

## При добавлении нового города

1. Добавьте город через админ-панель
2. Опубликуйте сайт заново
3. Sitemap обновится автоматически
4. Отправьте обновлённый sitemap в Google Search Console

## SEO оптимизация городов

Каждая городская страница включает:

- ✅ Уникальный title с названием города
- ✅ Мета-описание с ключевыми словами
- ✅ Schema.org разметка LocalBusiness
- ✅ Keywords: "купить букет [город]", "доставка цветов [город]"
- ✅ Canonical URL
- ✅ Open Graph теги

## Отправка в поисковики

### Google Search Console
1. Откройте https://search.google.com/search-console
2. Добавьте свой домен florustic.ru
3. Отправьте sitemap: https://florustic.ru/sitemap.xml

### Яндекс.Вебмастер
1. Откройте https://webmaster.yandex.ru
2. Добавьте сайт florustic.ru
3. Отправьте sitemap: https://florustic.ru/sitemap.xml

## Проверка sitemap

- Файл доступен по адресу: https://florustic.ru/sitemap.xml
- Проверить валидность: https://www.xml-sitemaps.com/validate-xml-sitemap.html
