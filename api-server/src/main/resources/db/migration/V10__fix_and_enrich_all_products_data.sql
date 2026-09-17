-- Migration V10: Comprehensive update for all products (Images, Color Galleries, Vietnamese Accents, and Variants)

-- 1. Category 1: Áo thun & Polo
UPDATE products SET 
    name = 'Áo thun basic cotton',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Trắng,Xám,Xanh dương',
    image = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80,https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80,https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80,https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
    description = 'Áo thun cotton mềm 100%, thoáng mát, form basic dễ mặc hằng ngày.'
WHERE id = 1;

UPDATE products SET 
    name = 'Áo thun oversize in chữ',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Trắng,Xám,Xanh dương',
    image = 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80,https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80,https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80,https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
    description = 'Thiết kế oversize phong cách streetwear hiện đại, họa tiết in nổi bật bền màu.'
WHERE id = 2;

UPDATE products SET 
    name = 'Áo thun polo thể thao',
    sizes = 'S,M,L,XL',
    colors = 'Trắng,Đen,Xanh navy',
    image = 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=800&q=80,https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=800&q=80,https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=800&q=80',
    description = 'Áo polo thể thao vải cá sấu cotton co giãn 4 chiều, thấm hút mồ hôi tối đa.'
WHERE id = 3;

UPDATE products SET 
    name = 'Áo polo phối bo sọc phong cách',
    sizes = 'S,M,L,XL',
    colors = 'Trắng,Đen,Xanh navy',
    image = 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=800&q=80,https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=800&q=80,https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=800&q=80',
    description = 'Áo thun có cổ chất cá sấu mềm mịn, cổ bo dệt sọc thể thao sang trọng.'
WHERE id = 25;

UPDATE products SET 
    name = 'Áo thun heavyweight premium',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Trắng,Xám',
    image = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80,https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80,https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
    description = 'Áo thun cotton định lượng 250gsm dày dặn đứng dáng, không xù lông, cực bền.'
WHERE id = 33;

UPDATE products SET 
    name = 'Áo thun graphic street',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Trắng,Đỏ',
    image = 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80,https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80,https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80',
    description = 'Thiết kế graphic nổi bật phong cách đường phố trẻ trung, cá tính.'
WHERE id = 34;

UPDATE products SET 
    name = 'Áo thun pastel basic nữ',
    sizes = 'S,M,L,XL',
    colors = 'Hồng,Be,Xanh nhạt',
    image = 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80,https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80,https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
    description = 'Tông màu pastel nhẹ nhàng, chất vải thoáng mát, tôn dáng và dễ phối đồ.'
WHERE id = 35;

UPDATE products SET 
    name = 'Áo thun trẻ em cotton',
    sizes = 'S,M,L,XL',
    colors = 'Vàng,Xanh dương,Trắng',
    image = 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80,https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80,https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80',
    description = 'Chất cotton tự nhiên an toàn cho làn da trẻ nhỏ, họa tiết sinh động đáng yêu.'
WHERE id = 36;

UPDATE products SET 
    name = 'Áo thun dry fit running',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Xanh dương,Đỏ',
    image = 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80,https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80,https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80',
    description = 'Vải dry fit nhanh khô, sợi co giãn chuyên dụng cho tập chạy bộ và thể thao cường độ cao.'
WHERE id = 37;

UPDATE products SET 
    name = 'Áo thun linen relaxed',
    sizes = 'S,M,L,XL',
    colors = 'Trắng,Be,Xanh nhạt',
    image = 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80,https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80,https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80',
    description = 'Chất liệu đũi linen pha cotton mát mẻ, form suông relaxed phóng khoáng mùa hè.'
WHERE id = 38;

-- 2. Category 2: Áo sơ mi
UPDATE products SET 
    name = 'Áo sơ mi công sở slim fit',
    sizes = 'S,M,L,XL',
    colors = 'Trắng,Xanh nhạt,Xám,Đen',
    image = 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80,https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80,https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80,https://images.unsplash.com/photo-1621072156002-e2fcc103e86e?w=800&q=80',
    description = 'Sơ mi slim fit công sở chỉn chu, chống nhăn, cổ áo đứng form lịch thiệp.'
