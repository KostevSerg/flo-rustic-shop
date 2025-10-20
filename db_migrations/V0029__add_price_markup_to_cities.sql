-- Add price_markup_percent column to cities table
ALTER TABLE cities ADD COLUMN IF NOT EXISTS price_markup_percent DECIMAL(5,2) DEFAULT 0 CHECK (price_markup_percent >= 0 AND price_markup_percent <= 999.99);

COMMENT ON COLUMN cities.price_markup_percent IS 'Percentage markup to apply to base prices for this city (e.g., 10.00 = 10%)';