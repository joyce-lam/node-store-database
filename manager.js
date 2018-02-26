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

//function to ask questions
function action() {
	inquirer.prompt({
		name: "choice",
		type: "list",
		message: "Please choose:\n",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", 
		"Add New Product", "q to quit"]
	}).then(function(response) {
		var choice = response.choice;

		//depending on user's input, run different functions
		switch (choice) {
			case "View Products for Sale":
				return displayAll();

			case "View Low Inventory":
				return displayLowInventory();

			case "Add to Inventory":
				return addInventory();

			case "Add New Product":
				return addProductName();

			case "q to quit":
			process.exit(0);
		}
	})
}

//function to display table using cli-table
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

//function to display items with low stock by acquiring data from sql databse and using cli-table 
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

		if (res.length === 0) {
			console.log("Nothing is short.");
			action();
		} else {

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
		}

	});
}

var item = {};
//function to add inventory 
function addInventory() {
	inquirer.prompt({
		name: "addInv",
		type: "input",
		message: "What is the ID of the item you would like to add inventory to? [q to quit]\n",
		validate: validateNumString
	}).then(function(response) {
		if (response.addInv === "q") {
			process.exit(0);
		} else {
			//function to find current stock
			findCurrentStock(response.addInv);
			//saving  user's choice as an object
			item["choice"] = response.addInv;
		}
	})
}

//function to find current stock by acquiring info from sql database
function findCurrentStock(id) {
	var query = "SELECT stock_quantity FROM products WHERE ?";
	connection.query(query, 
		{
			item_id: id
		}, function(err, res) {
		if (err) throw err;
		console.log("Current stock: " + res[0].stock_quantity);
		var currentStock = res[0].stock_quantity;

		//call the function to ask user for the quantity they want to add
		askQuantity(currentStock);
	});
}

//function to ask user for the quantity they want to add
function askQuantity(currentStock) {
	inquirer.prompt({
		name: "quantityInput",
		type: "input",
		message: "How many would you like to add? [q to quit]\n",
		validate: validateNumString
	}).then(function(response) {
		if (response.quantityInput === "q") {
			process.exit(0);
		} else {
			var totalQuantity = parseInt(response.quantityInput) + parseInt(currentStock);
			console.log("The total stock_quantity will be: " + totalQuantity);
			//saving user's input in an object
			item["addQuantity"] = totalQuantity;

			//call the function to update inventory
			updateInventory(item.choice, item.addQuantity);
		}
	});
}

//function to update inventory by accessing the database
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

			//call the function to display table
			displayAll();
		});
}


var newProduct = {};
//function to add product
function addProductName() {
	inquirer.prompt({
		name: "nameproduct",
		type: "input",
		message: "What is the name of the product you would like to add? [q to quit]\n",
		validate: validateNumString
	}).then(function(response) {
		if (response.nameproduct === "q") {
			process.exit(0);
		} else {
			//saving user's input as an object
			newProduct["name"] = response.nameproduct;
			//call the function to ask user to input the new product's dept
			addProductDept();
		}
	});
}

//function to ask user to input the new product's dept
function addProductDept() {
	inquirer.prompt({
		name: "dept",
		type: "input",
		message: "What department does this item belong to? [q to quit]\n",
		validate: validateNumString
	}).then(function(response) {
		if (response.dept === "q") {
			process.exit(0);
		} else {
			//saving user's input as an object
			newProduct["dept"] = response.dept;
			//call the function to ask user to input the new product's unit price
			addProductPrice();
		}
	});
}	

//function to ask user to input the new product's unit price
function addProductPrice() {
	inquirer.prompt({
		name: "unitprice",
		type: "input",
		message: "What is the unit price of this item? [q to quit]\n",
		validate: validateNumString
	}).then(function(response) {
		if (response.unitprice === "q") {
			process.exit(0);
		} else {
			//saving user's input as an object
			newProduct["unitprice"] = response.unitprice;
			//call the function to ask user to input the new product's stock
			addProductStock();
		}
	});
}

//function to ask user to input the new product's stock
function addProductStock() {
	inquirer.prompt({
		name: "stock",
		type: "input",
		message: "How many do you want to stock? [q to quit]\n",
		validate: validateNumString
	}).then(function(response) {
		//saving user's input as an object
		newProduct["stock"] = response.stock;
		//call the function to add the new product's info to the database
		addProductToTable(newProduct.name, newProduct.dept, newProduct.unitprice, newProduct.stock);
	});
}

//function to add the new product's info to the database
function addProductToTable(name, dept, unitprice, stock) {
	var query = "INSERT INTO products SET ?";
	connection.query(query, {
		product_name: name,
		department_name: dept,
		price_per_unit: unitprice,
		stock_quantity: stock
	}, function(err, res) {
		if (err) throw err;
		//call the function to display table
		displayAll();
	})
}

//function to validate user's input
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