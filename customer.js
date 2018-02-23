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

