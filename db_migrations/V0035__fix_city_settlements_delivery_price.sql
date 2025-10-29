-- Обновляем стоимость доставки для населенных пунктов, совпадающих с названием города
-- Все города кроме тех, что уже имеют правильную стоимость 500

UPDATE t_p90017259_flo_rustic_shop.settlements s
SET delivery_price = 500.00
FROM t_p90017259_flo_rustic_shop.cities c
WHERE s.city_id = c.id 
  AND s.name = c.name
  AND s.delivery_price != 500.00
  AND c.id NOT IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);