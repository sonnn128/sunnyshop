-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: laptopshop
-- ------------------------------------------------------
-- Server version	8.0.44

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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,'2025-12-13 10:05:53.585273',0,'2025-12-13 16:35:15.756015',_binary '�`\��Cݣ]dP%PR'),(2,'2025-12-13 15:12:17.508731',0,'2025-12-13 15:12:55.480700',_binary 'sSH�HOh�2+\\q�0\�');
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKoul14ho7bctbefv8jywp5v3i2` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'2025-12-13 09:47:17.682389','mobile-phone','https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFwdG9wJTIwY29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D','Laptop Asus TUF Gaming','mobile-phone','2025-12-13 09:47:17.682389'),(7,'2025-12-13 13:00:18.875733','Laptop Asus TUF Gaming','https://res.cloudinary.com/dswdadh2n/image/upload/v1765630817/y5u7gnsqvc90uqime6no.jpg','Laptop Asus TUF Gaming2','abcd','2025-12-13 13:00:18.875733'),(8,'2025-12-13 15:03:18.004745','Macbook laptop','https://res.cloudinary.com/dswdadh2n/image/upload/v1765638196/db3gjmf2ktavalksdsro.webp','Macbook','macbook','2025-12-13 15:03:18.004745'),(9,'2025-12-13 16:36:05.193462','Laptop Asus TUF Gaming','https://res.cloudinary.com/dswdadh2n/image/upload/v1765643763/ikfqsir0uaxiqaum9e2h.jpg','Laptop Asus TUF Gaming','Laptop Asus TUF Gaming','2025-12-13 16:36:05.193462');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `id` binary(16) NOT NULL,
  `active` bit(1) NOT NULL,
  `code` varchar(255) NOT NULL,
  `discount_amount` double DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `min_order_amount` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKeplt0kkm9yf2of2lnx6c1oy9b` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (1,'2025-12-13 10:06:29.981677',20000000,6,'2025-12-13 10:06:29.981677',2,2),(6,'2025-12-13 15:27:37.677598',10000000,1,'2025-12-13 15:27:37.677598',4,5),(8,'2025-12-13 16:12:58.652758',1006,1,'2025-12-13 16:12:58.652758',5,12),(9,'2025-12-13 16:12:58.657663',1005,2,'2025-12-13 16:12:58.657663',5,11),(10,'2025-12-13 16:35:15.691487',222020,5,'2025-12-13 16:35:15.691487',6,54),(11,'2025-12-13 16:35:15.696435',1014,6,'2025-12-13 16:35:15.696435',6,50);
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
  PRIMARY KEY (`id`),
  KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`),
  CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (2,'2025-12-13 10:06:29.976280','2025-12-13 10:06:29.976280','TX Kỳ Anh\nTX Kỳ Anh, Hà Tĩnh, An Giang 711345','Nguyễn Thị Trà Giang','0365253311','CANCELLED',120000000,'2025-12-13 13:08:17.570133',_binary '�`\��Cݣ]dP%PR',NULL,NULL),(3,'2025-12-13 15:12:55.356519','2025-12-13 15:12:55.356519','TX Kỳ Anh, Hà Tĩnh, An Giang 711345','Nguyễn Sơn','0365253311','COMPLETED',4050,'2025-12-13 15:13:21.248683',_binary 'sSH�HOh�2+\\q�0\�',NULL,NULL),(4,'2025-12-13 15:27:37.669551','2025-12-13 15:27:37.669551','TX Kỳ Anh, Hà Tĩnh, An Giang 711345','Nguyễn Thị Trà Giang','0365253311','COMPLETED',10000000,'2025-12-13 15:43:35.338681',_binary '�`\��Cݣ]dP%PR',NULL,NULL),(5,'2025-12-13 16:12:58.641878','2025-12-13 16:12:58.641878','TX Kỳ Anh, Hà Tĩnh, An Giang 711345','Nguyễn Thị Trà Giang','0365253311','COMPLETED',4023,'2025-12-13 16:22:11.422614',_binary '�`\��Cݣ]dP%PR',NULL,NULL),(6,'2025-12-13 16:35:15.685854','2025-12-13 16:35:15.685854','TX Kỳ Anh, Hà Tĩnh, An Giang 711345','Nguyễn Thị Trà Giang','0365253311','COMPLETED',1116184,'2025-12-13 16:38:38.043809',_binary '�`\��Cݣ]dP%PR',NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (2,'2025-12-13 09:47:46.803966','Laptop Asus TUF Gaming','Laptop Asus TUF Gaming','https://res.cloudinary.com/dswdadh2n/image/upload/v1765619265/cae2qe7tiwejtgxvlowl.jpg','Laptop Asus TUF Gaming',20000000,14,6,'Laptop Asus TUF Gaming','2025-12-13 13:21:16.943001',7),(5,'2025-12-13 14:58:58.650699','Short description','Dell 2','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Example Laptop',10000000,9,1,'Gaming','2025-12-13 16:30:06.530914',1),(7,'2025-12-13 15:04:02.779656','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M2',1001,11,0,'Gaming','2025-12-13 15:04:02.779656',8),(8,'2025-12-13 15:04:02.782438','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M3',1002,12,0,'Gaming','2025-12-13 15:04:02.782438',8),(9,'2025-12-13 15:04:02.785232','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M4',1003,13,0,'Gaming','2025-12-13 15:04:02.785232',8),(10,'2025-12-13 15:04:02.788041','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M5',1004,14,0,'Gaming','2025-12-13 15:04:02.788041',8),(11,'2025-12-13 15:04:02.790221','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M6',1005,13,2,'Gaming','2025-12-13 16:12:58.659360',8),(12,'2025-12-13 15:04:02.793466','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M7',1006,15,1,'Gaming','2025-12-13 16:12:58.659360',8),(37,'2025-12-13 16:13:48.034906','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M2',1001,12,0,'Gaming','2025-12-13 16:18:31.646487',8),(38,'2025-12-13 16:13:48.037233','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M3',1002,12,0,'Gaming','2025-12-13 16:13:48.037233',8),(39,'2025-12-13 16:13:48.039393','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M4',1003,13,0,'Gaming','2025-12-13 16:13:48.039393',8),(40,'2025-12-13 16:13:48.042431','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M5',1004,14,0,'Gaming','2025-12-13 16:13:48.042431',8),(41,'2025-12-13 16:13:48.045171','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M6',1005,15,0,'Gaming','2025-12-13 16:13:48.045171',8),(42,'2025-12-13 16:13:48.047421','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M7',1006,16,0,'Gaming','2025-12-13 16:13:48.047421',8),(43,'2025-12-13 16:13:48.049782','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M8',1007,17,0,'Gaming','2025-12-13 16:13:48.049782',8),(44,'2025-12-13 16:13:48.053719','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M9',1008,18,0,'Gaming','2025-12-13 16:13:48.053719',8),(45,'2025-12-13 16:13:48.056382','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M10',1009,19,0,'Gaming','2025-12-13 16:13:48.056382',8),(46,'2025-12-13 16:13:48.058599','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M11',1010,20,0,'Gaming','2025-12-13 16:13:48.058599',8),(47,'2025-12-13 16:13:48.060256','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M12',1011,21,0,'Gaming','2025-12-13 16:13:48.060256',8),(48,'2025-12-13 16:13:48.063943','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M13',1012,22,0,'Gaming','2025-12-13 16:13:48.063943',8),(49,'2025-12-13 16:13:48.066940','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M14',1013,23,0,'Gaming','2025-12-13 16:13:48.066940',8),(50,'2025-12-13 16:13:48.068949','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M15',1014,18,6,'Gaming','2025-12-13 16:35:15.698717',8),(51,'2025-12-13 16:14:13.766720','Laptop Asus TUF Gaming','Laptop Asus TUF Gaming','https://res.cloudinary.com/dswdadh2n/image/upload/v1765642452/rdlrb9xr9m2grgtfdt3w.jpg','Laptop Asus TUF Gaming',123412431,3033,0,'Laptop Asus TUF Gaming','2025-12-13 16:14:13.766720',8),(52,'2025-12-13 16:14:16.031969','Laptop Asus TUF Gaming','Laptop Asus TUF Gaming','https://res.cloudinary.com/dswdadh2n/image/upload/v1765642454/gtz0zun72goampkqaxld.jpg','Laptop Asus TUF Gaming',123412431,3033,0,'Laptop Asus TUF Gaming','2025-12-13 16:14:16.031969',8),(53,'2025-12-13 16:18:50.005842','Laptop Asus TUF Gaming','Laptop Asus TUF Gaming','https://res.cloudinary.com/dswdadh2n/image/upload/v1765642729/hpqckmzhlxr6dfbbyuci.jpg','Laptop Asus TUF Gaming',2340239302,23,0,'Laptop Asus TUF Gaming','2025-12-13 16:18:50.005842',8),(54,'2025-12-13 16:22:03.137837','Laptop Asus TUF Gaming','Laptop Asus TUF Gaming','https://res.cloudinary.com/dswdadh2n/image/upload/v1765642921/zwsqufezexe9bf8vnbys.jpg','Laptop Asus TUF Gaming',222020,2915,5,'Laptop Asus TUF Gaming','2025-12-13 16:35:15.698717',7),(55,'2025-12-13 16:36:35.674428','Laptop Asus TUF Gaming','Laptop Asus TUF Gaming','https://res.cloudinary.com/dswdadh2n/image/upload/v1765643794/ccqzjr9fbotvwidgeyok.jpg','Laptop Asus TUF Gaming',234123,418923,0,'Laptop Asus TUF Gaming','2025-12-13 16:36:35.674428',9),(56,'2025-12-13 16:37:54.179414','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M1',1000,10,0,'Gaming','2025-12-13 16:37:54.179414',8),(57,'2025-12-13 16:37:54.183178','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M2',1001,11,0,'Gaming','2025-12-13 16:37:54.183178',8),(58,'2025-12-13 16:37:54.185430','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M3',1002,12,0,'Gaming','2025-12-13 16:37:54.185430',8),(59,'2025-12-13 16:37:54.187660','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M4',1003,13,0,'Gaming','2025-12-13 16:37:54.187660',8),(60,'2025-12-13 16:37:54.189828','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M5',1004,14,0,'Gaming','2025-12-13 16:37:54.189828',8),(61,'2025-12-13 16:37:54.192613','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M6',1005,15,0,'Gaming','2025-12-13 16:37:54.192613',8),(62,'2025-12-13 16:37:54.194770','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M7',1006,16,0,'Gaming','2025-12-13 16:37:54.194770',8),(63,'2025-12-13 16:37:54.196915','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M8',1007,17,0,'Gaming','2025-12-13 16:37:54.196915',8),(64,'2025-12-13 16:37:54.198423','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M9',1008,18,0,'Gaming','2025-12-13 16:37:54.198423',8),(65,'2025-12-13 16:37:54.201063','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M10',1009,19,0,'Gaming','2025-12-13 16:37:54.201063',8),(66,'2025-12-13 16:37:54.204640','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M11',1010,20,0,'Gaming','2025-12-13 16:37:54.204640',8),(67,'2025-12-13 16:37:54.206646','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M12',1011,21,0,'Gaming','2025-12-13 16:37:54.206646',8),(68,'2025-12-13 16:37:54.208685','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M13',1012,22,0,'Gaming','2025-12-13 16:37:54.208685',8),(69,'2025-12-13 16:37:54.211178','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M14',1013,23,0,'Gaming','2025-12-13 16:37:54.211178',8),(70,'2025-12-13 16:37:54.214512','Short description','Dell','https://abramillar.com/wp-content/uploads/2018/01/apple-1842297_1920.jpg','Macbook Air M15',1014,24,0,'Gaming','2025-12-13 16:37:54.214512',8);
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
INSERT INTO `refresh_token` VALUES (_binary 'f �C_���D\�gB�','2026-01-12 10:01:02.706986','21381ae4-34e7-41d0-9eaa-bb14ca5fd12b',_binary '�c\�\Z)\�L㜅\�p\�A('),(_binary '��=\�\�Iĕ�l��V\�8','2026-01-12 10:01:17.153455','dc09fca3-1e10-40de-9d79-ea9bd30618d0',_binary '�`\��Cݣ]dP%PR'),(_binary 'U�K�\�AE�	\�͟`|','2026-01-12 16:26:40.563218','8f186a1a-cbe0-4c34-bfe7-f1e78ededddd',_binary '�c\�\Z)\�L㜅\�p\�A('),(_binary '0PN>�J{���3','2026-01-12 13:25:30.277393','ed13430d-8733-49a6-a1d8-a245d0ebd0fc',_binary '�c\�\Z)\�L㜅\�p\�A('),(_binary 'I�\�gOI�f!R��','2026-01-12 09:44:48.206822','0d76f2ac-9996-4a5a-b640-c16a63eb26db',_binary '�c\�\Z)\�L㜅\�p\�A('),(_binary 'Pq�.!�C�i�\�SX\�H','2026-01-12 09:47:05.709926','994fedd3-17e7-4bb7-8a80-5032833823c0',_binary '�c\�\Z)\�L㜅\�p\�A('),(_binary 'W�,^��K���\�\n\�v','2026-01-12 14:54:52.618530','5e120aaa-afe4-4787-81ec-b11c1c8b4b43',_binary '�c\�\Z)\�L㜅\�p\�A('),(_binary 'kt^��\�J����|��$','2026-01-12 16:34:41.854708','99246dad-86d7-419a-b242-5e704ec23669',_binary '�`\��Cݣ]dP%PR'),(_binary 'q$W2�1Gñ5\�\�GO\�','2026-01-12 10:17:43.512996','f7ecf1d1-3efa-4849-83ce-690733955c46',_binary '�c\�\Z)\�L㜅\�p\�A('),(_binary '�\�|O�F%�H�U\�\�\n]','2026-01-12 13:25:23.117508','1406deaa-06e2-4dff-b5bf-32fa80f87d64',_binary 'sSH�HOh�2+\\q�0\�'),(_binary '�v-\\atCQ�\�\���x\�','2026-01-12 09:23:24.007061','616a6169-d75c-44e0-96f9-37c193cb6520',_binary '�c\�\Z)\�L㜅\�p\�A('),(_binary '�5z�H3H��s2�^O�6','2026-01-12 10:19:48.672895','8f359812-f83a-4f54-aa0b-ee77e349718d',_binary '�`\��Cݣ]dP%PR'),(_binary '\�\�\"vҚK}�Q`�b\�','2026-01-12 11:02:38.235560','6aa9fa93-d64c-475f-86b8-ae037e21d9da',_binary '�c\�\Z)\�L㜅\�p\�A('),(_binary '\���̝N\�\�ȫ�%','2026-01-12 09:44:32.612648','80fc5e25-70f2-4836-800f-8827dc63cac0',_binary '�c\�\Z)\�L㜅\�p\�A('),(_binary '\�Uo�~?F��\�&\0P\�C\�','2026-01-12 15:27:01.713784','a6fb8df6-b8c1-4dcb-bacc-aed0e29d36d0',_binary '�`\��Cݣ]dP%PR'),(_binary '\�\nf�\�3M��,<�0r�@','2026-01-12 10:31:57.773761','36aa258f-7acd-4e01-b04a-3d76a9c2b452',_binary 'sSH�HOh�2+\\q�0\�');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,'New comment','2025-12-13 12:41:41.498689',5,2,_binary 'sSH�HOh�2+\\q�0\�'),(2,'new comment 2','2025-12-13 12:41:54.156831',5,2,_binary 'sSH�HOh�2+\\q�0\�');
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
INSERT INTO `user_role` VALUES (_binary '�c\�\Z)\�L㜅\�p\�A(','ADMIN'),(_binary 'sSH�HOh�2+\\q�0\�','USER'),(_binary '�`\��Cݣ]dP%PR','USER');
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (_binary 'sSH�HOh�2+\\q�0\�','TX Kỳ Anh','2025-12-13 10:31:10.047657','nson09267@gmail.com','Nguyễn Văn A','MALE','$2a$10$optcJzyh4BIpPTk9oWj.k.Lu3Xpvp7bQE5i0u3U9GPBO4J7v.l5KG','0365253311','2025-12-13 10:31:51.727958','nson09267@gmail.com',NULL),(_binary '�c\�\Z)\�L㜅\�p\�A(',NULL,'2025-12-13 09:22:05.671454','admin@laptopshop.com','System Administrator',NULL,'$2a$10$hY2EvOoIYFCEEBPR82Rp3O1Cyh/JbRyHc31kE3MXh7qXZyQ8Itcpe',NULL,'2025-12-13 09:22:05.671456','admin',NULL),(_binary '�`\��Cݣ]dP%PR','TX Kỳ Anh','2025-12-13 09:46:57.707310','tragiangnguyen1807@gmail.com','Nguyễn Thị Trà Giang','FEMALE','$2a$10$MCBs0zeISygIyjgyjlHnkOJOJ8TeKylwT373LENTKoKyJ/1YW19HS','0365253311','2025-12-13 09:46:57.707310','tragiangnguyen1807@gmail.com',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist_items`
--

DROP TABLE IF EXISTS `wishlist_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist_items` (
  `id` binary(16) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `user_id` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKtp53unkks741xiqi6m620i7mx` (`user_id`,`product_id`),
  KEY `FKqxj7lncd242b59fb78rqegyxj` (`product_id`),
  CONSTRAINT `FKmmj2k1i459yu449k3h1vx5abp` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKqxj7lncd242b59fb78rqegyxj` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist_items`
--

LOCK TABLES `wishlist_items` WRITE;
/*!40000 ALTER TABLE `wishlist_items` DISABLE KEYS */;
INSERT INTO `wishlist_items` VALUES (_binary '���\�\�O�ZL��\�\�','2025-12-13 10:32:55.139538',2,_binary 'sSH�HOh�2+\\q�0\�');
/*!40000 ALTER TABLE `wishlist_items` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlists`
--

LOCK TABLES `wishlists` WRITE;
/*!40000 ALTER TABLE `wishlists` DISABLE KEYS */;
INSERT INTO `wishlists` VALUES (1,'2025-12-13 12:14:34.119706',2,_binary 'sSH�HOh�2+\\q�0\�'),(2,'2025-12-13 16:34:45.815614',49,_binary '�`\��Cݣ]dP%PR'),(3,'2025-12-13 16:34:46.648003',48,_binary '�`\��Cݣ]dP%PR'),(4,'2025-12-13 16:34:47.414007',50,_binary '�`\��Cݣ]dP%PR'),(5,'2025-12-13 16:34:48.085239',54,_binary '�`\��Cݣ]dP%PR');
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

-- Dump completed on 2025-12-13 16:42:33
