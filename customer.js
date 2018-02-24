var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "inventoryDB"
});


connection.connect(function(err) {
	if (err) throw err;
	showTable();
	action();
});


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

		for (var i = 0; i < res.length; i++) {
			table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price_per_unit, res[i].stock_quantity]);
		}

	console.log(table.toString());

	})

}


// // 	var a = res.forEach(function(product) {
// // 				product.item_id;
// // 				product.product_name;
// // 				product.department_name;
// // 				product.price_per_unit;
// // 				product.stock_quantity
// // 			});



var purchase = {};
function action() {

	inquirer.prompt({
		name: "choice",
		type: "input",
		message: "Hi! Let's shop! What is the ID of the item you would like to buy today?[q to quit]\n"
	}).then(function(response) {
		if (response.choice === "q") {
			console.log("See you next time!");
		} else {
			askQuantity();
			purchase["choice"] = response.choice;
			//findCurrentStock(response.choice);
		}
	})
}
	

function askQuantity() {
	inquirer.prompt({
		name: "quantityInput",
		type: "input",
		message: "How many would you like?"
	}).then(function(response) {
		console.log(response.quantityInput);
		purchase["quantity"] = response.quantityInput;

		findCurrentStock(purchase.choice);

		
		// if (response.quantityInput < currentStock) {
		// 	updateStock(response.quantityInput, response.choice);
		// } else {
		// 	console.log("Insufficient stock to allow transactions! Try again!")
		// }
	});
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
		compareStock(purchase.choice, purchase.quantity, currentStock);
		return res[0].stock_quantity;
	});
}


function compareStock(choice, quantity, stock) {
	if (quantity < stock) {
			console.log("Processing transactions.");
			calculateAmount()
			//updateStock(quantity, choice);
	} else {
		console.log("Insufficient stock to allow transactions! Try again!")
	}

}

function calculateAmount(id, quantity) {
	var query = "SELECT price_per_unit FROM products WHERE ?";
	connection.query(query, 
	{
		item_id: id
	}, function(err, res) {
		if (err) throw err;
		var unitPrice = res[0].price_per_unit;
		var total = unitPrice * quantity;
		console.log("Total: " + total);
		return total;
	})
}


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
			console.log(res)
		}
	);
	action();
}


