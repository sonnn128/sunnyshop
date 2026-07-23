CREATE TABLE IF NOT EXISTS categories (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',
    created_at DATETIME(6),
    updated_at DATETIME(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS brands (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',
    created_at DATETIME(6),
    updated_at DATETIME(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_brands_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS targets (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',
    created_at DATETIME(6),
    updated_at DATETIME(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_targets_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS coupons (
    id BIGINT NOT NULL AUTO_INCREMENT,
    code VARCHAR(255) NOT NULL,
    discount_type VARCHAR(50) NOT NULL,
    discount_value DOUBLE NOT NULL,
    min_order_value DOUBLE,
    max_discount_amount DOUBLE,
    start_date DATETIME(6),
    end_date DATETIME(6),
    usage_limit INT,
    used_count INT DEFAULT 0,
    active BIT(1) DEFAULT b'1',
    created_at DATETIME(6),
    updated_at DATETIME(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_coupons_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price DOUBLE NOT NULL,
    image VARCHAR(255),
    description MEDIUMTEXT NOT NULL,
    quantity BIGINT NOT NULL,
    sold BIGINT DEFAULT 0,
    factory VARCHAR(255),
    target VARCHAR(255),
    category_id BIGINT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    PRIMARY KEY (id),
    KEY idx_products_category_id (category_id),
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO categories (id, name, slug, description, image, status, created_at, updated_at) VALUES
(1, 'Áo thun', 'ao-thun', 'Danh mục áo thun nam, nữ, form rộng và basic dễ phối.', 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&q=80', 'active', NOW(), NOW()),
(2, 'Áo sơ mi', 'ao-so-mi', 'Các mẫu sơ mi công sở, casual và overshirt thời trang.', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80', 'active', NOW(), NOW()),
(3, 'Áo khoác', 'ao-khoac', 'Áo khoác gió, bomber, denim và hoodie cho nhiều mùa.', 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&q=80', 'active', NOW(), NOW()),
(4, 'Quần jean', 'quan-jean', 'Quần jean slim, straight, baggy và cargo.', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80', 'active', NOW(), NOW()),
(5, 'Quần tây', 'quan-tay', 'Quần tây lịch sự cho công sở và sự kiện.', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', 'active', NOW(), NOW()),
(6, 'Đồ thể thao', 'do-the-thao', 'Trang phục tập luyện, chạy bộ, gym và outdoor.', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', 'active', NOW(), NOW()),
(7, 'Phụ kiện', 'phu-kien', 'Túi, mũ, tất và các phụ kiện thời trang.', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80', 'active', NOW(), NOW());

INSERT IGNORE INTO brands (id, name, slug, description, image, status, created_at, updated_at) VALUES
(1, 'TrendWear', 'trendwear', 'Thương hiệu nội bộ tập trung vào phong cách trẻ trung và dễ phối.', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80', 'active', NOW(), NOW()),
(2, 'Nike', 'nike', 'Trang phục thể thao và lifestyle năng động.', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'active', NOW(), NOW()),
(3, 'Adidas', 'adidas', 'Thiết kế thể thao hiện đại, phổ biến và bền bỉ.', 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80', 'active', NOW(), NOW()),
(4, 'Uniqlo', 'uniqlo', 'Phong cách tối giản, chất liệu dễ mặc hằng ngày.', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80', 'active', NOW(), NOW()),
(5, 'Zara', 'zara', 'Thời trang cập nhật xu hướng nhanh, phù hợp đi làm và đi chơi.', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80', 'active', NOW(), NOW()),
(6, 'H&M', 'hm', 'Nhiều lựa chọn phổ thông, trẻ trung và dễ mặc.', 'https://images.unsplash.com/photo-1485462537746-965f33f7f6d3?w=800&q=80', 'active', NOW(), NOW());

INSERT IGNORE INTO targets (id, name, slug, description, image, status, created_at, updated_at) VALUES
(1, 'Nam', 'nam', 'Các mẫu thời trang phù hợp cho nam giới.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80', 'active', NOW(), NOW()),
(2, 'Nữ', 'nu', 'Các mẫu thời trang phù hợp cho nữ giới.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80', 'active', NOW(), NOW()),
(3, 'Unisex', 'unisex', 'Thiết kế trung tính, phù hợp nhiều phong cách.', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80', 'active', NOW(), NOW()),
(4, 'Trẻ em', 'tre-em', 'Trang phục cho trẻ em và thiếu niên.', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80', 'active', NOW(), NOW()),
(5, 'Thể thao', 'the-thao', 'Trang phục phục vụ tập luyện và vận động.', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80', 'active', NOW(), NOW());

INSERT IGNORE INTO coupons (id, code, discount_type, discount_value, min_order_value, max_discount_amount, start_date, end_date, usage_limit, used_count, active, created_at, updated_at) VALUES
(1, 'WELCOME10', 'PERCENTAGE', 10, 300000, 50000, NOW(), DATE_ADD(NOW(), INTERVAL 365 DAY), 1000, 0, b'1', NOW(), NOW()),
(2, 'FREESHIP50', 'FIXED', 50000, 500000, NULL, NOW(), DATE_ADD(NOW(), INTERVAL 365 DAY), 500, 0, b'1', NOW(), NOW()),
(3, 'SALE15', 'PERCENTAGE', 15, 400000, 75000, NOW(), DATE_ADD(NOW(), INTERVAL 365 DAY), 300, 0, b'1', NOW(), NOW()),
(4, 'BAGDEAL20', 'PERCENTAGE', 20, 600000, 100000, NOW(), DATE_ADD(NOW(), INTERVAL 365 DAY), 200, 0, b'1', NOW(), NOW()),
(5, 'VIP100', 'FIXED', 100000, 1000000, NULL, NOW(), DATE_ADD(NOW(), INTERVAL 365 DAY), 100, 0, b'1', NOW(), NOW());

INSERT IGNORE INTO products (id, name, price, image, description, quantity, sold, factory, target, category_id, created_at, updated_at) VALUES
(1, 'Áo thun basic cotton', 199000, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80', 'Áo thun cotton mềm, form basic, dễ phối cho đi học và đi làm.', 120, 15, 'TrendWear', 'Unisex', 1, NOW(), NOW()),
(2, 'Áo thun oversize in chữ', 249000, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80', 'Thiết kế oversize hiện đại với họa tiết in nổi bật.', 95, 21, 'Zara', 'Nam', 1, NOW(), NOW()),
(3, 'Áo thun polo thể thao', 289000, 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=800&q=80', 'Polo thể thao thoáng khí, phù hợp vận động hằng ngày.', 80, 18, 'Nike', 'Thể thao', 1, NOW(), NOW()),
(4, 'Áo sơ mi công sở slim fit', 329000, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80', 'Sơ mi slim fit lịch sự, dễ mặc cho môi trường công sở.', 70, 12, 'Uniqlo', 'Nam', 2, NOW(), NOW()),
(5, 'Áo sơ mi overshirt kẻ sọc', 359000, 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800&q=80', 'Sơ mi overshirt trẻ trung, có thể mặc như áo khoác mỏng.', 65, 10, 'H&M', 'Unisex', 2, NOW(), NOW()),
(6, 'Áo sơ mi lụa nữ', 379000, 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80', 'Chất liệu lụa nhẹ, rũ đẹp và sang trọng.', 55, 14, 'Zara', 'Nữ', 2, NOW(), NOW()),
(7, 'Áo khoác bomber basic', 499000, 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&q=80', 'Áo khoác bomber trẻ trung, dễ phối với quần jean.', 60, 11, 'TrendWear', 'Unisex', 3, NOW(), NOW()),
(8, 'Áo khoác hoodie nỉ', 459000, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', 'Hoodie nỉ dày vừa, ấm áp cho thời tiết se lạnh.', 100, 30, 'Adidas', 'Thể thao', 3, NOW(), NOW()),
(9, 'Áo khoác denim wash', 549000, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80', 'Denim wash cá tính, form đứng đẹp.', 45, 9, 'Levis', 'Nam', 3, NOW(), NOW()),
(10, 'Quần jean slim fit', 399000, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80', 'Quần jean slim fit dễ mặc, ôm vừa vặn.', 110, 25, 'TrendWear', 'Nam', 4, NOW(), NOW()),
(11, 'Quần jean baggy', 429000, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80', 'Quần jean baggy thoải mái, hợp phong cách đường phố.', 88, 19, 'H&M', 'Unisex', 4, NOW(), NOW()),
(12, 'Quần jean nữ ống rộng', 449000, 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80', 'Thiết kế ống rộng thời trang, tôn dáng.', 72, 13, 'Zara', 'Nữ', 4, NOW(), NOW()),
(13, 'Quần tây công sở', 369000, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', 'Quần tây đứng dáng, lịch sự cho môi trường làm việc.', 90, 16, 'Uniqlo', 'Nam', 5, NOW(), NOW()),
(14, 'Quần tây nữ cạp cao', 389000, 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80', 'Quần tây cạp cao, dễ phối áo sơ mi và áo kiểu.', 68, 8, 'Zara', 'Nữ', 5, NOW(), NOW()),
(15, 'Quần jogger thể thao', 319000, 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=800&q=80', 'Jogger mềm nhẹ, phù hợp tập luyện và đi lại.', 75, 22, 'Nike', 'Thể thao', 6, NOW(), NOW()),
(16, 'Bộ đồ gym co giãn', 469000, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', 'Bộ đồ tập co giãn tốt, thoáng khí, hỗ trợ vận động.', 50, 17, 'Adidas', 'Thể thao', 6, NOW(), NOW()),
(17, 'Áo bra thể thao', 299000, 'https://images.unsplash.com/photo-1518988227763-974a19857729?w=800&q=80', 'Áo bra thể thao nâng đỡ tốt, thoải mái khi tập.', 60, 14, 'Nike', 'Nữ', 6, NOW(), NOW()),
(18, 'Mũ lưỡi trai basic', 159000, 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80', 'Phụ kiện đơn giản, phù hợp đi chơi và du lịch.', 140, 33, 'TrendWear', 'Unisex', 7, NOW(), NOW()),
(19, 'Túi tote canvas', 179000, 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80', 'Túi tote canvas bền, rộng, tiện dùng hằng ngày.', 125, 26, 'H&M', 'Nữ', 7, NOW(), NOW()),
(20, 'Tất cổ cao thể thao', 99000, 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&q=80', 'Tất cotton co giãn, thoáng khí, phù hợp sneaker.', 200, 40, 'Adidas', 'Thể thao', 7, NOW(), NOW());