WHERE id = 4;

UPDATE products SET 
    name = 'Áo sơ mi overshirt kẻ sọc',
    sizes = 'S,M,L,XL',
    colors = 'Xanh kẻ,Đỏ kẻ,Đen kẻ',
    image = 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800&q=80,https://images.unsplash.com/photo-1608234807905-4466023792f5?w=800&q=80,https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
    description = 'Sơ mi khoác ngoài overshirt năng động, họa tiết sọc caro trẻ trung cá tính.'
WHERE id = 5;

UPDATE products SET 
    name = 'Áo sơ mi lụa nữ cao cấp',
    sizes = 'S,M,L,XL',
    colors = 'Trắng,Hồng pastel,Be',
    image = 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80,https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80,https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80',
    description = 'Chất lụa ngọc trai mềm mại, bóng nhẹ quý phái, tạo vẻ ngoài sang trọng cho phái nữ.'
WHERE id = 6;

UPDATE products SET 
    name = 'Áo sơ mi caro flannel dài tay',
    sizes = 'M,L,XL',
    colors = 'Đỏ caro,Xanh caro',
    image = 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800&q=80,https://images.unsplash.com/photo-1608234807905-4466023792f5?w=800&q=80',
    description = 'Chất dạ mỏng flannel giữ ấm tốt, dễ mặc layer cùng áo thun trắng thời thượng.'
WHERE id = 26;

UPDATE products SET 
    name = 'Sơ mi oxford chống nhăn',
    sizes = 'S,M,L,XL',
    colors = 'Trắng,Xanh nhạt,Xám',
    image = 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80,https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80,https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80',
    description = 'Vải dệt oxford bền bỉ, ít nhăn sau khi giặt, phù hợp môi trường công sở.'
WHERE id = 39;

UPDATE products SET 
    name = 'Sơ mi denim overshirt',
    sizes = 'S,M,L,XL',
    colors = 'Xanh nhạt,Xanh đậm',
    image = 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80,https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
    description = 'Áo sơ mi bò denim wash cổ điển, mặc như áo khoác ngoài cực chất.'
WHERE id = 40;

UPDATE products SET 
    name = 'Sơ mi voan cổ nơ nữ',
    sizes = 'S,M,L,XL',
    colors = 'Trắng,Đen,Be',
    image = 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80,https://images.unsplash.com/photo-1621072156002-e2fcc103e86e?w=800&q=80,https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80',
    description = 'Thiết kế thắt nơ nữ tính, chất vải voan bay bổng tinh tế điệu đà.'
WHERE id = 41;

UPDATE products SET 
    name = 'Sơ mi kẻ sọc linen',
    sizes = 'S,M,L,XL',
    colors = 'Xanh kẻ,Trắng,Be',
    image = 'https://images.unsplash.com/photo-1608234807905-4466023792f5?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1608234807905-4466023792f5?w=800&q=80,https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80,https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80',
    description = 'Sơ mi đũi sọc thoáng khí, thích hợp đi làm mùa nóng và du lịch dã ngoại.'
WHERE id = 42;

UPDATE products SET 
    name = 'Sơ mi thể thao quick dry',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Xám,Xanh dương',
    image = 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1621072156002-e2fcc103e86e?w=800&q=80,https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80,https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
    description = 'Chất liệu co giãn đặc biệt khô nhanh, thích ứng mọi điều kiện hoạt động ngoài trời.'
WHERE id = 43;

UPDATE products SET 
    name = 'Sơ mi cổ tròn trẻ em',
    sizes = 'S,M,L,XL',
    colors = 'Trắng,Xanh pastel,Vàng nhạt',
    image = 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80,https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80,https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80',
    description = 'Sơ mi cổ tàu cổ tròn cho bé, cúc cài chắc chắn, vải cotton êm dịu.'
