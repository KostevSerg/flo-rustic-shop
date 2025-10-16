-- Добавляем поле is_featured для маркировки популярных товаров
ALTER TABLE t_p90017259_flo_rustic_shop.products 
ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;

-- Обновляем комментарий к таблице
COMMENT ON COLUMN t_p90017259_flo_rustic_shop.products.is_featured IS 'Отображается ли товар в популярных на главной странице';