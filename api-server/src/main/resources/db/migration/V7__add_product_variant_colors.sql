-- Add every size/color combination advertised by each expanded product.
-- V6 created only one color for most apparel products. This migration fills
-- the missing combinations without duplicating existing rows.

INSERT INTO product_variants (product_id, size, color, quantity)
SELECT p.id,
       TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p.sizes, ',', numbers.position), ',', -1)),
       TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p.colors, ',', colors.position), ',', -1)),
       18 + MOD(p.id * 11 + numbers.position * 3 + colors.position, 38)
FROM products p
CROSS JOIN (
    SELECT 1 AS position
    UNION ALL SELECT 2
    UNION ALL SELECT 3
    UNION ALL SELECT 4
) numbers
CROSS JOIN (
    SELECT 1 AS position
    UNION ALL SELECT 2
    UNION ALL SELECT 3
    UNION ALL SELECT 4
) colors
WHERE p.id BETWEEN 33 AND 80
  AND numbers.position <= 1 + LENGTH(p.sizes) - LENGTH(REPLACE(p.sizes, ',', ''))
  AND colors.position <= 1 + LENGTH(p.colors) - LENGTH(REPLACE(p.colors, ',', ''))
  AND NOT EXISTS (
      SELECT 1
      FROM product_variants existing
      WHERE existing.product_id = p.id
        AND existing.size = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p.sizes, ',', numbers.position), ',', -1))
        AND existing.color = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p.colors, ',', colors.position), ',', -1))
  );

-- Keep the product-level stock equal to the sum of all variant stocks.
UPDATE products p
JOIN (
    SELECT product_id, SUM(quantity) AS total_quantity
    FROM product_variants
    WHERE product_id BETWEEN 33 AND 80
    GROUP BY product_id
) variants ON variants.product_id = p.id
SET p.quantity = variants.total_quantity
WHERE p.id BETWEEN 33 AND 80;
