var mysql = require("mysql");
var inquirer = require("inquirer");


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
});


function showTable() {
	var query = "SELECT * FROM products";
	connection.query(query, function(err, res) {
		if (err) throw err;
		console.log(res);
		action();
	})
}

var purchase = {};
function action() {
	inquirer.prompt({
		name: "choice",
		type: "input",
		message: "Hi! Let's shop! What is the ID of the item you would like to buy today?[q to quit]"
	}).then(function(response) {
		if (response.choice === "q") {
			console.log("See you next time!");
			break;
		} else {
			askQuantity();
		}
	})
	

function askQuantity() {
	inquirer.prompt({
		name: "quantityInput",
		type: "input",
		message: "How many would you like?"
	}).then(function(response) {
		console.log(response.quantityInput);
}







		//compareStock(response.choice, response.quantityInput);
		// var currentStock = findCurrentStock(response.choice);
		// console.log(currentStock);
		// if (response.quantityInput < currentStock) {
		// 	updateStock(response.quantityInput, response.choice);
		// } else {
		// 	console.log("Insufficient stock to allow transactions! Try again!")
		// }


// function compareStock(choice, quantity) {
// 	var currentStock = findCurrentStock(choice);
// 	if (quantity < currentStock) {
// 			updateStock(quantity, choice);
// 	} else {
// 		console.log("Insufficient stock to allow transactions! Try again!")
// 	}

// }


// function findCurrentStock(id) {
// 	var query = "SELECT stock_quantity FROM products WHERE ?";
// 	connection.query(query, 
// 		{
// 			item_id: id
// 		}, function(err, res) {
// 		if (err) throw err;
// 		console.log(res[0].stock_quantity);
// 		return res[0].stock_quantity;
// 	});
// }

// function updateStock(quantity, id) {
// 	var query = "UPDATE products SET ? WHERE?";
// 	connection.query(query, 
// 		[{
// 			stock_quantity: quantity
// 		},
// 		{
// 			item_id: id
// 		}], function(err, res) {
// 			if (err) throw err;
// 			console.log(res)
// 		}
// 	);
// 	action();
// }







