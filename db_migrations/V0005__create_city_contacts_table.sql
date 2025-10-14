CREATE TABLE IF NOT EXISTS city_contacts (
    id SERIAL PRIMARY KEY,
    city_id INTEGER NOT NULL REFERENCES cities(id),
    phone VARCHAR(50),
    email VARCHAR(100),
    address TEXT,
    working_hours VARCHAR(100),
    delivery_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(city_id)
);

CREATE INDEX idx_city_contacts_city_id ON city_contacts(city_id);

INSERT INTO city_contacts (city_id, phone, email, address, working_hours, delivery_info)
SELECT 
    id,
    '+7 (999) 123-45-67',
    'info@florustic.ru',
    'г. ' || name || ', ул. Цветочная, 15',
    'Круглосуточно',
    'Бесплатная доставка в пределах центра'
FROM cities
ON CONFLICT (city_id) DO NOTHING;