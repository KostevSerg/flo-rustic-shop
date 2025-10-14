CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cities_name ON cities(name);
CREATE INDEX idx_cities_region ON cities(region);

INSERT INTO cities (name, region) VALUES
('Москва', 'Москва'),
('Санкт-Петербург', 'Ленинградская область'),
('Новосибирск', 'Новосибирская область'),
('Екатеринбург', 'Свердловская область'),
('Казань', 'Республика Татарстан'),
('Нижний Новгород', 'Нижегородская область'),
('Челябинск', 'Челябинская область'),
('Самара', 'Самарская область'),
('Омск', 'Омская область'),
('Ростов-на-Дону', 'Ростовская область'),
('Уфа', 'Республика Башкортостан'),
('Красноярск', 'Красноярский край'),
('Воронеж', 'Воронежская область'),
('Пермь', 'Пермский край'),
('Волгоград', 'Волгоградская область');