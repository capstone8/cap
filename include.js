
var socket;
    var firstconnect = true;
    var custID;
    var custInfo;
    var customerList = new Array();
    function connect() {
      if(firstconnect) {
        socket = io.connect(null);
        socket.on('getCust', function (ID, cust) {
	  addCustomerData(ID, cust);
	  custInfo = cust;
	});
	
	socket.emit("getCustomerListFromDB");
	
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
    
    function loadPage(page) {
      switch (page) {
	case 'pp':
	socket.emit("setCustomerID", custID);
	$.mobile.changePage( "/purchase_history.html", {
	    role: "page",
	    type: "get",
	    data:{ID:custID},
	    transition: "slide"
	  });
	      
	  break;
	case 'size':
	 socket.emit("setCustomerID", custID);
	$.mobile.changePage( "/size.html", {
	    role: "page",
	    type: "get",
	    data:{ID:custID},
	    transition: "slide"
	  });
	  break;
	case 'brand':
	socket.emit("setCustomerID", custID);
	$.mobile.changePage( "/brands.html", {
	    role: "page",
	    type: "get",
	    data:{ID:custID},
	    transition: "slide"
	  });
	  break;
	  case 'search':
	socket.emit("getCustomerListFromDB");
	$.mobile.changePage( "/search.html", {
	    role: "page",
	    type: "get",
	    data:{ID:custID},
	    transition: "slide"
	  });
	  break;
     }
      
    }
    
    function sendIdToCustomerPage(ID) {
	  socket.emit("setCustomerID", ID);
	  $.mobile.changePage( "/customer.html", {
	    role: "page",
	    type: "get",
	    data:{ID:ID},
	    transition: "slide"
	  });
	}