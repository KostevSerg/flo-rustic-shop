ALTER TABLE orders
ADD COLUMN recipient_name VARCHAR(255),
ADD COLUMN recipient_phone VARCHAR(50),
ADD COLUMN sender_name VARCHAR(255),
ADD COLUMN sender_phone VARCHAR(50),
ADD COLUMN delivery_date DATE,
ADD COLUMN delivery_time VARCHAR(50),
ADD COLUMN postcard_text TEXT,
ADD COLUMN payment_method VARCHAR(50) DEFAULT 'cash';