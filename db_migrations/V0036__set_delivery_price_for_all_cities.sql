-- Устанавливаем стоимость доставки 500 рублей для всех населенных пунктов, совпадающих с названием города
UPDATE t_p90017259_flo_rustic_shop.settlements s
SET delivery_price = 500.00
FROM t_p90017259_flo_rustic_shop.cities c
WHERE s.city_id = c.id 
  AND s.name = c.name
  AND c.is_active = true;