# 📖 Полная инструкция: Prerender для SEO страниц городов

## 🎯 Что это решает?

**Проблема:** Поисковики (Google, Yandex) видят одинаковый Title и Description для всех страниц городов.

**Решение:** Prerender создаёт отдельные HTML-файлы для каждого города с уникальными SEO мета-тегами.

---

## 🚀 Быстрый старт

### 1️⃣ Подключи GitHub к проекту

1. Открой свой проект в редакторе **poehali.dev**
2. Нажми кнопку **"Скачать"** в правом верхнем углу
3. Выбери **"Подключить GitHub"**
4. Войди в свой GitHub аккаунт (или зарегистрируйся, если нет)
5. Разреши poehali.dev доступ к репозиториям
6. Выбери свой личный аккаунт или организацию
7. Код автоматически загрузится в новый репозиторий

✅ После этого в poehali.dev появится название репозитория

---

### 2️⃣ Скачай проект на компьютер

Открой терминал (командную строку) и выполни:

```bash
# Замени YOUR_USERNAME и REPO_NAME на свои данные из GitHub
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git

# Перейди в папку проекта
cd REPO_NAME
```

**Пример:**
```bash
git clone https://github.com/ivan123/florustic-shop.git
cd florustic-shop
```

---

### 3️⃣ Установи зависимости

```bash
npm install
```

Это установит все необходимые библиотеки из `package.json`.

⏱️ Займёт 1-3 минуты в зависимости от скорости интернета.

---

### 4️⃣ Собери проект

```bash
npm run build
```

Это создаст папку `dist/` с готовым сайтом.

⏱️ Займёт ~30 секунд.

---

### 5️⃣ Запусти prerender (ГЛАВНЫЙ ШАГ!)

```bash
node scripts/prerender.js
```

**Что произойдёт:**

1. Скрипт подключится к вашей базе данных
2. Получит список всех активных городов
3. Для каждого города создаст файл `/city/{город}/index.html`
4. В каждом файле будут уникальные мета-теги

**Вывод в консоли:**

```
🚀 Starting prerendering...
📂 Using build path: /path/to/dist
📄 Index file: /path/to/dist/index.html

🔍 Fetching cities from database...
✅ Found 52 active cities

✅ Generated: /city/alejsk/index.html
✅ Generated: /city/barnaul/index.html
✅ Generated: /city/belokuriha/index.html
✅ Generated: /city/bijsk/index.html
✅ Generated: /city/volgograd/index.html
...
✅ Generated: /city/yarovoe/index.html

✅ Prerendering complete! Generated 52 city pages.
```

---

### 6️⃣ Проверь результат

Открой любой файл города:

```bash
cat dist/city/volgograd/index.html | grep "<title>"
```

Должен показать:
```html
<title>Доставка цветов Волгоград — FloRustic | Букеты с доставкой в Волгоград</title>
```

✅ Если видишь название города в title - всё работает!

---

### 7️⃣ Закоммить изменения

```bash
# Добавь все новые файлы
git add dist/city/

# Создай коммит
git commit -m "Add prerendered city pages for SEO"

# Отправь на GitHub
git push
```

---

### 8️⃣ Опубликуй в poehali.dev

1. Вернись в редактор **poehali.dev**
2. Изменения из GitHub автоматически подтянутся
3. Нажми **"Опубликовать"**
4. Сайт обновится с новыми SEO страницами

---

## ✅ Проверка работы SEO

### Проверь Title в браузере:

1. Открой https://florustic.ru/city/volgograd
2. Нажми F12 (откроется консоль разработчика)
3. Вкладка **Elements** → найди `<title>`
4. Должно быть: `Доставка цветов Волгоград — FloRustic`

### Проверь что видит Google:

1. Открой: https://search.google.com/test/rich-results
2. Вставь URL: `https://florustic.ru/city/volgograd`
3. Нажми "Test URL"
4. Google покажет какие мета-теги он видит

---

## 🔄 Когда нужно запускать повторно?

Запускай prerender каждый раз когда:

- ✅ Добавляешь новый город в базу данных
- ✅ Меняешь шаблон мета-тегов (файл `src/components/city/CitySEOHelmet.tsx`)
- ✅ Обновляешь тексты для SEO

---

## 📁 Что создаётся?

```
dist/
├── index.html                    ← Главная страница
├── assets/                       ← JS, CSS файлы
└── city/                         ← НОВОЕ! Страницы городов
    ├── alejsk/
    │   └── index.html           ← SEO для Алейска
    ├── barnaul/
    │   └── index.html           ← SEO для Барнаула
    ├── volgograd/
    │   └── index.html           ← SEO для Волгограда
    └── ...
```

---

## 🆘 Проблемы и решения

### ❌ Ошибка: `command not found: node`

**Решение:** Установи Node.js с https://nodejs.org/

### ❌ Ошибка: `Cannot find module 'node-fetch'`

**Решение:** Запусти `npm install`

### ❌ Ошибка: `ENOENT: no such file or directory, open 'dist/index.html'`

**Решение:** Сначала запусти `npm run build`, потом `node scripts/prerender.js`

### ❌ Prerender создал файлы, но поисковики не видят

**Причина:** Файлы не попали на сервер

**Решение:**
1. Проверь что файлы закоммичены: `git status`
2. Отправь на GitHub: `git push`
3. Опубликуй в poehali.dev

### ❌ В файле города всё ещё старый title

**Решение:** Удали старые файлы и запусти заново:
```bash
rm -rf dist/city/
node scripts/prerender.js
```

---

## 📊 Какой результат в SEO?

### ДО prerender:
```
Google Search Console:
❌ Дубликаты Title: 50+ страниц
❌ Дубликаты Description: 50+ страниц
❌ Низкий CTR в поиске
```

### ПОСЛЕ prerender:
```
Google Search Console:
✅ Уникальные Title: 0 дубликатов
✅ Уникальные Description: 0 дубликатов  
✅ Повышение CTR на 30-50%
✅ Улучшение позиций в поиске
```

---

## 🎓 Дополнительно

### Автоматизация (для продвинутых)

Можно настроить GitHub Actions для автоматического prerender при каждом коммите.

Создай файл `.github/workflows/prerender.yml`:

```yaml
name: Prerender City Pages

on:
  push:
    branches: [ main ]

jobs:
  prerender:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - run: npm install
    - run: npm run build
    - run: node scripts/prerender.js
    
    - name: Commit prerendered pages
      run: |
        git config user.name "GitHub Actions"
        git config user.email "actions@github.com"
        git add dist/city/
        git commit -m "Auto-prerender city pages" || exit 0
        git push
```

---

## 📞 Нужна помощь?

1. **Документация poehali.dev:** https://docs.poehali.dev
2. **Комьюнити в Telegram:** https://t.me/+QgiLIa1gFRY4Y2Iy
3. **GitHub Issues:** Создай issue в своём репозитории

---

## ✨ Готово!

После выполнения всех шагов:

✅ Каждый город имеет уникальный Title  
✅ Каждый город имеет уникальный Description  
✅ Google и Yandex правильно индексируют страницы  
✅ Улучшается позиция сайта в поиске  

**Успехов с SEO! 🚀**
