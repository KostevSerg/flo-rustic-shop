# 🚀 Настройка SEO для страниц городов

## Проблема

React SPA (Single Page Application) не может изменить мета-теги до загрузки JavaScript. Поисковики видят только стандартный `<title>` из `index.html`.

## Решение: Prerendering

Prerendering создаёт статические HTML-файлы для каждого города с уникальными SEO мета-тегами.

## Как запустить

### Вариант 1: Локально (если проект скачан на компьютер)

```bash
# 1. Установить зависимости (если ещё не установлены)
npm install

# 2. Собрать проект
npm run build

# 3. Запустить prerendering
node scripts/prerender.js

# 4. Результат будет в папке dist/city/
```

### Вариант 2: Через деплой скрипт

```bash
chmod +x deploy.sh
./deploy.sh
```

## Что создаётся

Для каждого города из базы данных создаётся файл:
```
dist/city/{citySlug}/index.html
```

Например:
- `dist/city/volgograd/index.html`
- `dist/city/barnaul/index.html`
- `dist/city/bijsk/index.html`

Каждый файл содержит уникальные:
- `<title>Доставка цветов {Город} — FloRustic</title>`
- `<meta name="description" content="...">`
- `<link rel="canonical" href="https://florustic.ru/city/{slug}">`
- OpenGraph теги для соцсетей
- Structured Data (Schema.org)

## Проверка результата

После prerendering проверьте файл:
```bash
cat dist/city/volgograd/index.html | grep "<title>"
```

Должен показать:
```html
<title>Доставка цветов Волгоград — FloRustic | Букеты с доставкой в Волгоград</title>
```

## Автоматизация

⚠️ **Важно:** В текущей конфигурации poehali.dev prerendering НЕ запускается автоматически.

Нужно запускать вручную после каждого обновления списка городов.

## Альтернатива: Server-Side Rendering (SSR)

Для полностью автоматического SEO можно переехать на:
- Next.js (React SSR)
- Remix (React SSR)
- Astro (Static Site Generation)

Но это требует полной переработки проекта.
