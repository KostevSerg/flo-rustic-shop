-- Синхронизация working_hours из cities.work_hours в city_contacts
UPDATE city_contacts cc
SET working_hours = 
  CASE 
    WHEN c.work_hours->>'monday' IS NOT NULL THEN
      (c.work_hours->'monday'->>'from') || ' - ' || (c.work_hours->'monday'->>'to')
    ELSE 
      'Круглосуточно'
  END
FROM cities c
WHERE cc.city_id = c.id;