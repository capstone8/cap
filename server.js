var util = require("./util.js");
var timeago = require("timeago");
var http = require('http')
, url = require('url')
, fs = require('fs')
, server;
//var $ = require('jQuery');
var _ = require('underscore');
  var mysql      = require('mysql');
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'teamx!',
    database : 'capstone'
});


server = http.createServer(function(req, res) {
  // your normal server code
  var path = url.parse(req.url).pathname;
	//security measure to double check each page
  switch (path){
    case '/':
	fs.readFile(__dirname + "/index.html", function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'})
        res.write(data, 'utf8');
        res.end();
      });
	break;
    case '/index.html':
      fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'})
        res.write(data, 'utf8');
        res.end();
      });
      break;
    case '/customer.html':
      fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'})
        res.write(data, 'utf8');
        res.end();
      });
      break;
       case '/size.html':
      fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'})
        res.write(data, 'utf8');
        res.end();
      });
      break;
       case '/purchase_history.html':
      fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'})
        res.write(data, 'utf8');
        res.end();
      });
      break;
       case '/brands.html':
      fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'})
        res.write(data, 'utf8');
        res.end();
      });
      break;
        case '/search.html':
      fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'})
        res.write(data, 'utf8');
        res.end();
      });
      break;
    case '/shopping_cart.html':
      fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'})
        res.write(data, 'utf8');
        res.end();
      });
      break;
    case '/item_search.html':
      fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'})
        res.write(data, 'utf8');
        res.end();
      });
      break;  
    case '/checkout.html':
      fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'})
        res.write(data, 'utf8');
        res.end();
      });
      break;  
    case '/include.js':
      fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/javascript'})
        res.write(data, 'utf8');
        res.end();
      });
      break;
      case '/timeago.js':
      fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/javascript'})
        res.write(data, 'utf8');
        res.end();
      });
      break;
    case '/gviz-api.js':
      fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/javascript'})
        res.write(data, 'utf8');
        res.end();
      });
      break;  
	case '/style.css':
      fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/css' : 'text/css'})
        res.write(data, 'utf8');
        res.end();
      });
      break;  
      //shopping cart icon
     case '/assets/80-shopping-cart.png':
      fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'image/png'})
        res.write(data, 'utf8');
        res.end();
      });
      break;
	case '/assets/buttons.png':
      fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'image/png'})
        res.write(data, 'utf8');
        res.end();
      });
      break;  
    default: send404(res);
  }
}),

send404 = function(res){
  res.writeHead(404);
  res.write('404');
  res.end();
};

server.listen(8080);
connection.connect();
console.log("Connected to MySQL");
// socket.io, I choose you
var io = require('socket.io').listen(server);


//RFID python script child process
    var util  = require('util'),
    spawn = require('child_process').spawn,
    ls    = spawn('python', ['test.py']);
	
	
	//RFID read-in process
	ls.stdout.on('data', function(data) {
    console.log("read RFID: " + data);
	console.log(String(data).length);
     connection.query("SELECT * FROM Customer WHERE rfid = \'" + String(data).trim() + "\'", function(err, rows) {
        if(err) throw err;
        else if (rows==0) {console.log('err', 'ERR: no customer matches that rfid'); }
        else {
		console.log(rows[0].custID);
          	cusEnterLeave(rows[0].custID)
        }//end else
      });//end query

    });


