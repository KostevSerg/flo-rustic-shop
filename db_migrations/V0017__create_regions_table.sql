-- Создаём таблицу регионов
CREATE TABLE IF NOT EXISTS regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавляем колонку region_id в таблицу cities
ALTER TABLE cities ADD COLUMN IF NOT EXISTS region_id INTEGER;
ALTER TABLE cities ADD COLUMN IF NOT EXISTS timezone VARCHAR(100) DEFAULT 'Europe/Moscow';

-- Заполняем таблицу regions существующими регионами
INSERT INTO regions (name, is_active)
SELECT DISTINCT region, TRUE
FROM cities
WHERE region IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- Связываем города с регионами
UPDATE cities c
SET region_id = r.id
FROM regions r
WHERE c.region = r.name;

-- Создаём индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_cities_region_id ON cities(region_id);
CREATE INDEX IF NOT EXISTS idx_cities_is_active ON cities(is_active);
CREATE INDEX IF NOT EXISTS idx_regions_is_active ON regions(is_active);
