-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: laptopshop
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `city` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `phone` varchar(255) DEFAULT NULL,
  `receiver_name` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `ward` varchar(255) DEFAULT NULL,
  `user_id` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1fa36y2oqhao3wgg2rw1pi459` (`user_id`),
  CONSTRAINT `FK1fa36y2oqhao3wgg2rw1pi459` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKpnhnc9urm6fro7oseu9vka70q` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (1,'2026-04-03 07:36:07.990535','Nike','https://res.cloudinary.com/dswdadh2n/image/upload/v1775201765/obuwemufahsaz0fndrbl.jpg','Nike','nike','active','2026-04-03 07:36:07.990535'),(2,'2026-04-03 07:36:51.569456','adidas','https://res.cloudinary.com/dswdadh2n/image/upload/v1775201809/ezllcbev7xqhucqoryux.jpg','Adidas','adidas','active','2026-04-03 07:36:51.569456'),(3,'2026-04-03 07:38:25.550728','zara','https://res.cloudinary.com/dswdadh2n/image/upload/v1775201903/jawlqkwtfkmwqyhl7xca.jpg','Zara','zara','active','2026-04-03 07:38:25.550728'),(4,'2026-04-03 07:39:00.191571','H&M','https://res.cloudinary.com/dswdadh2n/image/upload/v1775201938/w7desw9hqhjx832ppxtg.jpg','H&M','hm','active','2026-04-03 07:39:00.191571'),(5,'2026-04-03 07:40:01.547327','Uniqlo','https://res.cloudinary.com/dswdadh2n/image/upload/v1775201999/cwkf1blqrn2p65famgvp.jpg','Uniqlo','Uniqlo','active','2026-04-03 07:40:01.547327'),(6,'2026-04-03 07:40:40.005478','Gucci','https://res.cloudinary.com/dswdadh2n/image/upload/v1775202037/ubibvnhctot5upcpdfyb.jpg','Gucci','Gucci','active','2026-04-03 07:40:40.005478'),(7,'2026-04-03 07:41:24.705303','Chanel','https://res.cloudinary.com/dswdadh2n/image/upload/v1775202082/si7rsi7fxkseln62naf0.jpg','Chanel','chanel','active','2026-04-03 07:41:24.705303'),(8,'2026-04-03 07:43:34.325890','Dior','https://res.cloudinary.com/dswdadh2n/image/upload/v1775202212/mf2t1qlmegxhghtqbcgr.jpg','Dior','dior','active','2026-04-03 07:43:34.325890');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_details`
--

DROP TABLE IF EXISTS `cart_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_details` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `quantity` bigint DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `cart_id` bigint DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKkcochhsa891wv0s9wrtf36wgt` (`cart_id`),
  KEY `FK9rlic3aynl3g75jvedkx84lhv` (`product_id`),
  CONSTRAINT `FK9rlic3aynl3g75jvedkx84lhv` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKkcochhsa891wv0s9wrtf36wgt` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_details`
--

