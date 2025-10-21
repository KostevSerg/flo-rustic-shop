-- Создаём таблицу для связи товаров с категориями
CREATE TABLE product_categories (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, category)
);

-- Создаём таблицу для связи товаров с подкатегориями
CREATE TABLE product_subcategories (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    subcategory_id INTEGER NOT NULL REFERENCES subcategories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, subcategory_id)
);

-- Мигрируем существующие данные
INSERT INTO product_categories (product_id, category)
SELECT id, category FROM products WHERE category IS NOT NULL;

INSERT INTO product_subcategories (product_id, subcategory_id)
SELECT id, subcategory_id FROM products WHERE subcategory_id IS NOT NULL;

-- Создаём индексы для быстрого поиска
CREATE INDEX idx_product_categories_product_id ON product_categories(product_id);
CREATE INDEX idx_product_categories_category ON product_categories(category);
CREATE INDEX idx_product_subcategories_product_id ON product_subcategories(product_id);
CREATE INDEX idx_product_subcategories_subcategory_id ON product_subcategories(subcategory_id);