WHERE id = 44;

-- 3. Category 3: Áo khoác & Hoodies
UPDATE products SET 
    name = 'Áo khoác bomber basic',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Rêu,Xanh navy',
    image = 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80,https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80,https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&q=80',
    description = 'Bomber cổ bo gân thể thao, khóa kéo kim loại cao cấp, lót dù gió cản gió tốt.'
WHERE id = 7;

UPDATE products SET 
    name = 'Áo khoác hoodie nỉ',
    sizes = 'S,M,L,XL',
    colors = 'Xám,Đen,Be,Xanh navy',
    image = 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80,https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80,https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80,https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
    description = 'Chất nỉ bông ấm áp, có mũ trùm đầu rộng có dây rút, giữ nhiệt lý tưởng.'
WHERE id = 8;

UPDATE products SET 
    name = 'Áo khoác denim wash',
    sizes = 'S,M,L,XL',
    colors = 'Xanh nhạt,Xanh đậm,Đen',
    image = 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&q=80,https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&q=80,https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    description = 'Áo bò denim wash màu tự nhiên, form suông đứng tôn dáng năng động.'
WHERE id = 9;

UPDATE products SET 
    name = 'Áo khoác dù 2 lớp chống nước',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Xanh navy,Rêu',
    image = 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80,https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80,https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&q=80',
    description = 'Áo khoác gió 2 lớp trượt nước, túi kéo khóa kín đáo, có mũ có thể tháo rời.'
WHERE id = 21;

UPDATE products SET 
    name = 'Áo hoodie basic form rộng',
    sizes = 'S,M,L,XL',
    colors = 'Xám,Đen,Be',
    image = 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80,https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80,https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80',
    description = 'Áo hoodie form rộng unisex phong cách Hàn Quốc trẻ trung.'
WHERE id = 22;

UPDATE products SET 
    name = 'Áo blazer Hàn Quốc form suông',
    sizes = 'S,M,L',
    colors = 'Đen,Be,Nâu',
    image = 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80,https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80,https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80',
    description = 'Vest blazer nữ 2 lớp đứng form thanh lịch, dễ phối cả đi làm lẫn dạo phố.'
WHERE id = 27;

UPDATE products SET 
    name = 'Áo khoác bomber nylon',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Xanh rêu,Be',
    image = 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80,https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80,https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80',
    description = 'Bomber chất vải nylon cản gió, nhẹ nhàng và cá tính cho thời trang đường phố.'
WHERE id = 45;

UPDATE products SET 
    name = 'Áo khoác denim vintage',
    sizes = 'S,M,L,XL',
    colors = 'Xanh nhạt,Xanh đậm,Đen',
    image = 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&q=80,https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&q=80,https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    description = 'Phong cách retro vintage hoài cổ, cúc bấm kim loại đồng cổ sang trọng.'
WHERE id = 46;

UPDATE products SET 
    name = 'Áo khoác gió chạy bộ',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Xanh dương,Đỏ',
    image = 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80,https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80,https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    description = 'Áo gió thể thao siêu nhẹ, có chi tiết phản quang an toàn khi chạy ban đêm.'
WHERE id = 47;

UPDATE products SET 
    name = 'Áo khoác cardigan len',
    sizes = 'S,M,L,XL',
    colors = 'Be,Xám,Nâu',
    image = 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80,https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80,https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    description = 'Cardigan len dệt kim mềm mịn, giữ ấm nhẹ nhàng cho tiết trời giao mùa.'
WHERE id = 48;

UPDATE products SET 
    name = 'Áo khoác phao trẻ em',
    sizes = 'S,M,L,XL',
    colors = 'Đỏ,Xanh dương,Vàng',
    image = 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80,https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80,https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80',
    description = 'Áo phao siêu nhẹ chần bông êm ái, cản gió giữ ấm cực tốt cho các bé.'
WHERE id = 49;

