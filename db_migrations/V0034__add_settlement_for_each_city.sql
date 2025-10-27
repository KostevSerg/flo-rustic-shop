-- Добавляем населённый пункт с названием города для каждого города, где его ещё нет
INSERT INTO t_p90017259_flo_rustic_shop.settlements (city_id, name, delivery_price, is_active)
SELECT 
    c.id,
    c.name,
    500.00,
    true
FROM t_p90017259_flo_rustic_shop.cities c
WHERE NOT EXISTS (
    SELECT 1 
    FROM t_p90017259_flo_rustic_shop.settlements s 
    WHERE s.city_id = c.id AND s.name = c.name
);
