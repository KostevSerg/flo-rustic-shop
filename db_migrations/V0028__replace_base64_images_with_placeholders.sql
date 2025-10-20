-- Replace base64 images with placeholder URLs for existing products
UPDATE products 
SET image_url = 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop' 
WHERE LENGTH(image_url) > 1000;
