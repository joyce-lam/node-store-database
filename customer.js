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
	showTable();
});

//render table using cli-table package to show data from mysql database
function showTable() {
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


var purchase = {};
//function to ask questions
function action() {
	inquirer.prompt({
		name: "choice",
		type: "input",
		message: "Hi! Let's shop! What is the ID of the item you would like to buy today?[q to quit]\n",
		validate: validateNumString
	}).then(function(response) {
		//if user clicks q, they can quit the app
		if (response.choice === "q") {
			console.log("See you next time!");
			process.exit(0);
		} else {
			//otherwise, they will be prompted to answer the next question
			askQuantity();
			//saving user's choice in an object
			purchase["choice"] = response.choice;
		}
	})
}

//validate user input
function validateNumString(input) {
   if (typeof parseInt(input) === "number"){
   		return true;
   	} else if (input === "q"){
   		return true;
   	} else {
   		console.log("Enter a valid number or quit")
   		return;
   	}
}

//function to ask user to input quantity using inquirer
function askQuantity() {
	inquirer.prompt({
		name: "quantityInput",
		type: "input",
		message: "How many would you like?"
	}).then(function(response) {
		//saving user's input in an object
		purchase["quantity"] = response.quantityInput;
		//call the next function to find the available stock
		findCurrentStock(purchase.choice);
		return response.quantityInput;
	});
}

//function to find available stock by reaching to sql database
function findCurrentStock(id) {
	var query = "SELECT stock_quantity FROM products WHERE ?";
	connection.query(query, 
		{
			item_id: id
		}, function(err, res) {
		if (err) throw err;
		//call the next function to compare the available stock and user's input
		var currentStock = res[0].stock_quantity;
		compareStock(purchase.choice, purchase.quantity, currentStock);
		return res[0].stock_quantity;
	});
}

//function to compare the available stock and user's input
function compareStock(choice, quantity, stock) {
	if (quantity <= stock) {
		//call the next function to calculate the amount the user has to pay
		calculateAmount(choice, quantity, stock);
	} else {
		console.log("Insufficient stock to allow transactions! Try again!")
	}

}

//function to calculate the amount user has to pay
function calculateAmount(id, quantity, stock) {
	var query = "SELECT price_per_unit FROM products WHERE ?";
	connection.query(query, 
	{
		item_id: id
	}, function(err, res) {
		if (err) throw err;
		var unitPrice = res[0].price_per_unit;
		//calculate the total price
		var total = unitPrice * quantity;
		console.log("Total Price: " + total);

		var quantityAfterPurchase = parseInt(stock) - parseInt(quantity);
		//call the function to update sql database
		updateStock(quantityAfterPurchase, id);
		return total;
	})
}

//function to update sql database
function updateStock(quantity, id) {
	var query = "UPDATE products SET ? WHERE?";
	connection.query(query, 
		[{
			stock_quantity: quantity
		},
		{
			item_id: id
		}], function(err, res) {
			if (err) throw err;
			
			console.log("Now we have: ");
			//call the function to show the items available in the store
			showTable();
		}
	);
}