UPDATE products SET 
    name = 'Áo khoác training zip',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Xám,Xanh navy',
    image = 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80,https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80,https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80',
    description = 'Áo khoác kéo khóa thể thao, vải co giãn kháng khuẩn, thoáng khí.'
WHERE id = 50;

-- 4. Category 4: Quần jean
UPDATE products SET 
    name = 'Quần jean slim fit',
    sizes = 'S,M,L,XL',
    colors = 'Xanh đậm,Xanh nhạt,Đen,Xám',
    image = 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80,https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80,https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80,https://images.unsplash.com/photo-1584441401012-45757bd1a2bc?w=800&q=80',
    description = 'Quần jean slim fit ôm vừa vặn, chất denim co giãn nhẹ tạo sự thoải mái cả ngày.'
WHERE id = 10;

UPDATE products SET 
    name = 'Quần jean baggy unisex',
    sizes = 'S,M,L,XL',
    colors = 'Xanh nhạt,Xanh đậm,Đen',
    image = 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80,https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80,https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80',
    description = 'Dáng baggy ống suông rộng rãi, phong cách hip hop đường phố cực ngầu.'
WHERE id = 11;

UPDATE products SET 
    name = 'Quần jean nữ ống rộng',
    sizes = 'S,M,L,XL',
    colors = 'Xanh nhạt,Xanh đậm,Trắng',
    image = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80,https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80,https://images.unsplash.com/photo-1584441401012-45757bd1a2bc?w=800&q=80',
    description = 'Thiết kế cạp cao tôn eo, ống rộng suông dài hack dáng cực đỉnh.'
WHERE id = 12;

UPDATE products SET 
    name = 'Quần jean baggy rách gối',
    sizes = 'S,M,L,XL',
    colors = 'Xanh nhạt,Xanh đậm',
    image = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80,https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80',
    description = 'Điểm nhấn rách gối bụi bặm, wash màu cá tính mang hơi thở streetwear.'
WHERE id = 23;

UPDATE products SET 
    name = 'Quần cargo túi hộp ống thụng',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Kaki,Rêu',
    image = 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&q=80,https://images.unsplash.com/photo-1506629905607-d9c297d1e9da?w=800&q=80,https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80',
    description = 'Nhiều ngăn túi hộp tiện dụng, chất kaki dày dặn siêu bền.'
WHERE id = 28;

UPDATE products SET 
    name = 'Quần jean straight fit',
    sizes = 'S,M,L,XL',
    colors = 'Xanh nhạt,Xanh đậm,Đen',
    image = 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80,https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80,https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80',
    description = 'Dáng ống đứng basic kinh điển, phù hợp mọi vóc dáng và dễ phối giày.'
WHERE id = 51;

UPDATE products SET 
    name = 'Quần jean mom fit nữ',
    sizes = 'S,M,L,XL',
    colors = 'Xanh nhạt,Xanh đậm,Trắng',
    image = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80,https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80,https://images.unsplash.com/photo-1584441401012-45757bd1a2bc?w=800&q=80',
    description = 'Mom jean cạp cao thắt eo, ôm phần hông và suông nhẹ ở đùi.'
WHERE id = 52;

UPDATE products SET 
    name = 'Quần jean trẻ em co giãn',
    sizes = 'S,M,L,XL',
    colors = 'Xanh dương,Đen',
    image = 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80,https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80',
    description = 'Quần jean cạp chun mềm mại, co giãn tốt giúp bé thoải mái vận động cả ngày.'
WHERE id = 53;

UPDATE products SET 
    name = 'Quần jean cargo utility',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Kaki,Rêu',
    image = 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&q=80,https://images.unsplash.com/photo-1506629905607-d9c297d1e9da?w=800&q=80,https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
    description = 'Quần jean phong cách dã ngoại utility, túi đa năng có khóa kéo bảo vệ.'
WHERE id = 54;

