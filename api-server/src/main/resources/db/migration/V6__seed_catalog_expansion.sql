-- Expand the catalog for realistic filtering and variant testing.
-- Products 33-80 cover every supported brand, target, category, and price range.

INSERT IGNORE INTO products
(id, name, price, image, description, quantity, sold, factory, target, category_id, sizes, colors, images, created_at, updated_at)
VALUES
(33, 'Áo thun heavyweight premium', 289000, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80', 'Áo thun cotton day dan, form regular, ben mau va phu hop mac hang ngay.', 180, 24, 'TrendWear', 'Nam', 1, 'S,M,L,XL', 'Den,Trang,Xam', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80', NOW(), NOW()),
(34, 'Áo thun graphic street', 319000, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80', 'Thiet ke graphic noi bat tren nen vai cotton mem, phong cach duong pho.', 160, 31, 'Nike', 'Unisex', 1, 'S,M,L,XL', 'Den,Trang,Do', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80', NOW(), NOW()),
(35, 'Áo thun pastel basic', 229000, 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80', 'Mau pastel nhe, vai thoang va form de phoi cho nhieu phong cach.', 140, 18, 'Uniqlo', 'Nu', 1, 'S,M,L,XL', 'Hong,Be,Xanh nhat', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80', NOW(), NOW()),
(36, 'Áo thun tre em cotton', 179000, 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80', 'Ao thun cotton an toan cho da tre, hoa tiet vui tuoi va de giat.', 130, 12, 'H&M', 'Tre em', 1, 'S,M,L,XL', 'Vang,Xanh,Trang', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80', NOW(), NOW()),
(37, 'Áo thun dry fit running', 399000, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80', 'Vai dry fit nhanh kho, co gian tot cho chay bo va tap luyen.', 125, 40, 'Adidas', 'The thao', 1, 'S,M,L,XL', 'Den,Xanh,Do', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80', NOW(), NOW()),
(38, 'Áo thun linen relaxed', 349000, 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80', 'Chat linen pha cotton mat me, form relaxed thanh lich cho mua he.', 115, 20, 'Zara', 'Nu', 1, 'S,M,L,XL', 'Trang,Be,Xanh', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80', NOW(), NOW()),
(39, 'Sơ mi oxford chống nhăn', 459000, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80', 'So mi oxford it nhan, co ao dung dang va phu hop cong so.', 100, 15, 'Uniqlo', 'Nam', 2, 'S,M,L,XL', 'Trang,Xanh,Xam', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80', NOW(), NOW()),
(40, 'Sơ mi denim overshirt', 529000, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80', 'Overshirt denim day vua, mac doc lap hoac phoi layer deu dep.', 90, 28, 'TrendWear', 'Unisex', 2, 'S,M,L,XL', 'Xanh nhat,Xanh dam', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80', NOW(), NOW()),
(41, 'Sơ mi voan cổ nơ', 489000, 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80', 'So mi voan nhe, co no nu tinh va duoc may tinh te.', 75, 11, 'Zara', 'Nu', 2, 'S,M,L,XL', 'Trang,Den,Be', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80', NOW(), NOW()),
(42, 'Sơ mi kẻ sọc linen', 419000, 'https://images.unsplash.com/photo-1608234807905-4466023792f5?w=800&q=80', 'So mi ke soc linen thoang mat, hop di bien va mac hang ngay.', 85, 19, 'H&M', 'Nam', 2, 'S,M,L,XL', 'Xanh,Trang,Be', 'https://images.unsplash.com/photo-1608234807905-4466023792f5?w=800&q=80', NOW(), NOW()),
(43, 'Sơ mi thể thao quick dry', 439000, 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80', 'So mi the thao nhanh kho, co gian va van dong thoai mai.', 95, 25, 'Nike', 'The thao', 2, 'S,M,L,XL', 'Den,Xam,Xanh', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80', NOW(), NOW()),
(44, 'Sơ mi cổ tròn trẻ em', 259000, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80', 'So mi tre em mem mai, mau sac tuoi sang va de phoi.', 80, 9, 'Adidas', 'Tre em', 2, 'S,M,L,XL', 'Trang,Xanh,Vang', 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80', NOW(), NOW()),
(45, 'Áo khoác bomber nylon', 699000, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80', 'Bomber nylon can gio, lot mem va phu hop phong cach duong pho.', 70, 22, 'TrendWear', 'Nam', 3, 'S,M,L,XL', 'Den,Xanh reu,Be', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80', NOW(), NOW()),
(46, 'Áo khoác denim vintage', 799000, 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&q=80', 'Ao khoac denim wash vintage, form rong va ben dang.', 65, 17, 'Zara', 'Unisex', 3, 'S,M,L,XL', 'Xanh nhat,Xanh dam,Den', 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&q=80', NOW(), NOW()),
(47, 'Áo khoác gió chạy bộ', 649000, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', 'Ao gio sieu nhe, phan quang va thong thoang khi chay bo.', 90, 34, 'Nike', 'The thao', 3, 'S,M,L,XL', 'Den,Xanh,Do', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', NOW(), NOW()),
(48, 'Áo khoác cardigan len', 579000, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80', 'Cardigan len mong am ap, mau trung tinh de phoi quanh nam.', 60, 14, 'Uniqlo', 'Nu', 3, 'S,M,L,XL', 'Be,Xam,Nau', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80', NOW(), NOW()),
(49, 'Áo khoác phao trẻ em', 729000, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80', 'Ao phao nhe cho tre em, giu am tot va co mu ao tien dung.', 55, 8, 'H&M', 'Tre em', 3, 'S,M,L,XL', 'Do,Xanh,Vang', 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80', NOW(), NOW()),
(50, 'Áo khoác training zip', 619000, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80', 'Ao khoac training co gian tot, khoa keo ben va de van dong.', 75, 27, 'Adidas', 'The thao', 3, 'S,M,L,XL', 'Den,Xam,Xanh', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80', NOW(), NOW()),
(51, 'Quần jean straight fit', 599000, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80', 'Jean straight fit ton dang, vai denim ben va mau wash tu nhien.', 100, 23, 'Uniqlo', 'Nam', 4, 'S,M,L,XL', 'Xanh nhat,Xanh dam,Den', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80', NOW(), NOW()),
(52, 'Quần jean mom fit nữ', 629000, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80', 'Mom jean co lung cao, ong dung thoai mai va ton dang.', 85, 29, 'Zara', 'Nu', 4, 'S,M,L,XL', 'Xanh nhat,Xanh dam,Trang', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80', NOW(), NOW()),
(53, 'Quần jean trẻ em co giãn', 389000, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80', 'Quan jean tre em co gian, de mac va phu hop hoat dong.', 90, 16, 'H&M', 'Tre em', 4, 'S,M,L,XL', 'Xanh,Den', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80', NOW(), NOW()),
(54, 'Quần jean cargo utility', 679000, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', 'Quan cargo nhieu tui, form rong va phong cach utility hien dai.', 95, 36, 'TrendWear', 'Unisex', 4, 'S,M,L,XL', 'Den,Kaki,Rieu', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', NOW(), NOW()),
(55, 'Quần jean thể thao denim', 749000, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80', 'Denim co gian cho van dong, ket hop phong cach va su thoai mai.', 70, 18, 'Nike', 'The thao', 4, 'S,M,L,XL', 'Den,Xanh dam,Xam', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80', NOW(), NOW()),
(56, 'Quần jean premium selvedge', 1290000, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80', 'Denim selvedge cao cap, duong may chac chan va mau phai dep.', 45, 12, 'Adidas', 'Nam', 4, 'S,M,L,XL', 'Xanh dam,Den', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80', NOW(), NOW()),
(57, 'Quần tây slim công sở', 549000, 'https://images.unsplash.com/photo-1506629905607-d9c297d1e9da?w=800&q=80', 'Quan tay slim vai tuyet mua it nhan va giu dang tot.', 85, 21, 'TrendWear', 'Nam', 5, 'S,M,L,XL', 'Den,Ghi,Xanh than', 'https://images.unsplash.com/photo-1506629905607-d9c297d1e9da?w=800&q=80', NOW(), NOW()),
(58, 'Quần tây nữ ống đứng', 569000, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80', 'Quan tay ong dung thanh lich, lung cao va de phoi.', 75, 15, 'Zara', 'Nu', 5, 'S,M,L,XL', 'Den,Be,Ghi', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80', NOW(), NOW()),
(59, 'Quần tây linen mùa hè', 499000, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', 'Quan linen thoang mat, ong rong vua va hop thoi tiet nong.', 80, 19, 'Uniqlo', 'Unisex', 5, 'S,M,L,XL', 'Be,Trang,Xam', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', NOW(), NOW()),
(60, 'Quần tây trẻ em lịch sự', 329000, 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&q=80', 'Quan tay tre em dung dang, mem mai va thoai mai khi mac.', 60, 10, 'H&M', 'Tre em', 5, 'S,M,L,XL', 'Den,Ghi,Xanh', 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&q=80', NOW(), NOW()),
(61, 'Quần tây golf co giãn', 699000, 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80', 'Quan co gian cho golf va outdoor, thoat am va de van dong.', 65, 24, 'Nike', 'The thao', 5, 'S,M,L,XL', 'Den,Xam,Xanh', 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80', NOW(), NOW()),
(62, 'Quần tây wool cao cấp', 1590000, 'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=800&q=80', 'Quan wool cao cap, be mat min va giu phom cho su kien quan trong.', 35, 7, 'Adidas', 'Nam', 5, 'S,M,L,XL', 'Den,Xam,Xanh than', 'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=800&q=80', NOW(), NOW()),
(63, 'Áo chạy bộ phản quang', 429000, 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80', 'Ao chay bo co chi phan quang, hut am nhanh va nhe.', 110, 44, 'Nike', 'The thao', 6, 'S,M,L,XL', 'Den,Xanh,Do', 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80', NOW(), NOW()),
(64, 'Quần legging tập luyện', 379000, 'https://images.unsplash.com/photo-1506629905607-d9c297d1e9da?w=800&q=80', 'Legging co gian 4 chieu, om vua va khong trong khi van dong.', 120, 52, 'Adidas', 'Nu', 6, 'S,M,L,XL', 'Den,Xam,Xanh', 'https://images.unsplash.com/photo-1506629905607-d9c297d1e9da?w=800&q=80', NOW(), NOW()),
(65, 'Bộ thể thao trẻ em', 459000, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', 'Bo the thao tre em thoang mat, mau sac tuoi sang va ben.', 70, 18, 'H&M', 'Tre em', 6, 'S,M,L,XL', 'Xanh,Do,Den', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', NOW(), NOW()),
(66, 'Áo polo golf dry fit', 529000, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80', 'Polo dry fit co co ao gon gang va kha nang thoat am tot.', 85, 26, 'Uniqlo', 'Nam', 6, 'S,M,L,XL', 'Trang,Xanh,Den', 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80', NOW(), NOW()),
(67, 'Áo bra thể thao nâng đỡ', 419000, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80', 'Ao bra nang do tot, vai mem va phu hop tap gym.', 95, 33, 'TrendWear', 'Nu', 6, 'S,M,L,XL', 'Den,Do,Xanh', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80', NOW(), NOW()),
(68, 'Áo khoác outdoor chống nước', 1190000, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&q=80', 'Ao outdoor chong nuoc, nhieu tui va phu hop trekking.', 45, 13, 'Zara', 'Unisex', 6, 'S,M,L,XL', 'Den,Rieu,Cam', 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&q=80', NOW(), NOW()),
(69, 'Túi tote canvas', 189000, 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80', 'Tui tote canvas day dan, suc chua tot va dung hang ngay.', 180, 62, 'TrendWear', 'Unisex', 7, 'F', 'Den,Trang,Be', 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80', NOW(), NOW()),
(70, 'Túi đeo chéo mini', 259000, 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=80', 'Tui deo cheo gon nhe, day deo dieu chinh va hop di choi.', 135, 48, 'Nike', 'Nu', 7, 'F', 'Den,Trang,Do', 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=80', NOW(), NOW()),
(71, 'Mũ lưỡi trai thêu logo', 199000, 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80', 'Mu luoi trai cotton, co khoa dieu chinh va logo theu tinh te.', 160, 55, 'Adidas', 'Nam', 7, 'F', 'Den,Trang,Xanh', 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80', NOW(), NOW()),
(72, 'Mũ bucket reversible', 229000, 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800&q=80', 'Mu bucket hai mat, de gap gon va phu hop di bien.', 125, 37, 'Uniqlo', 'Unisex', 7, 'F', 'Be,Den,Xanh', 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800&q=80', NOW(), NOW()),
(73, 'Tất thể thao cổ trung', 99000, 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&q=80', 'Tat the thao co trung, vai cotton co gian va tham hut tot.', 300, 95, 'H&M', 'The thao', 7, 'F', 'Trang,Den,Xam', 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&q=80', NOW(), NOW()),
(74, 'Thắt lưng da tối giản', 349000, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', 'That lung da toi gian, khoa kim loai ben va hop cong so.', 90, 21, 'Zara', 'Nam', 7, 'F', 'Den,Nau', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', NOW(), NOW()),
(75, 'Ví cầm tay canvas', 279000, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80', 'Vi canvas nho gon, nhieu ngan va phu hop su dung hang ngay.', 110, 34, 'TrendWear', 'Nu', 7, 'F', 'Den,Be,Do', 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80', NOW(), NOW()),
(76, 'Balo laptop công sở', 899000, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', 'Balo laptop chong soc, chong tham va co ngan dung do thong minh.', 80, 29, 'Nike', 'Unisex', 7, 'F', 'Den,Xam,Xanh', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', NOW(), NOW()),
(77, 'Túi thể thao du lịch', 759000, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', 'Tui the thao dung tich lon, day deo chac va phu hop du lich.', 65, 18, 'Adidas', 'The thao', 7, 'F', 'Den,Do,Xam', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', NOW(), NOW()),
(78, 'Kính râm thời trang', 449000, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80', 'Kinh ram loc UV, gong nhe va thiet ke hien dai.', 100, 42, 'Uniqlo', 'Nu', 7, 'F', 'Den,Nau,Trong', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80', NOW(), NOW()),
(79, 'Khăn choàng len mềm', 389000, 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80', 'Khan choang len mem, giu am tot va de phoi voi ao khoac.', 75, 16, 'H&M', 'Unisex', 7, 'F', 'Be,Xam,Do', 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80', NOW(), NOW()),
(80, 'Thắt lưng thể thao co giãn', 239000, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', 'That lung co gian nhe, khoa chac va phu hop trang phuc the thao.', 55, 13, 'Zara', 'The thao', 7, 'F', 'Den,Xanh,Do', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', NOW(), NOW());

