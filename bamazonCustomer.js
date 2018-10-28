var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3386,
  user: "root",
  password: "password",
  database: "bamazondb"
});

connection.connect(function(err) {
  if (err) throw err;
  clients();
});


function clients() {
  inquirer
    .prompt({
      type: "list",
      message: "Which option would you like to try?",
      choices:["show-products", "supervisor-view"],
      name: "menu",
    })
    .then(function(menu) {
      console.log(menu.product_name);
      showProducts();   
  });
}

function showProducts() {
  var query = "SELECT * FROM products";
  connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(
        "Product Name: " +  
        res[i].product_name + 
        " || Price: " +
        res[i].price)
    }    
  });
  // clients();
}

