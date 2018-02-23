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
	action();
});

function action() {
	inquirer.prompt({
		name: "choice",
		type: "input",
		message: "Hi! What is the ID of the item you would like to buy today?"
	},
	{
		name: "quantityInput",
		type: "input",
		message: "How many would you like?"
	}).then(function(response) {
		response.choice
		response.quantityInput
	})
}