-- Four size variants for apparel products.
INSERT IGNORE INTO product_variants (product_id, size, color, quantity)
SELECT p.id,
       sizes.size,
       CASE MOD(p.id, 4)
           WHEN 0 THEN 'Den'
           WHEN 1 THEN 'Trang'
           WHEN 2 THEN 'Xanh'
           ELSE 'Xam'
       END,
       20 + MOD(p.id * 7 + sizes.position, 35)
FROM products p
CROSS JOIN (
    SELECT 'S' AS size, 1 AS position
    UNION ALL SELECT 'M', 2
    UNION ALL SELECT 'L', 3
    UNION ALL SELECT 'XL', 4
) sizes
WHERE p.id BETWEEN 33 AND 68;

-- Four color variants for accessories.
INSERT IGNORE INTO product_variants (product_id, size, color, quantity)
SELECT p.id,
       'F',
       colors.color,
       25 + MOD(p.id * 5 + colors.position, 55)
FROM products p
CROSS JOIN (
    SELECT 'Den' AS color, 1 AS position
    UNION ALL SELECT 'Trang', 2
    UNION ALL SELECT 'Be', 3
    UNION ALL SELECT 'Xanh', 4
) colors
WHERE p.id BETWEEN 69 AND 80;

-- Keep aggregate product stock consistent with the generated variants.
UPDATE products p
JOIN (
    SELECT product_id, SUM(quantity) AS total_quantity
    FROM product_variants
    WHERE product_id BETWEEN 33 AND 80
    GROUP BY product_id
) v ON v.product_id = p.id
SET p.quantity = v.total_quantity
WHERE p.id BETWEEN 33 AND 80;
