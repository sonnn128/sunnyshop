-- Backfill missing variant attributes for legacy products.
UPDATE products
SET sizes = CASE
    WHEN category_id = 7 THEN 'F'
    ELSE 'S,M,L,XL'
END
WHERE sizes IS NULL OR TRIM(sizes) = '';

UPDATE products
SET colors = CASE
    WHEN category_id = 7 THEN 'Đen,Trắng,Nâu'
    ELSE 'Đen,Trắng,Xám,Xanh dương'
END
WHERE colors IS NULL OR TRIM(colors) = '';

-- Add every advertised size/color combination that is still missing.
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
  AND p.colors IS NOT NULL
  AND sizes.position <= 1 + LENGTH(p.sizes) - LENGTH(REPLACE(p.sizes, ',', ''))
  AND colors.position <= 1 + LENGTH(p.colors) - LENGTH(REPLACE(p.colors, ',', ''))
  AND NOT EXISTS (
      SELECT 1
      FROM product_variants existing
      WHERE existing.product_id = p.id
        AND existing.size = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p.sizes, ',', sizes.position), ',', -1))
        AND existing.color = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p.colors, ',', colors.position), ',', -1))
  );

UPDATE products p
JOIN (
    SELECT product_id, SUM(quantity) AS total_quantity
    FROM product_variants
    GROUP BY product_id
) variants ON variants.product_id = p.id
SET p.quantity = variants.total_quantity;
