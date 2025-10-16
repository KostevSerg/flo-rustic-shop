ALTER TABLE cities ALTER COLUMN work_hours SET DEFAULT '{"from": "00:00", "to": "23:59"}'::jsonb;

UPDATE cities SET work_hours = '{"from": "00:00", "to": "23:59"}'::jsonb WHERE work_hours IS NULL OR work_hours::text = 'null';