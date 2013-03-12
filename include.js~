
var socket;
    var firstconnect = true;
    var custID;
    function connect() {
      if(firstconnect) {
        socket = io.connect(null);
        socket.on('getCust', function (ID, cust) { addCustomerData(ID, cust); });
	socket.on('retrieveCustID', function(ID) { 
	  custID = ID;
	  socket.emit("getCustomerData",custID);
	});
	socket.emit('getCustomerID');
        firstconnect = false;
      }
      else {
        socket.socket.reconnect();
      }
    }

    function addCustomerData(ID, cust) {
	$("h1").text(cust.firstName + " " + cust.lastName);
    }
    