-- Create settlements for cities that don't have them (72 cities)
INSERT INTO t_p90017259_flo_rustic_shop.settlements (city_id, name, delivery_price, is_active)
SELECT c.id, c.name, 200.00, true
FROM t_p90017259_flo_rustic_shop.cities c
LEFT JOIN t_p90017259_flo_rustic_shop.settlements s ON s.city_id = c.id AND s.name = c.name
WHERE s.id IS NULL;

-- Update delivery price to 200 for all settlements with city names (178 existing + 72 new = 250 total)
UPDATE t_p90017259_flo_rustic_shop.settlements s
SET delivery_price = 200.00, updated_at = CURRENT_TIMESTAMP
FROM t_p90017259_flo_rustic_shop.cities c
WHERE s.city_id = c.id AND s.name = c.name;