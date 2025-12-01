ALTER TABLE products 
ADD COLUMN is_gift BOOLEAN DEFAULT FALSE,
ADD COLUMN is_recommended BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN products.is_gift IS 'Отображать товар в разделе "Подарки"';
COMMENT ON COLUMN products.is_recommended IS 'Отображать товар в разделе "Рекомендации"';