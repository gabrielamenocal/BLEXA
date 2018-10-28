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
      choices:["Show-products", "Buy-Product"],
      name: "menu",
    })
    .then(function(response) {
      if (response.menu === "Show-products"){
        showProducts();   
      }
      else if (response.menu === "Buy-Product"){        
        buyProducts();
      }
      else {
        console.log("Please choose a valida option");
      }
  });
}

function showProducts() {
  var query = "SELECT * FROM products";
  connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(
        "ID: " +  
        res[i].item_id + 
        " || Product Name: " +  
        res[i].product_name + 
        " || Price: " +
        res[i].price +
        " || Price: " +
        res[i].department_name + 
        " || Stock: " +
        res[i].stock_quantity     
      )
    }    
  });
}

function buyProducts(){
  inquirer
    .prompt({
      type:"input",
      message:"Please write the ID of the product you would like to buy",
      name:"id",
    })
    .then(function(id){
      var query = "SELECT * FROM products WHERE ?";
       connection.query(query, {id:id.item_id}, function(err, res){
        for (var i = 0; i < res.length; i++) {
              console.log(
                "ID: " +  
                res.item_id + 
                " || Product Name: " +  
                res.product_name +  
                " || Price: " +
                res.price +
                " || Price: " +
                res.department_name + 
                " || Stock: " +
                res.stock_quantity     
              )
        }       
    });
})
}

