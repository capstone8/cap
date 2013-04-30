-- MySQL dump 10.13  Distrib 5.5.30, for debian-linux-gnu (armv5tel)
--
-- Host: localhost    Database: capstone
-- ------------------------------------------------------
-- Server version	5.5.30-1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Auth`
--

DROP TABLE IF EXISTS `Auth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Auth` (
  `authID` int(12) NOT NULL AUTO_INCREMENT,
  `salt` varchar(32) DEFAULT NULL,
  `password` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`authID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Auth`
--

LOCK TABLES `Auth` WRITE;
/*!40000 ALTER TABLE `Auth` DISABLE KEYS */;
INSERT INTO `Auth` VALUES (1,'814b58cf1218d6c8db202a81a0a69ecc','9591939ddd83b38562a43511a31d2eb2'),(2,'814b58cf1218d6c8db202a81a0a69ecc','9591939ddd83b38562a43511a31d2eb2');
/*!40000 ALTER TABLE `Auth` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Customer`
--

DROP TABLE IF EXISTS `Customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Customer` (
  `custID` int(12) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(32) DEFAULT NULL,
  `lastName` varchar(32) DEFAULT NULL,
  `street` varchar(128) DEFAULT NULL,
  `city` varchar(32) DEFAULT NULL,
  `state` varchar(2) DEFAULT NULL,
  `zipCode` varchar(5) DEFAULT NULL,
  `phoneNumber` varchar(32) DEFAULT NULL,
  `birthDate` date DEFAULT NULL,
  `picPath` varchar(200) DEFAULT NULL,
  `shirtSize` varchar(32) DEFAULT NULL,
  `pantSize` varchar(32) DEFAULT NULL,
  `dressSize` varchar(32) DEFAULT NULL,
  `rfid` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`custID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Customer`
--

LOCK TABLES `Customer` WRITE;
/*!40000 ALTER TABLE `Customer` DISABLE KEYS */;
INSERT INTO `Customer` VALUES (1,'Ryan','Schulze','Columbia','MO','29','65201','3149208260','1990-11-23','http://m.c.lnkd.licdn.com/media/p/2/000/103/029/0ac7c04.jpg','M','28x28',NULL,'0xbd0xd90xae0xf60x760xf60x560x360xed0x350x2b0x0'),(2,'Paul','Reschke','Columbia','MO','29','65201','3149208260','1990-11-23','http://m.c.lnkd.licdn.com/media/p/1/000/0d5/1e9/2bed87f.jpg','M','28x28',NULL,'0xbd0xd90xae0xf60x760xd60x960x650x6b0x8b0x560x0'),(3,'Yaniv','Shnaider','700 Stillwater Dr.','Columbia','MO','65201','5738233103','1987-06-26','http://missourigrandprix.com/wp-content/uploads/2011/01/Yaniv-Shnaider.jpg','L','31x31',NULL,'0xbd0xd90xae0xf60x760xd60x560x450x8b0x6b0x560x0'),(4,'Alon','Gilboa','Columbia','MO','29','65201','3149208260','1990-11-23','http://b.vimeocdn.com/ps/287/660/2876603_300.jpg','M','28x28',NULL,'0xbd0xd90xae0xf60x760xd60x560x450xcb0xf50x950x0');
/*!40000 ALTER TABLE `Customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Employee`
--

DROP TABLE IF EXISTS `Employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Employee` (
  `empID` int(12) NOT NULL AUTO_INCREMENT,
  `userName` varchar(32) DEFAULT NULL,
  `firstName` varchar(32) DEFAULT NULL,
  `lastName` varchar(32) DEFAULT NULL,
  `authID` int(12) DEFAULT NULL,
  PRIMARY KEY (`empID`),
  KEY `authID` (`authID`),
  CONSTRAINT `Employee_ibfk_1` FOREIGN KEY (`authID`) REFERENCES `Auth` (`authID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Employee`
--

LOCK TABLES `Employee` WRITE;
/*!40000 ALTER TABLE `Employee` DISABLE KEYS */;
INSERT INTO `Employee` VALUES (2,'emp1','emp1','emp1',1);
/*!40000 ALTER TABLE `Employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Item`
--

DROP TABLE IF EXISTS `Item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Item` (
  `itemID` int(12) NOT NULL AUTO_INCREMENT,
  `category` varchar(32) DEFAULT NULL,
  `brand` varchar(32) DEFAULT NULL,
  `price` int(10) DEFAULT NULL,
  PRIMARY KEY (`itemID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Item`
--

LOCK TABLES `Item` WRITE;
/*!40000 ALTER TABLE `Item` DISABLE KEYS */;
INSERT INTO `Item` VALUES (1,'Shirt','Hugo Boss',200),(2,'Dress Shirt','Armani',250),(3,'Dress Shirt','Calvin Klein',150),(4,'DressShirt','Guess',200),(5,'Dress Shirt','Polo Ralph Lauren',130),(6,'Pants','Hugo Boss',100),(7,'Pants','Armani',130),(8,'Pants','Calvin Klein',80),(9,'Pants','Guess',250),(10,'Pants','Polo Ralph Lauren',60);
/*!40000 ALTER TABLE `Item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Item_Attribute`
--

DROP TABLE IF EXISTS `Item_Attribute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Item_Attribute` (
  `itemAttID` int(12) NOT NULL AUTO_INCREMENT,
  `clotheSize` varchar(10) DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `itemID` int(12) DEFAULT NULL,
  PRIMARY KEY (`itemAttID`),
  KEY `itemID` (`itemID`),
  CONSTRAINT `Item_Attribute_ibfk_1` FOREIGN KEY (`itemID`) REFERENCES `Item` (`itemID`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Item_Attribute`
--

LOCK TABLES `Item_Attribute` WRITE;
/*!40000 ALTER TABLE `Item_Attribute` DISABLE KEYS */;
INSERT INTO `Item_Attribute` VALUES (1,'S','Black',1),(2,'M','Black',1),(3,'L','Black',1),(4,'XL','Black',1),(5,'S','White',1),(6,'M','White',1),(7,'L','White',1),(8,'XL','White',1),(9,'S','Black',2),(10,'M','Black',2),(11,'L','Black',2),(12,'XL','Black',2),(13,'S','White',2),(14,'M','White',2),(15,'L','White',2),(16,'XL','White',2),(17,'S','Black',3),(18,'M','Black',3),(19,'L','Black',3),(20,'XL','Black',3),(21,'S','White',3),(22,'M','White',3),(23,'L','White',3),(24,'XL','White',3),(25,'S','Black',4),(26,'M','Black',4),(27,'L','Black',4),(28,'XL','Black',4),(29,'S','White',4),(30,'M','White',4),(31,'L','White',4),(32,'XL','White',4),(33,'S','Black',5),(34,'M','Black',5),(35,'L','Black',5),(36,'XL','Black',5),(37,'S','White',5),(38,'M','White',5),(39,'L','White',5),(40,'XL','White',5);
/*!40000 ALTER TABLE `Item_Attribute` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Item_Inst`
--

DROP TABLE IF EXISTS `Item_Inst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Item_Inst` (
  `itemInstID` int(12) NOT NULL AUTO_INCREMENT,
  `adjPrice` int(10) DEFAULT NULL,
  `itemID` int(12) DEFAULT NULL,
  `purchaseInstID` int(12) DEFAULT NULL,
  `itemAttID` int(12) DEFAULT NULL,
  PRIMARY KEY (`itemInstID`),
  KEY `itemAttID` (`itemAttID`),
  KEY `itemID` (`itemID`),
  KEY `purchaseInstID` (`purchaseInstID`),
  CONSTRAINT `Item_Inst_ibfk_1` FOREIGN KEY (`itemAttID`) REFERENCES `Item_Attribute` (`itemAttID`),
  CONSTRAINT `Item_Inst_ibfk_2` FOREIGN KEY (`itemID`) REFERENCES `Item` (`itemID`),
  CONSTRAINT `Item_Inst_ibfk_3` FOREIGN KEY (`purchaseInstID`) REFERENCES `Purchase_Inst` (`purchaseInstID`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Item_Inst`
--

LOCK TABLES `Item_Inst` WRITE;
/*!40000 ALTER TABLE `Item_Inst` DISABLE KEYS */;
INSERT INTO `Item_Inst` VALUES (1,130,5,1,34),(2,200,4,1,26),(3,150,3,1,18),(4,250,2,1,10),(5,200,1,1,2),(6,250,2,2,10),(7,200,1,2,5),(8,130,5,3,34),(9,150,3,4,23),(10,200,1,5,1),(11,250,2,8,9),(12,150,3,11,21),(13,150,3,11,23),(14,150,3,11,22),(15,130,5,12,34),(16,130,5,12,35),(17,130,5,12,33),(18,130,5,12,36),(19,150,3,13,19),(20,250,2,14,11),(21,250,2,15,9),(22,250,2,15,10),(23,250,2,15,12),(24,250,2,16,10),(25,250,2,17,9),(26,250,2,17,9),(27,250,2,17,9),(28,150,3,18,20),(29,130,5,20,34);
/*!40000 ALTER TABLE `Item_Inst` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Purchase_Inst`
--

DROP TABLE IF EXISTS `Purchase_Inst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Purchase_Inst` (
  `purchaseInstID` int(12) NOT NULL AUTO_INCREMENT,
  `purchaseDate` datetime DEFAULT NULL,
  `totalAmnt` varchar(32) DEFAULT NULL,
  `numItems` int(10) DEFAULT NULL,
  `custID` int(12) DEFAULT NULL,
  PRIMARY KEY (`purchaseInstID`),
  KEY `custID` (`custID`),
  CONSTRAINT `Purchase_Inst_ibfk_1` FOREIGN KEY (`custID`) REFERENCES `Customer` (`custID`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Purchase_Inst`
--

LOCK TABLES `Purchase_Inst` WRITE;
/*!40000 ALTER TABLE `Purchase_Inst` DISABLE KEYS */;
INSERT INTO `Purchase_Inst` VALUES (1,'2013-04-25 00:00:00','930',5,4),(2,'2013-04-25 00:00:00','450',2,2),(3,'2013-04-25 00:00:00','130',1,2),(4,'2013-04-29 00:00:00','150',1,4),(5,'2013-04-29 00:00:00','200',1,4),(6,'2013-04-29 00:00:00','250',1,3),(7,'2013-04-29 00:00:00','250',1,3),(8,'2013-04-29 00:00:00','250',1,4),(9,'2013-04-29 00:00:00','0',0,2),(10,'2013-04-29 00:00:00','0',0,2),(11,'2013-04-29 00:00:00','750',5,2),(12,'2013-04-29 00:00:00','520',4,2),(13,'2013-04-29 00:00:00','150',1,2),(14,'2013-04-30 00:00:00','250',1,3),(15,'2013-04-30 00:00:00','750',3,1),(16,'2013-04-30 00:00:00','1000',4,1),(17,'2013-04-30 00:00:00','750',3,1),(18,'2013-04-30 00:00:00','150',1,1),(19,'2013-04-30 00:00:00','0',0,1),(20,'2013-04-30 04:30:04','130',1,1);
/*!40000 ALTER TABLE `Purchase_Inst` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-04-30  6:31:17
