#!/bin/bash

echo "🚀 Обновление sitemap..."
node scripts/generate-sitemap.js

if [ $? -eq 0 ]; then
    echo "✅ Sitemap успешно обновлён!"
    echo "📁 Файл сохранён в public/sitemap.xml"
else
    echo "❌ Ошибка при генерации sitemap"
    exit 1
fi
