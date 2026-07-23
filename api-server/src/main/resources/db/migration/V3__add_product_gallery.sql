-- Alter products table to add images gallery column
ALTER TABLE products ADD COLUMN images TEXT DEFAULT NULL;

-- Seed multiple images for key clothing/apparel products matching colors: 'Đen,Trắng,Xám,Xanh dương'

-- Product 1: Áo thun basic cotton
UPDATE products 
SET images = 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80,https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80,https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80,https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80'
WHERE id = 1;

-- Product 2: Áo thun oversize in chữ
UPDATE products 
SET images = 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80,https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80,https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80,https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80'
WHERE id = 2;

-- Product 4: Áo sơ mi công sở slim fit
UPDATE products 
SET images = 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80,https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80,https://images.unsplash.com/photo-1621072156002-e2fcc103e86e?w=800&q=80,https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80'
WHERE id = 4;

-- Product 8: Áo khoác hoodie nỉ
UPDATE products 
SET images = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80,https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80,https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80,https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80'
WHERE id = 8;

-- Product 10: Quần jean slim fit
UPDATE products 
SET images = 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80,https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80,https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80,https://images.unsplash.com/photo-1584441401012-45757bd1a2bc?w=800&q=80'
WHERE id = 10;
