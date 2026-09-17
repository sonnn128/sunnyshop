-- Complete size/color variants for every product in the catalog.
-- Earlier migrations only added variants for selected products.

INSERT INTO product_variants (product_id, size, color, quantity)
SELECT p.id,
       TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p.sizes, ',', sizes.position), ',', -1)),
       TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p.colors, ',', colors.position), ',', -1)),
       15 + MOD(p.id * 13 + sizes.position * 5 + colors.position, 46)
FROM products p
CROSS JOIN (
    SELECT 1 AS position
    UNION ALL SELECT 2
    UNION ALL SELECT 3
    UNION ALL SELECT 4
) sizes
CROSS JOIN (
    SELECT 1 AS position
    UNION ALL SELECT 2
    UNION ALL SELECT 3
    UNION ALL SELECT 4
) colors
WHERE p.sizes IS NOT NULL
  AND p.sizes <> ''
  AND p.colors IS NOT NULL
  AND p.colors <> ''
  AND sizes.position <= 1 + LENGTH(p.sizes) - LENGTH(REPLACE(p.sizes, ',', ''))
  AND colors.position <= 1 + LENGTH(p.colors) - LENGTH(REPLACE(p.colors, ',', ''))
  AND NOT EXISTS (
      SELECT 1
      FROM product_variants existing
      WHERE existing.product_id = p.id
        AND existing.size = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p.sizes, ',', sizes.position), ',', -1))
        AND existing.color = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p.colors, ',', colors.position), ',', -1))
  );

-- Keep aggregate stock consistent with the variants for all products.
UPDATE products p
JOIN (
    SELECT product_id, SUM(quantity) AS total_quantity
    FROM product_variants
    GROUP BY product_id
) variants ON variants.product_id = p.id
SET p.quantity = variants.total_quantity;