// on a 'connection' event
io.sockets.on('connection', function(socket){

	

	
	
    

	
  console.log("Connection " + socket.id + " accepted.");
  socket.on('message', function(message){
    console.log("Received message: " + message + " - from client " + socket.id);
  });
//listener for customer entering/leaving the store
  socket.on('cusEnterLeave', function (ID) { cusEnterLeave(ID); });
//listener for customer being helped at the store 
  socket.on('custHelped',function(ID){custHelped(socket,ID); });
//listener for customer.html query
  socket.on('getCustData',function(ID){getCustData(socket, ID);});
//invoke when socket is disconnected
  /*socket.on('disconnect', function(){
    console.log("Connection " + socket.id + " terminated.");
    //kill mysql connection upon socket disconnect
    connection.end();
  });*/
  
  //listener for when an item is removed from cart
  socket.on('removeItemFromCart', function(itemID, itemAttID, custID){removeItemFromCart(itemID,itemAttID, custID);});
  //listener for when user is assigned a rank based on purchase history
  socket.on('getRank',function(custID){getTotalAmntSpentFromDB(custID,socket);})  
  //gets any existing items in the customer's cart
  socket.on('getCustExistingCart',function(custID){
    getCustExistingCart(socket,custID)});
  //adds database informtion to cart
  socket.on('getCartItemFromDB',function(itemID,attID,custID){
    if (typeof shopping_cart[custID] == 'undefined'){
	shopping_cart[custID] = new Array();
    }
    getCartItemFromDB(socket,itemID,attID,custID)});
  //creates a new purchase instance when an item is bought
  socket.on('setPurchaseInst',function(custID,totalPrice,numItems,cart){setPurchaseInst(socket,custID,totalPrice,numItems,cart);});
  //changes an item's quantity
  socket.on('changeItemQuantityInCart',function(itemID,itemAttID,custID,value){
    changeItemQuantityInCart(itemID,itemAttID,custID,value);
  });
  //sums the total brands from the customer's purchase history
  socket.on('getBrandListFromDB',function(custID){getBrandListFromDB(socket,custID); });
  //get's the customer's size information
  socket.on('getCustomerSizeFromDB',function(custID){getSizeFromDB(socket,custID);});
  //clears the customer's cart
  socket.on('resetCustCart',function(custID){resetCustCart(custID);});
  //loads item attributes dynamically when a user selects a specific item in item search
  socket.on('getItemAttributes', function(ID){getItemAttributes(socket, ID);});
  //gets all of the clothes items from the db
  socket.on('getItemListFromDB', function(){getItemListFromDB(socket);});
  //gets all of the customer's previous purchases
  socket.on('getCustPurchaseHist', function(ID){getCustPurchaseHist(socket,ID)});
  //sets the client's currently viewing customerID
  socket.on('setCustomerID', function(ID){setCustomerID(socket, ID);});
  //gets the client's currently viewing customerID
  socket.on('getCustomerID', function(ID){getCustomerID(socket, ID);});
  //gets the list of customers currently in the store
  socket.on('getCustomerListFromFeed', function() {getCustomerListFromFeed(socket);});
  //gets the total list of customers in the database for the search utility
  socket.on('getCustomerListFromDB',function(){getCustomerListFromDB(
    function(custListFromDB){
      if (typeof customersDB !== 'undefined' && customersDB.length > 0) {
        // the array is defined and has at least one element
        _.uniq(customersDB);
        io.sockets.emit('retreiveCustomerListFromDB',customersDB);
      } else
        for (var cust in custListFromDB) {
        customersDB.push(custListFromDB[cust]);
      }
    })
  });



    
});

//globals
var customersDB = new Array();
var first = 'false';
//array to keep track of customers enter/leave the store
var custArr = new Array();
//array to keep track of customers being helped at the store
var custViewing = new Array();
// var purchaseInstArr = new Array();
// var itemInstArr = new Array();
var purchaseInstArr = new Array();

var shopping_cart = new Array();

function getTotalAmntSpentFromDB(custID,socket){
	connection.query('SELECT SUM(totalAmnt) AS total FROM Purchase_Inst WHERE custID = ' + custID, function(err, rows) {
    if(err) throw err;
    else if (rows==0) {socket.emit("retrieveTotalAmntFromDB", 0); }
    else {
	console.log(rows[0].total);
        socket.emit("retrieveTotalAmntFromDB",rows[0].total);
    }//end else
  });//end query 

}
function getBrandListFromDB(socket,custID){
  connection.query('SELECT brand FROM Item, Item_Inst, Purchase_Inst WHERE Purchase_Inst.custID = ' + custID + ' AND Item_Inst.purchaseInstID = Purchase_Inst.purchaseInstID AND Item_Inst.itemID = Item.itemID', function(err,rows){

    if (err) throw err;
    else if (rows == null) {socket.emit('err','ERR: no brands'); }
    else {
      var group = {};
      var max = 0;
      var value;
      for (var i = rows.length; --i >= 0;) {
	value = rows[i].brand;
	group[value] = (group[value] | 0) + 1;
    }
    for (key in group) {
	if (group[key] > max) max = group[key];
    }
      console.log(group);
    }
   socket.emit('retreiveBrandData',group);
  });//end query
}

