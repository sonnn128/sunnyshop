-- Migration V5: Seed additional rich ecommerce data (Products, Variants, Gallery Images)

INSERT IGNORE INTO products (id, name, price, image, description, quantity, sold, factory, target, category_id, sizes, colors, images, created_at, updated_at) VALUES
(21, 'Áo khoác dù 2 lớp chống nước', 380000, 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80', 'Áo khoác gió thể thao 2 lớp cản gió và chống nước nhẹ cực tốt, phong cách năng động hiện đại.', 120, 45, 'TrendWear', 'Unisex', 3, 'S,M,L,XL', 'Đen,Xanh navy,Rêu', 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80,https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&q=80', NOW(), NOW()),
(22, 'Áo hoodie basic form rộng', 420000, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80', 'Áo hoodie chất nỉ bông cao cấp dày dặn, form unisex trẻ trung, giữ ấm tốt và dễ phối trang phục dạo phố.', 95, 88, 'Adidas', 'Unisex', 3, 'S,M,L,XL', 'Xám,Đen,Be', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80,https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', NOW(), NOW()),
(23, 'Quần jean baggy rách gối', 450000, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80', 'Quần jean form rộng streetwear cá tính, chất bò denim cao cấp bền đẹp, wash màu tự nhiên.', 80, 60, 'Zara', 'Nam', 4, 'S,M,L,XL', 'Xanh nhạt,Xanh đậm', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80,https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80', NOW(), NOW()),
(24, 'Quần short thun thể thao năng động', 220000, 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=800&q=80', 'Quần đùi thun mềm mại thoáng khí, túi có khóa kéo tiện lợi khi chạy bộ, tập gym hoặc mặc nhà.', 150, 110, 'Nike', 'Thể thao', 6, 'M,L,XL', 'Đen,Xám,Xanh', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=800&q=80,https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=800&q=80', NOW(), NOW()),
(25, 'Áo polo phối bo sọc phong cách', 310000, 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=800&q=80', 'Áo thun có cổ chất cá sấu cotton 4 chiều mềm mịn, thấm hút mồ hôi tốt, kiểu dáng lịch thiệp sang trọng.', 90, 75, 'Uniqlo', 'Nam', 1, 'S,M,L,XL', 'Trắng,Đen,Xanh navy', 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=800&q=80', NOW(), NOW()),
(26, 'Áo sơ mi caro flannel dài tay', 360000, 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800&q=80', 'Sơ mi kẻ sọc caro chất dạ mỏng flannel mềm mại, ấm áp, phối cùng áo thun trắng cực kỳ thời trang.', 70, 42, 'H&M', 'Unisex', 2, 'M,L,XL', 'Đỏ caro,Xanh caro', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800&q=80', NOW(), NOW()),
(27, 'Áo blazer Hàn Quốc form suông', 650000, 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80', 'Áo vest blazer 2 lớp form rộng phong cách Hàn Quốc trẻ trung, phù hợp cả đi làm và đi tiệc.', 50, 38, 'Zara', 'Nữ', 3, 'S,M,L', 'Đen,Be,Nâu', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80', NOW(), NOW()),
(28, 'Quần cargo túi hộp ống thụng', 430000, 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&q=80', 'Quần túi hộp đậm chất dạo phố streetwear, chất kaki cotton dày dặn đứng dáng cực ngầu.', 85, 92, 'TrendWear', 'Nam', 4, 'S,M,L,XL', 'Đen,Kaki,Rêu', 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&q=80', NOW(), NOW()),
(29, 'Quần tây âu dáng ôm co giãn', 390000, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80', 'Quần tây công sở vải tuyết mưa mềm mại, chống nhăn, tôn dáng và mang lại vẻ ngoài lịch lãm.', 100, 55, 'Uniqlo', 'Nam', 5, 'S,M,L,XL', 'Đen,Ghi xám,Xanh than', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80', NOW(), NOW()),
(30, 'Balo thời trang chống nước', 290000, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', 'Balo laptop và du lịch đa năng, chống thấm nước, nhiều ngăn tiện ích, quai đeo êm ái trợ lực.', 110, 68, 'TrendWear', 'Unisex', 7, 'F', 'Đen,Xám', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', NOW(), NOW()),
(31, 'Giày sneaker retro cổ thấp', 850000, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'Giày thể thao đế cao su êm ái, kiểu dáng retro cổ điển kết hợp chất liệu da tổng hợp cao cấp.', 60, 135, 'Nike', 'Thể thao', 6, '39,40,41,42,43', 'Trắng,Đen', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', NOW(), NOW()),
(32, 'Mũ bucket vành tròn cá tính', 160000, 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80', 'Mũ bucket tai bèo vành tròn chất vải kaki 2 mặt phong cách unisex, dễ dàng gấp gọn mang theo.', 140, 95, 'Adidas', 'Unisex', 7, 'F', 'Đen,Trắng,Be', 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80', NOW(), NOW());

-- Product Variants for new items
INSERT IGNORE INTO product_variants (product_id, size, color, quantity) VALUES
(21, 'S', 'Đen', 15), (21, 'M', 'Đen', 25), (21, 'L', 'Đen', 20), (21, 'XL', 'Đen', 10),
(21, 'M', 'Xanh navy', 25), (21, 'L', 'Xanh navy', 15), (21, 'M', 'Rêu', 10),
(22, 'S', 'Xám', 15), (22, 'M', 'Xám', 30), (22, 'L', 'Xám', 20), (22, 'M', 'Đen', 20), (22, 'L', 'Be', 10),
(23, 'S', 'Xanh nhạt', 20), (23, 'M', 'Xanh nhạt', 25), (23, 'L', 'Xanh nhạt', 15), (23, 'M', 'Xanh đậm', 20),
(24, 'M', 'Đen', 50), (24, 'L', 'Đen', 50), (24, 'XL', 'Đen', 20), (24, 'L', 'Xám', 30),
(25, 'S', 'Trắng', 20), (25, 'M', 'Trắng', 30), (25, 'L', 'Trắng', 20), (25, 'M', 'Đen', 20),
(26, 'M', 'Đỏ caro', 25), (26, 'L', 'Đỏ caro', 20), (26, 'M', 'Xanh caro', 25),
(27, 'S', 'Đen', 15), (27, 'M', 'Đen', 20), (27, 'M', 'Be', 15),
(28, 'S', 'Đen', 20), (28, 'M', 'Đen', 30), (28, 'L', 'Đen', 20), (28, 'M', 'Kaki', 15),
(29, 'S', 'Đen', 25), (29, 'M', 'Đen', 35), (29, 'L', 'Đen', 25), (29, 'M', 'Ghi xám', 15),
(30, 'F', 'Đen', 70), (30, 'F', 'Xám', 40),
(31, '40', 'Trắng', 20), (31, '41', 'Trắng', 20), (31, '42', 'Trắng', 10), (31, '41', 'Đen', 10),
(32, 'F', 'Đen', 60), (32, 'F', 'Trắng', 50), (32, 'F', 'Be', 30);
