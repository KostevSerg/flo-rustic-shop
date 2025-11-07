-- Deactivate duplicate Иркутск cities
UPDATE cities SET is_active = false WHERE id IN (184, 185);

-- Ensure city ID 183 is active
UPDATE cities SET is_active = true WHERE id = 183;