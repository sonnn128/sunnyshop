-- Alter tables to add size and color fields
ALTER TABLE products ADD COLUMN sizes VARCHAR(255) DEFAULT NULL;
ALTER TABLE products ADD COLUMN colors VARCHAR(255) DEFAULT NULL;

ALTER TABLE cart_details ADD COLUMN size VARCHAR(50) DEFAULT '';
ALTER TABLE cart_details ADD COLUMN color VARCHAR(50) DEFAULT '';

ALTER TABLE order_details ADD COLUMN size VARCHAR(50) DEFAULT NULL;
ALTER TABLE order_details ADD COLUMN color VARCHAR(50) DEFAULT NULL;

-- Seed sizes and colors for existing clothing/apparel products (category_id 1 to 6)
UPDATE products 
SET sizes = 'S,M,L,XL', colors = 'Đen,Trắng,Xám,Xanh dương'
WHERE category_id IN (1, 2, 3, 4, 5, 6);

-- Seed sizes and colors for accessories (category_id 7)
UPDATE products 
SET sizes = 'F', colors = 'Đen,Trắng,Nâu'
WHERE category_id = 7;