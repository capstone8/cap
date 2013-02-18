var http = require('http')
, url = require('url')
, fs = require('fs')
, server;

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'capstone'
});	




server = http.createServer(function(req, res) {
  // your normal server code
  var path = url.parse(req.url).pathname;
  switch (path){
    case '/':
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write('<h1>Hello! Try the <a href="/socketio-test.html">Socket.io Test</a></h1>');
      res.end();
      break;
    case '/socketio-test.html':
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
    
  // now that we have our connected 'socket' object, we can 
  // define its event handlers
  socket.on('message', function(message){
        console.log("Received message: " + message + " - from client " + socket.id);
	
	//connection.query('SELECT * FROM Employees WHERE EmpID =' + message, function(err, rows, fields) {
 	 //if (err) throw err;

		//socket.emit('result',rows);
	//});
	
  });

	socket.on('cusEnterLeave', function (ID) { cusEnterLeave(socket, ID); });
    
  socket.on('disconnect', function(){
    console.log("Connection " + socket.id + " terminated.");
connection.end();
  });
    
});


var custArr = new Array();

function cusEnterLeave(socket, ID) {

	if( ID != null && typeof(custArr[ID]) != 'undefined') {		
		//free memory somehow		
		delete custArr[ID];
		socket.emit('removeCustomerFromFeed', ID);
	} else if (ID!=null) {
		var cust;
		getCustomerFromDB(socket, ID, function(cust) {
			if(cust.length > 0) {
				custArr[ID] = cust[0];
			socket.emit('addCustomerToFeed', ID, custArr[ID]);
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
		connection.query('SELECT * FROM Employees WHERE EmpID = ' + ID, function(err, rows) {
			if (err) throw err;
			else if (rows==null) { socket.emit('err', 'seriouslyfuckyou'); }
			else {
				callback(rows);
			}
		});
	}
}


