# node-store-database
A storefront created with Node.js and My SQL.

## Getting Started
### Prerequistities
In order to run this store, you need to install the following Node packages.
* [Inquirer](https://www.npmjs.com/package/inquirer)
* [mysql](https://www.npmjs.com/package/mysql)
* [cli-table](https://www.npmjs.com/package/cli-table)

### Instructions
1. In terminal, go to your project and run `npm init --y` which can initialize a `package.json` file for your project.

2. Make 2 sql files.

(1) schema.sql
This file contains the database and table for holding data about the store inventory.

(2) seed.sql
This file contains the data(items) for the store inventory.

3. Make 2 javascript files.

(1) customer.js
* This file contains the logic for customer view.
* Customers will be shown the product table with items and corresponding data which are stored in the mysql database. Then, they will be prompted to select the product and the quantity of the product they would like to purchase. The data in database will be updated and results are shown in a table.

![alt text](https://github.com/joyce-lam/node-store-database/blob/master/assets/customer.gif)


(2) manager.js
* This file contains the logic for manager view.
* Managers can select to view/update/add products. Data will be pulled from the mysql database.

## Built With
* Node.js
* Npm Inquirer.js
* Npm mysql
* Npm cli-table
* MySQL 
* Javascript

## License
This porject is licensed under the MIT License - see the [https://github.com/joyce-lam/node-store-database/blob/master/LICENSE](LICENSE.md) file for details.
