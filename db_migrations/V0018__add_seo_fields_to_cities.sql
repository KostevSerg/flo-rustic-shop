-- Add SEO fields to cities table
ALTER TABLE t_p90017259_flo_rustic_shop.cities
ADD COLUMN seo_title VARCHAR(255),
ADD COLUMN seo_description TEXT,
ADD COLUMN seo_keywords TEXT;