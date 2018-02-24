//require npm package
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

//create connection to mysql database
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "inventoryDB"
});

//connect to database
connection.connect(function(err) {
	if (err) throw err;
	action();
});

function action() {
	inquirer.prompt({
		name: "choice",
		type: "list",
		message: "Please choose:\n",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", 
		"Add New Product"]
	}).then(function(response) {
		var choice = response.choice;
		switch (choice) {
			case "View Products for Sale":
				return displayAll();

			case "View Low Inventory":
				return displayLowInventory();

			case "Add to Inventory":
				return addInventory();

			case "Add New Product":
				return addProductName();
		}
	})
}

function displayAll() {
	var table = new Table({
	  chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
	         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
	         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
	         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
	});

	var query = "SELECT * FROM products";
	connection.query(query, function(err, res) {
		if (err) throw err;

		table.push(["item_id", "product_name", "department", "price_per_unit", "stock_quantity"]);

		res.forEach(function(product) {
			table.push([
				product.item_id,
				product.product_name,
				product.department_name,
				product.price_per_unit,
				product.stock_quantity
			]);
		})

		console.log(table.toString());
		
		//call inquirer function
		action();

	});
}

function displayLowInventory() {
	var table = new Table({
	  chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
	         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
	         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
	         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
	});


	var query = "SELECT * FROM products WHERE stock_quantity <=5";
	connection.query(query, function(err, res) {
		if (err) throw err;

		table.push(["item_id", "product_name", "department", "price_per_unit", "stock_quantity"]);

		res.forEach(function(product) {
			table.push([
				product.item_id,
				product.product_name,
				product.department_name,
				product.price_per_unit,
				product.stock_quantity
			]);
		})

		console.log(table.toString());

		//call inquirer function
		action();

	});
}

var item = {};
function addInventory() {
	inquirer.prompt({
		name: "addInv",
		type: "input",
		message: "What is the ID of the item you would like to add inventory to? [q to quit]\n",
		validate: validateNumString
	}).then(function(response) {
		if (response.addInv === "q") {
			return;
		} else {

			findCurrentStock(response.addInv);
			item["choice"] = response.addInv;
		}
	})
}





function findCurrentStock(id) {
	var query = "SELECT stock_quantity FROM products WHERE ?";
	connection.query(query, 
		{
			item_id: id
		}, function(err, res) {
		if (err) throw err;
		console.log("Current stock: " + res[0].stock_quantity);
		var currentStock = res[0].stock_quantity;
		askQuantity(currentStock);



	});
}



function askQuantity(currentStock) {
	inquirer.prompt({
		name: "quantityInput",
		type: "input",
		message: "How many would you like to add? [q to quit]\n",
		validate: validateNumString
	}).then(function(response) {
		if (response.quantityInput === "q") {
			action();
		} else {
			var totalQuantity = parseInt(response.quantityInput) + parseInt(currentStock);
			console.log("The total stock_quantity will be: " + totalQuantity);
			item["addQuantity"] = totalQuantity;

			updateInventory(item.choice, item.addQuantity);
		}
	});
}



function updateInventory(choice, quantity) {
	var query = "UPDATE products SET ? WHERE ?";
	connection.query(query, 
		[{
			stock_quantity: quantity
		},
		{
			item_id: choice
		}], function(err, res) {
			if (err) throw err;
			displayAll();
		});
}


var newProduct = {};
function addProductName() {
	inquirer.prompt({
		name: "nameproduct",
		type: "input",
		message: "What is the name of the product you would like to add? [q to quit]\n",
		validate: validateNumString
	}).then(function(response) {
		if (response.nameproduct === "q") {
			return;
		} else {
			newProduct["name"] = response.nameproduct;
			addProductDept();
		}
	});
}


function addProductDept() {
	inquirer.prompt({
		name: "dept",
		type: "input",
		message: "What department does this item belong to? [q to quit]\n",
		validate: validateNumString
	}).then(function(response) {
		if (response.dept === "q") {
			return;
		} else {
			newProduct["dept"] = response.dept;
			addProductPrice();
		}
	});
}	


function askProductPrice() {
	inquirer.prompt({
		name: "unitprice",
		type: "input",
		message: "What is the unit price of this item? [q to quit]\n",
		validate: validateNumString
	}).then(function(response) {
		if (response.unitprice === "q") {
			return;
		} else {
			newProduct["unitprice"] = response.unitprice;
			addProductStock();
		}
	});

}


function askProductStock() {
	inquirer.prompt({
		name: "stock",
		type: "input",
		message: "How many do you want to stock? [q to quit]\n",
		validate: validateNumString
	}).then(function(response) {
		newProduct["stock"] = response.stock;
		addProductToTable(newProduct.name, newProduct.dept, newProduct.unitprice, newProduct.stock);
	});

}


function addProductToTable(name, dept, unitprice, stock) {
	var query = "INSERT INTO products SET ?";
	connection.query(query, {
		product_name: name,
		department_name: dept,
		price_per_unit: unitprice,
		stock_quantity: stock
	}, function(err, res) {
		if (err) throw err;
		displayAll();
	})
}



function validateNumString(input) {
   if (typeof parseInt(input) === "number"){
   		return true;
   	} else if (input === "q"){
   		return true;
   	} else {
   		console.log("Enter a valid number or quit with 'q'")
   		return;
   	}
}