function getSizeFromDB(socket,custID) {
  connection.query('SELECT shirtSize,pantSize,dressSize FROM Customer WHERE custID = ' + custID, function(err, rows) {
    if(err) throw err;
    else if (rows==null) {socket.emit('err', 'ERR: size from customer was null'); }
    else {
      socket.emit("retrieveSizeFromDB",rows);
    }//end else
  });//end query 
  
}  
//function to convert javascript new Date into mysql DATE format YYYY-MM-DD
Date.prototype.toYMD = Date_toYMD;
function Date_toYMD() {
    var year, month, day;
    year = String(this.getFullYear());
    month = String(this.getMonth() + 1);
    if (month.length == 1) {
        month = "0" + month;
    }
    day = String(this.getDate());
    if (day.length == 1) {
        day = "0" + day;
    }
    return year + "-" + month + "-" + day;
}
var purchaseInstID;
function setPurchaseInst(socket,custID,totalPrice,numItems,cart){
 var time = new Date();
 var dt = time.toYMD();
 console.log(dt);
  //console.log("setPurchaseInst: " +cart[i][j].itemID);
  connection.query('INSERT INTO Purchase_Inst (purchaseDate,totalAmnt,numItems,custID) VALUES (now(),'+totalPrice+','+numItems+','+custID+')', function(err, result) {
    if (err) throw err;
      purchaseInstID = result.insertId;
      console.log("purchaseInstID: "+result.insertId);
      for (var item in cart) {
        setItemInst(socket, custID, purchaseInstID, cart[item]);
      }
    });
}

function setItemInst(socket,custID,purchaseInstID, cartItem) {
	
	//for(var i = 0; i<cartItem[0].quantity;i++){
    	for (var item in cartItem){
			for(var i = 0;i<cartItem[item].quantity;i++){
			connection.query('INSERT INTO Item_Inst (adjPrice, itemID, purchaseInstID, itemAttID) VALUES ('+cartItem[item].price+','+cartItem[item].itemID+','+purchaseInstID+','+cartItem[item].itemAttID+')', function(err,result) {
      		if (err) throw err;
      		console.log("itemInstID: "+result.insertId);
    });
	}
  }

}

function changeItemQuantityInCart(itemID,itemAttID,custID,value){
  for (var i in shopping_cart[custID]){
	for (var j in shopping_cart[custID][i]){
      		if (shopping_cart[custID][i][j].itemID == itemID && shopping_cart[custID][i][j].itemAttID == itemAttID){
		shopping_cart[custID][i][j].quantity = value;
		console.log("Quantity: " +shopping_cart[custID][i][j].quantity );
   	}
  }
  }
}

function removeItemFromCart(itemID,itemAttID, custID) {
  if(itemID!==null && itemAttID!==null && custID !==null && typeof(shopping_cart[custID])!=='undefined') {
    
    for(var i in shopping_cart[custID]) {
	if (typeof shopping_cart[custID][i] !== 'undefined'){
	  if(shopping_cart[custID][i][0].itemID == itemID && shopping_cart[custID][i][0].itemAttID == itemAttID) {
	    console.log("customer# " + custID + " cart itemid " + itemID + " and attid " + itemAttID + " will be deleted.");
	    shopping_cart[custID].splice(i,1);
	    break;
	  }  
	}
    }
  }
}  

function resetCustCart(custID){
  shopping_cart.splice(custID);
}

function getCustExistingCart(socket,custID){
      socket.emit('receiveCustExistingCart',shopping_cart[custID]);      
}



function getCartItemFromDB (socket,itemID,attID,custID){
//    connection.query('SELECT * FROM Item INNER JOIN Item_Attribute ON Item.itemID=Item_Attribute.itemID WHERE Item.itemID='+itemID+' and Item_Attribute.itemAttID=' + attID, function(err, rows) {

  connection.query('SELECT * FROM Item INNER JOIN Item_Attribute ON Item.itemID='+itemID+' WHERE Item_Attribute.itemAttID=' + attID, function(err, rows) {
    if(err) throw err;
    else if (rows==null) {socket.emit('err', 'ERR: Joined Item and Item_Attribute query was null'); }
    else {
     for (var i in rows){
       rows[i].quantity = 1;
    }
    shopping_cart[custID].push(rows);
    socket.emit("addToCart",rows);
    }//end else
  });//end query 
}

