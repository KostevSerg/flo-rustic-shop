# SEO: Prerendering для страниц городов

## Проблема
React Helmet обновляет мета-теги (Title, Description) только на клиенте, но поисковики видят изначальный HTML без динамического контента.

## Решение
Скрипт `scripts/prerender.js` создаёт статические HTML-файлы для каждого города с правильными мета-тегами **во время билда**.

## Как использовать

### 1. Сделать билд
```bash
npm run build
```

### 2. Запустить prerendering
```bash
node scripts/prerender.js
```

Это создаст структуру:
```
dist/
├── city/
│   ├── volgograd/
│   │   └── index.html  ← с мета-тегами для Волгограда
│   ├── barnaul/
│   │   └── index.html  ← с мета-тегами для Барнаула
│   └── ...
```

### 3. Проверить результат
Откройте `dist/city/volgograd/index.html` в браузере или просмотрите исходный код — вы увидите правильные Title и Description.

## Автоматизация

Добавьте в `package.json`:
```json
"scripts": {
  "build": "vite build && node scripts/prerender.js"
}
```

Теперь prerendering будет запускаться автоматически после каждого билда.

## Добавление новых городов

Отредактируйте `scripts/prerender.js`, добавьте город в массив `CITIES`:

```javascript
const CITIES = [
  { slug: 'volgograd', name: 'Волгоград' },
  { slug: 'moscow', name: 'Москва' },
  { slug: 'novyj-gorod', name: 'Новый Город' }, // ← добавить
];
```

Slug должен совпадать с URL (транслитерация).

## Важно для хостинга

Убедитесь, что ваш хостинг настроен на:
- Отдавать `/city/volgograd/` → `/city/volgograd/index.html`
- Не перенаправлять всё на корневой `/index.html`

Для GitHub Pages / Netlify / Vercel это работает автоматически.

## Что получают поисковики

**До prerendering:**
```html
<title>FloRustic — Доставка цветов по России</title>
<!-- одинаковый для всех страниц -->
```

**После prerendering:**
```html
<title>Доставка цветов Волгоград — FloRustic | Букеты с доставкой в Волгоград</title>
<meta name="description" content="Служба доставки цветов в Волгоград...">
<!-- уникальный для каждого города -->
```

Google и Yandex увидят правильные мета-теги и проиндексируют страницы корректно!
