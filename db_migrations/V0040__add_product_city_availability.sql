-- Таблица для хранения информации о доступности товаров в городах
-- По умолчанию все товары доступны везде
-- Записи в этой таблице означают ИСКЛЮЧЕНИЯ (где товар НЕДОСТУПЕН)

CREATE TABLE IF NOT EXISTS t_p90017259_flo_rustic_shop.product_city_exclusions (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    city_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, city_id)
);

CREATE INDEX idx_product_city_exclusions_product ON t_p90017259_flo_rustic_shop.product_city_exclusions(product_id);
CREATE INDEX idx_product_city_exclusions_city ON t_p90017259_flo_rustic_shop.product_city_exclusions(city_id);

COMMENT ON TABLE t_p90017259_flo_rustic_shop.product_city_exclusions IS 'Список городов где товары НЕДОСТУПНЫ (исключения). Если записи нет - товар доступен';