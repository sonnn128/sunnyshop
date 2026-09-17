-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: trendwearshop
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
INSERT INTO `brands` VALUES (1,'2026-07-23 10:01:36.000000','Thương hiệu nội bộ tập trung vào phong cách trẻ trung và dễ phối.','https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80','TrendWear','trendwear','active','2026-07-23 10:01:36.000000'),(2,'2026-07-23 10:01:36.000000','Trang phục thể thao và lifestyle năng động.','https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80','Nike','nike','active','2026-07-23 10:01:36.000000'),(3,'2026-07-23 10:01:36.000000','Thiết kế thể thao hiện đại, phổ biến và bền bỉ.','https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80','Adidas','adidas','active','2026-07-23 10:01:36.000000'),(4,'2026-07-23 10:01:36.000000','Phong cách tối giản, chất liệu dễ mặc hằng ngày.','https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80','Uniqlo','uniqlo','active','2026-07-23 10:01:36.000000'),(5,'2026-07-23 10:01:36.000000','Thời trang cập nhật xu hướng nhanh, phù hợp đi làm và đi chơi.','https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80','Zara','zara','active','2026-07-23 10:01:36.000000'),(6,'2026-07-23 10:01:36.000000','Nhiều lựa chọn phổ thông, trẻ trung và dễ mặc.','https://res.cloudinary.com/dswdadh2n/image/upload/v1789429590/yuqgvqf2cowwj2hycr4v.svg','H&M','hm','active','2026-09-14 23:46:31.986421');
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
INSERT INTO `carts` VALUES (1,'2026-07-23 10:03:15.430091',0,'2026-09-17 14:10:05.638985',_binary '\�Ã\�^@�\�\�!r�');
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
INSERT INTO `flyway_schema_history` VALUES (1,'0','<< Flyway Baseline >>','BASELINE','<< Flyway Baseline >>',NULL,'laptopshop','2026-07-23 10:01:36',0,1),(2,'1','seed demo data','SQL','V1__seed_demo_data.sql',-359355287,'laptopshop','2026-07-23 10:01:36',40,1),(3,'2','add product attributes','SQL','V2__add_product_attributes.sql',421828232,'laptopshop','2026-07-23 10:40:18',282,1),(4,'3','add product gallery','SQL','V3__add_product_gallery.sql',-881478058,'laptopshop','2026-07-23 10:43:34',46,1),(5,'4','add product variants','SQL','V4__add_product_variants.sql',-264209292,'laptopshop','2026-07-23 10:47:30',72,1),(6,'5','seed realistic ecommerce data','SQL','V5__seed_realistic_ecommerce_data.sql',-615595446,'trendwearshop','2026-09-14 14:58:00',60,1),(7,'6','seed catalog expansion','SQL','V6__seed_catalog_expansion.sql',2025373724,'trendwearshop','2026-09-15 00:03:11',75,1),(8,'7','add product variant colors','SQL','V7__add_product_variant_colors.sql',-1770597868,'trendwearshop','2026-09-15 00:09:54',62,1),(9,'8','complete all product variants','SQL','V8__complete_all_product_variants.sql',-695449593,'trendwearshop','2026-09-15 00:14:45',164,1),(10,'9','backfill product attributes and variants','SQL','V9__backfill_product_attributes_and_variants.sql',-245035111,'trendwearshop','2026-09-15 00:19:22',40,1),(11,'10','fix and enrich all products data','SQL','V10__fix_and_enrich_all_products_data.sql',NULL,'trendwearshop','2026-09-15 00:25:20',150,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (1,'2026-07-23 13:45:08.777275',199000,2,'2026-07-23 13:45:08.777275',1,1,'M','Xám'),(2,'2026-07-23 13:45:08.802104',199000,1,'2026-07-23 13:45:08.802104',1,1,'L','Xanh dương'),(4,'2026-07-23 13:45:08.826485',549000,1,'2026-07-23 13:45:08.826485',1,9,'M','Trắng'),(5,'2026-07-23 13:45:08.830923',429000,1,'2026-07-23 13:45:08.830923',1,11,'L','Trắng'),(6,'2026-07-23 13:45:08.837701',429000,1,'2026-07-23 13:45:08.837701',1,11,'L','Xanh dương'),(7,'2026-07-23 13:45:08.843589',449000,1,'2026-07-23 13:45:08.843589',1,12,'M','Đen'),(8,'2026-07-23 13:45:08.848230',299000,1,'2026-07-23 13:45:08.848230',1,17,'S','Xanh dương'),(9,'2026-09-01 21:14:49.726103',199000,1,'2026-09-01 21:14:49.726103',2,1,'S','Xám'),(10,'2026-09-05 17:09:43.267550',329000,1,'2026-09-05 17:09:43.267550',3,4,'S','Trắng'),(11,'2026-09-14 14:58:10.333642',199000,1,'2026-09-14 14:58:10.333648',4,1,'L','Đen'),(12,'2026-09-14 14:58:10.350093',499000,1,'2026-09-14 14:58:10.350094',4,7,'XL','Đen'),(14,'2026-09-14 14:58:10.415878',329000,1,'2026-09-14 14:58:10.415879',5,4,'L','Trắng'),(15,'2026-09-14 14:58:10.457320',420000,1,'2026-09-14 14:58:10.457322',6,22,'L','Xám'),(16,'2026-09-14 14:58:10.584315',379000,1,'2026-09-14 14:58:10.584317',7,6,'M','Trắng'),(17,'2026-09-14 14:58:10.596437',389000,1,'2026-09-14 14:58:10.596439',7,14,'M','Đen'),(18,'2026-09-14 14:58:10.605353',179000,1,'2026-09-14 14:58:10.605357',7,19,'F','Nâu'),(19,'2026-09-14 14:58:10.648337',650000,1,'2026-09-14 14:58:10.648399',8,27,'M','Be'),(20,'2026-09-14 14:58:10.768504',850000,1,'2026-09-14 14:58:10.768504',9,31,'41','Trắng'),(21,'2026-09-14 14:58:10.776156',319000,1,'2026-09-14 14:58:10.776156',9,15,'L','Đen'),(22,'2026-09-14 14:58:10.898816',469000,1,'2026-09-14 14:58:10.898816',10,16,'M','Đen'),(23,'2026-09-14 14:58:11.037377',380000,1,'2026-09-14 14:58:11.037377',11,21,'L','Xanh navy'),(24,'2026-09-14 23:50:04.160952',160000,11,'2026-09-14 23:50:04.160952',12,32,'F','Đen'),(25,'2026-09-14 23:50:04.432429',160000,11,'2026-09-14 23:50:04.432429',13,32,'F','Đen'),(26,'2026-09-14 23:50:17.661007',160000,11,'2026-09-14 23:50:17.661007',14,32,'F','Đen'),(27,'2026-09-14 23:54:02.440334',99000,1,'2026-09-14 23:54:02.440334',15,20,'F','Đen'),(28,'2026-09-14 23:55:46.986030',160000,1,'2026-09-14 23:55:46.986030',16,32,'F','Trắng'),(29,'2026-09-17 14:10:05.477665',389000,1,'2026-09-17 14:10:05.477665',17,79,'F','Cà phê'),(30,'2026-09-17 14:10:05.530612',649000,2,'2026-09-17 14:10:05.530612',17,47,'M','Xanh cây');
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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,NULL,'2026-07-23 13:45:08.765663',NULL,'2026-07-23 13:45:08.765663','COD','sonvipkl04@gmail.com, HaTinh, adsf 711345','Nguyễn Ngọc Sơn','0815216193','COMPLETED',3151000,'2026-07-23 13:45:25.474554',_binary '\�Ã\�^@�\�\�!r�'),(2,NULL,'2026-09-01 21:14:49.700720',NULL,'2026-09-01 21:14:49.700720','COD','sonvipkl04@gmail.com, HaTinh, adsf 711345','Nguyễn Ngọc Sơn','0815216193','PENDING',199000,'2026-09-01 21:14:49.732347',_binary '\�Ã\�^@�\�\�!r�'),(3,NULL,'2026-09-05 17:09:43.256166',NULL,'2026-09-05 17:09:43.256166','COD','sonvipkl04@gmail.com, HaTinh, adsf 711345','Nguyễn Ngọc Sơn','0815216193','PENDING',329000,'2026-09-05 17:09:43.271338',_binary '\�Ã\�^@�\�\�!r�'),(4,NULL,'2026-09-14 14:58:10.301289',NULL,'2026-09-14 14:58:10.301288','COD','123 Cầu Giấy, Quận Cầu Giấy, Hà Nội','Nguyễn Văn An','0912345678','COMPLETED',698000,'2026-09-14 14:58:10.378302',_binary '�N/�Gq�rX\0\�iRm'),(5,NULL,'2026-09-14 14:58:10.397730',NULL,'2026-09-14 14:58:10.397729','VNPAY','123 Cầu Giấy, Quận Cầu Giấy, Hà Nội','Nguyễn Văn An','0912345678','COMPLETED',728000,'2026-09-14 14:58:10.435484',_binary '�N/�Gq�rX\0\�iRm'),(6,NULL,'2026-09-14 14:58:10.447007',NULL,'2026-09-14 14:58:10.447006','COD','123 Cầu Giấy, Quận Cầu Giấy, Hà Nội','Nguyễn Văn An','0912345678','PROCESSING',420000,'2026-09-14 14:58:10.472684',_binary '�N/�Gq�rX\0\�iRm'),(7,NULL,'2026-09-14 14:58:10.574587',NULL,'2026-09-14 14:58:10.574584','MOMO','456 Lê Duẩn, Quận Hải Châu, Đà Nẵng','Trần Thị Bích','0987654321','COMPLETED',947000,'2026-09-14 14:58:10.627915',_binary '�}g�*!N��KBH��'),(8,NULL,'2026-09-14 14:58:10.637462',NULL,'2026-09-14 14:58:10.637461','COD','456 Lê Duẩn, Quận Hải Châu, Đà Nẵng','Trần Thị Bích','0987654321','SHIPPED',650000,'2026-09-14 14:58:10.664132',_binary '�}g�*!N��KBH��'),(9,NULL,'2026-09-14 14:58:10.760339',NULL,'2026-09-14 14:58:10.760339','VNPAY','789 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh','Lê Hoàng Cường','0901234567','COMPLETED',1169000,'2026-09-14 14:58:10.791797',_binary '\��\\�&h@��r6<n�:T'),(10,NULL,'2026-09-14 14:58:10.890487',NULL,'2026-09-14 14:58:10.890487','COD','12 Trần Phú, Quận Ngô Quyền, Hải Phòng','Phạm Thị Dung','0934567890','COMPLETED',469000,'2026-09-14 14:58:10.910684',_binary '�]ʀ\�ET� ^��-'),(11,NULL,'2026-09-14 14:58:11.021427',NULL,'2026-09-14 14:58:11.021427','COD','88 Kim Mã, Quận Ba Đình, Hà Nội','Đặng Quang Minh','0977889900','PENDING',380000,'2026-09-14 14:58:11.057148',_binary 'N9�\\\�E	�A>{G\�'),(12,NULL,'2026-09-14 23:50:04.113812',NULL,'2026-09-14 23:50:04.113812','VNPAY','sonvipkl04@gmail.com, HaTinh, Hà Tĩnh 711345','Nguyễn Ngọc Sơn','0815216193','PENDING',1760000,'2026-09-14 23:50:04.167912',_binary '\�Ã\�^@�\�\�!r�'),(13,NULL,'2026-09-14 23:50:04.408191',NULL,'2026-09-14 23:50:04.408191','VNPAY','sonvipkl04@gmail.com, HaTinh, Hà Tĩnh 711345','Nguyễn Ngọc Sơn','0815216193','PENDING',1760000,'2026-09-14 23:50:04.438137',_binary '\�Ã\�^@�\�\�!r�'),(14,NULL,'2026-09-14 23:50:17.643195',NULL,'2026-09-14 23:50:17.643195','COD','sonvipkl04@gmail.com, HaTinh, Hà Tĩnh 711345','Nguyễn Ngọc Sơn','0815216193','PENDING',1760000,'2026-09-14 23:50:17.664375',_binary '\�Ã\�^@�\�\�!r�'),(15,NULL,'2026-09-14 23:54:02.430280',NULL,'2026-09-14 23:54:02.430280','COD','sonvipkl04@gmail.com, HaTinh, adsf 711345','Nguyễn Ngọc Sơn','0815216193','PENDING',99000,'2026-09-14 23:54:02.445150',_binary '\�Ã\�^@�\�\�!r�'),(16,NULL,'2026-09-14 23:55:46.972907',NULL,'2026-09-14 23:55:46.972907','COD','sonvipkl04@gmail.com, Kỳ Anh, Hà Tĩnh 711345','Nguyễn Ngọc Sơn','0815216193','PENDING',160000,'2026-09-14 23:55:46.989630',_binary '\�Ã\�^@�\�\�!r�'),(17,NULL,'2026-09-17 14:10:05.469818',NULL,'2026-09-17 14:10:05.469818','COD','sonvipkl04@gmail.com, Ha Noi, Ha Tinh  220202','Nguyễn Ngọc Sơn','0815216193','PENDING',1687000,'2026-09-17 14:10:05.546941',_binary '\�Ã\�^@�\�\�!r�');
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
) ENGINE=InnoDB AUTO_INCREMENT=4495 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (3274,31,'43','Trắng',53),(3277,3,'XL','Trắng',42),(3278,4,'XL','Trắng',55),(3280,6,'XL','Trắng',36),(3281,7,'XL','Đen',49),(3282,8,'XL','Xám',17),(3283,9,'XL','Xanh nhạt',30),(3285,11,'XL','Xanh nhạt',56),(3289,15,'XL','Đen',18),(3293,22,'XL','Xám',19),(3294,23,'XL','Xanh nhạt',32),(3295,25,'XL','Trắng',58),(3296,28,'XL','Đen',52),(3297,29,'XL','Đen',20),(3298,31,'42','Trắng',46),(3299,33,'XL','Đen',27),(3303,37,'XL','Đen',34),(3305,39,'XL','Trắng',15),(3306,40,'XL','Xanh nhạt',28),(3310,44,'XL','Trắng',35),(3312,46,'XL','Xanh nhạt',16),(3337,3,'L','Trắng',35),(3338,4,'L','Trắng',48),(3340,6,'L','Trắng',29),(3341,7,'L','Đen',42),(3342,8,'L','Xám',55),(3343,9,'L','Xanh nhạt',23),(3345,11,'L','Xanh nhạt',49),(3349,15,'L','Đen',56),(3353,22,'L','Xám',57),(3354,23,'L','Xanh nhạt',25),(3355,24,'XL','Đen',38),(3356,25,'L','Trắng',51),(3358,27,'L','Đen',32),(3359,28,'L','Đen',45),(3360,29,'L','Đen',58),(3361,31,'41','Trắng',39),(3362,33,'L','Đen',20),(3366,37,'L','Đen',27),(3368,39,'L','Trắng',53),(3369,40,'L','Xanh nhạt',21),(3373,44,'L','Trắng',28),(3375,46,'L','Xanh nhạt',54),(3400,3,'M','Trắng',28),(3401,4,'M','Trắng',41),(3403,6,'M','Trắng',22),(3404,7,'M','Đen',35),(3405,8,'M','Xám',48),(3406,9,'M','Xanh nhạt',16),(3408,11,'M','Xanh nhạt',42),(3412,15,'M','Đen',49),(3416,22,'M','Xám',50),(3417,23,'M','Xanh nhạt',18),(3418,24,'L','Đen',31),(3419,25,'M','Trắng',44),(3421,27,'M','Đen',25),(3422,28,'M','Đen',38),(3423,29,'M','Đen',51),(3424,31,'40','Trắng',32),(3425,33,'M','Đen',58),(3429,37,'M','Đen',20),(3431,39,'M','Trắng',46),(3432,40,'M','Xanh nhạt',59),(3436,44,'M','Trắng',21),(3438,46,'M','Xanh nhạt',47),(3463,3,'S','Trắng',21),(3464,4,'S','Trắng',34),(3466,6,'S','Trắng',15),(3467,7,'S','Đen',28),(3468,8,'S','Xám',41),(3469,9,'S','Xanh nhạt',54),(3471,11,'S','Xanh nhạt',35),(3475,15,'S','Đen',42),(3480,20,'F','Đen',17),(3482,22,'S','Xám',43),(3483,23,'S','Xanh nhạt',56),(3484,24,'M','Đen',24),(3485,25,'S','Trắng',37),(3487,27,'S','Đen',18),(3488,28,'S','Đen',31),(3489,29,'S','Đen',44),(3491,31,'39','Trắng',25),(3492,32,'F','Đen',38),(3493,33,'S','Đen',51),(3497,37,'S','Đen',58),(3499,39,'S','Trắng',39),(3500,40,'S','Xanh nhạt',52),(3504,44,'S','Trắng',59),(3506,46,'S','Xanh nhạt',40),(3534,74,'F','Đen',44),(3540,31,'43','Đen',58),(3543,3,'XL','Đen',47),(3544,4,'XL','Xanh nhạt',15),(3546,6,'XL','Hồng pastel',41),(3547,7,'XL','Rêu',54),(3548,8,'XL','Đen',22),(3549,9,'XL','Xanh đậm',35),(3551,11,'XL','Xanh đậm',16),(3555,15,'XL','Xám',23),(3559,22,'XL','Đen',24),(3560,23,'XL','Xanh đậm',37),(3561,25,'XL','Đen',18),(3562,28,'XL','Kaki',57),(3563,29,'XL','Ghi xám',25),(3564,31,'42','Đen',51),(3565,33,'XL','Trắng',32),(3569,37,'XL','Xanh dương',39),(3571,39,'XL','Xanh nhạt',20),(3572,40,'XL','Xanh đậm',33),(3576,44,'XL','Xanh pastel',40),(3578,46,'XL','Xanh đậm',21),(3603,3,'L','Đen',40),(3604,4,'L','Xanh nhạt',53),(3606,6,'L','Hồng pastel',34),(3607,7,'L','Rêu',47),(3608,8,'L','Đen',15),(3609,9,'L','Xanh đậm',28),(3611,11,'L','Xanh đậm',54),(3615,15,'L','Xám',16),(3619,22,'L','Đen',17),(3620,23,'L','Xanh đậm',30),(3621,24,'XL','Xám',43),(3622,25,'L','Đen',56),(3624,27,'L','Be',37),(3625,28,'L','Kaki',50),(3626,29,'L','Ghi xám',18),(3627,31,'41','Đen',44),(3628,33,'L','Trắng',25),(3632,37,'L','Xanh dương',32),(3634,39,'L','Xanh nhạt',58),(3635,40,'L','Xanh đậm',26),(3639,44,'L','Xanh pastel',33),(3641,46,'L','Xanh đậm',59),(3666,3,'M','Đen',33),(3667,4,'M','Xanh nhạt',46),(3669,6,'M','Hồng pastel',27),(3670,7,'M','Rêu',40),(3671,8,'M','Đen',53),(3672,9,'M','Xanh đậm',21),(3674,11,'M','Xanh đậm',47),(3678,15,'M','Xám',54),(3682,22,'M','Đen',55),(3683,23,'M','Xanh đậm',23),(3684,24,'L','Xám',36),(3685,25,'M','Đen',49),(3687,27,'M','Be',30),(3688,28,'M','Kaki',43),(3689,29,'M','Ghi xám',56),(3690,31,'40','Đen',37),(3691,33,'M','Trắng',18),(3695,37,'M','Xanh dương',25),(3697,39,'M','Xanh nhạt',51),(3698,40,'M','Xanh đậm',19),(3702,44,'M','Xanh pastel',26),(3704,46,'M','Xanh đậm',52),(3729,3,'S','Đen',26),(3730,4,'S','Xanh nhạt',39),(3732,6,'S','Hồng pastel',20),(3733,7,'S','Rêu',33),(3734,8,'S','Đen',46),(3735,9,'S','Xanh đậm',59),(3737,11,'S','Xanh đậm',40),(3741,15,'S','Xám',47),(3746,20,'F','Trắng',22),(3748,22,'S','Đen',48),(3749,23,'S','Xanh đậm',16),(3750,24,'M','Xám',29),(3751,25,'S','Đen',42),(3753,27,'S','Be',23),(3754,28,'S','Kaki',36),(3755,29,'S','Ghi xám',49),(3757,31,'39','Đen',30),(3758,32,'F','Trắng',43),(3759,33,'S','Trắng',56),(3763,37,'S','Xanh dương',18),(3765,39,'S','Xanh nhạt',44),(3766,40,'S','Xanh đậm',57),(3770,44,'S','Xanh pastel',19),(3772,46,'S','Xanh đậm',45),(3800,74,'F','Nâu',49),(3808,3,'XL','Xanh navy',52),(3809,4,'XL','Xám',20),(3811,6,'XL','Be',46),(3812,7,'XL','Xanh navy',59),(3813,8,'XL','Be',27),(3814,9,'XL','Đen',40),(3816,11,'XL','Đen',21),(3820,15,'XL','Xanh navy',28),(3824,22,'XL','Be',29),(3825,25,'XL','Xanh navy',23),(3826,28,'XL','Rêu',17),(3827,29,'XL','Xanh than',30),(3828,33,'XL','Xám',37),(3832,37,'XL','Đỏ',44),(3834,39,'XL','Xám',25),(3838,44,'XL','Vàng nhạt',45),(3840,46,'XL','Đen',26),(3863,3,'L','Xanh navy',45),(3864,4,'L','Xám',58),(3866,6,'L','Be',39),(3867,7,'L','Xanh navy',52),(3868,8,'L','Be',20),(3869,9,'L','Đen',33),(3871,11,'L','Đen',59),(3875,15,'L','Xanh navy',21),(3879,22,'L','Be',22),(3880,24,'XL','Xanh',48),(3881,25,'L','Xanh navy',16),(3882,27,'L','Nâu',42),(3883,28,'L','Rêu',55),(3884,29,'L','Xanh than',23),(3885,33,'L','Xám',30),(3889,37,'L','Đỏ',37),(3891,39,'L','Xám',18),(3895,44,'L','Vàng nhạt',38),(3897,46,'L','Đen',19),(3920,3,'M','Xanh navy',38),(3921,4,'M','Xám',51),(3923,6,'M','Be',32),(3924,7,'M','Xanh navy',45),(3925,8,'M','Be',58),(3926,9,'M','Đen',26),(3928,11,'M','Đen',52),(3932,15,'M','Xanh navy',59),(3936,22,'M','Be',15),(3937,24,'L','Xanh',41),(3938,25,'M','Xanh navy',54),(3939,27,'M','Nâu',35),(3940,28,'M','Rêu',48),(3941,29,'M','Xanh than',16),(3942,33,'M','Xám',23),(3946,37,'M','Đỏ',30),(3948,39,'M','Xám',56),(3952,44,'M','Vàng nhạt',31),(3954,46,'M','Đen',57),(3977,3,'S','Xanh navy',31),(3978,4,'S','Xám',44),(3980,6,'S','Be',25),(3981,7,'S','Xanh navy',38),(3982,8,'S','Be',51),(3983,9,'S','Đen',19),(3985,11,'S','Đen',45),(3989,15,'S','Xanh navy',52),(3994,20,'F','Xám',27),(3996,22,'S','Be',53),(3997,24,'M','Xanh',34),(3998,25,'S','Xanh navy',47),(3999,27,'S','Nâu',28),(4000,28,'S','Rêu',41),(4001,29,'S','Xanh than',54),(4002,32,'F','Be',48),(4003,33,'S','Xám',16),(4007,37,'S','Đỏ',23),(4009,39,'S','Xám',49),(4013,44,'S','Vàng nhạt',24),(4015,46,'S','Đen',50),(4048,4,'XL','Đen',25),(4049,8,'XL','Xanh navy',32),(4053,4,'L','Đen',18),(4054,8,'L','Xanh navy',25),(4058,4,'M','Đen',56),(4059,8,'M','Xanh navy',18),(4063,4,'S','Đen',49),(4064,8,'S','Xanh navy',56),(4297,1,'S','Xám',50),(4298,1,'S','Vàng',50),(4299,1,'S','Đỏ',50),(4300,1,'M','Xám',57),(4301,1,'M','Vàng',50),(4302,1,'M','Đỏ',50),(4303,1,'L','Xám',19),(4304,1,'L','Vàng',50),(4305,1,'L','Đỏ',50),(4306,1,'XL','Xám',26),(4307,1,'XL','Vàng',50),(4308,1,'XL','Đỏ',50),(4309,5,'S','Xanh kẻ',47),(4310,5,'S','Nâu',50),(4311,5,'M','Xanh kẻ',54),(4312,5,'M','Nâu',50),(4313,5,'L','Xanh kẻ',16),(4314,5,'L','Nâu',50),(4315,5,'XL','Xanh kẻ',23),(4316,5,'XL','Nâu',50),(4317,12,'S','Đen',50),(4318,12,'S','Trắng',58),(4319,12,'S','Xanh',50),(4320,12,'M','Đen',50),(4321,12,'M','Trắng',20),(4322,12,'M','Xanh',50),(4323,12,'L','Đen',50),(4324,12,'L','Trắng',27),(4325,12,'L','Xanh',50),(4326,12,'XL','Đen',50),(4327,12,'XL','Trắng',34),(4328,12,'XL','Xanh',50),(4329,79,'F','Be',19),(4330,79,'F','Cà phê',49),(4331,79,'F','Xám',24),(4332,79,'F','Đen',50),(4333,77,'F','Đen',38),(4334,77,'F','Kaki',50),(4335,77,'F','Xanh dương',50),(4336,78,'F','Đen trong đen',50),(4337,78,'F','Đen tròng trà',50),(4338,47,'S','Cam',50),(4339,47,'S','Xanh cây',50),(4340,47,'S','Xanh biển',50),(4341,47,'M','Cam',50),(4342,47,'M','Xanh cây',48),(4343,47,'M','Xanh biển',50),(4344,47,'L','Cam',50),(4345,47,'L','Xanh cây',50),(4346,47,'L','Xanh biển',50),(4347,47,'XL','Cam',50),(4348,47,'XL','Xanh cây',50),(4349,47,'XL','Xanh biển',50),(4350,48,'S','Vàng',50),(4351,48,'S','Hồng',50),(4352,48,'S','Đen',50),(4353,48,'M','Vàng',50),(4354,48,'M','Hồng',50),(4355,48,'M','Đen',50),(4356,48,'L','Vàng',50),(4357,48,'L','Hồng',50),(4358,48,'L','Đen',50),(4359,48,'XL','Vàng',50),(4360,48,'XL','Hồng',50),(4361,48,'XL','Đen',50),(4362,49,'S','Đỏ',34),(4363,49,'S','Đen',50),(4364,49,'S','Hồng',50),(4365,49,'M','Đỏ',41),(4366,49,'M','Đen',50),(4367,49,'M','Hồng',50),(4368,49,'L','Đỏ',48),(4369,49,'L','Đen',50),(4370,49,'L','Hồng',50),(4371,49,'XL','Đỏ',55),(4372,49,'XL','Đen',50),(4373,49,'XL','Hồng',50),(4374,50,'S','Đen',47),(4375,50,'S','Đỏ',50),(4376,50,'S','Xanh',50),(4377,50,'M','Đen',54),(4378,50,'M','Đỏ',50),(4379,50,'M','Xanh',50),(4380,50,'L','Đen',16),(4381,50,'L','Đỏ',50),(4382,50,'L','Xanh',50),(4383,50,'XL','Đen',50),(4384,50,'XL','Đỏ',50),(4385,50,'XL','Xanh',50),(4386,70,'F','Đen',37),(4387,70,'F','Kem',50),(4388,71,'F','Đen',50),(4389,71,'F','Trắng',55),(4390,71,'F','Đỏ',50),(4391,72,'F','Đỏ',50),(4392,72,'F','Hồng',50),(4393,72,'F','Đen',23),(4394,75,'F','Đen',57),(4395,75,'F','Nâu',50),(4396,36,'S','Trắng',55),(4397,36,'S','Nâu',50),(4398,36,'M','Trắng',17),(4399,36,'M','Nâu',50),(4400,36,'L','Trắng',24),(4401,36,'L','Nâu',50),(4402,36,'XL','Trắng',31),(4403,36,'XL','Nâu',50),(4404,45,'S','Đen',27),(4405,45,'S','Be',37),(4406,45,'S','Navy',50),(4407,45,'M','Đen',34),(4408,45,'M','Be',44),(4409,45,'M','Navy',50),(4410,45,'L','Đen',41),(4411,45,'L','Be',51),(4412,45,'L','Navy',50),(4413,45,'XL','Đen',48),(4414,45,'XL','Be',58),(4415,45,'XL','Navy',50),(4416,43,'S','WHT',50),(4417,43,'M','WHT',50),(4418,43,'L','WHT',50),(4419,43,'XL','WHT',50),(4420,42,'S','Xanh kẻ',33),(4421,42,'S','Ghi',50),(4422,42,'M','Xanh kẻ',40),(4423,42,'M','Ghi',50),(4424,42,'L','Xanh kẻ',47),(4425,42,'L','Ghi',50),(4426,42,'XL','Xanh kẻ',54),(4427,42,'XL','Ghi',50),(4428,41,'S','Đen',25),(4429,41,'S','Hồng',50),(4430,41,'M','Đen',32),(4431,41,'M','Hồng',50),(4432,41,'L','Đen',39),(4433,41,'L','Hồng',50),(4434,41,'XL','Đen',46),(4435,41,'XL','Hồng',50),(4436,38,'S','Trắng',26),(4437,38,'S','Xám',50),(4438,38,'M','Trắng',33),(4439,38,'M','Xám',50),(4440,38,'L','Trắng',40),(4441,38,'L','Xám',50),(4442,38,'XL','Trắng',47),(4443,38,'XL','Xám',50),(4444,26,'M','Nâu caro',50),(4445,26,'L','Nâu caro',50),(4446,26,'XL','Nâu caro',50),(4447,34,'S','Đen',19),(4448,34,'S','Trắng',24),(4449,34,'S','Be',50),(4450,34,'M','Đen',26),(4451,34,'M','Trắng',31),(4452,34,'M','Be',50),(4453,34,'L','Đen',33),(4454,34,'L','Trắng',38),(4455,34,'L','Be',50),(4456,34,'XL','Đen',40),(4457,34,'XL','Trắng',45),(4458,34,'XL','Be',50),(4459,14,'S','',50),(4460,14,'M','',50),(4461,14,'L','',50),(4462,14,'XL','',50),(4463,16,'S','Hồng',50),(4464,16,'S','Trắng',50),(4465,16,'S','Đen',55),(4466,16,'M','Hồng',50),(4467,16,'M','Trắng',50),(4468,16,'M','Đen',17),(4469,16,'L','Hồng',50),(4470,16,'L','Trắng',50),(4471,16,'L','Đen',24),(4472,16,'XL','Hồng',50),(4473,16,'XL','Trắng',50),(4474,16,'XL','Đen',31),(4475,17,'S','Đen',23),(4476,17,'S','Cà phê',50),(4477,17,'M','Đen',30),(4478,17,'M','Cà phê',50),(4479,17,'L','Đen',37),(4480,17,'L','Cà phê',50),(4481,17,'XL','Đen',44),(4482,17,'XL','Cà phê',50),(4483,18,'F','Đen',36),(4484,18,'F','Hồng',50),(4485,19,'F','Đen',49),(4486,19,'F','Kem',50),(4487,21,'S','Đen',30),(4488,21,'S','Xanh Đen',50),(4489,21,'M','Đen',37),(4490,21,'M','Xanh Đen',50),(4491,21,'L','Đen',44),(4492,21,'L','Xanh Đen',50),(4493,21,'XL','Đen',51),(4494,21,'XL','Xanh Đen',50);
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
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'2026-07-23 10:01:36.000000','Áo thun cotton mềm 100%, thoáng mát, form basic dễ mặc hằng ngày.','TrendWear','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mn0zuqrncsu865.webp','Áo Thun Cotton Co Giãn 4 Chiều Thoáng Mát, Phù Hợp Nhiều Phong Cách',199000,552,19,'Unisex','2026-09-17 13:34:23.081839',1,'S,M,L,XL','Xám,Vàng,Đỏ','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mn0zuqrncsu865.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mn0zusu21secbb.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mn0zuowdips2b9.webp'),(3,'2026-07-23 10:01:36.000000','Áo polo thể thao vải cá sấu cotton co giãn 4 chiều, thấm hút mồ hôi tối đa.','Nike','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mq1rh186ccgd98.webp','Áo thun polo thể thao SPMATT01 thun poly coolmax co giãn tập gym chạy bộ PigoFashion',289000,438,18,'Thể thao','2026-09-17 13:34:44.271456',1,'S,M,L,XL','Trắng,Đen,Xanh navy','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mq1rh186ccgd98.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mlbp39yhik8x19.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mp4odoxuh72m97.webp'),(4,'2026-07-23 10:01:36.000000','Sơ mi slim fit công sở chỉn chu, chống nhăn, cổ áo đứng form lịch thiệp.','Uniqlo','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mq6mgripqrr44e@resize_w450_nl.webp','Áo sơ mi nam tay dài JBAGY Pastel sơ mi trắng form rộng, vải lụa tăm cao cấp phong cách Hàn Quốc JS0101 (D2)',329000,652,13,'Nam','2026-09-15 00:57:10.100906',2,'S,M,L,XL','Trắng,Xanh nhạt,Đen','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mq6mgripqrr44e@resize_w450_nl.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mq4jldclpce911@resize_w450_nl.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mq60dko1ztam9a@resize_w450_nl.webp'),(5,'2026-07-23 10:01:36.000000','Sơ mi khoác ngoài overshirt năng động, họa tiết sọc caro trẻ trung cá tính.','H&M','https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-mbgik2nmfxpcc4.webp','Áo Sơ Mi Kẻ Sọc Vải Linen Cao Cấp Form Rộng Có Túi Ngục , Áo Sơ Mi Oversize ZUTEE',359000,340,10,'Unisex','2026-09-17 13:36:31.893185',2,'S,M,L,XL','Xanh kẻ,Nâu','https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-mbgik2nmfxpcc4.webp,https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lyadnk81wo0xd2@resize_w450_nl.webp'),(6,'2026-07-23 10:01:36.000000','Chất lụa ngọc trai mềm mại, bóng nhẹ quý phái, tạo vẻ ngoài sang trọng cho phái nữ.','Zara','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-moxef9box4ap8e@resize_w450_nl.webp','Áo Sơ Mi Nữ Cổ V Thanh Lịch Oxatyl A025 - Áo Công Sở Lụa Mềm Họa Tiết Vân Mờ Cao Cấp Tôn Dáng Sang Trọng',379000,366,14,'Nữ','2026-09-15 00:59:40.790131',2,'S,M,L,XL','Đỏ,Hồng,Đen,Trắng,Kem','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-moxef9box4ap8e@resize_w450_nl.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-moxf3fkz0qa349@resize_w450_nl.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-moxfckim3e3002@resize_w450_nl.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-moxfcpms9i4sf1@resize_w450_nl.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-moxegl18wdfm46@resize_w450_nl.webp'),(7,'2026-07-23 10:01:36.000000','Bomber cổ bo gân thể thao, khóa kéo kim loại cao cấp, lót dù gió cản gió tốt.','TrendWear','https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mifnx60vmayqaa@resize_w450_nl.webp','Bomber big boxy jacket nam nữ áo khoác dù thêu local brand form rộng unisex oversize Pandax Polime',499000,522,11,'Unisex','2026-09-15 01:00:51.827026',3,'S,M,L,XL','Đen','https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mifnx60vmayqaa@resize_w450_nl.webp'),(8,'2026-07-23 10:01:36.000000','Chất nỉ bông ấm áp, có mũ trùm đầu rộng có dây rút, giữ nhiệt lý tưởng.','Adidas','https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0x9huz2v6sv3e@resize_w450_nl.webp','Áo Khoác Hoodie Zip boxy bigsize Haven Studio nam nữ rộng chất nỉ cua thêu màu đen xám xanh đen',459000,584,30,'Thể thao','2026-09-15 01:02:39.790810',3,'S,M,L,XL','Xanh navy,Đen,Xám','https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0x9huz2v6sv3e@resize_w450_nl.webp,https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m2fg48e30wqc7e@resize_w450_nl.webp,https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0x9igo52skv2d@resize_w450_nl.webp'),(9,'2026-07-23 10:01:36.000000','Áo bò denim wash màu tự nhiên, form suông đứng tôn dáng năng động.','Levis','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mlwvpyi14wsg29@resize_w450_nl.webp','Áo Khoác Jeans Bò Jacket Denim Wash 002 áo khoác bò nam nữ HAVEN tôn dáng cá tính Unisex Hàn Quốc HOTTREN',549000,384,10,'Nam','2026-09-15 01:03:53.940556',3,'S,M,L,XL','DarkBlue,LightBlue,OceanBlue','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mlwvpyi14wsg29@resize_w450_nl.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mlwvqhjd5sed21@resize_w450_nl.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mlwvqnm09tz9b2@resize_w450_nl.webp'),(11,'2026-07-23 10:01:36.000000','Dáng baggy ống suông rộng rãi, phong cách hip hop đường phố cực ngầu.','H&M','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mokmd1x3q7m311.webp','Quần Jean nam ống suông đứng JBAGY Straight Fit Jean Denim Cotton cao cấp - JJ0101',429000,516,21,'Unisex','2026-09-15 01:05:21.098895',4,'S,M,L,XL','Xanh nhạt,Đen','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mokmd1x3q7m311.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mo7va9l1i22qe2.webp'),(12,'2026-07-23 10:01:36.000000','Thiết kế cạp cao tôn eo, ống rộng suông dài hack dáng cực đỉnh.','Zara','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mqvny45cvnd462@resize_w450_nl.webp','MLB - Quần jeans nữ ống rộng Varsity Series_3FDPV0261-50INS',449000,539,14,'Nữ','2026-09-17 13:36:42.814658',4,'S,M,L,XL','Đen,Trắng,Xanh','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mqvny45cvnd462@resize_w450_nl.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mqmwou0o5pfm09@resize_w450_nl.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mt1tikqjos9452@resize_w450_nl.webp'),(14,'2026-07-23 10:01:36.000000','Quần tây nữ cạp cao khóa ẩn sành điệu, tôn đường cong quyến rũ.','Zara','https://down-vn.img.susercontent.com/file/6c9fa443906885341e3a39507a7d7ef6.webp','Quần Tây Nữ Basic Lưng Cạp Siêu Baggy - Bản nâng cấp - Có Bigsize',389000,200,8,'Nữ','2026-09-17 13:50:22.422999',5,'S,M,L,XL','',''),(15,'2026-07-23 10:01:36.000000','Quần jogger bo gấu chun mềm, túi khóa zip sâu đựng điện thoại tiện lợi khi chạy bộ.','Nike','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mqh52la26eblff@resize_w450_nl.webp','Quần Jogger Nam Thun Dài Thể Thao Dưới 110kg Co Giãn Basic In Phản Quang - VIETANFASHION',319000,465,22,'Thể thao','2026-09-15 01:08:24.248827',6,'S,M,L,XL','Đen,Xanh navy','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mqh52la26eblff@resize_w450_nl.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mqh52lapmln165@resize_w450_nl.webp'),(16,'2026-07-23 10:01:36.000000','Set quần áo tập gym co giãn đa chiều, thoát mồ hôi nhanh, ôm sát cơ bắp.','Adidas','https://down-vn.img.susercontent.com/file/vn-11134201-7ras8-m39iienf22f04c.webp','Bộ quần áo tập gym nữ 2 lớp có túi tiện lợi, vải co giãn 4 chiều thấm hút mồ hôi',469000,527,17,'Thể thao','2026-09-17 13:50:33.320208',6,'S,M,L,XL','Hồng,Trắng,Đen','https://down-vn.img.susercontent.com/file/vn-11134201-7ras8-m39iienf22f04c.webp,https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m76t95xnqildd7.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mq466a87wsn501.webp'),(17,'2026-07-23 10:01:36.000000','Áo ngực bra thể thao có đệm mút thoáng khí, đai nâng đỡ ngực chắc chắn khi tập nặng.','Nike','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mn9pbsdqgnb4d4.webp','Áo Bra Đệm Mỏng 0.2cm Cố Định Gom Nâng Quả',299000,334,15,'Nữ','2026-09-17 13:50:38.830192',6,'S,M,L,XL','Đen,Cà phê','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mn9pbsdqgnb4d4.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mn9pbv9kthxhc3.webp'),(18,'2026-07-23 10:01:36.000000','Mũ lưỡi trai vải kaki cotton 100%, khóa gài kim loại điều chỉnh kích cỡ linh hoạt.','TrendWear','https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lo9zr50jmgvrdb.webp','Mũ Lưỡi Trai Rách Trơn Basic Jussy Official Vải Kaki Cotton Thoáng Mát Nhiều Màu Đẹp Có Khóa Thu To Nhỏ',159000,86,33,'Unisex','2026-09-17 13:50:41.843870',7,'F','Đen,Hồng','https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lo9zr50jmgvrdb.webp,https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lw433532ysbf9e.webp'),(19,'2026-07-23 10:01:36.000000','Túi tote vải canvas dày dặn, có khóa kéo miệng và ngăn con để phụ kiện.','H&M','https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m41pmf5oioio85.webp','Túi tote vải bố Canvas 2 lớp có khóa kéo phong cách Hàn Quốc form to đựng vừa laptop đi học đi chơi',179000,99,26,'Nữ','2026-09-17 13:50:45.471967',7,'F','Đen,Kem','https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m41pmf5oioio85.webp,https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m41pmf5ohadr31.webp'),(20,'2026-07-23 10:01:36.000000','Tất dệt vớ cổ cao cotton co giãn êm ái, đệm êm lòng bàn chân khử mùi hôi.','Adidas','https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-mchj9g4nm55oc5.webp','Vớ cao cổ unisex, màu trơn trắng đen, thoáng khí và thấm hút mồ hôi 3 màu vớ lựa chọn',99000,66,41,'Thể thao','2026-09-15 01:16:10.760918',7,'F','Đen,Trắng,Xám','https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-mchj9g4nm55oc5.webp,https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mgnujjehu3v036@resize_w450_nl.webp,https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-mchjag7gthngcf.webp'),(21,'2026-09-14 14:58:00.000000','Áo khoác gió 2 lớp trượt nước, túi kéo khóa kín đáo, có mũ có thể tháo rời.','TrendWear','https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m8mxwn05sp66af.webp','Áo Khoác Dù Gió Nam Nữ Có Nón 2 Lớp Basic KENTA AKD0030 Chống Nắng, Trượt Nước, Túi Trong Tiện Dụng',380000,362,45,'Unisex','2026-09-17 13:50:54.388801',3,'S,M,L,XL','Đen,Xanh Đen','https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m8mxwn05sp66af.webp,https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lw6sagnwueorc4.webp'),(22,'2026-09-14 14:58:00.000000','Áo hoodie form rộng unisex phong cách Hàn Quốc trẻ trung.','Adidas','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mnv5s7wbjv9f6b.webp','Áo Hoodie Unisex Form Rộng Basic',420000,432,88,'Unisex','2026-09-17 13:35:24.708204',3,'S,M,L,XL','Xám,Đen,Be','https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m61dv10a8api79.webp,https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m61duskqlwl2ce.webp,https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m61duxe5iq7qda.webp'),(23,'2026-09-14 14:58:00.000000','Điểm nhấn rách gối bụi bặm, wash màu cá tính mang hơi thở streetwear.','Zara','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mt3fdhofmcjl9b.webp','Quần jean baggy rách gối',450000,237,60,'Nam','2026-09-17 12:56:51.007453',4,'S,M,L,XL','Xanh nhạt','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mt3fdhofmcjl9b.webp'),(24,'2026-09-14 14:58:00.000000','Quần đùi thun mềm mát 2 lớp, xẻ tà linh hoạt cho các bài tập chân và chạy bộ.','Nike','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mp3g45uh6r6666.webp','Quần Đùi Thun Nam YOLO DESIGN Thời Trang Thể Thao Năng Động Chất Vải Mềm Mát Co Giãn Tốt Dễ Phối Đồ Tập Gym Chạy Bộ',220000,324,110,'Thể thao','2026-09-17 13:35:43.445353',6,'M,L,XL','Đen,Xám,Xanh','https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lwiegm5nmfh55b.webp,https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lwiegm5np8m124.webp,https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lwiegm5nnu1ld6.webp'),(25,'2026-09-14 14:58:00.000000','Áo thun có cổ chất cá sấu mềm mịn, cổ bo dệt sọc thể thao sang trọng.','Uniqlo','https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m78y9dvuleuu38.webp','Áo polo boxy local brand nam nữ thun có cổ phông oversize sọc kẻ phối màu form rộng bigsize cặp đôi px pandax polime',310000,495,75,'Nam','2026-09-17 12:58:21.756855',1,'S,M,L,XL','Trắng,Đen','https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m3hxt3fuo0819c.webp,https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m78ya3et8meu35.webp'),(26,'2026-09-14 14:58:00.000000','Chất dạ mỏng flannel giữ ấm tốt, dễ mặc layer cùng áo thun trắng thời thượng.','H&M','https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvt619i7k15nbc.webp','Áo Sơ Mi Kẻ Nam GUY\'s Closet Gunther Flannel Shirt - Chất Liệu Flannel, Dễ mặc - Vintage - Nhiều Màu',360000,150,42,'Unisex','2026-09-17 13:49:49.743569',2,'M,L,XL','Nâu caro','https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mdw15ws9xxc38f.webp'),(27,'2026-09-14 14:58:00.000000','Vest blazer nữ 2 lớp đứng form thanh lịch, dễ phối cả đi làm lẫn dạo phố.','Zara','https://down-vn.img.susercontent.com/file/sg-11134201-22100-eehya6dlativc1.webp','Áo Blazer nam công sở TRACY áo vest nữ cách điệu chất vải veston nhập 2 lớp La Merci B13',650000,270,38,'Nữ','2026-09-17 13:36:08.928915',3,'S,M,L','Đen,Be,Nâu','https://down-vn.img.susercontent.com/file/sg-11134201-22100-g2xt6k9qtoiv99.webp,https://down-vn.img.susercontent.com/file/sg-11134201-22100-obrtbk9qtoiv76.webp,https://down-vn.img.susercontent.com/file/1b71abb799386729423f0f309b3d2a5d.webp'),(28,'2026-09-14 14:58:00.000000','Nhiều ngăn túi hộp tiện dụng, chất kaki dày dặn siêu bền.','TrendWear','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mrn4lm9jneh24a.webp','EDENKISS [Cargo Nỉ Túi Hộp🔥 - Có Ảnh Thật] - Quần Nỉ Cargo Túi Hộp | Jogger Form Rộng Streetwear Tập Gym Cá Tính',430000,513,92,'Nam','2026-09-17 13:01:12.341966',4,'S,M,L,XL','Kaki,Rêu','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mpc8b9vm1frj8d.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mpc8b9vm01730e.webp'),(29,'2026-09-14 14:58:00.000000','Quần âu form slimfit nhẹ nhàng, co giãn 2 chiều cực thoải mái khi ngồi làm việc.','Uniqlo','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mpgo5cjwngng0f.webp','Quần tây âu nam dáng ôm vải co giãn 4 chiều chống nhăn chống xù phong cách trẻ trung Hàn Quốc.',390000,444,55,'Nam','2026-09-17 13:01:57.369570',5,'S,M,L,XL','Đen,Ghi xám,Xanh than','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mpgo5cjwngng0f.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mpgo5cjtophdb9.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mpgo5cjup89a2f.webp'),(31,'2026-09-14 14:58:00.000000','Sneaker thể thao đế cao su êm ái đàn hồi, đệm bọt khí trợ lực tối đa.','Nike','https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ltf8m67aodu52a.webp','[GeekSneaker] Giày Sneaker cổ thấp Rick Owens Vintage Black/Milk',850000,415,135,'Thể thao','2026-09-17 13:02:34.714059',6,'39,40,41,42,43','Trắng','https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ltf8m67aodu52a.webp'),(32,'2026-09-14 14:58:00.000000','Mũ vành tai bèo chất kaki 2 lớp, dễ dàng gấp gọn mang theo mọi lúc.','Adidas','https://down-vn.img.susercontent.com/file/83b977173f89a347b318b6a8b2a2181c.webp','Mũ bucket vành tròn cá tính',160000,129,129,'Unisex','2026-09-17 13:03:09.231356',7,'F','Đen,Trắng,Be','https://down-vn.img.susercontent.com/file/07e57e2231ccbc63013bf0afe018352c.webp,https://down-vn.img.susercontent.com/file/d3a6319592fa89e27ebab22121f7eb0f.webp,https://down-vn.img.susercontent.com/file/39047a501ef7bdd14de98de62d1d976a.webp'),(33,'2026-09-15 00:03:11.000000','Áo thun cotton định lượng 250gsm dày dặn đứng dáng, không xù lông, cực bền.','TrendWear','https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mepju4sdh1qeb4.webp','Áo thun nam ORICANO basics In LOGO NHỎ form rộng compact phiên bản Premium chống nhăn,khử mùi tốt AP08',289000,393,24,'Nam','2026-09-17 13:03:48.275598',1,'S,M,L,XL','Đen,Trắng,Xám','https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mepju4sdh1qeb4.webp,https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mepju4sdjuva77.webp,https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mepju4sqs1dv2f.webp'),(34,'2026-09-15 00:03:11.000000','Thiết kế graphic nổi bật phong cách đường phố trẻ trung, cá tính.','Nike','https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-ma12h17owiv62d.webp','Áo Thun BOO Unisex Cotton Regular Tay Raglan In Graphic Made In The Street',319000,456,31,'Unisex','2026-09-17 13:50:09.972740',1,'S,M,L,XL','Đen,Trắng,Be','https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-ma12h17owiv62d.webp,https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-ma12gdkfi8g43c.webp,https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-mdeho4sqn6i422.webp'),(36,'2026-09-15 00:03:11.000000','Chất cotton tự nhiên an toàn cho làn da trẻ nhỏ, họa tiết sinh động đáng yêu.','H&M','https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lypa21s1rx3ha1.webp','Áo thun bé trai, áo thun trẻ em ngắn tay Delfinkid, áo thun bé trai vải cotton 100% phong cách Hàn Quốc',179000,327,12,'Tre em','2026-09-17 13:48:35.558028',1,'S,M,L,XL','Trắng,Nâu','https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lypa352unl8t80.webp,https://down-vn.img.susercontent.com/file/vn-11134211-7r98o-lz8ukptdhtn1e8.webp'),(37,'2026-09-15 00:03:11.000000','Vải dry fit nhanh khô, sợi co giãn chuyên dụng cho tập chạy bộ và thể thao cường độ cao.','Adidas','https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mgi01mssb1fsfe.webp','Áo Thun (T) Cộc Tay Nam Chất Liệu thun Thể Thao Mặc Nhẹ Thấm Hút Tốt Co Giãn 4 Chiều',399000,387,40,'The thao','2026-09-17 13:20:12.522466',1,'S,M,L,XL','Đen,Xanh dương,Đỏ','https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mgi01msy757146.webp,https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mgi01msy2xhpa6.webp,https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mgi01msy4c250b.webp'),(38,'2026-09-15 00:03:11.000000','Chất liệu đũi linen pha cotton mát mẻ, form suông relaxed phóng khoáng mùa hè.','Zara','https://down-vn.img.susercontent.com/file/vn-11134201-7ra0g-m9xdet5lr3fe94@resize_w450_nl.webp','100% Cotton Áo thun cổ tròn tay ngắn mùa hè vintage ins Áo thun in họa tiết mới cho nam và nữ',349000,346,20,'Nu','2026-09-17 13:49:32.183308',1,'S,M,L,XL','Trắng,Xám','https://down-vn.img.susercontent.com/file/vn-11134201-7ra0g-m9xdewq2j51gfb@resize_w450_nl.webp,https://down-vn.img.susercontent.com/file/vn-11134201-7ra0g-m9xdet5lr3fe94@resize_w450_nl.webp'),(39,'2026-09-15 00:03:11.000000','Vải dệt oxford bền bỉ, ít nhăn sau khi giặt, phù hợp môi trường công sở.','Uniqlo','https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80','Áo Sơ Mi Nam Oxford BADASS Chống Nhăn, Giữ Form Dáng, Thấm Hút Mồ Hôi Tốt, Trẻ Trung - STDTK617',459000,474,15,'Nam','2026-09-17 13:21:45.986963',2,'S,M,L,XL','Trắng,Xanh nhạt,Xám','https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mets5r6zttz65f@resize_w450_nl.webp,https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mets7ktaxwck06@resize_w450_nl.webp,https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mfakn13lidxq5e@resize_w450_nl.webp'),(40,'2026-09-15 00:03:11.000000','Áo sơ mi bò denim wash cổ điển, mặc như áo khoác ngoài cực chất.','TrendWear','https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m6138l73sl4z03.webp','SƠ MI DENIM 8022',529000,295,28,'Unisex','2026-09-17 13:22:32.587253',2,'S,M,L,XL','Xanh nhạt,Xanh đậm','https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m6138l73slo8bf.webp,https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m6138l73sl4z03.webp'),(41,'2026-09-15 00:03:11.000000','Thiết kế thắt nơ nữ tính, chất vải voan bay bổng tinh tế điệu đà.','Zara','https://down-vn.img.susercontent.com/file/fd8292a92d5037cfa2f6635883652008.webp','Áo sơ mi nữ voan nơ sau cổ ảnh thật full size 40-90kg',489000,342,11,'Nu','2026-09-17 13:48:58.005663',2,'S,M,L,XL','Đen,Hồng','https://down-vn.img.susercontent.com/file/384ea870cafbc3c49bb45b3b8d9646b2@resize_w450_nl.webp,https://down-vn.img.susercontent.com/file/fd8292a92d5037cfa2f6635883652008.webp'),(42,'2026-09-15 00:03:11.000000','Sơ mi đũi sọc thoáng khí, thích hợp đi làm mùa nóng và du lịch dã ngoại.','H&M','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mphu2eqorx1e6f@resize_w450_nl.webp','Sơ mi linen shirt kẻ sọc ARMCEO form rộng tôn dáng, chất liệu linen spandex siêu mát -S13',419000,374,19,'Nam','2026-09-17 13:48:53.554567',2,'S,M,L,XL','Xanh kẻ,Ghi','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mphu2eqyswzm86@resize_w450_nl.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mphu2eqorx1e6f@resize_w450_nl.webp'),(43,'2026-09-15 00:03:11.000000','Chất liệu co giãn đặc biệt khô nhanh, thích ứng mọi điều kiện hoạt động ngoài trời.','Nike','https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80','CHARLES TYRWHITT - Áo sơ mi nam cổ bẻ tay ngắn Pure Linen_CSH0018-WHT',439000,200,25,'The thao','2026-09-17 13:48:47.793797',2,'S,M,L,XL','WHT','https://down-vn.img.susercontent.com/file/sg-11134201-8260n-mkbxqpl8u4u8d5.webp'),(44,'2026-09-15 00:03:11.000000','Sơ mi cổ tàu cổ tròn cho bé, cúc cài chắc chắn, vải cotton êm dịu.','Adidas','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mq8pyr4f9m9u1e.webp','Áo Sơ Mi Cổ Tròn Dài Tay Phối Túi Cho Bé Trai Bé Gái Hokiha Vải Thô Đứng Form, Thoáng mát Size Từ 8-17kg A60',259000,399,9,'Tre em','2026-09-17 13:25:45.657202',2,'S,M,L,XL','Xanh pastel,Trắng','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mq8pyqgjuhou94.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mq8pyr4f9m9u1e.webp'),(45,'2026-09-15 00:03:11.000000','Bomber chất vải nylon cản gió, nhẹ nhàng và cá tính cho thời trang đường phố.','TrendWear','https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80','Áo khoác bomber nam S2 SPORT 2 lớp vải gió chần bông cao cấp đứng form giữ ấm tốt - AP03',699000,540,22,'Nam','2026-09-17 13:48:41.896284',3,'S,M,L,XL','Đen,Be,Navy','https://down-vn.img.susercontent.com/file/sg-11134201-824gl-mf3q5dq8o8b0cc@resize_w450_nl.webp,https://down-vn.img.susercontent.com/file/sg-11134201-824gl-mf3q5fcn2byib6@resize_w450_nl.webp,https://down-vn.img.susercontent.com/file/sg-11134201-824gf-mf3q5fh6tr0tea@resize_w450_nl.webp'),(46,'2026-09-15 00:03:11.000000','Phong cách retro vintage hoài cổ, cúc bấm kim loại đồng cổ sang trọng.','Zara','https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lpphpssidopgee.webp','Áo Khoác DENIM/ JEAN oversize style,vintage Nhật,Hàn - secondhand (2hand) [𝐅𝐑𝐄𝐄 𝐒𝐇𝐈𝐏]',799000,486,17,'Unisex','2026-09-17 13:27:34.618898',3,'S,M,L,XL','Xanh nhạt,Xanh đậm','https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lq0ian7yqz3r03.webp,https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lpphpssidopgee.webp'),(47,'2026-09-15 00:03:11.000000','Áo gió thể thao siêu nhẹ, có chi tiết phản quang an toàn khi chạy ban đêm.','Nike','https://down-vn.img.susercontent.com/file/sg-11134201-7rcdq-ltb6q61w3blf63.webp','Áo khoác gió, áo khoác chạy bộ nam nữ, co giãn thoải mái, thoáng khí, chống tia UV phù hợp hoạt động thể thao ngoài trời',649000,598,36,'The thao','2026-09-17 14:10:05.547938',3,'S,M,L,XL','Cam,Xanh cây,Xanh biển','https://down-vn.img.susercontent.com/file/sg-11134201-7rcdq-ltb6q61w3blf63.webp,https://down-vn.img.susercontent.com/file/sg-11134201-7rccz-ltb6q6gvhe2007.webp,https://down-vn.img.susercontent.com/file/sg-11134201-7rcf4-ltb6q6wou8vyc1.webp'),(48,'2026-09-15 00:03:11.000000','Cardigan len dệt kim mềm mịn, giữ ấm nhẹ nhàng cho tiết trời giao mùa.','Uniqlo','https://down-vn.img.susercontent.com/file/sg-11134201-22110-9g8m2wad53jv90.webp','[littlefish] Áo Khoác Cardigan Dệt Kim Dài Tay Dáng Rộng Nhiều Lớp Màu Hồng Bạc Hà Nhật Bản Mùa Thu Đông jk Cho Nữ Sinh áo nữ',579000,600,14,'Nu','2026-09-17 13:47:44.901114',3,'S,M,L,XL','Vàng,Hồng,Đen','https://down-vn.img.susercontent.com/file/sg-11134201-22110-9g8m2wad53jv90.webp,https://down-vn.img.susercontent.com/file/sg-11134201-22110-ac7lpyad53jv18.webp,https://down-vn.img.susercontent.com/file/sg-11134201-22110-1q2qdvad53jvda.webp'),(49,'2026-09-15 00:03:11.000000','Áo phao siêu nhẹ chần bông êm ái, cản gió giữ ấm cực tốt cho các bé.','H&M','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-ms7t4wy1evidc2.webp','Áo Khoác Phao Trẻ Em 3 Lớp Lót Lông Cừu Giữ Ấm Mùa Đông cute Cho Bé Trai Bé Gái 6–40Kg P5',729000,578,8,'Tre em','2026-09-17 13:47:53.148758',3,'S,M,L,XL','Đỏ,Đen,Hồng','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mr73t4rdgw7488.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mk3jfoo6q68435.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-ms7t4wy1evidc2.webp'),(50,'2026-09-15 00:03:11.000000','Áo khoác kéo khóa thể thao, vải co giãn kháng khuẩn, thoáng khí.','Adidas','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mm1hasmrj94zc1.webp','[KI BOUTIQUE] Áo Khoác Thể Thao Nam Nữ – KHÔNG LOGO, Chất Thun Poly Co Giãn, Mềm Mịn, Thoáng Mát',619000,567,27,'The thao','2026-09-17 13:48:02.513280',3,'S,M,L,XL','Đen,Đỏ,Xanh','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mm1hasmrj94zc1.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mm1haa3eo4qpcd.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mm1hb1btgrgg14.webp'),(70,'2026-09-15 00:03:11.000000','Túi đeo chéo bao tử nhỏ gọn, dây đeo tùy chỉnh phù hợp dạo phố du lịch.','Nike','https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-ljnop0pyejzob1.webp','Túi đeo chéo mini nam nữ BAMA New Basic Shoulder Bag NB204 chống nước nhiều ngăn vải canvas đi chơi cafe',259000,87,48,'Nu','2026-09-17 13:48:06.016000',7,'F','Đen,Kem','https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-ljnop0pyejzob1.webp,https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mhivo3y7hqmead.webp'),(71,'2026-09-15 00:03:11.000000','Mũ kết lưỡi trai thêu logo sắc sảo, chống nắng và thời trang.','Adidas','https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1052awgd38fe1@resize_w450_nl.webp','MŨ LƯỠI TRAI THÊU LOGO/ THÊU TÊN THEO YÊU CẦU',199000,155,55,'Nam','2026-09-17 13:48:08.206200',7,'F','Đen,Trắng,Đỏ','https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1052awgd38fe1@resize_w450_nl.webp,https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1053hc69ggv0e@resize_w450_nl.webp,https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1052vy7k7fj26@resize_w450_nl.webp'),(72,'2026-09-15 00:03:11.000000','Mũ bucket 2 mặt có thể đổi chiều mặc 2 màu sắc khác nhau độc đáo.','Uniqlo','https://down-vn.img.susercontent.com/file/vn-11134201-820l4-mecm4s1vo1dw9c@resize_w450_nl.webp','[Mũ Bucket Đ reversible] Mũ Rộng Vành Chống Nắng - Thiết Kế 2 Mặt Caro và Trơn – Nhiều Màu Sắc Thời Thượng !',229000,123,37,'Unisex','2026-09-17 13:48:11.545924',7,'F','Đỏ,Hồng,Đen','https://down-vn.img.susercontent.com/file/vn-11134201-820l4-mecm4vzspbt0b4.webp,https://down-vn.img.susercontent.com/file/vn-11134201-820l4-mecm4yocuu4h4f.webp,https://down-vn.img.susercontent.com/file/vn-11134201-820l4-mecm50kwuoliad@resize_w450_nl.webp'),(74,'2026-09-15 00:03:11.000000','Dây nịt da bò cao cấp không bong tróc, mặt khóa kim loại sáng bóng sang trọng.','Zara','https://down-vn.img.susercontent.com/file/vn-11134207-820l4-miecr5m4d3pdc5.webp','Thắt lưng nam da bò mềm mại, bền đẹp, kiểu dáng sang trọng',349000,93,21,'Nam','2026-09-17 13:13:07.959525',7,'F','Đen','https://down-vn.img.susercontent.com/file/vn-11134207-820l4-miecr5m4d3pdc5.webp'),(75,'2026-09-15 00:03:11.000000','Ví nhỏ gọn tiện lợi để thẻ ngân hàng, tiền mặt và chìa khóa.','TrendWear','https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mjoedqh8lcsh71.webp','Ví Nhỏ Cầm Tay Nam, Nữ ROLDA - Thiết Kế Basic Sang Trọng - Có Thể Móc Kèm Túi Lớn',279000,107,34,'Nu','2026-09-17 13:48:15.988780',7,'F','Đen,Nâu','https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mjoedqi7fpxjce.webp,https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mjoedqhqw5508e.webp'),(77,'2026-09-15 00:03:11.000000','Túi trống thể thao du lịch dung tích 35L có ngăn riêng để giày tiện lợi.','Adidas','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-msaxsfln30g357.webp','Túi Xách Du Lịch Cỡ Lớn 2 Tầng Boxelo🍀FREESHIP🍀Túi Du Lịch Đa Năng Nam Nữ Đựng Quần Áo Mỹ Phẩm.s1370',759000,138,18,'The thao','2026-09-17 13:47:12.900568',7,'F','Đen,Kaki,Xanh dương','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-msaxs4j708w427.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-msaxs4mdpyiu7e.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-msaz56z76fpgcb@resize_w450_nl.webp'),(78,'2026-09-15 00:03:11.000000','Kính mát chống tia tử ngoại UV400, gọng dẻo nhẹ nhàng không đau sống mũi.','Uniqlo','https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80','Kính râm mắt mèo thời trang chống tia UV kính mát gọng nhỏ phong cách retro cao cấp cho nam và nữ BlanCray BC1',449000,100,42,'Nu','2026-09-17 13:47:15.343468',7,'F','Đen trong đen, Đen tròng trà','https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mmsbrmq7yuwyc5.webp,https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mmsbtv5d91c5f1@resize_w450_nl.webp'),(79,'2026-09-15 00:03:11.000000','Khăn quàng cổ chất len dạ mềm mại ấm áp, phụ kiện hoàn hảo cho mùa thu đông.','H&M','https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lo6mn4ksriev60.webp','Khăn Choàng Cổ mùa thu đông nam nữ',389000,142,17,'Unisex','2026-09-17 14:10:05.482684',7,'F','Be,Cà phê ,Xám ,Đen','https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lo6mn4ksswzb3e.webp,https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1uz9brtygn346.webp,https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lo6mn4ksswzb3e.webp,https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lo6mn4ksyj93da.webp');
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
INSERT INTO `refresh_token` VALUES (_binary 's~%/�D�H\�~\���>','2026-10-17 14:09:18.158052','77cc637f-c9ab-46f2-85cf-80e3824f0c62',_binary '\�Ã\�^@�\�\�!r�');
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
INSERT INTO `user_role` VALUES (_binary 'ׇ\�&tA���fav��','ADMIN'),(_binary 'N9�\\\�E	�A>{G\�','USER'),(_binary '�N/�Gq�rX\0\�iRm','USER'),(_binary '�]ʀ\�ET� ^��-','USER'),(_binary '\�Ã\�^@�\�\�!r�','USER'),(_binary '\��\\�&h@��r6<n�:T','USER'),(_binary '�}g�*!N��KBH��','USER');
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
INSERT INTO `users` VALUES (_binary 'N9�\\\�E	�A>{G\�','88 Kim Mã, Quận Ba Đình, Hà Nội',NULL,'2026-09-14 14:58:10.992928','minh.dang@gmail.com','Đặng Quang Minh','MALE',_binary '\0','$2a$10$llffbtw48Nip4Ge9C2UlkuTMZrusgbhA5wJSnXNsSkFBvXVoSkysa','0977889900','2026-09-14 14:58:10.992929','dangquang'),(_binary '�N/�Gq�rX\0\�iRm','123 Cầu Giấy, Quận Cầu Giấy, Hà Nội',NULL,'2026-09-14 14:58:10.201788','vana.nguyen@gmail.com','Nguyễn Văn An','MALE',_binary '\0','$2a$10$vcsHI0lzDJwjI7jTs7McwubqEdwNnFWNfasI6CVIhpiblXAB.Lncu','0912345678','2026-09-14 14:58:10.201791','nguyenvana'),(_binary '�]ʀ\�ET� ^��-','12 Trần Phú, Quận Ngô Quyền, Hải Phòng',NULL,'2026-09-14 14:58:10.875006','dung.pham@gmail.com','Phạm Thị Dung','FEMALE',_binary '\0','$2a$10$ATKHkJcaBBrH9/e/cyWJPOOOERRO7so2ar/Xr0Md2t6CXpJD2lJqq','0934567890','2026-09-14 14:58:10.875006','phamthid'),(_binary 'ׇ\�&tA���fav��',NULL,NULL,'2026-07-10 14:57:47.554414','admin@laptopshop.com','System Administrator',NULL,_binary '\0','$2a$10$IZlzfh2Eokeb/8KEoFhtJuKjvYX3bn.bNa0y56wLL7rEw8uy/BZcy',NULL,'2026-07-10 14:57:47.554416','admin'),(_binary '\�Ã\�^@�\�\�!r�','sonvipkl04@gmail.com',NULL,'2026-07-23 09:41:35.423602','sonvipkl04@gmail.com','Nguyễn Ngọc Sơn','MALE',_binary '\0','$2a$10$siJYf1nFlKq258wig2x67.A/BlX80E5F1HNYer749h6/D.XEewjQK','0815216193','2026-07-23 09:41:35.423602','sonvipkl04@gmail.com'),(_binary '\��\\�&h@��r6<n�:T','789 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',NULL,'2026-09-14 14:58:10.745717','cuong.le@gmail.com','Lê Hoàng Cường','MALE',_binary '\0','$2a$10$HgY4jkML5SMlkkIkjnFcLOPpdRxycSFJ6vHWvfEvcDGU6c82s07P6','0901234567','2026-09-14 14:58:10.745718','lehoangc'),(_binary '�}g�*!N��KBH��','456 Lê Duẩn, Quận Hải Châu, Đà Nẵng',NULL,'2026-09-14 14:58:10.557616','bich.tran@gmail.com','Trần Thị Bích','FEMALE',_binary '\0','$2a$10$DN1bEfSaUpVkjjpVo3Sv0.OMFFXodvuuP5YQbA5I.kUwIs3obQ0Va','0987654321','2026-09-14 14:58:10.557618','tranthib');
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlists`
--

LOCK TABLES `wishlists` WRITE;
/*!40000 ALTER TABLE `wishlists` DISABLE KEYS */;
INSERT INTO `wishlists` VALUES (1,'2026-09-01 21:35:38.462263',20,_binary '\�Ã\�^@�\�\�!r�'),(2,'2026-09-17 13:58:59.360061',79,_binary '\�Ã\�^@�\�\�!r�'),(3,'2026-09-17 13:59:05.588261',77,_binary '\�Ã\�^@�\�\�!r�'),(5,'2026-09-17 13:59:10.785115',75,_binary '\�Ã\�^@�\�\�!r�'),(6,'2026-09-17 13:59:12.812140',70,_binary '\�Ã\�^@�\�\�!r�'),(7,'2026-09-17 13:59:14.955263',48,_binary '\�Ã\�^@�\�\�!r�'),(8,'2026-09-17 13:59:16.666307',47,_binary '\�Ã\�^@�\�\�!r�'),(9,'2026-09-17 13:59:20.413952',46,_binary '\�Ã\�^@�\�\�!r�');
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

-- Dump completed on 2026-09-17 14:12:34
