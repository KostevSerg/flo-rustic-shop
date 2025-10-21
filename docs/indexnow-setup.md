# Настройка IndexNow для FloRustic

## Что такое IndexNow?

IndexNow — это протокол, который позволяет мгновенно уведомлять поисковые системы (Google, Bing, Yandex и др.) об изменениях на сайте. Вместо ожидания, пока поисковики переиндексируют страницы (3-14 дней), изменения появляются в индексе за несколько минут.

## ✅ Что уже настроено

1. **API-ключ создан**: `f8a7b3c4e2d5f6a9b1c8d7e4f3a2b5c6`
2. **Файл верификации**: `https://florustic.ru/f8a7b3c4e2d5f6a9b1c8d7e4f3a2b5c6.txt`
3. **Backend API готов**: отправляет URL в IndexNow автоматически

## Поддерживаемые поисковые системы

- ✅ **Bing** (Microsoft)
- ✅ **Yandex**
- ✅ **Seznam.cz**
- ✅ **Naver**
- ⏳ **Google** (планируется поддержка)

Отправка в один API = уведомление всех поисковиков сразу!

## Как использовать

### 1. Автоматическая отправка при добавлении товаров

Добавьте в админ-панель товаров вызов API после создания/обновления:

```javascript
// После успешного добавления товара
const notifyIndexNow = async (productId) => {
  try {
    await fetch('https://functions.poehali.dev/f9051455-576c-4094-8413-8c03926b2370', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        urls: [`/product/${productId}`]
      })
    });
  } catch (error) {
    console.error('IndexNow error:', error);
  }
};
```

### 2. Массовая отправка всех городов

Для индексации всех страниц городов сразу:

```javascript
const cities = ['moskva', 'barnaul', 'bijsk', /* все города */];
const urls = cities.map(city => `/city/${city}`);

fetch('https://functions.poehali.dev/f9051455-576c-4094-8413-8c03926b2370', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ urls })
});
```

### 3. Отправка важных страниц

После обновления контента отправьте URL:

```javascript
const importantPages = [
  '/',
  '/catalog',
  '/about',
  '/delivery',
  '/contacts'
];

fetch('https://functions.poehali.dev/f9051455-576c-4094-8413-8c03926b2370', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ urls: importantPages })
});
```

## Формат запроса

**Endpoint**: `https://functions.poehali.dev/f9051455-576c-4094-8413-8c03926b2370`

**Метод**: POST

**Body**:
```json
{
  "urls": [
    "/",
    "/catalog",
    "/city/moskva",
    "/product/123"
  ]
}
```

**Ограничения**:
- Максимум **10,000 URL** за один запрос
- Можно отправлять **несколько раз в день**
- URL должны быть с **вашего домена**

## Формат ответа

### Успешная отправка:
```json
{
  "success": true,
  "indexnow_status": 202,
  "urls_submitted": 5,
  "message": "URLs submitted to IndexNow"
}
```

### Ошибка:
```json
{
  "success": false,
  "error": "IndexNow API error: 400",
  "details": "Invalid URL format"
}
```

## Коды ответа IndexNow

| Код | Значение |
|-----|----------|
| **200** | URL уже в индексе |
| **202** | URL принят к индексации ✅ |
| **400** | Неверный формат запроса |
| **403** | Ключ не найден/неверный |
| **422** | URL не принадлежит домену |
| **429** | Слишком много запросов |

## Когда отправлять уведомления?

### ✅ Отправляйте:
- После добавления нового товара
- После обновления цен товаров
- После изменения контента страницы
- После публикации новой статьи/отзыва
- После добавления нового города

### ❌ НЕ отправляйте:
- При каждом клике пользователя
- Для страниц корзины/оформления заказа
- Для личных кабинетов
- Для админ-панели

## Мониторинг индексации

### Проверка в Bing Webmaster Tools:

1. Зайдите на https://www.bing.com/webmasters
2. Добавьте свой сайт
3. Проверьте раздел "URL Inspection"
4. Там увидите статус отправленных через IndexNow URL

### Проверка в Yandex Webmaster:

1. Зайдите на https://webmaster.yandex.ru
2. Добавьте сайт
3. Раздел "Индексирование" → "История обхода"
4. Проверьте, какие URL проиндексированы

## Рекомендации

1. **Не злоупотребляйте**: отправляйте только реально изменённые страницы
2. **Группируйте запросы**: отправляйте несколько URL за раз, не по одному
3. **Логируйте ошибки**: сохраняйте неудачные попытки для повторной отправки
4. **Проверяйте статус**: код 202 = успех, остальное = проблема

## Интеграция с админ-панелью

Добавьте кнопку "Отправить в IndexNow" в админке:

```tsx
const handleSubmitToIndexNow = async () => {
  const response = await fetch('https://functions.poehali.dev/f9051455-576c-4094-8413-8c03926b2370', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      urls: selectedProducts.map(p => `/product/${p.id}`)
    })
  });
  
  const data = await response.json();
  
  if (data.success) {
    toast({
      title: 'Успешно!',
      description: `${data.urls_submitted} страниц отправлено в поисковики`
    });
  }
};
```

## Проверка работы

После отправки URL проверьте в консоли браузера:

```javascript
// Отправить тестовый URL
fetch('https://functions.poehali.dev/f9051455-576c-4094-8413-8c03926b2370', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ urls: ['/'] })
})
.then(r => r.json())
.then(console.log);

// Ожидаемый результат:
// { success: true, indexnow_status: 202, urls_submitted: 1, ... }
```

## FAQ

**Q: Как часто можно отправлять URL?**  
A: Нет строгих лимитов, но рекомендуется не чаще 1 раза в минуту для одного URL.

**Q: Нужно ли отправлять URL после каждого изменения?**  
A: Да, если изменения значимые для пользователей (цена, описание, новый товар).

**Q: Работает ли это для Google?**  
A: Пока нет, но Google рассматривает возможность поддержки IndexNow.

**Q: Что делать при ошибке 403?**  
A: Проверьте, что файл `f8a7b3c4e2d5f6a9b1c8d7e4f3a2b5c6.txt` доступен по URL.

**Q: Заменяет ли IndexNow sitemap.xml?**  
A: Нет, sitemap.xml всё ещё нужен для полного списка страниц. IndexNow — для быстрых обновлений.

---

**API Endpoint**: `https://functions.poehali.dev/f9051455-576c-4094-8413-8c03926b2370`  
**Ключ**: `f8a7b3c4e2d5f6a9b1c8d7e4f3a2b5c6`  
**Домен**: `https://florustic.ru`  
**Дата настройки**: 21 октября 2025
