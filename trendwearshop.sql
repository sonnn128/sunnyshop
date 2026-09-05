-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: laptopshop
-- ------------------------------------------------------
-- Server version	8.0.46

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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (1,'2026-07-23 10:01:36.000000','Thương hiệu nội bộ tập trung vào phong cách trẻ trung và dễ phối.','https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80','TrendWear','trendwear','active','2026-07-23 10:01:36.000000'),(2,'2026-07-23 10:01:36.000000','Trang phục thể thao và lifestyle năng động.','https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80','Nike','nike','active','2026-07-23 10:01:36.000000'),(3,'2026-07-23 10:01:36.000000','Thiết kế thể thao hiện đại, phổ biến và bền bỉ.','https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80','Adidas','adidas','active','2026-07-23 10:01:36.000000'),(4,'2026-07-23 10:01:36.000000','Phong cách tối giản, chất liệu dễ mặc hằng ngày.','https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80','Uniqlo','uniqlo','active','2026-07-23 10:01:36.000000'),(5,'2026-07-23 10:01:36.000000','Thời trang cập nhật xu hướng nhanh, phù hợp đi làm và đi chơi.','https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80','Zara','zara','active','2026-07-23 10:01:36.000000'),(6,'2026-07-23 10:01:36.000000','Nhiều lựa chọn phổ thông, trẻ trung và dễ mặc.','https://images.unsplash.com/photo-1485462537746-965f33f7f6d3?w=800&q=80','H&M','hm','active','2026-07-23 10:01:36.000000');
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
  `size` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKkcochhsa891wv0s9wrtf36wgt` (`cart_id`),
  KEY `FK9rlic3aynl3g75jvedkx84lhv` (`product_id`),
  CONSTRAINT `FK9rlic3aynl3g75jvedkx84lhv` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKkcochhsa891wv0s9wrtf36wgt` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,'2026-07-23 10:03:15.430091',0,'2026-07-23 13:45:09.147070',_binary '\�Ã\�^@�\�\�!r�');
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
  `status` varchar(20) DEFAULT 'active',
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKoul14ho7bctbefv8jywp5v3i2` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'2026-07-23 10:01:36.000000','Danh mục áo thun nam, nữ, form rộng và basic dễ phối.','https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&q=80','Áo thun','ao-thun','active','2026-07-23 10:01:36.000000'),(2,'2026-07-23 10:01:36.000000','Các mẫu sơ mi công sở, casual và overshirt thời trang.','https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80','Áo sơ mi','ao-so-mi','active','2026-07-23 10:01:36.000000'),(3,'2026-07-23 10:01:36.000000','Áo khoác gió, bomber, denim và hoodie cho nhiều mùa.','https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&q=80','Áo khoác','ao-khoac','active','2026-07-23 10:01:36.000000'),(4,'2026-07-23 10:01:36.000000','Quần jean slim, straight, baggy và cargo.','https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80','Quần jean','quan-jean','active','2026-07-23 10:01:36.000000'),(5,'2026-07-23 10:01:36.000000','Quần tây lịch sự cho công sở và sự kiện.','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80','Quần tây','quan-tay','active','2026-07-23 10:01:36.000000'),(6,'2026-07-23 10:01:36.000000','Trang phục tập luyện, chạy bộ, gym và outdoor.','https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80','Đồ thể thao','do-the-thao','active','2026-07-23 10:01:36.000000'),(7,'2026-07-23 10:01:36.000000','Túi, mũ, tất và các phụ kiện thời trang.','https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80','Phụ kiện','phu-kien','active','2026-07-23 10:01:36.000000');
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
  `code` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `discount_type` varchar(255) NOT NULL,
  `discount_value` double NOT NULL,
  `end_date` datetime(6) DEFAULT NULL,
  `active` bit(1) DEFAULT NULL,
  `max_discount_amount` double DEFAULT NULL,
  `min_order_value` double DEFAULT NULL,
  `start_date` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `usage_limit` int DEFAULT NULL,
  `used_count` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKeplt0kkm9yf2of2lnx6c1oy9b` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` VALUES (1,'WELCOME10','2026-07-23 10:01:36.000000','PERCENTAGE',10,'2027-07-23 10:01:36.000000',_binary '',50000,300000,'2026-07-23 10:01:36.000000','2026-07-23 10:01:36.000000',1000,0),(2,'FREESHIP50','2026-07-23 10:01:36.000000','FIXED',50000,'2027-07-23 10:01:36.000000',_binary '',NULL,500000,'2026-07-23 10:01:36.000000','2026-07-23 10:01:36.000000',500,0),(3,'SALE15','2026-07-23 10:01:36.000000','PERCENTAGE',15,'2027-07-23 10:01:36.000000',_binary '',75000,400000,'2026-07-23 10:01:36.000000','2026-07-23 10:01:36.000000',300,0),(4,'BAGDEAL20','2026-07-23 10:01:36.000000','PERCENTAGE',20,'2027-07-23 10:01:36.000000',_binary '',100000,600000,'2026-07-23 10:01:36.000000','2026-07-23 10:01:36.000000',200,0),(5,'VIP100','2026-07-23 10:01:36.000000','FIXED',100000,'2027-07-23 10:01:36.000000',_binary '',NULL,1000000,'2026-07-23 10:01:36.000000','2026-07-23 10:01:36.000000',100,0);
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flyway_schema_history`
--

