CREATE TABLE IF NOT EXISTS site_texts (
    id SERIAL PRIMARY KEY,
    page VARCHAR(100) NOT NULL,
    key VARCHAR(100) NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(page, key)
);

CREATE INDEX idx_site_texts_page ON site_texts(page);

INSERT INTO site_texts (page, key, value, description) VALUES
('home', 'hero_title', 'Цветы, которые дарят эмоции', 'Заголовок главного экрана'),
('home', 'hero_subtitle', 'Свежие букеты с доставкой по городу. Создаем композиции с душой и вниманием к деталям.', 'Подзаголовок главного экрана'),
('home', 'popular_title', 'Популярные товары', 'Заголовок секции популярных товаров'),
('home', 'popular_subtitle', 'Наши самые любимые композиции, которые выбирают чаще всего', 'Подзаголовок секции популярных товаров'),
('home', 'cities_title', 'Доставка по городам', 'Заголовок секции городов'),
('home', 'cities_subtitle', 'Выберите свой город для просмотра актуального каталога и цен', 'Подзаголовок секции городов'),
('catalog', 'title', 'Каталог', 'Заголовок страницы каталога'),
('catalog', 'subtitle', 'Выберите идеальный букет для любого случая', 'Подзаголовок страницы каталога'),
('footer', 'description', 'Цветочная мастерская с душой. Создаем букеты, которые дарят радость.', 'Описание в футере'),
('contacts', 'phone', '+7 (999) 123-45-67', 'Телефон'),
('contacts', 'email', 'info@florustic.ru', 'Email'),
('contacts', 'address', 'г. Москва, ул. Цветочная, 15', 'Адрес')
ON CONFLICT (page, key) DO NOTHING;