
var socket;
    var firstconnect = true;
  function connect() {
      if(firstconnect) {
        socket = io.connect(null);
          
        socket.on('message', function(data){ message(data); });
	socket.on('result',function(result){ query_result(result); });
        socket.on('connect', function(){ status_update("Connected to Server"); });
        socket.on('disconnect', function(){ status_update("Disconnected from Server"); });
        socket.on('reconnect', function(){ status_update("Reconnected to Server"); });
        socket.on('reconnecting', function( nextRetry ){ status_update("Reconnecting in " 
          + nextRetry + " seconds"); });
        socket.on('reconnect_failed', function(){ message("Reconnect Failed"); });
	socket.on('err', function(message) {status_update(message); });
	socket.on('removeCustomerFromFeed', function(ID) {removeCustomerFromFeed(ID);});
	socket.on('addCustomerToFeed', function(ID, cust) {addCustomerToFeed(ID, cust);});
    socket.on('isHelped',function(ID, helped){changeCSS(ID,helped); });
      socket.on('getCust', function (ID, cust) { addCustomerData(ID, cust); });
        firstconnect = false;
	
      }
      else {
        socket.socket.reconnect();
      }
    }
        
    function disconnect() {
      socket.disconnect();
    }
  

  
    //alert(ID + "    " + cust.firstName);
   
   
   function addCustomerData(ID, cust) {
	alert("im inside " + ID);
	$("h1").text(ID);
	
    }

  