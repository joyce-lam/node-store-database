DROP DATABASE IF EXISTS inventoryDB;
CREATE database inventoryDB;

USE inventoryDB;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(50) NULL,
	department_name VARCHAR(50) NULL,
	price_per_unit DECIMAL(10,2) NULL,
	stock_quantity INT(20) NULL,
	PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price_per_unit, stock_quantity)
VALUES ("strawberries", "fruits", 4.00, 20),
("mango", "fruits", 2.00, 30),
("new york strip steak", "meat", 14.00, 50),
("chicken thigh", "meat", 2.50, 50),
("pita chips", "snacks", 2.00, 50),
("chocolate chip cookies", "snacks", 1.00, 25),
("asparagus", "vegetables", 3.00, 20),
("tomato", "vegetables", 1.50, 30),
("paper towels", "home", 0.50, 50),
("liquid detergent", "home", 2.20, 30),
("mozzarella cheese", "dairy", 8.00, 20),
("strawberry yoghurt", "dairy", 1.00, 20),
("bacon", "deli", 5.00, 30);