UPDATE products SET 
    name = 'Quần jean thể thao denim',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Xanh đậm,Xám',
    image = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80,https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80,https://images.unsplash.com/photo-1584441401012-45757bd1a2bc?w=800&q=80',
    description = 'Vải denim kết hợp sợi spandex co giãn thể thao đàn hồi cực êm.'
WHERE id = 55;

UPDATE products SET 
    name = 'Quần jean premium selvedge',
    sizes = 'S,M,L,XL',
    colors = 'Xanh đậm,Đen',
    image = 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80,https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80',
    description = 'Dòng denim selvedge dệt biên đỏ cao cấp, lên màu tự nhiên theo thời gian.'
WHERE id = 56;

-- 5. Category 5: Quần tây & Công sở
UPDATE products SET 
    name = 'Quần tây công sở',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Ghi xám,Xanh than',
    image = 'https://images.unsplash.com/photo-1506629905607-d9c297d1e9da?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1506629905607-d9c297d1e9da?w=800&q=80,https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80,https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=800&q=80',
    description = 'Quần âu vải tuyết mưa cao cấp đứng dáng, cạp ép keo phẳng phiu không nhăn.'
WHERE id = 13;

UPDATE products SET 
    name = 'Quần tây nữ cạp cao',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Be,Ghi',
    image = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80,https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80,https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    description = 'Quần tây nữ cạp cao khóa ẩn sành điệu, tôn đường cong quyến rũ.'
WHERE id = 14;

UPDATE products SET 
    name = 'Quần tây âu dáng ôm co giãn',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Ghi xám,Xanh than',
    image = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1506629905607-d9c297d1e9da?w=800&q=80,https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80,https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=800&q=80',
    description = 'Quần âu form slimfit nhẹ nhàng, co giãn 2 chiều cực thoải mái khi ngồi làm việc.'
WHERE id = 29;

UPDATE products SET 
    name = 'Quần tây slim công sở',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Ghi xám,Xanh than',
    image = 'https://images.unsplash.com/photo-1506629905607-d9c297d1e9da?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1506629905607-d9c297d1e9da?w=800&q=80,https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80,https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=800&q=80',
    description = 'Dáng slim fit trẻ trung, vải mềm mát mịn tay, không bám bụi.'
WHERE id = 57;

UPDATE products SET 
    name = 'Quần tây nữ ống đứng',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Be,Ghi',
    image = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80,https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80,https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    description = 'Ống đứng trang nhã, đường ly dập sắc nét tăng vẻ chuyên nghiệp nơi văn phòng.'
WHERE id = 58;

UPDATE products SET 
    name = 'Quần tây linen mùa hè',
    sizes = 'S,M,L,XL',
    colors = 'Be,Trắng,Xám',
    image = 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80,https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80,https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    description = 'Chất linen sợi tự nhiên thoáng gió, mộc mạc tinh tế cho ngày hè.'
WHERE id = 59;

UPDATE products SET 
    name = 'Quần tây trẻ em lịch sự',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Ghi,Xanh navy',
    image = 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&q=80,https://images.unsplash.com/photo-1506629905607-d9c297d1e9da?w=800&q=80,https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=800&q=80',
    description = 'Thiết kế chỉn chu cho các sự kiện, lễ hội, biểu diễn tại trường.'
WHERE id = 60;

UPDATE products SET 
    name = 'Quần tây golf co giãn',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Xám,Xanh navy',
    image = 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1506629905607-d9c297d1e9da?w=800&q=80,https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80,https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=800&q=80',
    description = 'Quần golf chuyên dụng co giãn 4 chiều, chống tia UV và chống thấm nước nhẹ.'
WHERE id = 61;

UPDATE products SET 
    name = 'Quần tây wool cao cấp',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Xám,Xanh than',
    image = 'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=800&q=80,https://images.unsplash.com/photo-1506629905607-d9c297d1e9da?w=800&q=80,https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    description = 'Chất len lông cừu pha cao cấp mượt mà, giữ phom hoàn hảo cho các dịp trọng đại.'
WHERE id = 62;

