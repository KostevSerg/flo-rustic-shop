CREATE TABLE subcategories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, category)
);

ALTER TABLE products ADD COLUMN subcategory_id INTEGER REFERENCES subcategories(id);

CREATE INDEX idx_products_subcategory ON products(subcategory_id);
CREATE INDEX idx_subcategories_category ON subcategories(category);

INSERT INTO subcategories (name, category) VALUES
('Розы', 'Цветы'),
('Альстромерии', 'Цветы'),
('Диантусы', 'Цветы'),
('Хризантемы', 'Цветы'),
('Тюльпаны', 'Цветы'),
('Лилии', 'Цветы'),
('Пионы', 'Цветы'),
('Гвоздики', 'Цветы');