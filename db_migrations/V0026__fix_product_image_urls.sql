-- Обновление URL изображений товаров на публичные плейсхолдеры
UPDATE products 
SET image_url = 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&h=800&fit=crop'
WHERE image_url LIKE 'file:///%' OR image_url IS NULL OR image_url = '';