-- 6. Category 6: Đồ thể thao & Giày
UPDATE products SET 
    name = 'Quần jogger thể thao',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Xám,Xanh navy',
    image = 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80,https://images.unsplash.com/photo-1506629905607-d9c297d1e9da?w=800&q=80,https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=800&q=80',
    description = 'Quần jogger bo gấu chun mềm, túi khóa zip sâu đựng điện thoại tiện lợi khi chạy bộ.'
WHERE id = 15;

UPDATE products SET 
    name = 'Bộ đồ gym co giãn',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Xám,Xanh rêu',
    image = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80,https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80,https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80',
    description = 'Set quần áo tập gym co giãn đa chiều, thoát mồ hôi nhanh, ôm sát cơ bắp.'
WHERE id = 16;

UPDATE products SET 
    name = 'Áo bra thể thao nâng đỡ',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Đỏ,Xanh dương',
    image = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80,https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80,https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=800&q=80',
    description = 'Áo ngực bra thể thao có đệm mút thoáng khí, đai nâng đỡ ngực chắc chắn khi tập nặng.'
WHERE id = 17;

UPDATE products SET 
    name = 'Quần short thun thể thao năng động',
    sizes = 'M,L,XL',
    colors = 'Đen,Xám,Xanh',
    image = 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=800&q=80,https://images.unsplash.com/photo-1506629905607-d9c297d1e9da?w=800&q=80,https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80',
    description = 'Quần đùi thun mềm mát 2 lớp, xẻ tà linh hoạt cho các bài tập chân và chạy bộ.'
WHERE id = 24;

UPDATE products SET 
    name = 'Giày sneaker retro cổ thấp',
    sizes = '39,40,41,42,43',
    colors = 'Trắng,Đen',
    image = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80,https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&q=80',
    description = 'Sneaker thể thao đế cao su êm ái đàn hồi, đệm bọt khí trợ lực tối đa.'
WHERE id = 31;

UPDATE products SET 
    name = 'Áo chạy bộ phản quang',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Xanh dương,Đỏ',
    image = 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80,https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80,https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
    description = 'Vải dệt kim lưới thoáng khí tổ ong, viền phản quang tăng nhận diện ban đêm.'
WHERE id = 63;

UPDATE products SET 
    name = 'Quần legging tập luyện',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Xám,Xanh navy',
    image = 'https://images.unsplash.com/photo-1506629905607-d9c297d1e9da?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1506629905607-d9c297d1e9da?w=800&q=80,https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=800&q=80,https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80',
    description = 'Quần bó legging cạp cao định hình eo, vải dày dặn không lộ khi squat.'
WHERE id = 64;

UPDATE products SET 
    name = 'Bộ thể thao trẻ em',
    sizes = 'S,M,L,XL',
    colors = 'Xanh dương,Đỏ,Đen',
    image = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80,https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80,https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80',
    description = 'Set bộ thể thao năng động cho bé trai và bé gái chơi đùa sảng khoái.'
WHERE id = 65;

UPDATE products SET 
    name = 'Áo polo golf dry fit',
    sizes = 'S,M,L,XL',
    colors = 'Trắng,Xanh navy,Đen',
    image = 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=800&q=80,https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=800&q=80,https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=800&q=80',
    description = 'Áo polo thể thao cao cấp chống nhăn, cổ áo sắc nét phù hợp trên sân golf.'
WHERE id = 66;

UPDATE products SET 
    name = 'Áo bra thể thao nâng đỡ pro',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Đỏ,Xanh dương',
    image = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80,https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80,https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=800&q=80',
    description = 'Áo bra tập gym cao cấp ôm khít, đai thun co giãn êm ái chống rung lắc.'
WHERE id = 67;

UPDATE products SET 
    name = 'Áo khoác outdoor chống nước',
    sizes = 'S,M,L,XL',
    colors = 'Đen,Rêu,Cam',
    image = 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&q=80,https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80,https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    description = 'Áo khoác leo núi trekking chuyên dụng, chống gió bão và chống thấm mưa tuyệt đối.'
