-- Create product_variants table
CREATE TABLE product_variants (
    id BIGINT NOT NULL AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    size VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_variants_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed combinations for Product 1 (Áo thun basic cotton)
-- S: Đen (15), Trắng (20), Xám (10), Xanh dương (5)
-- M: Đen (0), Trắng (100), Xám (20), Xanh dương (10)
-- L: Đen (25), Trắng (30), Xám (15), Xanh dương (10)
-- XL: Đen (10), Trắng (10), Xám (5), Xanh dương (5)
INSERT INTO product_variants (product_id, size, color, quantity) VALUES
(1, 'S', 'Đen', 15), (1, 'S', 'Trắng', 20), (1, 'S', 'Xám', 10), (1, 'S', 'Xanh dương', 5),
(1, 'M', 'Đen', 0), (1, 'M', 'Trắng', 100), (1, 'M', 'Xám', 20), (1, 'M', 'Xanh dương', 10),
(1, 'L', 'Đen', 25), (1, 'L', 'Trắng', 30), (1, 'L', 'Xám', 15), (1, 'L', 'Xanh dương', 10),
(1, 'XL', 'Đen', 10), (1, 'XL', 'Trắng', 10), (1, 'XL', 'Xám', 5), (1, 'XL', 'Xanh dương', 5);

-- Seed combinations for Product 2 (Áo thun oversize in chữ)
INSERT INTO product_variants (product_id, size, color, quantity) VALUES
(2, 'S', 'Đen', 10), (2, 'S', 'Trắng', 15), (2, 'S', 'Xám', 10), (2, 'S', 'Xanh dương', 5),
(2, 'M', 'Đen', 20), (2, 'M', 'Trắng', 20), (2, 'M', 'Xám', 10), (2, 'M', 'Xanh dương', 5),
(2, 'L', 'Đen', 15), (2, 'L', 'Trắng', 15), (2, 'L', 'Xám', 5), (2, 'L', 'Xanh dương', 5),
(2, 'XL', 'Đen', 5), (2, 'XL', 'Trắng', 5), (2, 'XL', 'Xám', 5), (2, 'XL', 'Xanh dương', 5);

-- Seed combinations for Product 4 (Áo sơ mi công sở slim fit)
INSERT INTO product_variants (product_id, size, color, quantity) VALUES
(4, 'S', 'Đen', 10), (4, 'S', 'Trắng', 15), (4, 'S', 'Xám', 5), (4, 'S', 'Xanh dương', 5),
(4, 'M', 'Đen', 15), (4, 'M', 'Trắng', 20), (4, 'M', 'Xám', 5), (4, 'M', 'Xanh dương', 5),
(4, 'L', 'Đen', 10), (4, 'L', 'Trắng', 15), (4, 'L', 'Xám', 5), (4, 'L', 'Xanh dương', 5),
(4, 'XL', 'Đen', 5), (4, 'XL', 'Trắng', 5), (4, 'XL', 'Xám', 2), (4, 'XL', 'Xanh dương', 3);

-- Seed combinations for Product 8 (Áo khoác hoodie nỉ)
INSERT INTO product_variants (product_id, size, color, quantity) VALUES
(8, 'S', 'Đen', 15), (8, 'S', 'Trắng', 15), (8, 'S', 'Xám', 10), (8, 'S', 'Xanh dương', 10),
(8, 'M', 'Đen', 20), (8, 'M', 'Trắng', 20), (8, 'M', 'Xám', 10), (8, 'M', 'Xanh dương', 10),
(8, 'L', 'Đen', 15), (8, 'L', 'Trắng', 15), (8, 'L', 'Xám', 5), (8, 'L', 'Xanh dương', 5),
(8, 'XL', 'Đen', 5), (8, 'XL', 'Trắng', 5), (8, 'XL', 'Xám', 5), (8, 'XL', 'Xanh dương', 5);

-- Seed combinations for Product 10 (Quần jean slim fit)
INSERT INTO product_variants (product_id, size, color, quantity) VALUES
(10, 'S', 'Đen', 20), (10, 'S', 'Trắng', 10), (10, 'S', 'Xám', 10), (10, 'S', 'Xanh dương', 10),
(10, 'M', 'Đen', 25), (10, 'M', 'Trắng', 15), (10, 'M', 'Xám', 10), (10, 'M', 'Xanh dương', 10),
(10, 'L', 'Đen', 20), (10, 'L', 'Trắng', 10), (10, 'L', 'Xám', 5), (10, 'L', 'Xanh dương', 5),
(10, 'XL', 'Đen', 10), (10, 'XL', 'Trắng', 5), (10, 'XL', 'Xám', 5), (10, 'XL', 'Xanh dương', 5);
