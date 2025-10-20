-- Обновление правильных контактов для всех городов
UPDATE city_contacts 
SET 
  phone = '+7 995 215-10-96',
  email = 'florustic@yandex.ru'
WHERE city_id IN (SELECT id FROM cities);