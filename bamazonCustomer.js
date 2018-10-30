var mysql = require("mysql");
var inquirer = require("inquirer");
var stock;
var price;
var id;

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
        console.log("Buy products");

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
    connection.end();    
  });
}

function buyProducts(){
  inquirer
    .prompt({
      type:"input",
      message:"Please write the ID of the product you would like to buy",
      name:"id",
    })
    .then(function(response){
      var query = "SELECT * FROM products WHERE ?";
       connection.query(query, {item_id:response.id}, function(err, res){
         console.log(response.id)
         stock = res[0].stock_quantity;
         price = res[0].price;
         id =  res[0].item_id ;
              console.log(
                "ID: " +  
                res[0].item_id + 
                " || Product Name: " +  
                res[0].product_name +  
                " || Price: " +
                res[0].price +
                " || Department: " +
                res[0].department_name + 
                " || Stock: " +
                res[0].stock_quantity     
              );

          inquirer
            .prompt({
              type:"input",
              message:"How many would you like to buy?",
              name:"quantity",
            })
            .then(function(response){
              if(response.quantity > stock){
                console.log("Insufficient quantity!!");
                connection.end();
              }
              else {
                console.log("In Stock: " + stock);
                var newQuantity = stock - response.quantity;
                var charge = price*response.quantity*1.13;
                var query = `UPDATE products SET stock_quantity = ${newQuantity} WHERE item_id = ${id}`
                connection.query(query, function(err, res){                  
                  if (err) throw err;
                  console.log("Succesfully Charged: " + charge);
                  connection.end();
                })

              }

            })
    });
})
}