WHERE id = 68;

-- 7. Category 7: Phụ kiện (Mũ, Túi, Tất, Balo, Thắt lưng, Kính, Khăn)
UPDATE products SET 
    name = 'Mũ lưỡi trai basic',
    sizes = 'F',
    colors = 'Đen,Trắng,Nâu',
    image = 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80,https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800&q=80',
    description = 'Mũ lưỡi trai vải kaki cotton 100%, khóa gài kim loại điều chỉnh kích cỡ linh hoạt.'
WHERE id = 18;

UPDATE products SET 
    name = 'Túi tote canvas',
    sizes = 'F',
    colors = 'Đen,Trắng,Nâu',
    image = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80,https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80,https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
    description = 'Túi tote vải canvas dày dặn, có khóa kéo miệng và ngăn con để phụ kiện.'
WHERE id = 19;

UPDATE products SET 
    name = 'Tất cổ cao thể thao',
    sizes = 'F',
    colors = 'Đen,Trắng,Xám',
    image = 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&q=80,https://images.unsplash.com/photo-1582966772680-860e372bb558?w=800&q=80,https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&q=80',
    description = 'Tất dệt vớ cổ cao cotton co giãn êm ái, đệm êm lòng bàn chân khử mùi hôi.'
WHERE id = 20;

UPDATE products SET 
    name = 'Balo thời trang chống nước',
    sizes = 'F',
    colors = 'Đen,Xám',
    image = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80,https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    description = 'Balo đựng vừa laptop 15.6 inch, vải oxford chống thấm, quai đeo êm vai.'
WHERE id = 30;

UPDATE products SET 
    name = 'Mũ bucket vành tròn cá tính',
    sizes = 'F',
    colors = 'Đen,Trắng,Be',
    image = 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800&q=80,https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80',
    description = 'Mũ vành tai bèo chất kaki 2 lớp, dễ dàng gấp gọn mang theo mọi lúc.'
WHERE id = 32;

UPDATE products SET 
    name = 'Túi tote canvas unisex',
    sizes = 'F',
    colors = 'Đen,Trắng,Be',
    image = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80,https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80,https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
    description = 'Túi tote vải mộc phong cách tối giản Nhật Bản, đựng đồ rộng rãi tiện lợi.'
WHERE id = 69;

UPDATE products SET 
    name = 'Túi đeo chéo mini',
    sizes = 'F',
    colors = 'Đen,Trắng,Đỏ',
    image = 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=80,https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=80,https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=80',
    description = 'Túi đeo chéo bao tử nhỏ gọn, dây đeo tùy chỉnh phù hợp dạo phố du lịch.'
WHERE id = 70;

UPDATE products SET 
    name = 'Mũ lưỡi trai thêu logo',
    sizes = 'F',
    colors = 'Đen,Trắng,Xanh',
    image = 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80,https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800&q=80',
    description = 'Mũ kết lưỡi trai thêu logo sắc sảo, chống nắng và thời trang.'
WHERE id = 71;

UPDATE products SET 
    name = 'Mũ bucket reversible hai mặt',
    sizes = 'F',
    colors = 'Be,Đen,Xanh',
    image = 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800&q=80,https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80,https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80',
    description = 'Mũ bucket 2 mặt có thể đổi chiều mặc 2 màu sắc khác nhau độc đáo.'
WHERE id = 72;

UPDATE products SET 
    name = 'Tất thể thao cổ trung',
    sizes = 'F',
    colors = 'Trắng,Đen,Xám',
    image = 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&q=80,https://images.unsplash.com/photo-1582966772680-860e372bb558?w=800&q=80,https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&q=80',
    description = 'Tất thể thao cổ lửng thoáng khí, vải cotton chải kỹ thấm hút mồ hôi tối đa.'
WHERE id = 73;