DROP TABLE IF EXISTS `flyway_schema_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flyway_schema_history` (
  `installed_rank` int NOT NULL,
  `version` varchar(50) DEFAULT NULL,
  `description` varchar(200) NOT NULL,
  `type` varchar(20) NOT NULL,
  `script` varchar(1000) NOT NULL,
  `checksum` int DEFAULT NULL,
  `installed_by` varchar(100) NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `execution_time` int NOT NULL,
  `success` tinyint(1) NOT NULL,
  PRIMARY KEY (`installed_rank`),
  KEY `flyway_schema_history_s_idx` (`success`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flyway_schema_history`
--

LOCK TABLES `flyway_schema_history` WRITE;
/*!40000 ALTER TABLE `flyway_schema_history` DISABLE KEYS */;
INSERT INTO `flyway_schema_history` VALUES (1,'0','<< Flyway Baseline >>','BASELINE','<< Flyway Baseline >>',NULL,'laptopshop','2026-07-23 10:01:36',0,1),(2,'1','seed demo data','SQL','V1__seed_demo_data.sql',-359355287,'laptopshop','2026-07-23 10:01:36',40,1),(3,'2','add product attributes','SQL','V2__add_product_attributes.sql',421828232,'laptopshop','2026-07-23 10:40:18',282,1),(4,'3','add product gallery','SQL','V3__add_product_gallery.sql',-881478058,'laptopshop','2026-07-23 10:43:34',46,1),(5,'4','add product variants','SQL','V4__add_product_variants.sql',-264209292,'laptopshop','2026-07-23 10:47:30',72,1);
/*!40000 ALTER TABLE `flyway_schema_history` ENABLE KEYS */;
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
  `size` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKjyu2qbqt8gnvno9oe9j2s2ldk` (`order_id`),
  KEY `FK4q98utpd73imf4yhttm3w0eax` (`product_id`),
  CONSTRAINT `FK4q98utpd73imf4yhttm3w0eax` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKjyu2qbqt8gnvno9oe9j2s2ldk` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (1,'2026-07-23 13:45:08.777275',199000,2,'2026-07-23 13:45:08.777275',1,1,'M','Xám'),(2,'2026-07-23 13:45:08.802104',199000,1,'2026-07-23 13:45:08.802104',1,1,'L','Xanh dương'),(3,'2026-07-23 13:45:08.816812',399000,1,'2026-07-23 13:45:08.816812',1,10,'M','Trắng'),(4,'2026-07-23 13:45:08.826485',549000,1,'2026-07-23 13:45:08.826485',1,9,'M','Trắng'),(5,'2026-07-23 13:45:08.830923',429000,1,'2026-07-23 13:45:08.830923',1,11,'L','Trắng'),(6,'2026-07-23 13:45:08.837701',429000,1,'2026-07-23 13:45:08.837701',1,11,'L','Xanh dương'),(7,'2026-07-23 13:45:08.843589',449000,1,'2026-07-23 13:45:08.843589',1,12,'M','Đen'),(8,'2026-07-23 13:45:08.848230',299000,1,'2026-07-23 13:45:08.848230',1,17,'S','Xanh dương'),(9,'2026-09-01 21:14:49.726103',199000,1,'2026-09-01 21:14:49.726103',2,1,'S','Xám');
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
  `coupon_code` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `discount_amount` double DEFAULT NULL,
  `order_date` datetime(6) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `receiver_address` varchar(255) DEFAULT NULL,
  `receiver_name` varchar(255) DEFAULT NULL,
  `receiver_phone` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `total_price` double DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`),
  CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,NULL,'2026-07-23 13:45:08.765663',NULL,'2026-07-23 13:45:08.765663','COD','sonvipkl04@gmail.com, HaTinh, adsf 711345','Nguyễn Ngọc Sơn','0815216193','COMPLETED',3151000,'2026-07-23 13:45:25.474554',_binary '\�Ã\�^@�\�\�!r�'),(2,NULL,'2026-09-01 21:14:49.700720',NULL,'2026-09-01 21:14:49.700720','COD','sonvipkl04@gmail.com, HaTinh, adsf 711345','Nguyễn Ngọc Sơn','0815216193','PENDING',199000,'2026-09-01 21:14:49.732347',_binary '\�Ã\�^@�\�\�!r�');
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
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
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
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint NOT NULL,
  `size` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_variants_product` (`product_id`),
  CONSTRAINT `fk_variants_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (1,1,'S','Đen',15),(2,1,'S','Trắng',20),(3,1,'S','Xám',9),(4,1,'S','Xanh dương',5),(5,1,'M','Đen',0),(6,1,'M','Trắng',100),(7,1,'M','Xám',18),(8,1,'M','Xanh dương',10),(9,1,'L','Đen',25),(10,1,'L','Trắng',30),(11,1,'L','Xám',15),(12,1,'L','Xanh dương',9),(13,1,'XL','Đen',10),(14,1,'XL','Trắng',10),(15,1,'XL','Xám',5),(16,1,'XL','Xanh dương',5),(17,2,'S','Đen',10),(18,2,'S','Trắng',15),(19,2,'S','Xám',10),(20,2,'S','Xanh dương',5),(21,2,'M','Đen',20),(22,2,'M','Trắng',20),(23,2,'M','Xám',10),(24,2,'M','Xanh dương',5),(25,2,'L','Đen',15),(26,2,'L','Trắng',15),(27,2,'L','Xám',5),(28,2,'L','Xanh dương',5),(29,2,'XL','Đen',5),(30,2,'XL','Trắng',5),(31,2,'XL','Xám',5),(32,2,'XL','Xanh dương',5),(33,4,'S','Đen',10),(34,4,'S','Trắng',15),(35,4,'S','Xám',5),(36,4,'S','Xanh dương',5),(37,4,'M','Đen',15),(38,4,'M','Trắng',20),(39,4,'M','Xám',5),(40,4,'M','Xanh dương',5),(41,4,'L','Đen',10),(42,4,'L','Trắng',15),(43,4,'L','Xám',5),(44,4,'L','Xanh dương',5),(45,4,'XL','Đen',5),(46,4,'XL','Trắng',5),(47,4,'XL','Xám',2),(48,4,'XL','Xanh dương',3),(49,8,'S','Đen',15),(50,8,'S','Trắng',15),(51,8,'S','Xám',10),(52,8,'S','Xanh dương',10),(53,8,'M','Đen',20),(54,8,'M','Trắng',20),(55,8,'M','Xám',10),(56,8,'M','Xanh dương',10),(57,8,'L','Đen',15),(58,8,'L','Trắng',15),(59,8,'L','Xám',5),(60,8,'L','Xanh dương',5),(61,8,'XL','Đen',5),(62,8,'XL','Trắng',5),(63,8,'XL','Xám',5),(64,8,'XL','Xanh dương',5),(65,10,'S','Đen',20),(66,10,'S','Trắng',10),(67,10,'S','Xám',10),(68,10,'S','Xanh dương',10),(69,10,'M','Đen',25),(70,10,'M','Trắng',14),(71,10,'M','Xám',10),(72,10,'M','Xanh dương',10),(73,10,'L','Đen',20),(74,10,'L','Trắng',10),(75,10,'L','Xám',5),(76,10,'L','Xanh dương',5),(77,10,'XL','Đen',10),(78,10,'XL','Trắng',5),(79,10,'XL','Xám',5),(80,10,'XL','Xanh dương',5),(81,7,'S','Đen',1),(82,7,'S','Trắng',2),(83,7,'S','Xám',3),(84,7,'S','Xanh dương',0),(85,7,'M','Đen',0),(86,7,'M','Trắng',0),(87,7,'M','Xám',0),(88,7,'M','Xanh dương',0),(89,7,'L','Đen',0),(90,7,'L','Trắng',0),(91,7,'L','Xám',0),(92,7,'L','Xanh dương',0),(93,7,'XL','Đen',0),(94,7,'XL','Trắng',0),(95,7,'XL','Xám',0),(96,7,'XL','Xanh dương',0);
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
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
  `sizes` varchar(255) DEFAULT NULL,
  `colors` varchar(255) DEFAULT NULL,
  `images` text,
  PRIMARY KEY (`id`),
  KEY `FKog2rp4qthbtt2lfyhfo32lsw9` (`category_id`),
  CONSTRAINT `FKog2rp4qthbtt2lfyhfo32lsw9` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'2026-07-23 10:01:36.000000','Áo thun cotton mềm, form basic, dễ phối cho đi học và đi làm.','TrendWear','https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80','Áo thun basic cotton',199000,116,19,'Unisex','2026-09-01 21:14:49.734360',1,'S,M,L,XL','Đen,Trắng,Xám,Xanh dương','https://res.cloudinary.com/dswdadh2n/image/upload/v1784804902/limnnwygovk3gpjn1hcz.png,https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80,https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80,https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80'),(2,'2026-07-23 10:01:36.000000','Thiết kế oversize hiện đại với họa tiết in nổi bật.','Zara','https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80','Áo thun oversize in chữ',249000,95,21,'Nam','2026-07-23 10:01:36.000000',1,'S,M,L,XL','Đen,Trắng,Xám,Xanh dương','https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80,https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80,https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80,https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80'),(3,'2026-07-23 10:01:36.000000','Polo thể thao thoáng khí, phù hợp vận động hằng ngày.','Nike','https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=800&q=80','Áo thun polo thể thao',289000,80,18,'Thể thao','2026-07-23 10:01:36.000000',1,'S,M,L,XL','Đen,Trắng,Xám,Xanh dương',NULL),(4,'2026-07-23 10:01:36.000000','Sơ mi slim fit lịch sự, dễ mặc cho môi trường công sở.','Uniqlo','https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80','Áo sơ mi công sở slim fit',329000,70,12,'Nam','2026-07-23 10:01:36.000000',2,'S,M,L,XL','Đen,Trắng,Xám,Xanh dương','https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80,https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80,https://images.unsplash.com/photo-1621072156002-e2fcc103e86e?w=800&q=80,https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80'),(5,'2026-07-23 10:01:36.000000','Sơ mi overshirt trẻ trung, có thể mặc như áo khoác mỏng.','H&M','https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800&q=80','Áo sơ mi overshirt kẻ sọc',359000,65,10,'Unisex','2026-07-23 10:01:36.000000',2,'S,M,L,XL','Đen,Trắng,Xám,Xanh dương',NULL),(6,'2026-07-23 10:01:36.000000','Chất liệu lụa nhẹ, rũ đẹp và sang trọng.','Zara','https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80','Áo sơ mi lụa nữ',379000,55,14,'Nữ','2026-07-23 10:01:36.000000',2,'S,M,L,XL','Đen,Trắng,Xám,Xanh dương',NULL),(7,'2026-07-23 10:01:36.000000','Áo khoác bomber trẻ trung, dễ phối với quần jean.','TrendWear','https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&q=80','Áo khoác bomber basic',499000,6,11,'Unisex','2026-09-01 21:18:51.645983',3,'S,M,L,XL','Đen,Trắng,Xám,Xanh dương',NULL),(8,'2026-07-23 10:01:36.000000','Hoodie nỉ dày vừa, ấm áp cho thời tiết se lạnh.','Adidas','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80','Áo khoác hoodie nỉ',459000,100,30,'Thể thao','2026-07-23 10:01:36.000000',3,'S,M,L,XL','Đen,Trắng,Xám,Xanh dương','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80,https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80,https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80,https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80'),(9,'2026-07-23 10:01:36.000000','Denim wash cá tính, form đứng đẹp.','Levis','https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80','Áo khoác denim wash',549000,44,10,'Nam','2026-07-23 13:45:08.850230',3,'S,M,L,XL','Đen,Trắng,Xám,Xanh dương',NULL),(10,'2026-07-23 10:01:36.000000','Quần jean slim fit dễ mặc, ôm vừa vặn.','TrendWear','https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80','Quần jean slim fit',399000,109,26,'Nam','2026-07-23 13:45:08.820974',4,'S,M,L,XL','Đen,Trắng,Xám,Xanh dương','https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80,https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80,https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80,https://images.unsplash.com/photo-1584441401012-45757bd1a2bc?w=800&q=80'),(11,'2026-07-23 10:01:36.000000','Quần jean baggy thoải mái, hợp phong cách đường phố.','H&M','https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80','Quần jean baggy',429000,86,21,'Unisex','2026-07-23 13:45:08.850230',4,'S,M,L,XL','Đen,Trắng,Xám,Xanh dương',NULL),(12,'2026-07-23 10:01:36.000000','Thiết kế ống rộng thời trang, tôn dáng.','Zara','https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80','Quần jean nữ ống rộng',449000,71,14,'Nữ','2026-07-23 13:45:08.850230',4,'S,M,L,XL','Đen,Trắng,Xám,Xanh dương',NULL),(13,'2026-07-23 10:01:36.000000','Quần tây đứng dáng, lịch sự cho môi trường làm việc.','Uniqlo','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80','Quần tây công sở',369000,90,16,'Nam','2026-07-23 10:01:36.000000',5,'S,M,L,XL','Đen,Trắng,Xám,Xanh dương',NULL),(14,'2026-07-23 10:01:36.000000','Quần tây cạp cao, dễ phối áo sơ mi và áo kiểu.','Zara','https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80','Quần tây nữ cạp cao',389000,68,8,'Nữ','2026-07-23 10:01:36.000000',5,'S,M,L,XL','Đen,Trắng,Xám,Xanh dương',NULL),(15,'2026-07-23 10:01:36.000000','Jogger mềm nhẹ, phù hợp tập luyện và đi lại.','Nike','https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=800&q=80','Quần jogger thể thao',319000,75,22,'Thể thao','2026-07-23 10:01:36.000000',6,'S,M,L,XL','Đen,Trắng,Xám,Xanh dương',NULL),(16,'2026-07-23 10:01:36.000000','Bộ đồ tập co giãn tốt, thoáng khí, hỗ trợ vận động.','Adidas','https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80','Bộ đồ gym co giãn',469000,50,17,'Thể thao','2026-07-23 10:01:36.000000',6,'S,M,L,XL','Đen,Trắng,Xám,Xanh dương',NULL),(17,'2026-07-23 10:01:36.000000','Áo bra thể thao nâng đỡ tốt, thoải mái khi tập.','Nike','https://res.cloudinary.com/dswdadh2n/image/upload/v1784810413/bgjdpknxjttoclnnfuyl.png','Áo bra thể thao',299000,59,15,'Nữ','2026-07-23 13:45:08.850230',6,'S,M,L,XL','Đen,Trắng,Xám,Xanh dương',',,,'),(18,'2026-07-23 10:01:36.000000','Phụ kiện đơn giản, phù hợp đi chơi và du lịch.','TrendWear','https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80','Mũ lưỡi trai basic',159000,140,33,'Unisex','2026-07-23 10:01:36.000000',7,'F','Đen,Trắng,Nâu',NULL),(19,'2026-07-23 10:01:36.000000','Túi tote canvas bền, rộng, tiện dùng hằng ngày.','H&M','https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80','Túi tote canvas',179000,125,26,'Nữ','2026-07-23 10:01:36.000000',7,'F','Đen,Trắng,Nâu',NULL),(20,'2026-07-23 10:01:36.000000','Tất cotton co giãn, thoáng khí, phù hợp sneaker.','Adidas','https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&q=80','Tất cổ cao thể thao',99000,200,40,'Thể thao','2026-07-23 10:01:36.000000',7,'F','Đen,Trắng,Nâu',NULL);
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
INSERT INTO `refresh_token` VALUES (_binary '��=��G؂�=h��','2026-08-22 13:45:19.780672','0e6269a6-3063-4d2c-ad12-b2f98d99da2f',_binary 'ׇ\�&tA���fav��'),(_binary '\\�W\�\�DG�\��>]��','2026-10-01 21:15:04.500030','d2b7db8b-e728-48a4-9bee-3f8735bbd7d6',_binary 'ׇ\�&tA���fav��'),(_binary '^\�I2	@�\�R�T;','2026-08-22 10:41:25.367323','8a38511c-4ff3-43a3-ae34-039ad835e0b6',_binary '\�Ã\�^@�\�\�!r�'),(_binary 'nb\'�n�@b���p�\�','2026-08-22 12:55:25.291038','40875a00-2be6-469b-90b3-fe61df1fbf2b',_binary '\�Ã\�^@�\�\�!r�'),(_binary '��!�j�@��V�q�#3�','2026-08-22 09:41:37.308252','50f307b2-9e1d-4c6c-a40f-1d203c80f697',_binary '\�Ã\�^@�\�\�!r�'),(_binary '�\�tI��J����\�\�\Z\�','2026-10-01 21:14:41.279568','cd1e9b97-d8e9-4649-81f3-dcb8bced850f',_binary '\�Ã\�^@�\�\�!r�');
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
  CONSTRAINT `FKcgy7qjc1r99dp117y9en6lxye` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FKpl51cejpw4gy5swfar8br9ngi` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,'sonvipkl04@gmail.com','2026-07-23 12:55:28.115005',5,19,_binary '\�Ã\�^@�\�\�!r�'),(2,'abcd','2026-09-01 21:28:45.438901',5,12,_binary '\�Ã\�^@�\�\�!r�');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `targets`
--

LOCK TABLES `targets` WRITE;
/*!40000 ALTER TABLE `targets` DISABLE KEYS */;
INSERT INTO `targets` VALUES (1,'2026-07-23 10:01:36.000000','Các mẫu thời trang phù hợp cho nam giới.','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80','Nam','nam','active','2026-07-23 10:01:36.000000'),(2,'2026-07-23 10:01:36.000000','Các mẫu thời trang phù hợp cho nữ giới.','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80','Nữ','nu','active','2026-07-23 10:01:36.000000'),(3,'2026-07-23 10:01:36.000000','Thiết kế trung tính, phù hợp nhiều phong cách.','https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80','Unisex','unisex','active','2026-07-23 10:01:36.000000'),(4,'2026-07-23 10:01:36.000000','Trang phục cho trẻ em và thiếu niên.','https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80','Trẻ em','tre-em','active','2026-07-23 10:01:36.000000'),(5,'2026-07-23 10:01:36.000000','Trang phục phục vụ tập luyện và vận động.','https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80','Thể thao','the-thao','active','2026-07-23 10:01:36.000000');
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
INSERT INTO `user_role` VALUES (_binary 'ׇ\�&tA���fav��','ADMIN'),(_binary '\�Ã\�^@�\�\�!r�','USER');
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
  `avatar` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `gender` enum('FEMALE','MALE','OTHER') DEFAULT NULL,
  `is_locked` bit(1) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (_binary 'ׇ\�&tA���fav��',NULL,NULL,'2026-07-10 14:57:47.554414','admin@laptopshop.com','System Administrator',NULL,_binary '\0','$2a$10$IZlzfh2Eokeb/8KEoFhtJuKjvYX3bn.bNa0y56wLL7rEw8uy/BZcy',NULL,'2026-07-10 14:57:47.554416','admin'),(_binary '\�Ã\�^@�\�\�!r�','sonvipkl04@gmail.com',NULL,'2026-07-23 09:41:35.423602','sonvipkl04@gmail.com','Nguyễn Ngọc Sơn','MALE',_binary '\0','$2a$10$siJYf1nFlKq258wig2x67.A/BlX80E5F1HNYer749h6/D.XEewjQK','0815216193','2026-07-23 09:41:35.423602','sonvipkl04@gmail.com');
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
  CONSTRAINT `FK330pyw2el06fn5g28ypyljt16` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FKl7ao98u2bm8nijc1rv4jobcrx` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlists`
--

LOCK TABLES `wishlists` WRITE;
/*!40000 ALTER TABLE `wishlists` DISABLE KEYS */;
INSERT INTO `wishlists` VALUES (1,'2026-09-01 21:35:38.462263',20,_binary '\�Ã\�^@�\�\�!r�');
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

-- Dump completed on 2026-09-05 16:58:37
