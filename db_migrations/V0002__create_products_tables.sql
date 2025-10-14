CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    base_price INTEGER NOT NULL,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_city_prices (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    city_id INTEGER NOT NULL REFERENCES cities(id),
    price INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, city_id)
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_product_city_prices_product ON product_city_prices(product_id);
CREATE INDEX idx_product_city_prices_city ON product_city_prices(city_id);

INSERT INTO products (name, description, image_url, base_price, category) VALUES
('Букет "Нежность"', 'Воздушный букет из белых роз и эвкалипта', 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400', 3500, 'roses'),
('Композиция "Весна"', 'Яркая композиция с тюльпанами и фрезией', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400', 2800, 'tulips'),
('Букет "Романтика"', 'Классический букет красных роз', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400', 4200, 'roses'),
('Композиция "Лето"', 'Солнечный букет с подсолнухами', 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400', 3200, 'sunflowers'),
('Букет "Элегантность"', 'Изысканные белые каллы', 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400', 5500, 'callas');