UPDATE products SET 
    name = 'Thắt lưng da tối giản',
    sizes = 'F',
    colors = 'Đen,Nâu',
    image = 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80,https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80',
    description = 'Dây nịt da bò cao cấp không bong tróc, mặt khóa kim loại sáng bóng sang trọng.'
WHERE id = 74;

UPDATE products SET 
    name = 'Ví cầm tay canvas',
    sizes = 'F',
    colors = 'Đen,Be,Đỏ',
    image = 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80,https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80,https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
    description = 'Ví nhỏ gọn tiện lợi để thẻ ngân hàng, tiền mặt và chìa khóa.'
WHERE id = 75;

UPDATE products SET 
    name = 'Balo laptop công sở',
    sizes = 'F',
    colors = 'Đen,Xám,Xanh navy',
    image = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80,https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80,https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    description = 'Balo công sở sang trọng chống sốc tổ ong, tích hợp cổng sạc USB tiện dụng.'
WHERE id = 76;

UPDATE products SET 
    name = 'Túi thể thao du lịch',
    sizes = 'F',
    colors = 'Đen,Đỏ,Xám',
    image = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80,https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80,https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    description = 'Túi trống thể thao du lịch dung tích 35L có ngăn riêng để giày tiện lợi.'
WHERE id = 77;

UPDATE products SET 
    name = 'Kính râm thời trang',
    sizes = 'F',
    colors = 'Đen,Nâu,Trong suốt',
    image = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80,https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80,https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80',
    description = 'Kính mát chống tia tử ngoại UV400, gọng dẻo nhẹ nhàng không đau sống mũi.'
WHERE id = 78;

UPDATE products SET 
    name = 'Khăn choàng len mềm',
    sizes = 'F',
    colors = 'Be,Xám,Đỏ',
    image = 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80,https://images.unsplash.com/photo-1609803384069-19f3e5a70e75?w=800&q=80,https://images.unsplash.com/photo-1504279328919-cb04cd3be99b?w=800&q=80',
    description = 'Khăn quàng cổ chất len dạ mềm mại ấm áp, phụ kiện hoàn hảo cho mùa thu đông.'
WHERE id = 79;

UPDATE products SET 
    name = 'Thắt lưng thể thao co giãn',
    sizes = 'F',
    colors = 'Đen,Xanh navy,Đỏ',
    image = 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80',
    images = 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80,https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80,https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80',
    description = 'Dây đai vải dệt co giãn đàn hồi, khóa bấm chốt nhanh tiện dụng khi vận động.'
WHERE id = 80;

-- 8. Synchronize all product variants
-- Remove obsolete variants
DELETE FROM product_variants WHERE product_id BETWEEN 1 AND 80;

-- Re-generate every size x color combination with accurate accented names
INSERT INTO product_variants (product_id, size, color, quantity)
SELECT p.id,
       TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p.sizes, ',', sizes.position), ',', -1)),
       TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p.colors, ',', colors.position), ',', -1)),
       15 + MOD(p.id * 13 + sizes.position * 7 + colors.position * 5, 45)
FROM products p
CROSS JOIN (
    SELECT 1 AS position
    UNION ALL SELECT 2
    UNION ALL SELECT 3
    UNION ALL SELECT 4
    UNION ALL SELECT 5
) sizes
CROSS JOIN (
    SELECT 1 AS position
    UNION ALL SELECT 2
    UNION ALL SELECT 3
    UNION ALL SELECT 4
    UNION ALL SELECT 5
) colors
WHERE p.sizes IS NOT NULL
  AND p.colors IS NOT NULL
  AND sizes.position <= 1 + LENGTH(p.sizes) - LENGTH(REPLACE(p.sizes, ',', ''))
  AND colors.position <= 1 + LENGTH(p.colors) - LENGTH(REPLACE(p.colors, ',', ''));

-- 9. Update product total quantities
UPDATE products p
JOIN (
    SELECT product_id, SUM(quantity) AS total_quantity
    FROM product_variants
    GROUP BY product_id
) variants ON variants.product_id = p.id
SET p.quantity = variants.total_quantity;