LOCK TABLES `cart_details` WRITE;
/*!40000 ALTER TABLE `cart_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `sum` int DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK64t7ox312pqal3p7fg9o503c2` (`user_id`),
  CONSTRAINT `FKb5o626f86h46m4s7ms6ginnop` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKoul14ho7bctbefv8jywp5v3i2` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (11,'2026-04-03 06:28:19.299844','áo abcd','https://res.cloudinary.com/dswdadh2n/image/upload/v1775201210/jv6eaz3fo3dsvazsuhsy.jpg','Áo','ao-nam','2026-04-03 07:58:42.997832','active'),(12,'2026-04-03 07:20:54.888581','Quần','https://res.cloudinary.com/dswdadh2n/image/upload/v1775200852/zfzbnwbnll2yuitzd6fs.jpg','Quần ','quan','2026-04-03 07:20:54.888581','active'),(13,'2026-04-03 07:21:33.657089','Váy / Đầm','https://res.cloudinary.com/dswdadh2n/image/upload/v1775200891/f7gv4onjwdeh5gwvsibd.jpg','Váy / Đầm','vay-dam','2026-04-03 07:21:33.657089','active'),(14,'2026-04-03 07:22:19.154753','Đồ thể thao','https://res.cloudinary.com/dswdadh2n/image/upload/v1775200936/isprnn0ivox3twdxzlul.jpg','Đồ thể thao','do-the-thao','2026-04-03 07:22:19.154753','active'),(15,'2026-04-03 07:23:03.074611','Đồ ngủ / đồ mặc nhà','https://res.cloudinary.com/dswdadh2n/image/upload/v1775200980/skb8lchbhzcakoonyj0p.jpg','Đồ ngủ / đồ mặc nhà','do-ngu-mac-tai-nha','2026-04-03 07:23:03.074611','active'),(16,'2026-04-03 07:24:09.521096','Phụ kiện (mũ, túi, thắt lưng, kính…)','https://res.cloudinary.com/dswdadh2n/image/upload/v1775201047/gvgbjgybx6upzylukegm.jpg','Phụ kiện ','phu-kien','2026-04-03 07:24:09.521096','active'),(17,'2026-04-03 07:24:47.107233','Giày dép','https://res.cloudinary.com/dswdadh2n/image/upload/v1775201084/aewtyhymokpybu3cbjbi.jpg','Giày dép','giay-dep','2026-04-03 07:24:47.107233','active');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `code` varchar(255) NOT NULL,
  `discount_amount` double DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `min_order_amount` double DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `discount_type` varchar(255) NOT NULL,
  `discount_value` double NOT NULL,
  `end_date` datetime(6) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `max_discount_amount` double DEFAULT NULL,
  `min_order_value` double DEFAULT NULL,
  `start_date` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `usage_limit` int DEFAULT NULL,
  `used_count` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKeplt0kkm9yf2of2lnx6c1oy9b` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` VALUES (1,_binary '','NAMSALE20',NULL,NULL,NULL,'2026-04-03 00:45:40.565470','PERCENTAGE',20,'2026-04-17 00:00:05.000000',NULL,200000,1000,'2026-04-01 00:00:00.000000','2026-04-03 00:45:40.565470',100,0);
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `quantity` bigint DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKjyu2qbqt8gnvno9oe9j2s2ldk` (`order_id`),
  KEY `FK4q98utpd73imf4yhttm3w0eax` (`product_id`),
  CONSTRAINT `FK4q98utpd73imf4yhttm3w0eax` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKjyu2qbqt8gnvno9oe9j2s2ldk` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `order_date` datetime(6) DEFAULT NULL,
  `receiver_address` varchar(255) DEFAULT NULL,
  `receiver_name` varchar(255) DEFAULT NULL,
  `receiver_phone` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `total_price` double DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` binary(16) DEFAULT NULL,
  `coupon_code` varchar(255) DEFAULT NULL,
  `discount_amount` double DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`),
  CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_token`
--

DROP TABLE IF EXISTS `password_reset_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_token` (
  `id` binary(16) NOT NULL,
  `expires_at` datetime(6) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `user_id` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK83nsrttkwkb6ym0anu051mtxn` (`user_id`),
  CONSTRAINT `FK83nsrttkwkb6ym0anu051mtxn` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_token`
--

LOCK TABLES `password_reset_token` WRITE;
/*!40000 ALTER TABLE `password_reset_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` mediumtext NOT NULL,
  `factory` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `quantity` bigint NOT NULL,
  `sold` bigint DEFAULT NULL,
  `target` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKog2rp4qthbtt2lfyhfo32lsw9` (`category_id`),
  CONSTRAINT `FKog2rp4qthbtt2lfyhfo32lsw9` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (103,'2026-04-03 07:29:14.749665','Short description','Dell','https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m8n9192gupafc6.webp','ÁO CHỐNG NẮNG NAM- LÀM MÁT- THÔNG HƠI',1000000,100000,0,'Gaming','2026-04-06 07:10:13.019555',12),(121,'2026-04-06 07:26:40.884247','Quần Short unisex chất cotton cao cấp,Quần Short nam nữ phong cách thể thao -NANA SHOP.','Nike','https://res.cloudinary.com/dswdadh2n/image/upload/v1778740879/m0tnshbau2hp3ntmxomw.png','Quần Short unisex chất cotton cao cấp,Quần Short nam nữ phong cách thể thao -NANA SHOP.',50000,100000,0,'Unisex','2026-05-14 06:41:20.513052',12),(122,'2026-04-06 07:26:40.935276','Quần Short unisex chất cotton cao cấp,Quần Short nam nữ phong cách thể thao -NANA SHOP.','Nike','https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lju0wkebupz659_tn','Quần Short unisex chất cotton cao cấp,Quần Short nam nữ phong cách thể thao -NANA SHOP.',50001,100001,0,'Unisex','2026-04-06 07:26:40.935276',12),(123,'2026-04-06 07:26:40.940470','Quần Short unisex chất cotton cao cấp,Quần Short nam nữ phong cách thể thao -NANA SHOP.','Nike','https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lju0wkebupz659_tn','Quần Short unisex chất cotton cao cấp,Quần Short nam nữ phong cách thể thao -NANA SHOP.',50002,100002,0,'Unisex','2026-04-06 07:26:40.940470',12),(124,'2026-04-06 07:26:40.943088','Quần Short unisex chất cotton cao cấp,Quần Short nam nữ phong cách thể thao -NANA SHOP.','Nike','https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lju0wkebupz659_tn','Quần Short unisex chất cotton cao cấp,Quần Short nam nữ phong cách thể thao -NANA SHOP.',50003,100002,1,'Unisex','2026-04-14 17:59:03.364755',12),(125,'2026-04-06 07:26:40.948268','Quần Short unisex chất cotton cao cấp,Quần Short nam nữ phong cách thể thao -NANA SHOP.','Nike','https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lju0wkebupz659_tn','Quần Short unisex chất cotton cao cấp,Quần Short nam nữ phong cách thể thao -NANA SHOP.',50004,100004,0,'Unisex','2026-04-06 07:26:40.948268',12),(126,'2026-04-06 07:26:40.951528','Quần Short unisex chất cotton cao cấp,Quần Short nam nữ phong cách thể thao -NANA SHOP.','Nike','https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lju0wkebupz659_tn','Quần Short unisex chất cotton cao cấp,Quần Short nam nữ phong cách thể thao -NANA SHOP.',50005,100005,0,'Unisex','2026-04-06 07:26:40.951528',12),(127,'2026-04-06 07:26:40.954147','Quần Short unisex chất cotton cao cấp,Quần Short nam nữ phong cách thể thao -NANA SHOP.','Nike','https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lju0wkebupz659_tn','Quần Short unisex chất cotton cao cấp,Quần Short nam nữ phong cách thể thao -NANA SHOP.',50006,100006,0,'Unisex','2026-04-06 07:26:40.954147',12),(128,'2026-04-06 07:26:40.958244','Quần Short unisex chất cotton cao cấp,Quần Short nam nữ phong cách thể thao -NANA SHOP.','Nike','https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lju0wkebupz659_tn','Quần Short unisex chất cotton cao cấp,Quần Short nam nữ phong cách thể thao -NANA SHOP.',50007,100007,0,'Unisex','2026-04-06 07:26:40.958244',12),(129,'2026-04-06 07:26:40.960871','Quần Short unisex chất cotton cao cấp,Quần Short nam nữ phong cách thể thao -NANA SHOP.','Nike','https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lju0wkebupz659_tn','Quần Short unisex chất cotton cao cấp,Quần Short nam nữ phong cách thể thao -NANA SHOP.',50008,100008,0,'Unisex','2026-04-06 07:26:40.960871',12),(130,'2026-04-06 07:26:40.963556','Quần Short unisex chất cotton cao cấp,Quần Short nam nữ phong cách thể thao -NANA SHOP.','Nike','https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lju0wkebupz659_tn','Quần Short unisex chất cotton cao cấp,Quần Short nam nữ phong cách thể thao -NANA SHOP.',50009,100008,1,'Unisex','2026-04-14 17:59:03.364755',12),(131,'2026-04-06 07:26:40.967348','Quần Short unisex chất cotton cao cấp,Quần Short nam nữ phong cách thể thao -NANA SHOP.','Nike','https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lju0wkebupz659_tn','Quần Short unisex chất cotton cao cấp,Quần Short nam nữ phong cách thể thao -NANA SHOP.',50010,100010,0,'Unisex','2026-04-06 07:26:40.967348',12);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_token`
--

DROP TABLE IF EXISTS `refresh_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_token` (
  `id` binary(16) NOT NULL,
  `expires_at` datetime(6) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `user_id` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKjtx87i0jvq2svedphegvdwcuy` (`user_id`),
  CONSTRAINT `FKjtx87i0jvq2svedphegvdwcuy` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_token`
--

LOCK TABLES `refresh_token` WRITE;
/*!40000 ALTER TABLE `refresh_token` DISABLE KEYS */;
INSERT INTO `refresh_token` VALUES (_binary 'e��^�L)��\�f\'�','2026-06-05 15:31:17.631128','cf6fff43-fb97-4591-89b4-325249fd88b2',_binary '�c�\Z)�L㜅'),(_binary '�t�G\�*D����\�\�K�','2026-05-06 06:27:28.928614','3467060f-cf5c-4a33-98e7-32a4962c28f0',_binary '�c�\Z)�L㜅'),(_binary '�\�f(\�AF\Z�\�\�*�7�\'','2026-05-03 07:16:12.291008','b7e66cfe-244e-45b3-adf8-fad2f7ee5aa7',_binary '�c�\Z)�L㜅'),(_binary '�%y.$Gو�$�;L�\�','2026-06-05 15:30:53.641803','86281c90-c04f-4b20-a95b-4da5eab7c5cb',_binary '�c�\Z)�L㜅');
/*!40000 ALTER TABLE `refresh_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comment` text,
  `created_at` datetime(6) DEFAULT NULL,
  `rating` int NOT NULL,
  `product_id` bigint NOT NULL,
  `user_id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpl51cejpw4gy5swfar8br9ngi` (`product_id`),
  KEY `FKcgy7qjc1r99dp117y9en6lxye` (`user_id`),
  CONSTRAINT `FKcgy7qjc1r99dp117y9en6lxye` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKpl51cejpw4gy5swfar8br9ngi` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permission`
--

DROP TABLE IF EXISTS `role_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permission` (
  `role_id` varchar(255) NOT NULL,
  `permission_id` varchar(255) NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `FK2xn8qv4vw30i04xdxrpvn3bdi` (`permission_id`),
  CONSTRAINT `FK2xn8qv4vw30i04xdxrpvn3bdi` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`),
  CONSTRAINT `FKtfgq8q9blrp0pt1pvggyli3v9` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permission`
--

LOCK TABLES `role_permission` WRITE;
/*!40000 ALTER TABLE `role_permission` DISABLE KEYS */;
/*!40000 ALTER TABLE `role_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES ('ADMIN'),('USER');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `targets`
--

DROP TABLE IF EXISTS `targets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `targets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKm8qdmd61rfxj9trcutmumqdkd` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `targets`
--

LOCK TABLES `targets` WRITE;
/*!40000 ALTER TABLE `targets` DISABLE KEYS */;
INSERT INTO `targets` VALUES (1,'2026-04-03 07:51:55.528988','Sinh viên','https://res.cloudinary.com/dswdadh2n/image/upload/v1775202713/ntbgwq2po0opwpvz0y5c.jpg','Sinh viên','sinh-vien','active','2026-04-03 07:51:55.528988'),(2,'2026-04-03 07:52:11.678403','nguoi lon',NULL,'Người lớn','nguoi-lon','active','2026-04-03 07:52:11.678403'),(3,'2026-04-03 07:52:29.871449','nam\n',NULL,'Nam','nam','active','2026-04-03 07:52:29.871449'),(4,'2026-04-03 07:52:36.080531','nu',NULL,'Nữ','nu','active','2026-04-03 07:52:36.080531'),(5,'2026-04-03 07:52:46.994096','Unisex',NULL,'Unisex','unisex','active','2026-04-03 07:52:46.994096'),(6,'2026-04-03 07:53:01.756985','teen',NULL,'Teen','teen','active','2026-04-03 07:53:01.756985'),(7,'2026-04-03 07:53:13.326804','Trẻ em',NULL,'Trẻ em','tre-em','active','2026-04-03 07:53:13.326804');
/*!40000 ALTER TABLE `targets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role` (
  `user_id` binary(16) NOT NULL,
  `role_id` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FKt7e7djp752sqn6w22i6ocqy6q` (`role_id`),
  CONSTRAINT `FKj345gk1bovqvfame88rcx7yyx` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKt7e7djp752sqn6w22i6ocqy6q` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES (_binary '�c�\Z)�L㜅','ADMIN');
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` binary(16) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `gender` enum('FEMALE','MALE','OTHER') DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `is_locked` bit(1) DEFAULT NULL,
  `otp_code` varchar(255) DEFAULT NULL,
  `otp_expiry` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (_binary '�c�\Z)�L㜅',NULL,'2025-12-13 09:22:05.671454','admin@laptopshop.com','System Administrator',NULL,'$2a$10$hY2EvOoIYFCEEBPR82Rp3O1Cyh/JbRyHc31kE3MXh7qXZyQ8Itcpe',NULL,'2025-12-13 09:22:05.671456','admin',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlists`
--

DROP TABLE IF EXISTS `wishlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlists` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `product_id` bigint NOT NULL,
  `user_id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKht6e6158srxsvjciahp1kjywf` (`user_id`,`product_id`),
  KEY `FKl7ao98u2bm8nijc1rv4jobcrx` (`product_id`),
  CONSTRAINT `FK330pyw2el06fn5g28ypyljt16` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKl7ao98u2bm8nijc1rv4jobcrx` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlists`
--

LOCK TABLES `wishlists` WRITE;
/*!40000 ALTER TABLE `wishlists` DISABLE KEYS */;
/*!40000 ALTER TABLE `wishlists` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-15  3:48:52
