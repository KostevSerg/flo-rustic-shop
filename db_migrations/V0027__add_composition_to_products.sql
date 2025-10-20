-- Добавление поля composition (состав) в таблицу products
ALTER TABLE products ADD COLUMN composition TEXT;

-- Комментарий к полю
COMMENT ON COLUMN products.composition IS 'Состав букета/товара';