function getItemListFromDB(socket) {
  connection.query('SELECT * FROM Item', function(err, rows) {
    if(err) throw err;
    else if (rows==null) {socket.emit('err', 'ERR: Item_Inst query was null'); }
    else {
      socket.emit("retrieveItemListFromDB",rows);
    }//end else
  });//end query 
  
}  

function getItemAttributes(socket, ID) {
  connection.query('SELECT * FROM Item_Attribute WHERE itemID = ' + ID, function(err, rows) {
    if(err) throw err;
    else if (rows==null) {socket.emit('err', 'ERR: Item_Inst query was null'); }
    else {
      socket.emit("retrieveItemAttributes", ID, rows);
    }//end else
  });//end query 
}  

function getCustPurchaseHist(socket,ID){
  connection.query('SELECT * FROM Item, Item_Inst, Item_Attribute, Purchase_Inst WHERE Purchase_Inst.custID = ' + ID + ' AND Item_Inst.purchaseInstID = Purchase_Inst.purchaseInstID AND  Item_Inst.itemID = Item.itemID AND Item_Inst.itemAttID = Item_Attribute.itemAttID ORDER BY Purchase_Inst.purchaseInstID DESC', function(err2, rows) {
    if(err2) throw err2;
    else if (rows==null) {socket.emit('err', 'ERR: Item_Inst query was null'); }
    else {
      socket.emit("receiveCustPurchaseHist",rows);
    }//end else
  });//end query 
}

function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

function getCustomerListFromDB(callback){
  //change back to customer and add a query to personal info with custID
  connection.query('SELECT * FROM Customer', function(err, rows) {
	   if (err) throw err;
	  else if (rows == null) { socket.emit('err', 'no customer list from db'); }
			else {
				callback(rows);
			}
		});
}

function getCustomerListFromFeed(socket) {
  var customers = new Array();
  for (var cust in custArr) {
    customers.push(custArr[cust]);
  }
  socket.emit('retrieveCustomerListFromFeed', customers);
}
function setCustomerID(socket, ID) {
  custViewing[socket.id] = ID;
}

function getCustomerID(socket, ID) {
  socket.emit('retrieveCustID', custViewing[socket.id]);
}


function custHelped(socket,ID){
	if( ID != null && custArr[ID].helped == true) {		
		//free memory somehow		
		custArr[ID].helped = false;
		io.sockets.emit('isHelped', false, ID); //customer will be marked as not helped
	} else if (ID!=null) {
		custArr[ID].helped = true;
		io.sockets.emit('isHelped', true, ID); //customer will be marked as helped
	} else {
		socket.emit('err', "error");
	}
}

	
function cusEnterLeave(ID) {

	if( ID != null && typeof(custArr[ID]) != 'undefined') {		
		//free memory somehow		
		delete custArr[ID];
		io.sockets.emit('removeCustomerFromFeed', ID);
	} else if (ID!=null) {
		var cust;
		getCustomerFromDB(ID, function(cust) {
			if(_.isEmpty(cust) == false) {
				var time = new Date();
				custArr[ID] = {cust: cust[0], time: time, helped: false};
				io.sockets.emit('addCustomerToFeed', ID, custArr[ID].cust, custArr[ID].time);
			} else {
        io.sockets.emit('err', 'error');
			}
		});
	} else {
		io.sockets.emit('err', "no id");
	}
}


function getCustomerFromDB(ID, callback) {
	if(ID == null) {
		//socket.emit('err', "error getCustomerFromDB: ID = NULL");
		return;
	} else {
		connection.query('SELECT * FROM Customer WHERE custID = ' + ID, function(err, rows) {
			if (err) throw err;
			else if (rows==null) {
			
      }
			else {
				callback(rows);
			}
		});
	}
}

function getCustData(socket, ID) {
	if (ID!=null) {
		var cust;
		if(typeof(custArr[ID]) != 'undefined') {
                  var newDate = new Date();
		  socket.emit('retrieveCustData', ID, custArr[ID].cust, timeago(custArr[ID].time));
		}else {
		  getCustomerFromDB(ID, function(cust) {
                        if(cust.length > 0) {
                                io.sockets.emit('retrieveCustData', ID, cust[0], "N/A");
                        } else {
                                socket.emit('err', "error");
                        }
                });
		}	
		
	} else {
		socket.emit('err', "no id");
	}
}
