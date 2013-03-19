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

function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

function getCustomerListFromDB(callback){
  connection.query('SELECT * FROM Employees', function(err, rows) {
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
		socket.emit('err', "NO IDEA WHY YOU WOULD TRY AND FUCK ME");
		return;
	} else {
		connection.query('SELECT * FROM Employees WHERE empID = ' + ID, function(err, rows) {
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
		  socket.emit('err', 'shit');
		}	
		
	} else {
		socket.emit('err', "no id");
	}
}