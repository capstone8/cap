var util = require("./util.js");

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
    password : 'root',
    database : 'test'
});


server = http.createServer(function(req, res) {
  // your normal server code
  var path = url.parse(req.url).pathname;
  switch (path){
    case '/':
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write('<h1>Hello! Try the <a href="/index.html">Hey</a></h1>');
      res.end();
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
    case '/include.js':
      fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'})
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

// on a 'connection' event
io.sockets.on('connection', function(socket){

  console.log("Connection " + socket.id + " accepted.");
  socket.on('message', function(message){
    console.log("Received message: " + message + " - from client " + socket.id);
  });
//listener for customer entering/leaving the store
  socket.on('cusEnterLeave', function (ID) { cusEnterLeave(socket, ID); });
//listener for customer being helped at the store 
  socket.on('custHelped',function(ID){custHelped(socket,ID); });
//listener for customer.html query
  socket.on('getCustData',function(ID){getCustData(socket, ID);});
//invoke when socket is disconnected
  socket.on('disconnect', function(){
    console.log("Connection " + socket.id + " terminated.");
    //kill mysql connection upon socket disconnect
    connection.end();
  });
  socket.on('getCustPurchaseHist', function(ID){getCustPurchaseHist(socket,ID)});
  socket.on('setCustomerID', function(ID){setCustomerID(socket, ID);});
  socket.on('getCustomerID', function(ID){getCustomerID(socket, ID);});
  socket.on('getCustomerListFromFeed', function() {getCustomerListFromFeed(socket);});
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

var customersDB = new Array();
var first = 'false';
//array to keep track of customers enter/leave the store
var custArr = new Array();
//array to keep track of customers being helped at the store
var custViewing = new Array();
// var purchaseInstArr = new Array();
// var itemInstArr = new Array();
var itemInstArr = new Array();
var purchaseInstArr = new Array();

function getPurchaseInstFromDB(socket, ID, callback) {
  if(ID !== null) {
    connection.query('SELECT * FROM Purchase_Inst WHERE custID = ' + ID, function(err, rows) {
      if (err) throw err;
      else if (rows==null) { socket.emit('err', 'ERR: Purchase_Inst query was null'); }
      else {
        console.log("number of purchase instances: " + rows.length);
        for (var i in rows) {
          callback(rows);
        }
      }
    });
  }	  
}
function getItemInstFromDB (socket,ID,callback){
  var itemInstArray = [];
  getPurchaseInstFromDB(socket,ID,function(rows){
    
    for (var i in rows){
      if (rows[i].purchaseInstID!==null){
	connection.query('SELECT * FROM Item_Inst WHERE purchaseInstID = ' + rows[i].purchaseInstID, function(err2, itemInst) {
              if(err2) throw err2;
              else if (itemInst==null) {socket.emit('err', 'ERR: Item_Inst query was null'); }
              else {
                console.log("number of item instances for purchase instance " + rows[i].purchaseInstID + ": " + itemInst.length);
                for (var j in itemInst) {
                  itemInstArray.push(itemInst[j]);
                  console.log(itemInstArray.length);
                }
                callback(itemInstArray);
	      }//end else
	});//end query 
      }//end if
    }//end for 
  });
  
}

function getItemFromDB(socket,ID,callback){
   var purchaseInstArray = [];
  getItemInstFromDB(socket,ID,function(itemInst){
  
  for (var j in itemInst) {
    if (itemInst[j].itemID!==null){
    console.log(itemInst[0]);
    connection.query('SELECT * FROM Item WHERE itemID = '+ itemInst[j].itemID, function (err3, item) {
      if(err3) throw err;
      else if (item==null) {socket.emit('err', 'err3');}
      else {
	itemInst[j].category = item[0].category;
	itemInst[j].brand = item[0].brand;  
	purchaseInstArray.push(itemInst[j]);
	console.log("purchaseInstArray: "+purchaseInstArray.length);
      }
    });//end for (var j in itemInst)
   
    }
  }//end for
 
    
  });
 callback(purchaseInstArray);
}
function getCustPurchaseHist(socket,ID){
  
  getItemFromDB(socket,ID,function(purchaseInstArray){
      socket.emit("receiveCustPurchaseHist",purchaseInstArray);
  });
  
}


/*function getCustPurchaseHist(ID,socket) {
  if(ID!==null) {
    connection.query('SELECT * FROM Purchase_Inst WHERE custID = '+ID, function(err,rows) {
      if (err) throw err;
      else if (rows == null) {socket.emit('err', 'uhoh'); }
      else {
       
        for(var i in rows) {
          if(rows[i].purchaseInstID!==null) {
            connection.query('SELECT * FROM Item_Inst WHERE purchaseInstID = '+rows[i].purchaseInstID, function(err2, itemInst) {
              if(err2) throw err2;
              else if (itemInst==null) {socket.emit('err', 'uhohhh'); }
              else {
		 
                for (var j in itemInst) {
                  connection.query('SELECT * FROM Item WHERE itemID = '+ itemInst[j].itemID, function (err3, item) {
                    if(err3) throw err;
                    else if (item==null) {socket.emit('err', 'err3');}
                    else {
		      for (var k=0;k<item.length;k++){
                      itemInst[j].category = item[k].category;
                      itemInst[j].brand = item[k].brand;
		      console.log(JSON.stringify(item[k]));
		      }
		      itemInstArr.push(JSON.stringify(itemInst[j]));
                    }
                     
                   // socket.emit("receiveCustPurchaseHist", item);
                    });
                 
		  console.log(JSON.stringify(itemInst[j]));
                
		   
		  }  
              }
            });  
          }
          purchaseInstArr.push(JSON.stringify(itemInstArr));
	 //console.log(itemInstArr);
        }  
      }
      //socket.emit("receiveCustPurchaseHist", rows);
    });
    socket.emit("receiveCustPurchaseHist", purchaseInstArr);
    console.log("HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    console.log(JSON.stringify(purchaseInstArr));

  }  
}*/

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
	  else if (rows == null) { socket.emit('err', 'seriouslyfuckyou'); }
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
		socket.emit('err', "wtf");
	}
}


	
function cusEnterLeave(socket, ID) {

	if( ID != null && typeof(custArr[ID]) != 'undefined') {		
		//free memory somehow		
		delete custArr[ID];
		io.sockets.emit('removeCustomerFromFeed', ID);
	} else if (ID!=null) {
		var cust;
		getCustomerFromDB(socket, ID, function(cust) {
			if(cust.length > 0) {
				var time = new Date();
				custArr[ID] = {cust: cust[0], time: time, helped: false};
				io.sockets.emit('addCustomerToFeed', ID, custArr[ID].cust, custArr[ID].time);
			} else {
				socket.emit('err', "wtf");
			}
		});
		//console.log("look here fuckface" + rows[0].empID);		
		
	} else {
		socket.emit('err', "no id");
	}
}


function getCustomerFromDB(socket, ID, callback) {

	if(ID == null) {
		socket.emit('err', "error getCustomerFromDB: ID = NULL");
		return;
	} else {
		connection.query('SELECT * FROM Customer WHERE custID = ' + ID, function(err, rows) {
			if (err) throw err;
			else if (rows==null) { socket.emit('err', 'seriouslyfuckyou'); }
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
		  socket.emit('retrieveCustData', ID, custArr[ID].cust, custArr[ID].time);
		}else {
		  getCustomerFromDB(socket, ID, function(cust) {
                        if(cust.length > 0) {
                                io.sockets.emit('retrieveCustData', ID, cust[0], "N/A");
                        } else {
                                socket.emit('err', "wtf");
                        }
                });
		}	
		
	} else {
		socket.emit('err', "no id");
	}
}