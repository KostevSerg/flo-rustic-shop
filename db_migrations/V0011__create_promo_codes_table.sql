-- Создаем таблицу промокодов
CREATE TABLE t_p90017259_flo_rustic_shop.promo_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent INTEGER NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE t_p90017259_flo_rustic_shop.promo_codes IS 'Промокоды для скидок на заказы';
COMMENT ON COLUMN t_p90017259_flo_rustic_shop.promo_codes.code IS 'Уникальный код промокода';
COMMENT ON COLUMN t_p90017259_flo_rustic_shop.promo_codes.discount_percent IS 'Процент скидки от 1 до 100';
COMMENT ON COLUMN t_p90017259_flo_rustic_shop.promo_codes.is_active IS 'Активен ли промокод';

-- Добавляем поле promo_code_id в таблицу заказов
ALTER TABLE t_p90017259_flo_rustic_shop.orders 
ADD COLUMN promo_code_id INTEGER REFERENCES t_p90017259_flo_rustic_shop.promo_codes(id),
ADD COLUMN discount_amount INTEGER DEFAULT 0;

COMMENT ON COLUMN t_p90017259_flo_rustic_shop.orders.promo_code_id IS 'ID использованного промокода';
COMMENT ON COLUMN t_p90017259_flo_rustic_shop.orders.discount_amount IS 'Сумма скидки в рублях';