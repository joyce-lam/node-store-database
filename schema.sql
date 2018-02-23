DROP DATABASE IF EXISTS inventoryDB;
CREATE database inventoryDB;

USE inventoryDB;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(50) NULL,
	department_name VARCHAR(50) NULL,
	price DECIMAL(10,4) NULL,
	stock_quantity INT(20) NULL
	PRIMARY KEY (item_id)
);