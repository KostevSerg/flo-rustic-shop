-- Таблица для управления доступностью товаров по регионам
CREATE TABLE IF NOT EXISTS t_p90017259_flo_rustic_shop.product_region_exclusions (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    region_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, region_id)
);

CREATE INDEX IF NOT EXISTS idx_product_region_exclusions_product ON t_p90017259_flo_rustic_shop.product_region_exclusions(product_id);
CREATE INDEX IF NOT EXISTS idx_product_region_exclusions_region ON t_p90017259_flo_rustic_shop.product_region_exclusions(region_id);