INSERT INTO site_texts (page, key, value, description) 
VALUES 
  ('social', 'whatsapp', 'https://wa.me/79991234567', 'Ссылка на WhatsApp'),
  ('social', 'telegram', 'https://t.me/florustic', 'Ссылка на Telegram'),
  ('social', 'vk', 'https://vk.com/florustic', 'Ссылка на ВКонтакте')
ON CONFLICT DO NOTHING;