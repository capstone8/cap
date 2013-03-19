CREATE TABLE Auth (
authID INT(12) AUTO_INCREMENT,
salt VARCHAR(32),
password VARCHAR(32),
PRIMARY KEY (authID)
) Engine=InnoDB;

CREATE TABLE Personal_Information (
personalID INT(12) AUTO_INCREMENT,
firstName VARCHAR(32),
lastName VARCHAR(32),
middleName VARCHAR(32),
address VARCHAR(128),
phoneNumber VARCHAR(32),
birthDate DATE,
picPath VARCHAR(200),
PRIMARY KEY (personalID)
) Engine=InnoDB;

CREATE TABLE Employee (
personalID INT(12),
userName VARCHAR(32),
authid INT(12),
PRIMARY KEY (personalID),
FOREIGN KEY (authID) REFERENCES Auth(authID),
FOREIGN KEY (personalID) REFERENCES Personal_Information(personalID)
) Engine=InnoDB;

CREATE TABLE Customer (
personalID INT(12),
userName VARCHAR(32),
authid INT(12),
shirtSize VARCHAR(32),
pantSize VARCHAR(32),
dressSize VARCHAR(32),
PRIMARY KEY (personalID),
FOREIGN KEY (personalID) REFERENCES Personal_Information(personalID),
FOREIGN KEY (authID) REFERENCES Auth(authID)
) Engine=InnoDB;



CREATE TABLE Purchase_Inst (
purchaseInstID INT(12),
purchaseDate DATE,
totalAmnt VARCHAR(32),
numItems VARCHAR(32),
custID INT(12),
PRIMARY KEY (purchaseInstID),
FOREIGN KEY (custID) REFERENCES Customer(personalID)
) Engine=InnoDB;

CREATE TABLE Item (
itemID INT(12) AUTO_INCREMENT,
category VARCHAR(32),
brand VARCHAR(32),
price INT(10),
PRIMARY KEY (itemID)
) Engine=InnoDB;

CREATE TABLE Item_Inst (
itemInstID INT(12)  AUTO_INCREMENT,
clotheSize VARCHAR(32),
adjPrice INT(10),
color VARCHAR(32),
itemID INT(12),
purchaseInstID INT(12),
PRIMARY KEY (itemInstID),
FOREIGN KEY (itemID) REFERENCES Item(itemID),
FOREIGN KEY (purchaseInstID) REFERENCES Purchase_Inst(purchaseInstID)
) Engine=InnoDB;




/*
CREATE TABLE Purchase_History (
purchaseID INT(12),
totalSpent DECIMAL(12,4),
purchases VARCHAR(32),
custID INT(12),
Customer_Size_ID INT(12),
Peronal_Information INT(12),
FOREIGN KEY (custID) REFERENCES Customer,
FOREIGN KEY (purchaseInstID) REFERENCES Purchase_Inst
);
*/