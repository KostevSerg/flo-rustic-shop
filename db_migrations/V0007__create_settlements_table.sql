CREATE TABLE IF NOT EXISTS settlements (
    id SERIAL PRIMARY KEY,
    city_id INTEGER NOT NULL REFERENCES cities(id),
    name VARCHAR(255) NOT NULL,
    delivery_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_settlements_city_id ON settlements(city_id);
CREATE INDEX idx_settlements_active ON settlements(is_active);

INSERT INTO settlements (city_id, name, delivery_price) 
SELECT id, name, 0 FROM cities WHERE is_active = TRUE;