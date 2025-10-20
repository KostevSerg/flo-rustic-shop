-- Обновление контактов всех городов: корректные телефон и email, удаление delivery_info
UPDATE city_contacts 
SET 
  phone = '+7 (999) 123-45-67',
  email = 'info@florustic.ru',
  delivery_info = NULL
WHERE city_id IN (SELECT id FROM cities);